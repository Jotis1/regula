// CardHeader en el ejemplo interactivo (un fichero por componente: design D4): las acciones y el menú se eligen entre
// opciones preparadas.
import { Button } from "@jotis-me/react";
import type { Tweak } from "../lib/playground";

export { CardHeader as default } from "@jotis-me/react";

export const tweaks: Record<string, Tweak> = {
	actions: {
		kind: "content",
		options: [
			{
				label: "Ver todas",
				value: (
					<Button hierarchy="secondary" size="sm">
						Ver todas
					</Button>
				),
				code: '<Button hierarchy="secondary" size="sm">Ver todas</Button>',
				imports: ["Button"],
			},
		],
	},
	onMenu: { kind: "content", options: [{ label: "Con menú", value: () => {}, code: "() => {}" }] },
};
