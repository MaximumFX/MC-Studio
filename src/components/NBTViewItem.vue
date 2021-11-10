<template>
	<li :class="isFolder ? 'folder': 'tag'">
		<div>
			<span v-if="isFolder" @click="click" class="state-indicator">
				<i :class="['fas', 'fa-caret-' + (isOpen ? 'down' : 'right')]"></i>
			</span>

			<span class="background" :title="itemType">
				<span class="type-icon">
					<i :class="[icon === 'file' ? 'fas' : 'far', 'fa-' + icon, 'fa-fw']"></i>
					<span v-if="icon === 'file'">{{ item.type.substr(0, 1) }}</span>
				</span>
				<b v-if="item.name">{{ item.name }}:</b>
				<b v-else-if="!options.edit && index != null">{{index}}:</b>
				{{ isFolder ? items.length + ' ' + (items.length === 1 ? 'entry' : 'entries') : '' }}
				<code v-if="!isFolder">{{item.value}}</code>

				<span class="modify px-2">
					<a v-if="options.edit" @click="edit" class="link-primary" title="Edit"><i class="far fa-pencil me-2"></i></a>
					<a v-if="options.add" @click="add" class="link-success" title="Add item"><i class="far fa-plus me-2"></i></a>
					<a class="link-danger" @click="remove" title="Remove item"><i class="far fa-trash"></i></a>
				</span>
			</span>
		</div>
		<ul v-show="isOpen" v-if="isFolder">
			<NBTViewItem
				class="item"
				v-for="(child, index) in items"
				:key="index"
				:item="child"
				:index="index"
				:path="path + '/' + (item.name ? item.name : index)"
			></NBTViewItem>
		</ul>
	</li>
</template>

<script>
import Modals from "@/js/modals";
import { setModalsVal } from "@/js/state"

export default {
	name: "NBTViewItem",
	props: {
		item: Object,
		path: String,
		index: Number
	},
	data() {
		return {
			isOpen: this.path === '',
		}
	},
	computed: {
		itemType() {
			const names = {
				compound: 'Compound',
				list: 'List',
				byteArray: 'Byte Array',
				intArray: 'Int Array',
				int: 'Int',
				float: 'Float',
				byte: 'Byte',
				short: 'Short',
				double: 'Double',
				long: 'Long',
				string: 'String',
			}
			let prefix = ''
			if (this.item.type === 'list' && this.items.length) {
				prefix = names[this.items[0].type] + ' '
			}
			return prefix + names[this.item.type]
		},
		options() {
			return {
				add: this.isFolder,
				edit: this.item.type !== 'compound'
			}
		},
		isFolder() {
			return ['compound', 'list', 'byteArray', 'intArray'].includes(this.item.type)
		},
		icon() {
			if (this.item.type === 'compound') return 'box'
			else if (this.item.type === 'list' || this.item.type.endsWith('Array')) return 'list'
				// else if (this.item.type === 'int') return 'info'
				// else if (this.item.type === 'float') return 'info'
				// else if (this.item.type === 'byte') return 'info'
				// else if (this.item.type === 'short') return 'info'
			// else if (this.item.type === 'long') return 'info'
			else if (this.item.type === 'string') return 'text'
			return 'file'
		},
		items() {
			if (this.item.type === 'compound') {
				return Object.entries(this.item.value).map(a => {
					return {
						name: a[0],
						...a[1]
					}
				})
			}
			if (this.item.type.endsWith('Array')) {
				return this.item.value.map(a => {
					return {
						type: this.item.type.replace('Array', ''),
						name: '',
						value: a
					}
				})
			}
			else if (this.item.type === 'list') {
				if (this.item.value.type === 'compound')
					return this.item.value.value.map(a => {
						return {
							type: 'compound',
							name: '',
							value: a
						}
					})
				return this.item.value.value.map(a => {
					return {
						type: this.item.value.type,
						name: '',
						value: a
					}
				})
			}
			return []
		}
	},
	methods: {
		click() {
			if (this.isFolder) {
				this.isOpen = !this.isOpen;
			}
		},
		edit() {
			console.log('change value', this.item, this.path + '/' + this.item.name)
			setModalsVal('nbtChangeValue', this.item)
			Modals.get('nbtChangeValue', { backdrop: 'static' }).show()
		},
		add() {
			console.log('add item', this.item, this.path + '/' + this.item.name)
		},
		remove() {
			console.log('remove item', this.item, this.path + '/' + this.item.name)
		}
	}
}
</script>

<style scoped>
ul {
	list-style-type: none;
	padding-left: 1.5rem;
	position: relative;
	overflow: hidden;
}
.item > div {
	line-height: 2rem;
}
.tag > div {
	margin-left: 1rem;
}
.state-indicator {
	display: inline-block;
	width: 1rem;
	text-align: center;
	cursor: pointer;
}

.item {
	position: relative;
}

.item::before,
.item::after {
	content: '';
	left: -1rem;
	width: .5rem;
	position: absolute;
	border-style: solid;
	border-color: var(--bs-secondary);
}
.item::before {
	bottom: 1rem;
	height: 100%;
	border-width: 0 0 0 1px;
}
.item::after {
	top: 1rem;
	border-width: 0 0 1px 0;
}
.tag.item::after {
	width: 1.5rem;
}

b {
	font-weight: 600;
}

.background {
	display: inline-block;
	height: 2rem;
}
.modify {
	display: none;
	height: 2rem;
	margin-left: .25rem;
	line-height: 2rem;
	background-color: var(--secondary);
	border-radius: .25rem;
}
.item > div:hover .modify {
	display: inline-block;
}
.modify a {
	cursor: pointer;
}

.type-icon {
	width: 1.5rem;
	text-align: center;
	display: inline-block;
	position: relative;
	vertical-align: middle;
	line-height: 2rem;
	height: 2rem;
}
.type-icon .fa-file {
	left: 0;
	position: absolute;
	text-align: center;
	width: 100%;
	line-height: inherit;
	z-index: 1;
}
.type-icon span {
	left: 0;
	position: absolute;
	text-align: center;
	width: 100%;
	line-height: inherit;
	z-index: 2;
	color: var(--bs-primary);
	text-transform: uppercase;
	font-family: var(--bs-font-monospace);
	font-weight: 600;
	font-size: 75%;
	margin-top: 1px;
}

.fa-box {
	color: var(--bs-warning);
}
.fa-list {
	color: var(--bs-secondary);
}
.fa-text {
	color: var(--bs-danger);
}
</style>
