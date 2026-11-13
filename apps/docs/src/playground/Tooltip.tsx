// Tooltip en el ejemplo interactivo (un fichero por componente: design D4): lo que envuelve es un nodo, que se elige
// entre opciones preparadas.
import { Button } from "@jotis-me/react";
import { InfoCircle } from "@untitledui/icons";
import type { Tweak } from "../lib/playground";

export { Tooltip as default } from "@jotis-me/react";

export const tweaks: Record<string, Tweak> = {
	children: {
		kind: "content",
		options: [
			{
				label: "Botón",
				value: <Button hierarchy="secondary">Exportar</Button>,
				code: '<Button hierarchy="secondary">Exportar</Button>',
				imports: ["Button"],
			},
			{
				label: "Botón de icono",
				value: <Button hierarchy="tertiary" iconOnly={InfoCircle} label="Más información" />,
				code: '<Button hierarchy="tertiary" iconOnly={InfoCircle} label="Más información" />',
				imports: ["Button"],
			},
		],
	},
};
