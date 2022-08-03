import { app, protocol } from 'electron';
import './security-restrictions';
import { restoreOrCreateWindow } from '@/MainWindow';
import path from 'path';
import fs from 'fs';
import Settings from '@/Settings';
import { ConfigManager } from '@/storage/Storage';
// import MCData from '@/MCData';
// import { loadSprites } from '@/resources/MCSprite';

// app.commandLine.appendSwitch('ignore-gpu-blacklist')

// Set user data path
app.setPath('userData',
	path.join(app.getPath('appData'), 'MaximumFX', 'MC Studio'),
)

protocol.registerSchemesAsPrivileged([
	{scheme: 'app', privileges: {secure: true, standard: true}},
])

let config: ConfigManager
let settings: Settings
const initialize = async () => {
	// Only for dev to prebuild data
	// await MCData.buildBiomeColors()
	// await MCData.buildBlockColors()
	// await loadSprites()

	config = new ConfigManager()

	const settingsJSON = await config.settings.getJSON()
	settings = Settings.fromJSON(settingsJSON)

	const wv = path.join(app.getPath('userData'), 'Data', 'Images', 'WorldViewer')
	if (!fs.existsSync(wv))
		await fs.promises.mkdir(wv, { recursive: true })

	const mcData = path.join(app.getPath('userData'), 'Data', 'minecraft_data')
	if (!fs.existsSync(mcData))
		await fs.promises.mkdir(mcData, { recursive: true })
}

/**
 * Prevent multiple instances
 */
const isSingleInstance = app.requestSingleInstanceLock();
if (!isSingleInstance) {
	app.quit();
	process.exit(0);
}
app.on('second-instance', restoreOrCreateWindow);


/**
 * Disable Hardware Acceleration for more power-save
 */
// app.disableHardwareAcceleration();

/**
 * Shout down background process if all windows was closed
 */
app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

/**
 * @see https://www.electronjs.org/docs/v14-x-y/api/app#event-activate-macos Event: 'activate'
 */
app.on('activate', restoreOrCreateWindow);


/**
 * Create app window when background process will be ready
 */
app.whenReady().then(async () => {
	/**
	 * Install Vue.js or some other devtools in development mode only
	 */
	if (import.meta.env.DEV) {
		try {
			const { default: installExtension, VUEJS3_DEVTOOLS } = await import('electron-devtools-installer')
			console.log('Installing Vue Devtools')
			await installExtension(VUEJS3_DEVTOOLS)
		} catch (e: any) {
			console.error('Vue Devtools failed to install:', e.toString())
		}
	}

	await initialize()
	await restoreOrCreateWindow()
}).catch((e) => console.error('Failed create window:', e));



/**
 * Check new app version in production mode only
 */
if (import.meta.env.PROD) {
	app.whenReady()
		.then(() => import('electron-updater'))
		.then(({autoUpdater}) => autoUpdater.checkForUpdatesAndNotify())
		.catch((e) => console.error('Failed check updates:', e));
}

export {
	settings,
	config,
}
