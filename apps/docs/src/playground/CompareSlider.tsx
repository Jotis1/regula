// CompareSlider en el ejemplo interactivo (un fichero por componente: design D4): las dos capas son nodos, que se eligen
// entre pantallas preparadas.
import type { Tweak } from "../lib/playground";
import { PantallaGastos } from "../visual/examples/compare-slider";

export { CompareSlider as default } from "@jotis-me/react";

export const tweaks: Record<string, Tweak> = {
	before: {
		kind: "content",
		options: [
			{
				label: "Pantalla oscura",
				value: <PantallaGastos mode="dark" />,
				code: '<Pantalla tema="oscuro" />',
			},
			{
				label: "Pantalla clara",
				value: <PantallaGastos mode="light" />,
				code: '<Pantalla tema="claro" />',
			},
		],
	},
	after: {
		kind: "content",
		options: [
			{
				label: "Pantalla clara",
				value: <PantallaGastos mode="light" />,
				code: '<Pantalla tema="claro" />',
			},
			{
				label: "Pantalla oscura",
				value: <PantallaGastos mode="dark" />,
				code: '<Pantalla tema="oscuro" />',
			},
		],
	},
};
