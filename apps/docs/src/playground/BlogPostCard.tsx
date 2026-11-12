// BlogPostCard en el ejemplo interactivo (un fichero por componente: design D4): la imagen es un nodo, que se elige
// entre opciones preparadas.
import type { Tweak } from "../lib/playground";

export { BlogPostCard as default } from "@jotis-me/react";

export const tweaks: Record<string, Tweak> = {
	image: {
		kind: "content",
		options: [
			{
				label: "Portada",
				value: <div className="size-full bg-utility-brand-200" />,
				code: '<div className="size-full bg-utility-brand-200" />',
			},
		],
	},
};
