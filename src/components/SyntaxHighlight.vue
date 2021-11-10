<template>
	<pre class="bg-mcs-foreground p-3"><code class="syntax-highlight" v-html="code"></code></pre>
</template>

<script>
export default {
	name: "SyntaxHighlight",
	props: {
		data: Object
	},
	computed: {
		code() {
			let json = this.data
			if (typeof json != 'string') {
				json = JSON.stringify(json, undefined, 2);
			}
			json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
			return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g, function (match) {
				let cls = 'number';
				if (/^"/.test(match)) {
					if (/:$/.test(match)) {
						cls = 'key';
					} else {
						cls = 'string';
					}
				} else if (/true|false/.test(match)) {
					cls = 'boolean';
				} else if (/null/.test(match)) {
					cls = 'null';
				}
				return '<span class="' + cls + '">' + match + '</span>';
			})
		}
	}
}
</script>

<style>
.syntax-highlight .string { color: limegreen; }
.syntax-highlight .number { color: darkorange; }
.syntax-highlight .boolean { color: yellow; }
.syntax-highlight .null { color: magenta; }
.syntax-highlight .key { color: mediumpurple; }
</style>
