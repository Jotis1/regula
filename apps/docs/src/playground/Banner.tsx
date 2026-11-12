// Banner en el ejemplo interactivo (un fichero por componente: design D4): las acciones son nodos, que se eligen entre
// opciones preparadas.
import { Button } from "@jotis-me/react";
import type { Tweak } from "../lib/playground";

export { Banner as default } from "@jotis-me/react";

export const tweaks: Record<string, Tweak> = {
	actions: {
		kind: "content",
		options: [
			{
				label: "Ver novedades",
				value: (
					<>
						<Button hierarchy="secondary" size="sm">
							Descartar
						</Button>
						<Button size="sm">Ver novedades</Button>
					</>
				),
				code: [
					"<>",
					'\t<Button hierarchy="secondary" size="sm">Descartar</Button>',
					'\t<Button size="sm">Ver novedades</Button>',
					"</>",
				].join("\n"),
				imports: ["Button"],
			},
		],
	},
};
