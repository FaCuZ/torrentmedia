var method = Clase.prototype;

function Clase(){
	this._id = "5";
	this._nombre = "Milo";
}

method.getId =  function(){
	return this._id;
}

module.exports = Clase;