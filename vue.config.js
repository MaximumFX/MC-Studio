module.exports = {
	pluginOptions: {
		electronBuilder: {
			nodeIntegration: true,
			chainWebpackMainProcess: config => {
				config.module
					.rule('babel')
					.test(/\.js$/)
					.exclude.add(/node_modules/)
					.end()
					.use('babel')
					.loader('babel-loader')
					.options({
						presets: [['@babel/preset-env', { modules: false }]],
						plugins: ['@babel/plugin-proposal-class-properties']
					})
			},

			builderOptions: {
				appId: "nl.maximumfx.mc-studio",
				productName: "MC Studio",
				copyright: "Copyright © 2021 MaximumFX",
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
				]
			}
		}
	}
}
