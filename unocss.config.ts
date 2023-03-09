import { defineConfig, presetIcons, presetUno, transformerDirectives } from 'unocss';

export default defineConfig({
	transformers: [transformerDirectives()],
	presets: [presetUno(), presetIcons({ scale: 1.2 })],
	rules: [
		[
			'absolute-center',
			// https://ao.vern.cc/questions/42121150/css-centering-with-transform
			{
				position: 'absolute',
				top: '50%',
				right: '50%',
				transform: 'translate(50%, -50%)',
			},
		],
	],
	shortcuts: [[/^bgfg-(alt|focus|main)$/, ([, c]) => `bg-$bg-${c} text-$fg-${c}`]],
});
