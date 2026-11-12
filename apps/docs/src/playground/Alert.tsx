// Alert en el ejemplo interactivo (un fichero por componente: design D4): las acciones son nodos, que se eligen entre
// opciones preparadas.
import { Button } from "@jotis-me/react";
import type { Tweak } from "../lib/playground";

export { Alert as default } from "@jotis-me/react";

export const tweaks: Record<string, Tweak> = {
	actions: {
		kind: "content",
		options: [
			{
				label: "Reintentar y ver más",
				value: (
					<>
						<Button hierarchy="secondary" size="sm">
							Descartar
						</Button>
						<Button size="sm">Reintentar</Button>
					</>
				),
				code: [
					"<>",
					'\t<Button hierarchy="secondary" size="sm">Descartar</Button>',
					'\t<Button size="sm">Reintentar</Button>',
					"</>",
				].join("\n"),
				imports: ["Button"],
			},
		],
	},
};
