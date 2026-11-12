// JobPostCard en el ejemplo interactivo (un fichero por componente: design D4): la bandera es un nodo, que se elige
// entre opciones preparadas.

import { FlagEs } from "@untitledui/country-flags";
import type { Tweak } from "../lib/playground";

export { JobPostCard as default } from "@jotis-me/react";

export const tweaks: Record<string, Tweak> = {
	flag: {
		kind: "content",
		options: [
			{
				label: "Bandera",
				value: <FlagEs />,
				code: "<FlagEs />",
				imports: { "@untitledui/country-flags": ["FlagEs"] },
			},
		],
	},
};
