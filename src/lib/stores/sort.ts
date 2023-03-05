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
		const items_ = [...items].sort((a, b) => {
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

		return options.order === SortOrder.ascending ? items_ : items_.reverse();
	};
};

export const sorted = derived(
	sort,
	($sort, set) => set(createSorted($sort)),
	createSorted(__sortDefault),
);

if (import.meta.vitest) {
	const { describe, expect, it } = import.meta.vitest;

	const predicates: FileValue[] = (
		[
			{
				name: 'b',
				modified: new Date(2000, 0, 2).toUTCString(),
				size: 1001,
				type: FileType.unknown,
			},
			{
				name: 'a',
				modified: new Date(2000, 0, 1).toUTCString(),
				size: 1000,
				type: FileType.folder,
			},
		] as Omit<FileValue, 'path' | 'thumbnail'>[]
	).map((value) => ({ ...value, path: '_', thumbnail: false }));

	describe.each<SortOptions & { outputs: FileValue[] }>([
		{ key: SortKey.name, order: SortOrder.ascending, outputs: [predicates[1], predicates[0]] },
		{ key: SortKey.name, order: SortOrder.descending, outputs: [predicates[0], predicates[1]] },
		{ key: SortKey.modified, order: SortOrder.ascending, outputs: [predicates[1], predicates[0]] },
		{ key: SortKey.modified, order: SortOrder.descending, outputs: [predicates[0], predicates[1]] },
		{ key: SortKey.size, order: SortOrder.ascending, outputs: [predicates[0], predicates[1]] },
		{ key: SortKey.size, order: SortOrder.descending, outputs: [predicates[0], predicates[1]] },
	])('$key $order', ({ outputs, ...options }) => {
		it('should sort', () => {
			const sorted = createSorted(options);
			expect(sorted(predicates)).toStrictEqual(outputs);
		});
	});
}
