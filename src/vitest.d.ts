declare module '@vitest/runner' {
	export interface TestContext {
		token: string;
		folderId: string;
	}
}

export {};
