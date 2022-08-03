const colors = require('tailwindcss/colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		'./packages/renderer/index.html',
		'./packages/**/*.{vue,js,ts,jsx,tsx}',
	],
	theme: {
		fontFamily: {
			sans: ['"Open Sans"'],
		},
		extend: {},
		colors: {
			current: 'currentColor',
			transparent: 'transparent',
			black: colors.black,
			white: colors.white,
			gray: colors.neutral,
			red: colors.red,
			orange: colors.orange,
			amber: colors.amber,
			yellow: colors.yellow,
			lime: colors.lime,
			green: colors.green,
			emerald: colors.emerald,
			teal: colors.teal,
			cyan: colors.cyan,
			sky: colors.sky,
			blue: colors.blue,
			indigo: colors.indigo,
			violet: colors.violet,
			purple: colors.purple,
			fuchsia: colors.fuchsia,
			pink: colors.pink,
			rose: colors.rose,
		},
	},
	plugins: [],
	safelist: [
		{
			pattern: /(bg|text|ring)-(white|black)/,
			variants: ['hover', 'focus', 'disabled'],
		},
		{
			pattern: /(bg|text|ring)-(red|green|blue|yellow)-(100|200|300|400|500|600|700|800|900)/,
			variants: ['hover', 'focus', 'disabled'],
		},
	],
}
