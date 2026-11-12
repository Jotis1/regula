// Carousel en el ejemplo interactivo (un fichero por componente: design D4): las diapositivas son nodos, que se eligen
// entre opciones preparadas.
import type { Tweak } from "../lib/playground";

export { Carousel as default } from "@jotis-me/react";

const SLIDES = [
	<div key="a" className="flex h-48 items-center justify-center bg-brand-solid font-semibold text-white">
		Uno
	</div>,
	<div key="b" className="flex h-48 items-center justify-center bg-secondary font-semibold text-secondary">
		Dos
	</div>,
	<div key="c" className="flex h-48 items-center justify-center bg-tertiary font-semibold text-tertiary">
		Tres
	</div>,
];

const SIX = ["Uno", "Dos", "Tres", "Cuatro", "Cinco", "Seis"].map((text, i) => (
	<div
		key={text}
		className={`flex h-48 items-center justify-center font-semibold ${i % 2 ? "bg-secondary text-secondary" : "bg-brand-solid text-white"}`}
	>
		{text}
	</div>
));

export const tweaks: Record<string, Tweak> = {
	slides: {
		kind: "content",
		options: [
			{
				label: "Tres diapositivas",
				value: SLIDES,
				code: [
					"[",
					'\t<div className="flex h-48 items-center justify-center bg-brand-solid text-white">Uno</div>,',
					'\t<div className="flex h-48 items-center justify-center bg-secondary">Dos</div>,',
					'\t<div className="flex h-48 items-center justify-center bg-tertiary">Tres</div>,',
					"]",
				].join("\n"),
			},
			{
				label: "Seis diapositivas",
				value: SIX,
				code: [
					"[",
					'\t<div className="flex h-48 items-center justify-center bg-brand-solid text-white">Uno</div>,',
					"\t// … hasta seis",
					"]",
				].join("\n"),
			},
		],
	},
};
