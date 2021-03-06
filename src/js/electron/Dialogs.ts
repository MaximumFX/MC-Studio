import path from "path";
import {app} from 'electron'

class Dialog {
	type: string
	constructor(type: string) {
		this.type = type
	}
}

export class Question extends Dialog {
	message: string
	title: string
	buttons: string[]
	cancelId: number
	constructor(message: string, title: string = 'Confirm', buttons: string[] = ['Yes', 'No'], cancelId: number = 1) {
		super('question')

		this.message = message
		this.title = title
		this.buttons = buttons
		this.cancelId = cancelId
	}
}

export class SaveFile extends Dialog {
	title: string
	defaultPath: string
	defaultName: string
	buttonLabel: string
	filters: {
			name: string,
			extensions: string[]
	}[]
	properties: []

	constructor(title: string = 'Select the File Path to save', defaultPath: string, defaultName: string, buttonLabel: string = 'Save', filters: { name: string, extensions: string[] }[] = [], properties: [] = []) {
		super('saveFile')

		this.title = title
		this.defaultPath = defaultPath
		this.defaultName = defaultName
		this.buttonLabel = buttonLabel
		this.filters = filters
		this.properties = properties
	}
}
