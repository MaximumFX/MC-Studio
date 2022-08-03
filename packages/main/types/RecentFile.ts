export interface RecentFile {
	file: string
	uuid: string
	name: string
}
export interface RecentFileExtended extends RecentFile {
	lastOpened: string
	size: string
}
