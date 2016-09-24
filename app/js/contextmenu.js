module.exports = {
	torrents: {
		menus: {
			separator: ()=> { return new MenuItem({ type: 'separator'}) },  

			pause: ()=> { return new MenuItem({ label: locale.menu.pause, click(){ call.btn_pause() }})},
			delete:()=> { return new MenuItem({ label: locale.menu.delete,click(){ call.btn_remove() }})},
			up:    ()=> { return new MenuItem({ label: locale.menu.up, 	  click(){ call.btn_position_up() }})},
			down:  ()=> { return new MenuItem({ label: locale.menu.down,  click(){ call.btn_position_down() }})},
			cast:  ()=> { return new MenuItem({ label: locale.menu.cast,  click(){ call.btn_cast() }})},
			share: ()=> { return new MenuItem({ label: locale.menu.share, click(){ call.btn_share() }})} 
		},

		init: ()=> {
			const menu = new Menu()
			let menus = contextmenu.torrents.menus

			menu.append(menus.pause())
			menu.append(menus.cast())
			menu.append(menus.share())
			menu.append(menus.separator())
			menu.append(menus.up())
			menu.append(menus.down())
			menu.append(menus.separator())
			menu.append(menus.delete())

			$('#table').on('contextmenu', 'tr', function (e){
				torrentSelected = downloads.selectTr($(this))
				e.preventDefault()
				menu.popup(remote.getCurrentWindow())
			})

		}
	}

}