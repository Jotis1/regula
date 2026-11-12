// Footer en el ejemplo interactivo (un fichero por componente: design D4): la marca es un nodo, que se elige entre
// opciones preparadas.
import type { Tweak } from "../lib/playground";

export { Footer as default } from "@jotis-me/react";

export const tweaks: Record<string, Tweak> = {
	brand: {
		kind: "content",
		options: [
			{
				label: "Regula",
				value: (
					<a href="/" className="font-display text-xl font-semibold text-primary no-underline">
						Regula
					</a>
				),
				code: '<a href="/" className="font-display text-xl font-semibold text-primary no-underline">Regula</a>',
			},
		],
	},
};
