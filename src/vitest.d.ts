declare module '@vitest/runner' {
	export interface TestContext {
		accessToken: string;
		folderId: string;
	}
}

export {};
