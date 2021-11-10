import { globalShortcut } from 'electron'

export default class Accelerators {
	constructor(events) {
		globalShortcut.register('CmdOrCtrl+I', () => {
			if (events.activePage === 'custom-terrain') {
				events.send('accelerator', 'import')
			}
		})
	}
}