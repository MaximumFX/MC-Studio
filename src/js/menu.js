import {Menu} from "electron";

const isMac = process.platform === 'darwin'

export const getMenu = (path = '/', page = 'home', events) =>
	Menu.buildFromTemplate([
		...(isMac ? [{
			label: 'MC Studio',
			submenu: [
				{ role: 'about' },
				{
					label: 'Check for Updates...',
					click: () => {
						console.log('todo')//todo
					}
				},
				{ type: 'separator' },
				{ role: 'services' },
				{ type: 'separator' },
				{ role: 'hide' },
				{ role: 'hideothers' },
				{ role: 'unhide' },
				{ type: 'separator' },
				{ role: 'quit' }
			]
		}] : []),
		// {
		// 	label: 'File',
		// 	submenu: [
		// 		isMac ? { role: 'close' } : { role: 'quit' }
		// 	]
		// },
		{ role: 'editMenu' },
		{
			id: 'worldgen',
			label: 'Worldgen',
			submenu: [
				{
					label: 'Import datapack...',
					accelerator: 'CmdOrCtrl+I',
					click: () => {
						console.log('import')
						if (events.activePage === 'custom-terrain') {
							events.send('accelerator', 'import')
						}
					},
					enabled: path === '/custom-terrain'
				},
				{
					label: 'Save datapack...',
					accelerator: 'CmdOrCtrl+S',
					click: () => {
						console.log('save')
						if (events.activePage === 'custom-terrain') {
							events.send('accelerator', 'save')
						}
					},
					enabled: path.startsWith('/custom-terrain/editor')
				},
				{
					label: 'Export datapack...',
					accelerator: 'CmdOrCtrl+E',
					click: () => {
						console.log('export')
						if (events.activePage === 'custom-terrain') {
							events.send('accelerator', 'export')
						}
					},
					enabled: path.startsWith('/custom-terrain/editor')
				},
			],
			visible: page === 'custom-terrain'
		},
		{ role: 'windowMenu' },
		{
			role: 'help',
			submenu: [
				{
					label: 'Learn More',
					click: async () => {
						const { shell } = require('electron')
						await shell.openExternal('https://maximumfx.nl')
					}
				}
			]
		},
		//TODO tmp
		// ...(process.env.NODE_ENV === 'production' ? [] : [{ role: 'viewMenu' }])
		{ role: 'viewMenu' }
	])
