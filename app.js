
String.prototype.hashCode = function(){
    var hash = 0;
    for (var i = 0; i < this.length; i++) {
        var character = this.charCodeAt(i);
        hash = ((hash<<5)-hash)+character;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
}

function init(){
	console.log('app init')
	window.inelem = document.getElementById('in');
	window.outelem = document.getElementById('out');
	window.sumelem = document.getElementById('sum');
	window.sumlelem = document.getElementById('suml');
	window.sumpelem = document.getElementById('sump');
	window.hashcode = -1;
	window.biggestprime = window.primes[window.primes.length-1];
	setTimeout(tick,250);
}


function tick(){
	var text = window.inelem.value;
	let hashcode = text.hashCode();
	
	if(window.hashcode === hashcode) return setTimeout(tick,250);
	console.log('hashcode mismatch',hashcode,window.hashcode);
	window.hashcode=hashcode;
	
	let totall = gpsum(text);
	let parable = parablenumber(text);
	
	
	var words = getwords(text);
	var total = 0;
	window.outelem.innerText = '';
	for(let word of words){
		let wordsum = gpsum(word);
		total+=wordsum;
		let span = document.createElement('span');
		this.setElemFromPrime(span,wordsum,word,wordsum)
		window.outelem.appendChild(span);
	}
	this.setElemFromPrime(sumelem,total);
	this.setElemFromPrime(sumlelem,totall);
	this.setElemFromPrime(sumpelem,parable);
	setTimeout(tick,250);
}

function setElemFromPrime(elem,number,overrideText=null,beforeTitle=null,afterTitle=null){
	//console.log('setElemFromPrime',elem,number,overrideText,beforeTitle);
	let primetype = getprimetype(number);
	let classes='word '+primetype;
	let title = primetype;
	if(beforeTitle!==null) title=beforeTitle+"\r\n"+title;
	if(afterTitle!=null) title+="\r\n"+afterTitle;
	this.setElemDetails(elem,overrideText??number,classes,title);
}

function setElemDetails(elem,text,classes,title){
	//console.log('setElemDetails',elem,text,classes,title);
	elem.setAttribute('class',classes);
	elem.setAttribute('title',title);
	elem.innerText = text;
}

function parablenumber(str){
	let lines = getlines(str);
	console.log('parable lines',lines);
	let parable = 0;
	for(let line of lines){
		let words = getwords(line);
		console.log(' words',words);
		let wordsum = 0;
		for(let word of words) wordsum+=gpsum(word);
		console.log(' wordsum',wordsum);
		if(wordsum>0){
			if(parable===0) parable=wordsum;
			else parable *= wordsum;
		}
		console.log(' parable',wordsum);
	}
	return parable;
}

function getlines(str){
	return str.split(/[\n]+/).filter(x => x);
}

function getwords(str){
	return str.split(/\W+/).filter(x => x);
}

function gpsum(str){ //Note: this can only be used for words because 't h' would become 'th'
	return +LiberPrimus.gematriaSum(str.replaceAll(/[^a-zA-Z]/g,''));
}

function getprimetype(num){
	if(!Number.isSafeInteger(num)) return 'too_big';
	let rnum = +reverseString(""+num);
	let f_isprime = isprime(num);
	let r_isprime = isprime(rnum);
	let ispalin = rnum===num;
	
	if(f_isprime && r_isprime && ispalin) return 'palindromic';
	if(f_isprime && r_isprime) return 'emirp';
	if(f_isprime) return 'prime';
	if(r_isprime) return 'reversed_prime';
	return '';
}

function isprime(num){
	if(num>window.biggestprime){
		return isprime_slow(num);
	}
	
	return primes.indexOf(+num)!==-1;
}
function isprime_slow(num){
  for(var i = 2, s = Math.sqrt(num); i <= s; i++)
    if(num % i === 0) return false;
  return num > 1;
}

function reverseString(str) {
    var newString = "";
    for (var i = str.length - 1; i >= 0; i--) {
        newString += str[i];
    }
    return newString;
}

document.addEventListener('DOMContentLoaded', init, false);


