import type { UserConfig } from 'vitest/config';

const config: UserConfig = {
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}'],
		includeSource: ['src/**/*.{js,ts}'],
		setupFiles: 'src/lib/server/google-drive-v3/setup-test.ts'
	}
};

export default config;
