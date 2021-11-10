import {DynamicSelectType} from "@/js/CustomTerrain/Helpers/Enum";

export enum ValidationType {
    STRING = 'string',
    BOOLEAN = 'boolean',
    INT = 'int',
    FLOAT = 'float',
    ENUM = 'enum',
    SELECT = 'select',

    OBJECT = 'object',
    ARRAY = 'array',

    CHOICE = 'choice',
    CHOICE_VALUE = 'choice_value'
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

    check = (): boolean => {
        console.log('check validation', this.type, this.optional, this.options)
        return true
    }

    getChoices = () => {
        if (this.type === ValidationType.SELECT) {
            if (typeof this.options.choices === 'number') {
                console.log('todo', this.options.choices)
                switch (this.options.choices) {
                    case DynamicSelectType.BIOME:
                        return [
                            {
                                name: 'Minecraft',
                                choices: [
                                    'minecraft:jungle'
                                ]
                            }
                        ]
                }
                return ['todo']
            }
            return this.options.choices
        }
        else if (this.type === ValidationType.CHOICE)
            return this.options.choices
        return null
    }

    static string = (optional: boolean = false, minLength?: number, maxLength?: number): Validation => new Validation(ValidationType.STRING, optional, {
        minLength, maxLength
    })

    static boolean = (optional: boolean = false): Validation => new Validation(ValidationType.BOOLEAN, optional)

    static int = (optional: boolean = false, minSize?: number, maxSize?: number): Validation => new Validation(ValidationType.INT, optional, {
        minSize, maxSize
    })
    static float = (optional: boolean = false, minSize?: number, maxSize?: number): Validation => new Validation(ValidationType.FLOAT, optional, {
        minSize, maxSize
    })

    static enum = (optional: boolean = false, enumType: any): Validation => new Validation(ValidationType.ENUM, optional, {
        enumType
    })
    static select = (optional: boolean = false, choices: any[] | DynamicSelectType): Validation => new Validation(ValidationType.SELECT, optional, {
        choices
    })

    static object = (optional: boolean = false, objectType: any): Validation => new Validation(ValidationType.OBJECT, optional, {
        objectType
    })

    static array = (optional: boolean = false, arrayObject: any, objectName: string): Validation => new Validation(ValidationType.ARRAY, optional, {
        arrayObject, objectName
    })

    static choice = (optional: boolean = false, choices: Choice[], key: string): Validation => new Validation(ValidationType.CHOICE, optional, {
        choices, key
    })
    static choiceValue = (): Validation => new Validation(ValidationType.CHOICE_VALUE, false)


    static getElements = (obj: any, data: any, log = false): any => {
        const keys = Object.keys(obj)
        if (keys.length === 1) {
            return Validation.getElements(obj[keys[0]], data[keys[0]], log)
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
