import path from 'path'
import { app } from 'electron';

export const getRouteForFile = (file: string) => {
	let route = ''
	const ext = path.extname(file)
	if (['.nbt', '.schem', '.schematic'].includes(ext)) {
		route = '/nbt-editor/editor'
	}
	return route
}

export const Paths = {
	DATA: () => path.join(app.getPath('userData'), 'Data'),
	MC_DIR: () => path.join(app.getPath('userData'), 'Data', 'minecraft_data'),
}
