import { BrowserWindow, dialog, Menu } from 'electron';
import type { BrowserWindowConstructorOptions } from 'electron';
import { join } from 'path';
import { URL } from 'url';
import { Question } from '@/electron/Dialogs';
import { settings, config } from '@/index';
import Events from '@/events';
import { getMenu } from '@/Menu';
import { getRouteForFile } from '@/Path';

let events: Events
async function createWindow(file?: string) {
	const options: BrowserWindowConstructorOptions = {
		show: false,
		width: settings.window.width ?? 1000,
		height: settings.window.height ?? 630,
		minWidth: 1000,
		minHeight: 630,
		titleBarStyle: 'hidden',
		webPreferences: {
			webviewTag: false,
			preload: join(__dirname, '../../preload/dist/index.cjs'),
		},
	}
	if (settings.window.x)
		options.x = settings.window.x
	if (settings.window.y)
		options.y = settings.window.y

	const mainWindow = new BrowserWindow(options)

	if (events) events.setWindow(mainWindow)
	else events = new Events(mainWindow)

	Menu.setApplicationMenu(getMenu('/', 'home', events))

	let route = ''
	if (file) route = getRouteForFile(file)

	if (route != '') route = '#' + route + '?file=' + file

	/**
	 * If you install `show: true` then it can cause issues when trying to close the window.
	 * Use `show: false` and listener events `ready-to-show` to fix these issues.
	 *
	 * @see https://github.com/electron/electron/issues/25012
	 */
	mainWindow.on('ready-to-show', () => {
		mainWindow?.show();

		if (import.meta.env.DEV) {
			mainWindow?.webContents.openDevTools();
		}
	});

	/**
	 * URL for main window.
	 * Vite dev server for development.
	 * `file://../renderer/index.html` for production and test
	 */
	const isDev = import.meta.env.DEV && import.meta.env.VITE_DEV_SERVER_URL !== undefined
	let pageUrl = import.meta.env.DEV && import.meta.env.VITE_DEV_SERVER_URL !== undefined
		? import.meta.env.VITE_DEV_SERVER_URL
		: new URL('../renderer/dist/index.html', 'file://' + __dirname).toString();
	if (!settings.finishedOnboarding) {
		pageUrl += isDev
			? '#/onboarding'
			: '/onboarding'
	}
	else pageUrl += route


	await mainWindow.loadURL(pageUrl);


	// Window state saving
	let timeout: NodeJS.Timeout | undefined
	const saveBoundsSoon = () => {
		if (timeout) clearTimeout(timeout)
		timeout = setTimeout(() => {
			timeout = undefined
			if (!mainWindow.isDestroyed()) {
				settings.window = mainWindow.getNormalBounds();
				config.settings.setJSON(settings);
				config.settings.saveAsync();
			}
		}, 1000)
	}
	mainWindow.on('resize', saveBoundsSoon)
	mainWindow.on('move', saveBoundsSoon)

	let overrideClose = false
	mainWindow.on('close', e => {
		if (!events.saved && !overrideClose) {
			e.preventDefault()
			dialog.showMessageBox(mainWindow,
				new Question('There are unsaved changes. Are you sure you want to quit?', 'Confirm',
					['Yes', 'No'], 1),
			).then(choice => {
				if (choice.response === 0) {
					overrideClose = true
					mainWindow.close()
				}
			})
		}
	})

	return mainWindow;
}

/**
 * Restore existing BrowserWindow or Create new BrowserWindow
 */
export async function restoreOrCreateWindow() {
	let window = BrowserWindow.getAllWindows().find(w => !w.isDestroyed());

	if (window === undefined) {
		window = await createWindow();
	}

	if (window.isMinimized()) {
		window.restore();
	}

	window.focus();
}
