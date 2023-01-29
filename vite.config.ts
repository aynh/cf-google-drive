import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig } from 'vite';

const config: UserConfig = {
	envPrefix: process.env.VITEST ? 'TEST_' : 'APP_',
	plugins: [sveltekit()],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}'],
		includeSource: ['src/**/*.{js,ts}'],
		setupFiles: 'src/lib/server/google-drive-v3/setup-test.ts'
	}
};

export default config;
