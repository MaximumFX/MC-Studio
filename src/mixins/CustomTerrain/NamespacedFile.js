export default {
	data() {
		return {
			fileId: this.$route.params.fileId,
			json: undefined,
			name: this.namespace.getFile(this.$route.params.fileId).name,
			validation: undefined,

			color: undefined,

			loaded: false,
			saved: true,
		}
	},
	async created() {
		this.$store.commit('setTitle', `[${this.ctfile.name}] ${this.$route.name.replace('CTE', '').replace(/([A-Z])/g, ' $1').trim()}`)

		this.$store.commit('custom_terrain/setCTFile', this.ctfile)
		if (this.ctfile.color)
			this.color = `rgb(${this.ctfile.color[0]}, ${this.ctfile.color[1]}, ${this.ctfile.color[2]})`
		await this.ctfile.load()
		this.json = this.ctfile.file
		console.log('[NamespacedFile created] Loaded json', this.ctfile)
		this.validation = this.json.getStructure()
	},
	computed: {
		ctfile() {
			return this.namespace.getFile(this.fileId)
		},
	},
	watch: {
		json: {
			handler(val) {
				if (this.loaded) {
					console.warn('[NamespacedFile watch:json]', val, this.loaded)
					this.saved = false
					this.$store.commit('setSaved', false)
				}
				this.loaded = true
				this.ready()
			},
			deep: true
		},
		name(val) {
			console.warn('[NamespacedFile watch:name]', val)
			this.saved = false
			this.$store.commit('setSaved', false)
		}
	},
	methods: {
		async save() {
			this.ctfile.name = this.name
			this.ctfile.file = this.json
			await this.ctfile.save()
			this.saved = true
			this.$store.commit('setSaved', true)
		},
		ready() {

		}
	}
}
