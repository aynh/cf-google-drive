import { derived, writable } from 'svelte/store';
import type { FileValue } from '$lib/types';

export interface SortOptions {
	key: 'name' | 'modified' | 'size';
	order: 'ascending' | 'descending';
}

export const __sortDefault: SortOptions = { key: 'name', order: 'ascending' };
export const sort = writable(__sortDefault);

export const updateSort = (key: SortOptions['key']) => {
	sort.update(($sort) => ({
		key,
		order:
			// interchange between ascending and descending
			$sort.key === key && $sort.order === 'ascending' ? 'descending' : 'ascending',
	}));
};

const createSorted = (options: SortOptions) => {
	return (items: FileValue[]) => {
		items.sort((a, b) => {
			const folderFirst = Number(b.folder) - Number(a.folder);

			const compareName = () =>
				folderFirst || // put folder first when sorting by name
				a.name.localeCompare(b.name);
			const compareModified = () => Number(new Date(a.modified)) - Number(new Date(b.modified));
			const compareSize = () =>
				(options.order === 'ascending'
					? -folderFirst // put folder last if ascending
					: 0) || a.size - b.size;

			switch (options.key) {
				case 'name':
					return compareName() || compareModified() || compareSize();

				case 'modified':
					return compareModified() || compareName() || compareSize();

				case 'size':
					return compareSize() || compareName() || compareModified();
			}
		});

		return options.order === 'ascending' ? items : [...items].reverse();
	};
};

export const sorted = derived(
	sort,
	($sort, set) => set(createSorted($sort)),
	createSorted(__sortDefault),
);
