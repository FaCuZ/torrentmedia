let instance = null;

class Torrents{  
	constructor() {
		if(!instance) instance = this

		this.time = new Date()

		return instance;
	}
}

let torrenta = new Torrents()
console.log(torrenta.time);

 setTimeout(function(){
   let torrenta = new Torrents();
   console.log(torrenta.time);
 },4000);



/*function Torrents(position) {
	var position = position

	this.getPosition = function (){
		return position;
	}

	this.setPosition = function (){
		//definir la posicion
		return position;
	}
}
*/