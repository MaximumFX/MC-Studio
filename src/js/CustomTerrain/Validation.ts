import CustomTerrain from "@/js/CustomTerrain/CustomTerrain";
import {CTFileType} from "@/js/CustomTerrain/Helpers/Enum";

export enum ValidationType {
	STRING = 'string',
	BOOLEAN = 'boolean',
	INT = 'int',
	FLOAT = 'float',
	ENUM = 'enum',
	SELECT = 'select',
	DYNAMIC_SELECT = 'dynamicSelect',
	COLOR = 'color',

	OBJECT = 'object',
	ARRAY = 'array',

	CHOICE = 'choice',
	CHOICE_VALUE = 'choice_value',

	INT_PROVIDER = 'intProvider'
}
export default class Validation {
	type: ValidationType
	optional: boolean
	options: any

	constructor(type: ValidationType, optional: boolean = false, options?: any) {
		this.type = type
		this.optional = optional
		this.options = options ?? {}
	}

	check = (value: any, debug = false): boolean => {
		if (this.optional && (value === undefined || value === '')) return true
		switch (this.type) {
			case ValidationType.INT:
				if (typeof value !== 'number') return false
				if (!Number.isInteger(value)) return false
				if (this.options.minSize && value < this.options.minSize) return false
				if (this.options.maxSize && value > this.options.maxSize) return false
				if (this.options.multipleOf && (value % this.options.multipleOf) !== 0) return false
		}
		return true
	}

	getChoices = (ct?: CustomTerrain) => {
		if (this.type === ValidationType.SELECT)
			return this.options.choices
		else if (this.type === ValidationType.DYNAMIC_SELECT) {
			if (ct) {
				return ct.getAllOfType(this.options.type, true)
			}
			else console.error('[Validation getChoices] No CustomTerrain provided for DynamicSelect!')
			return []
		}
		else if (this.type === ValidationType.CHOICE)
			return this.options.choices
		else if (this.type === ValidationType.ENUM)
			return Object.entries(this.options.enumType).map((a: [string, unknown]) => ({key: a[1], value: a[0]}))
		return null
	}

	static string = (optional: boolean = false, minLength?: number, maxLength?: number): Validation => new Validation(ValidationType.STRING, optional, {
		minLength, maxLength
	})

	static boolean = (optional: boolean = false): Validation => new Validation(ValidationType.BOOLEAN, optional)

	static int = (optional: boolean = false, minSize?: number | string, maxSize?: number | string, multipleOf?: number): Validation => new Validation(ValidationType.INT, optional, {
		minSize, maxSize, multipleOf
	})
	static float = (optional: boolean = false, minSize?: number, maxSize?: number): Validation => new Validation(ValidationType.FLOAT, optional, {
		minSize, maxSize
	})

	static enum = (optional: boolean = false, enumType: any): Validation => new Validation(ValidationType.ENUM, optional, {
		enumType
	})
	static select = (optional: boolean = false, choices: any[] | CTFileType): Validation => new Validation(ValidationType.SELECT, optional, {
		choices
	})
	static dynamicSelect = (optional: boolean = false, type: any[] | CTFileType): Validation => new Validation(ValidationType.DYNAMIC_SELECT, optional, {
		type
	})

	static color = (optional: boolean = false): Validation => new Validation(ValidationType.COLOR, optional)

	static object = (optional: boolean = false, objectType: any, key: Validation): Validation => new Validation(ValidationType.OBJECT, optional, {
		objectType, key
	})

	static array = (optional: boolean = false, arrayObject: any, objectName: string): Validation => new Validation(ValidationType.ARRAY, optional, {
		arrayObject, objectName
	})

	static choice = (optional: boolean = false, choices: Choice[], key: string): Validation => new Validation(ValidationType.CHOICE, optional, {
		choices, key
	})
	static choiceValue = (): Validation => new Validation(ValidationType.CHOICE_VALUE, false)


	static intProvider = (optional: boolean = false, canBeInt: boolean = false, minSize?: number | string, maxSize?: number): Validation => new Validation(ValidationType.INT_PROVIDER, optional, {
		canBeInt, minSize, maxSize
	})


	static getElements = (obj: any, data: any, log = false): any => {
		const keys = Object.keys(obj)
		if (keys.length === 1) {
			console.log('1key', keys[0], obj, data)
			//     return Validation.getElements(obj[keys[0]], data[keys[0]], log)
		}
		return keys.map(s => {
			if (obj[s] instanceof Validation) {
				if (obj[s].type === ValidationType.CHOICE) {
					obj[s].options.choices = obj[s].options.choices.map((choice: any) => {
						if (data[s][obj[s].options.key] === choice.key) {
							choice.value = {
								key: s,
								elements: Validation.getElements(choice.value, data[s], log)
							}
						}
						return choice
					})
				}
				return {
					key: s,
					validation: obj[s],
					value: data[s],
				}
			}
			return {
				key: s,
				elements: Validation.getElements(obj[s], data[s], log)
			}
		})
	}
}

export class Choice {
	key: string
	name: string
	value: any

	constructor(key: string, name: string, value: any) {
		this.key = key
		this.name = name
		this.value = value
	}
}
