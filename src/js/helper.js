import path from 'path'
import fs from "fs"
import * as JSZip from 'jszip'

export const loadZip = path => new JSZip.external.Promise((resolve, reject) =>
	fs.readFile(path, (err, data) => {
		if (err) reject(err)
		else resolve(data)
	})).then(data => JSZip.loadAsync(data))

export const getFile = filePath => filePath.replace(/^.*[\\/]/, '')
export const getFilename = filePath => getFile(filePath).split('.').slice(0, -1).join('.')
export const getFolder = filePath => path.dirname(filePath)

export const removeComments = string => string.replace(/\/\/.*|\/\*[^]*\*\//g, '')

export const isFloat = n => Number(n) === n && n % 1 !== 0

export const memorySizeOf = obj => {
	let bytes = 0

	function sizeOf(obj) {
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
	function formatByteSize(bytes) {
		if (bytes < 1024) return bytes + " bytes"
		else if (bytes < 1048576) return (bytes / 1024).toFixed(3) + " KB"
		else if (bytes < 1073741824) return (bytes / 1048576).toFixed(3) + " MB"
		else return (bytes / 1073741824).toFixed(3) + " GB"
	}
	return formatByteSize(sizeOf(obj))
}
