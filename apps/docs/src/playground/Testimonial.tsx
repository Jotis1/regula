// Testimonial en el ejemplo interactivo (un fichero por componente: design D4): la foto y las flechas son nodos o
// funciones, que se eligen entre opciones preparadas.
import type { Tweak } from "../lib/playground";

export { Testimonial as default } from "@jotis-me/react";

const FLECHA = { label: "Con flechas", value: () => {}, code: "() => {}" };

export const tweaks: Record<string, Tweak> = {
	image: {
		kind: "content",
		options: [
			{
				label: "Foto",
				value: <div className="size-full bg-utility-brand-300" />,
				code: '<div className="size-full bg-utility-brand-300" />',
			},
		],
	},
	onPrevious: { kind: "content", options: [FLECHA] },
	onNext: { kind: "content", options: [FLECHA] },
};
