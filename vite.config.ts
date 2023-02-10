import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig } from 'vite';

const config: UserConfig = {
	define: { 'import.meta.vitest': 'undefined' },
	envPrefix: 'APP_',
	plugins: [sveltekit()],
};

export default config;
