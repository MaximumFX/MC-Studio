import {Modal} from 'bootstrap'

export default class Modals {
	static get = (id, options = {}) => {
		return Modal.getInstance(document.getElementById(id)) ?
			Modal.getInstance(document.getElementById(id)) :
			new Modal(document.getElementById(id), { toggle: false, ...options })
	}
}
