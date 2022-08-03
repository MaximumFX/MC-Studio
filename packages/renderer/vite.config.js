/* eslint-env node */

import {chrome} from '../../.electron-vendors.cache.json';
import {join} from 'path';
import vue from '@vitejs/plugin-vue';
import {renderer} from 'unplugin-auto-expose';

const PACKAGE_ROOT = __dirname;

/**
 * @type {import('vite').UserConfig}
 * @see https://vitejs.dev/config/
 */
const config = {
	mode: process.env.MODE,
	root: PACKAGE_ROOT,
	resolve: {
		alias: [
			{ find: '@/', replacement: join(PACKAGE_ROOT, 'src') + '/' },
			{ find: '@asset/', replacement: join(PACKAGE_ROOT, 'assets') + '/' },
			{ find: '#main/', replacement: `${join(PACKAGE_ROOT, '../main/src')}/` },
			{ find: '#type/', replacement: `${join(PACKAGE_ROOT, '../main/type')}/` },
			{ find: /^(?!prismjs).*(components|views)((?!\.[^/.]).)*$/gm, replacement: '$&.vue' },
		],
	},
	base: '',
	server: {
		fs: {
			strict: true,
		},
	},
	build: {
		sourcemap: true,
		target: `chrome${chrome}`,
		outDir: 'dist',
		assetsDir: '.',
		rollupOptions: {
			input: join(PACKAGE_ROOT, 'index.html'),
		},
		emptyOutDir: true,
		brotliSize: false,
	},
	test: {
		environment: 'happy-dom',
	},
	plugins: [
		vue(),
		renderer.vite({
			preloadEntry: join(PACKAGE_ROOT, '../preload/src/index.ts'),
		}),
	],
};

export default config;
