'use strict'

import {app, BrowserWindow, dialog, Menu, protocol} from 'electron'
import {createProtocol} from 'vue-cli-plugin-electron-builder/lib'
import installExtension, {VUEJS_DEVTOOLS} from 'electron-devtools-installer'
import Events from './js/events'
import {getMenu} from "./js/menu"
import {getRouteForFile} from './js/path'
import path from "path";
import {Question} from "@/js/electron/Dialogs";

const isDevelopment = process.env.NODE_ENV !== 'production' || process.argv.includes('--dev')

app.setPath('userData',
	path.join(app.getPath('appData'), 'MaximumFX', 'MC Studio')
)
protocol.registerSchemesAsPrivileged([
	{scheme: 'app', privileges: {secure: true, standard: true}}
])

let mainWindow: BrowserWindow
let events: Events
async function createWindow(file?: string) {
	mainWindow = new BrowserWindow({
		width: 1000,
		height: 630,
		minWidth: 1000,
		minHeight: 630,
		titleBarStyle: "hidden",
		webPreferences: {
			nodeIntegration: (process.env.ELECTRON_NODE_INTEGRATION as unknown) as boolean,
			contextIsolation: false,
		}
	})

	events = new Events(mainWindow)

	Menu.setApplicationMenu(getMenu('/', 'home', events))

	let route = ''
	if (file) route = getRouteForFile(file)

	if (route != '') route = '/#' + route + '?file=' + file

	if (process.env.WEBPACK_DEV_SERVER_URL) {
		await mainWindow.loadURL(process.env.WEBPACK_DEV_SERVER_URL + route)
		if (!process.env.IS_TEST) mainWindow.webContents.openDevTools()
	}
	else {
		createProtocol('app')
		await mainWindow.loadURL('app://./index.html' + route)
	}

	let overrideClose = false
	mainWindow.on('close', e => {
		if (!events.saved && !overrideClose) {
			e.preventDefault()
			dialog.showMessageBox(mainWindow,
				new Question('There are unsaved changes. Are you sure you want to quit?', 'Confirm',
					['Yes', 'No'], 1)
			).then(choice => {
				if (choice.response === 0) {
					overrideClose = true
					mainWindow.close()
				}
			})
		}
	})
}


let initOpenFile: string | undefined = undefined
app.on('will-finish-launching', () => {
	app.on('open-file', (event, file) => {
		if (!app.isReady()) initOpenFile = file
		else if (BrowserWindow.getAllWindows().length !== 0)
			mainWindow.webContents.send('setPage', file)
		else createWindow(file)
		event.preventDefault()
	})
})

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
	if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

app.on('ready', async () => {
	if (isDevelopment && !process.env.IS_TEST) {
		// Install Vue Devtools
		try {
			await installExtension(VUEJS_DEVTOOLS)
		} catch (e) {
			console.error('Vue Devtools failed to install:', e.toString())
		}
	}
	createWindow(initOpenFile)
})


// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
	if (process.platform === 'win32') {
		process.on('message', (data) => {
			if (data === 'graceful-exit') {
				app.quit()
			}
		})
	}
	else {
		process.on('SIGTERM', () => {
			app.quit()
		})
	}
}
