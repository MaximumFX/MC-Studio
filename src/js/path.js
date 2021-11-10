import path from "path"

export const getRouteForFile = file => {
	let route = ''
	const ext = path.extname(file)
	if (['.schem', '.nbt'].includes(ext)) {
		route = '/nbt-explorer/editor'
	}
	return route
}
