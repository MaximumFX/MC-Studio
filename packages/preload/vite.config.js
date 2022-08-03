import {chrome} from '../../.electron-vendors.cache.json';
import {preload} from 'unplugin-auto-expose';
import path, { join } from 'path';

const PACKAGE_ROOT = __dirname;

/**
 * @type {import('vite').UserConfig}
 * @see https://vitejs.dev/config/
 */
const config = {
	mode: process.env.MODE,
	root: PACKAGE_ROOT,
	envDir: process.cwd(),
	build: {
		ssr: true,
		sourcemap: 'inline',
		target: `chrome${chrome}`,
		outDir: 'dist',
		assetsDir: '.',
		minify: process.env.MODE !== 'development',
		lib: {
			entry: 'src/index.ts',
			formats: ['cjs'],
		},
		rollupOptions: {
			output: {
				entryFileNames: '[name].cjs',
			},
		},
		emptyOutDir: true,
		brotliSize: false,
	},
	plugins: [
		preload.vite(),
	],
	resolve: {
		alias: {
			'@/': join(PACKAGE_ROOT, 'src') + '/',
			'#main/': `${path.resolve(PACKAGE_ROOT, '../main/src')}/`,
			'#type/': `${path.resolve(PACKAGE_ROOT, '../main/type')}/`,
		},
	},
};

export default config;