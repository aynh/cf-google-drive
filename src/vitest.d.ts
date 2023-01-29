declare module 'vitest' {
	export interface TestContext {
		accessToken: string;
		folderId: string;
	}
}

export {};
