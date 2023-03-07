import type { FileResource } from './server/google-drive-v3/files';

export enum FileType {
	archive,
	audio,
	folder,
	image,
	presentation,
	spreadsheet,
	video,
	text,
	unknown,
}

export const resolveFileType = ({ name, mimeType }: Pick<FileResource, 'name' | 'mimeType'>) => {
	return fileTypeFromMimePrefix(mimeType) ?? fileTypeFromExtension(name) ?? FileType.unknown;
};

const fileTypeFromMimePrefix = (mimeType: string) => {
	const prefixes = [FileType.audio, FileType.image, FileType.video, FileType.text];

	return prefixes.find((type) => mimeType.startsWith(FileType[type]));
};

const fileTypeFromExtension = (name: string) => {
	const extensionsMap = new Map<FileType, string[]>([
		[
			FileType.archive,
			[
				// handpicked from https://en.wikipedia.org/wiki/List_of_archive_formats
				['iso', 'tar', 'bz', 'bz2', 'gz', 'lz', 'lz4', 'lzma', 'lzo', 'xz', 'z', 'Z'],
				['zst', '7z', 'apk', 'arc', 'ark', 'cab', 'deb', 'dmg', 'jar', 'rar', 'sfx'],
				['tgz', 'tbz2', 'tlz', 'txz', 'wim', 'zip', 'zpaq'],
				['gz', 'Z', 'bz2', 'lz', 'xz', 'zst'].map((it) => `tar.${it}`),
			].flat(),
		],
		// image, presentation, spreedsheet, and text are handpicked from /usr/share/mime
		[FileType.image, ['cb7', 'cbr', 'cbt', 'cbz']],
		[
			FileType.presentation,
			[
				['odp', 'otp', 'ppam', 'ppsm', 'ppt', 'pptm', 'pptx', 'pps', 'ppz', 'pot'],
				['potm', 'potx', 'sdd', 'sdp', 'sldm', 'sti', 'sxi'],
			].flat(),
		],
		[
			FileType.spreadsheet,
			[
				['odc', 'ods', 'otc', 'ots', 'xla', 'xlam', 'xlc', 'xld', 'xlsb', 'xll', 'xlm'],
				['xls', 'xlsm', 'xlsx', 'xlt', 'xltm', 'xltx', 'xlw'],
			].flat(),
		],
		[
			FileType.text,
			[
				['chm', 'doc', 'docm', 'docx', 'dotm', 'dotx', 'ipynb', 'odb', 'odf', 'odt'],
				['odm', 'otf', 'ott', 'pdf', 'ps', 'rtf', 'mdb', 'xps'],
			].flat(),
		],
	]);

	for (const [type, extensions] of extensionsMap.entries()) {
		if (extensions.some((extension) => name.endsWith(`.${extension}`))) {
			return type;
		}
	}
};

if (import.meta.vitest) {
	const { describe, expect, it } = import.meta.vitest;

	describe.each([
		{ name: '_', mimeType: '_', is: FileType.unknown },
		{ name: '_', mimeType: 'image/jpeg', is: FileType.image },
		{ name: '_', mimeType: 'audio/mp3', is: FileType.audio },
		{ name: '_', mimeType: 'video/webm', is: FileType.video },
		{ name: '_', mimeType: 'text/plain', is: FileType.text },
		{ name: 'zstd-1.5.4-1-x86_64.pkg.tar.zst', mimeType: '_', is: FileType.archive },
	])('$name $mimeType = $is', ({ is, ...args }) => {
		it('should match', () => {
			expect(resolveFileType(args)).toBe(is);
		});
	});
}
