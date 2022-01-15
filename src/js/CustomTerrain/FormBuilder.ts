import Validation, {ValidationType} from "@/js/CustomTerrain/Validation";

export default class FormBuilder {
	constructor() {}

	static getComponentName = (element: {
		key: string,
		value: object,
		validation: Validation
	}) => {
		if (element.hasOwnProperty('elements')) return 'FormSection'
		switch (element.validation.type) {
			case ValidationType.STRING:
				return 'FormString'
			case ValidationType.BOOLEAN:
				return 'FormBoolean'
			case ValidationType.INT:
				return 'FormInt'
			case ValidationType.FLOAT:
				return 'FormFloat'
			case ValidationType.SELECT:
				return 'FormSelect'
			case ValidationType.DYNAMIC_SELECT:
				return 'FormDynamicSelect'
			case ValidationType.ENUM:
				return 'FormEnum'
			case ValidationType.COLOR:
				return 'FormColor'
			case ValidationType.CHOICE:
				return 'FormChoice'
			case ValidationType.CHOICE_VALUE:
				return 'FormChoiceValue'
			case ValidationType.ARRAY:
				return 'FormArray'
		}
		return 'div'
	}
}
