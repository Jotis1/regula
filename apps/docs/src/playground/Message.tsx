// Message en el ejemplo interactivo (un fichero por componente: design D4): la respuesta citada se elige entre
// opciones preparadas.
import type { Tweak } from "../lib/playground";

export { Message as default } from "@jotis-me/react";

export const tweaks: Record<string, Tweak> = {
	reply: {
		kind: "content",
		options: [
			{
				label: "Respuesta",
				value: "¿Hay algo por debajo de 200 €?",
				code: '"¿Hay algo por debajo de 200 €?"',
			},
		],
	},
};
