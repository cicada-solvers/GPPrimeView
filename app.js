
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
	window.inelem = document.getElementById('in');
	window.outelem = document.getElementById('out');
	window.sumelem = document.getElementById('sum');
	window.sumlelem = document.getElementById('suml');
	window.hashcode = -1;
	setTimeout(tick,250);
}


function tick(){
	var text = window.inelem.value;
	let hashcode = text.hashCode();
	let totall = gpsum(text);
	
	if(window.hashcode === hashcode) return setTimeout(tick,250);
	window.hashcode=hashcode;
	
	var words = text.split(/\W+/).filter(x => x);
	var total = 0;
	window.outelem.innerText = '';
	for(let word of words){
		let wordsum = gpsum(word);
		total+=wordsum;
		let primetype = getprimetype(wordsum);
		let span = document.createElement('span');
		let classes='word '+primetype;
		span.setAttribute('class',classes);
		span.setAttribute('style','margin-right: 0.5em');
		span.setAttribute('title',wordsum+"\r\n"+primetype);
		span.innerText=word;
		window.outelem.appendChild(span);
	}
	{
		let primetype = getprimetype(total);
		let classes='word '+primetype;
		window.sumelem.setAttribute('class',classes);
		window.sumelem.setAttribute('title',primetype);
		window.sumelem.innerText = total;
	}
	{
		let primetype = getprimetype(totall);
		let classes='word '+primetype;
		window.sumlelem.setAttribute('class',classes);
		window.sumlelem.setAttribute('title',primetype);
		window.sumlelem.innerText = totall;
	}
	setTimeout(tick,250);
}

function gpsum(str){ //Note: this can only be used for words because 't h' would become 'th'
	return +LiberPrimus.gematriaSum(str.replaceAll(/[^a-zA-Z]/g,''));
}
function getprimetype(num){
	let rnum = +reverseString(""+num);
	let f_isprime = isprime(num);
	let r_isprime = isprime(rnum);
	let ispalin = rnum===num;
	
	if(f_isprime && r_isprime && ispalin) return 'palindromic';
	if(f_isprime && r_isprime) return 'emirp';
	if(f_isprime) return 'prime';
	return '';
}
function isprime(num){
	return primes.indexOf(+num)!==-1;
}

function reverseString(str) {
    var newString = "";
    for (var i = str.length - 1; i >= 0; i--) {
        newString += str[i];
    }
    return newString;
}

document.addEventListener('DOMContentLoaded', init, false);


