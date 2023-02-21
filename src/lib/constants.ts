// @ts-expect-error vite config define
export const git = __GIT__ as Record<'hash' | 'origin' | 'lastmod', string>;
