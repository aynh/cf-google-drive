import { derived, writable } from 'svelte/store';
import type { FileValue } from '$lib/types';
import { FileType } from '$lib/filetype';

export enum SortKey {
	name,
	modified,
	size,
}

export enum SortOrder {
	ascending,
	descending,
}

export interface SortOptions {
	key: SortKey;
	order: SortOrder;
}

export const __sortDefault: SortOptions = { key: SortKey.name, order: SortOrder.ascending };
export const sort = writable(__sortDefault);

const createSorted = (options: SortOptions) => {
	return (items: FileValue[]) => {
		items.sort((a, b) => {
			const folderFirst = Number(b.type === FileType.folder) - Number(a.type === FileType.folder);

			const compareName = () =>
				folderFirst || // put folder first when sorting by name
				a.name.localeCompare(b.name);
			const compareModified = () => Number(new Date(a.modified)) - Number(new Date(b.modified));
			const compareSize = () =>
				(options.order === SortOrder.ascending
					? -folderFirst // put folder last if ascending
					: 0) || a.size - b.size;

			switch (options.key) {
				case SortKey.name:
					return compareName() || compareModified() || compareSize();

				case SortKey.modified:
					return compareModified() || compareName() || compareSize();

				case SortKey.size:
					return compareSize() || compareName() || compareModified();
			}
		});

		return options.order === SortOrder.ascending ? items : [...items].reverse();
	};
};

export const sorted = derived(
	sort,
	($sort, set) => set(createSorted($sort)),
	createSorted(__sortDefault),
);
