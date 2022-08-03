import path from 'path';
import fs, { promises as fsp } from 'fs';
import * as JSZip from 'jszip';
import type { BitDepth } from 'pngjs';
import { PNG } from 'pngjs';
import { promisify } from 'util'
import fastFolderSizeCallback from 'fast-folder-size';

const fastFolderSize = promisify(fastFolderSizeCallback)

export const loadZip = (path: string) => new JSZip.external.Promise((resolve, reject) =>
	fs.readFile(path, (err, data) => {
		if (err) reject(err)
		else resolve(data)
	})).then((data: any) => JSZip.loadAsync(data))

export const getFile = (filePath: string) => filePath.replace(/^.*[\\/]/, '')
export const getFilename = (filePath: string) => getFile(filePath).split('.').slice(0, -1).join('.')
export const getFolder = (filePath: string) => path.dirname(filePath)

export const removeComments = (string: string) => string.replace(/\/\/.*|\/\*[^]*\*\//g, '')

export const isFloat = (n: number) => Number(n) === n && n % 1 !== 0

export const memorySizeOf = (obj: never) => {
	let bytes = 0

	function sizeOf(obj: any) {
		if(obj !== null && obj !== undefined) {
			switch(typeof obj) {
				case 'number':
					bytes += 8
					break
				case 'string':
					bytes += obj.length * 2
					break
				case 'boolean':
					bytes += 4
					break
				case 'object':
					// eslint-disable-next-line no-case-declarations
					const objClass = Object.prototype.toString.call(obj).slice(8, -1);
					if (objClass === 'Object' || objClass === 'Array') {
						for(const key in obj) {
							if(!obj.hasOwnProperty(key)) continue
							sizeOf(obj[key])
						}
					}
					else bytes += obj.toString().length * 2
					break
			}
		}
		return bytes
	}
	function formatByteSize(bytes: number) {
		if (bytes < 1024) return bytes + ' bytes'
		else if (bytes < 1048576) return (bytes / 1024).toFixed(3) + ' KB'
		else if (bytes < 1073741824) return (bytes / 1048576).toFixed(3) + ' MB'
		else return (bytes / 1073741824).toFixed(3) + ' GB'
	}
	return formatByteSize(sizeOf(obj))
}

export const deconstructNBT = (obj: any): any => {
	if (Array.isArray(obj))
		return obj.map(a => deconstructNBT(a))

	if (obj.hasOwnProperty('value')) {
		if (obj.type === 'list' && Array.isArray(obj.value))
			return obj.value.map((a: any) => deconstructNBT(a))

		if (obj.value.hasOwnProperty('value'))
			return deconstructNBT(obj.value)

		if (obj.type === 'compound') {
			if (Array.isArray(obj.value))
				return obj.value.map((a: any) => deconstructNBT(a))

			const newObj: any = {}
			Object.entries(obj.value).forEach(([key, value]) => {
				if (key === 'palettes') console.log(value);
				newObj[key] = deconstructNBT(value)
			})
			return newObj
		}
		return obj.value
	}
	const newObj: any = {}
	Object.entries(obj).forEach(([key, value]) => {
		newObj[key] = deconstructNBT(value)
	})
	return newObj
}

export const getPixels = async (filePath: string, bitDepth: BitDepth = 8): Promise<PNG> => new Promise((resolve, reject) => {
	fs.createReadStream(filePath)
		.pipe(
			new PNG({
				filterType: 4,
				bitDepth,
				colorType: 6,
				inputColorType: 6,
				inputHasAlpha: true,
				skipRescale: true,
			}),
		)
		.on('error', function (e) {
			reject(e)
		})
		.on('parsed', function () {
			resolve(this)
		})
})

export interface File {
	isDirectory: boolean
	name: string
	ext: string
	path: string
}
export interface Directory {
	isDirectory: boolean
	name: string
	path: string
	items: (File | Directory)[]
}
export const getDirectories = async (source: string, includeFiles = false, filesOnly = false) => {
	const walk = async (staticPath: string, relPath = './'): Promise<(Directory | File)[]> => {
		const items = (await fsp.readdir(staticPath, { withFileTypes: true }))
			.filter(dir => filesOnly ? !dir.isDirectory() && dir.name !== '.DS_Store' : (dir.isDirectory() || includeFiles))
		const folder = []
		for (const dir of items) {
			const tmpPath = path.join(relPath, dir.name)
			if (dir.isDirectory()) {
				folder.push({
					isDirectory: true,
					name: dir.name,
					path: tmpPath,
					items: await walk(path.join(staticPath, dir.name), tmpPath),
				})
			}
			else folder.push({
				isDirectory: false,
				name: path.basename(dir.name, path.extname(dir.name)),
				ext: path.extname(dir.name).replace('.', ''),
				path: tmpPath,
			})
		}
		return folder
	}
	return await walk(source)
}

export const getFolderSize = async (dir: string) => {
	return await fastFolderSize(dir)
}
