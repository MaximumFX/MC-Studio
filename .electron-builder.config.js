if (process.env.VITE_APP_VERSION === undefined) {
	const now = new Date;
	process.env.VITE_APP_VERSION = `${now.getUTCFullYear() - 2000}.${now.getUTCMonth() + 1}.${now.getUTCDate()}-${now.getUTCHours() * 60 + now.getUTCMinutes()}`;
}

/**
 * @type {import('electron-builder').Configuration}
 * @see https://www.electron.build/configuration/configuration
 */
const config = {
	appId: "nl.maximumfx.mc-studio",
	productName: "MC Studio",
	copyright: "Copyright © 2022 MaximumFX",
	mac: {
		target: "dmg",
		category: "public.app-category.developer-tools",
	},
	win: {
		target: "nsis",
	},

	fileAssociations: [
		{
			ext: "schem",
			name: "Minecraft Schematic file",
			role: "Editor",
		},
		{
			ext: "nbt",
			name: "Minecraft NBT file",
			role: "Editor",
		}
	],

	directories: {
		output: 'dist',
		buildResources: 'resources',
	},
	files: [
		'packages/**/dist/**',
	],
	extraMetadata: {
		version: process.env.VITE_APP_VERSION,
	},
};

module.exports = config;
