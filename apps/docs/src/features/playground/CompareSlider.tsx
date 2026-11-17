// CompareSlider en el ejemplo interactivo (un fichero por componente: design D4): las dos capas son nodos, que se eligen
// entre pantallas preparadas.

import { ExpensesScreen } from "../../components/ExpensesScreen";
import type { Tweak } from "../../lib/playground";

export { CompareSlider as Component } from "@jotis-me/react";

export const tweaks: Record<string, Tweak> = {
	before: {
		kind: "content",
		options: [
			{
				label: "Pantalla oscura",
				value: <ExpensesScreen mode="dark" />,
				code: '<Pantalla tema="oscuro" />',
			},
			{
				label: "Pantalla clara",
				value: <ExpensesScreen mode="light" />,
				code: '<Pantalla tema="claro" />',
			},
		],
	},
	after: {
		kind: "content",
		options: [
			{
				label: "Pantalla clara",
				value: <ExpensesScreen mode="light" />,
				code: '<Pantalla tema="claro" />',
			},
			{
				label: "Pantalla oscura",
				value: <ExpensesScreen mode="dark" />,
				code: '<Pantalla tema="oscuro" />',
			},
		],
	},
};
