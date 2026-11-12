// SectionHeader en el ejemplo interactivo (un fichero por componente: design D4): las acciones, el buscador y las
// pestañas son nodos, que se eligen entre opciones preparadas.
import { Button, Input, Tabs } from "@jotis-me/react";
import type { Tweak } from "../lib/playground";

export { SectionHeader as default } from "@jotis-me/react";

export const tweaks: Record<string, Tweak> = {
	actions: {
		kind: "content",
		options: [
			{
				label: "Importar y añadir",
				value: (
					<>
						<Button hierarchy="secondary">Importar</Button>
						<Button iconLeading="plus">Añadir</Button>
					</>
				),
				code: [
					"<>",
					'\t<Button hierarchy="secondary">Importar</Button>',
					'\t<Button iconLeading="plus">Añadir</Button>',
					"</>",
				].join("\n"),
				imports: ["Button"],
			},
		],
	},
	search: {
		kind: "content",
		options: [
			{
				label: "Buscador",
				value: <Input aria-label="Buscar" placeholder="Buscar" icon="search-lg" />,
				code: '<Input aria-label="Buscar" placeholder="Buscar" icon="search-lg" />',
				imports: ["Input"],
			},
		],
	},
	tabs: {
		kind: "content",
		options: [
			{
				label: "Pestañas",
				value: (
					<Tabs
						aria-label="Vista"
						items={[
							{ id: "todos", label: "Todos" },
							{ id: "activos", label: "Activos" },
						]}
					/>
				),
				code: '<Tabs aria-label="Vista" items={[{ id: "todos", label: "Todos" }, { id: "activos", label: "Activos" }]} />',
				imports: ["Tabs"],
			},
		],
	},
};
