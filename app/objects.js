'use strict'

class Torrent { 
	constructor() {	
		this._position = '99'
		this.progress = '50'		
	}
	
	get position() { return this._position }
	set position(value) { this._position = value }

	up() { this._position++ }
	down() { this._position-- }


}

/* 
 // TEST //
let torrents = {}
torrents['aa11'] = new Torrents()
torrents['bb22'] = new Torrents()
torrents['cc33'] = new Torrents()
torrents['aa11'] = new Torrents()
torrents['aa11'].position = 100
torrents['bb22'].up()

console.log(torrents)
*/


/*
let instance = null

class Singleton { 
	constructor() {	
		this._value = ''

		// SINGLETON
		if(!instance) instance = this
		return instance
	}
}
*/