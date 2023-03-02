import { browser } from '$app/environment';
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
	for (const prefix of [FileType.audio, FileType.image, FileType.video, FileType.text]) {
		if (mimeType.startsWith(FileType[prefix])) {
			return prefix;
		}
	}
};

const extensionsMap = new Map<FileType, string[]>();
const fileTypeFromExtension = (name: string) => {
	for (const [type, extensions] of extensionsMap.entries()) {
		if (extensions.some((extension) => name.endsWith(`.${extension}`))) {
			return type;
		}
	}
};

if (!browser) {
	extensionsMap.set(
		FileType.archive,
		[
			// handpicked from https://en.wikipedia.org/wiki/List_of_archive_formats
			['iso', 'tar', 'bz', 'bz2', 'gz', 'lz', 'lz4', 'lzma', 'lzo', 'xz', 'z', 'Z'],
			['zst', '7z', 'apk', 'arc', 'ark', 'cab', 'deb', 'dmg', 'jar', 'rar', 'sfx'],
			['tgz', 'tbz2', 'tlz', 'txz', 'wim', 'zip', 'zpaq'],
			['gz', 'Z', 'bz2', 'lz', 'xz', 'zst'].map((it) => `tar.${it}`),
		].flat(),
	);

	// image, presentation, spreedsheet, and text are handpicked from /usr/share/mime
	extensionsMap.set(FileType.image, ['cb7', 'cbr', 'cbt', 'cbz']);
	extensionsMap.set(
		FileType.presentation,
		[
			['odp', 'otp', 'ppam', 'ppsm', 'ppt', 'pptm', 'pptx', 'pps', 'ppz', 'pot'],
			['potm', 'potx', 'sdd', 'sdp', 'sldm', 'sti', 'sxi'],
		].flat(),
	);
	extensionsMap.set(
		FileType.spreadsheet,
		[
			['odc', 'ods', 'otc', 'ots', 'xla', 'xlam', 'xlc', 'xld', 'xlsb', 'xll', 'xlm'],
			['xls', 'xlsm', 'xlsx', 'xlt', 'xltm', 'xltx', 'xlw'],
		].flat(),
	);
	extensionsMap.set(
		FileType.text,
		[
			['chm', 'doc', 'docm', 'docx', 'dotm', 'dotx', 'ipynb', 'odb', 'odf', 'odt'],
			['odm', 'otf', 'ott', 'pdf', 'ps', 'rtf', 'mdb', 'xps'],
		].flat(),
	);
}
