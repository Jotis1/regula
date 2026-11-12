// SectionLabel en el ejemplo interactivo (un fichero por componente: design D4): las acciones se eligen entre opciones
// preparadas.
import { Button } from "@jotis-me/react";
import { UserPlus01 } from "@untitledui/icons";
import type { Tweak } from "../lib/playground";

export { SectionLabel as default } from "@jotis-me/react";

export const tweaks: Record<string, Tweak> = {
	actions: {
		kind: "content",
		options: [
			{
				label: "Invitar",
				value: (
					<Button hierarchy="secondary" size="sm" iconLeading={UserPlus01}>
						Invitar
					</Button>
				),
				code: '<Button hierarchy="secondary" size="sm" iconLeading={UserPlus01}>Invitar</Button>',
				imports: ["Button"],
			},
		],
	},
};
