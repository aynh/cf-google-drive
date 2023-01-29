// See https://kit.svelte.dev/docs/types#app

import type { FileResource } from '$lib/server/google-drive-v3/files';

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			accessToken: string;
			resolved: FileResource;
		}
		// interface PageData {}
		// interface Platform {}
	}
}

export {};
