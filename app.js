
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
	//let parable = parablenumber(text);
	let parable_linesums = [];
	
	var lines = getlines(text);
	outelem.innerText = '';
	let total = 0;
	for(let line of lines){
		let row = document.createElement('tr');
		let wordselem = document.createElement('td');
		let linestatscell = document.createElement('td');
		let linestat1 = document.createElement('span');
		let linestat2 = document.createElement('span');
		wordselem.setAttribute('class','line-words');
		linestatscell.setAttribute('class','line-stats sep-left');
		let words = getwords(line);
		let linetotall = gpsum(line);
		let linetotal = 0;
		for(let word of words){
			let wordsum = gpsum(word);
			total+=wordsum;
			linetotal+=wordsum;
			let span = document.createElement('span');
			this.setElemFromPrime(span,wordsum,word,wordsum)
			wordselem.appendChild(span);
		}
		parable_linesums.push(linetotal);
		setElemFromPrime(linestat1,linetotal);
		setElemFromPrime(linestat2,linetotall);
		linestatscell.appendChild(linestat1);
		linestatscell.appendChild(linestat2);
		row.appendChild(wordselem);
		row.appendChild(linestatscell);
		outelem.appendChild(row);
	}

	this.setElemFromPrime(sumelem,total);
	this.setElemFromPrime(sumlelem,totall);
	this.setElemFromPrime(sumpelem,product(parable_linesums));
	setTimeout(tick,250);
}

function setElemFromPrime(elem,number,overrideText=null,beforeTitle=null,afterTitle=null,addClasses=''){
	//console.log('setElemFromPrime',elem,number,overrideText,beforeTitle);
	let primetype = getprimetype(number);
	let addtltypes = getaddtltypes(number);
	let classes='word '+primetype+' '+(addtltypes.join(' '));
	console.log('getaddtl ',number,addtltypes,classes)
	let title = primetype;
	if(addtltypes.length) title+="\r\n"+(addtltypes.join("\r\n"))
	if(beforeTitle!==null) title=beforeTitle+"\r\n"+title;
	if(afterTitle!=null) title+="\r\n"+afterTitle;
	this.setElemDetails(elem,overrideText??number,classes,title,addClasses);
}

function setElemDetails(elem,text,classes,title,addClasses=''){
	//console.log('setElemDetails',elem,text,classes,title);
	elem.setAttribute('class',classes+' '+addClasses);
	elem.setAttribute('title',title);
	elem.innerText = text;
}

function product(nums){
	return nums.reduce((a, b)=> a*b, 1);
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
function getaddtltypes(num){
	let types = [];
	if(isFibonacci(num)) types.push('fibonacci_number');
	return types;
}

function isFibonacci(n)
{
	return isPerfectSquare(5*n*n + 4) ||
		isPerfectSquare(5*n*n - 4);
}

function isPerfectSquare(x)
{
	let s = parseInt(""+Math.sqrt(x));
	return ((s*s) == x);
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


