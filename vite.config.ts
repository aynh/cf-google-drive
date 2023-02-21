import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig } from 'vitest/config';
import UnoCSS from 'unocss/vite';

import { exec } from 'child_process';
import { promisify } from 'util';

// Get current commit hash, last commit date, and origin from git
const pexec = promisify(exec);
let [hash, lastmod, origin] = (
	await Promise.allSettled([
		pexec('git rev-parse HEAD'),
		pexec('git log -1 --format=%cd --date=format:"%Y.%m.%d"'),
		pexec('git remote get-url origin'),
	])
).map((it) => (it.status === 'fulfilled' ? it.value.stdout.trim() : undefined));

const config: UserConfig = {
	define: {
		'import.meta.vitest': 'undefined',
		__GIT__: JSON.stringify({
			hash,
			lastmod,
			origin: origin?.replace(/.git$/, ''),
		}),
	},
	envPrefix: process.env.VITEST ? 'TEST_' : 'APP_',
	plugins: [UnoCSS({ mode: 'svelte-scoped' }), sveltekit()],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}'],
		includeSource: ['src/**/*.{js,ts}'],
		setupFiles: 'src/lib/server/google-drive-v3/setup-test.ts',
	},
};

export default config;
