// Los grupos del inspector del ejemplo interactivo (design D3 de redesign-docs-site-v2): qué props van juntas y en qué
// orden. El primero, «Lo esencial», va abierto. Un componente sin grupos tiene uno solo, «Propiedades»; con más de doce
// controles, un test pide que los tenga. Un arranque puede traer sus propios `groups`, que mandan sobre estos.
import type { Group } from "../playground";

const AYUDA_Y_VALIDACION: Group = {
	name: "Ayuda y validación",
	props: ["hint", "error", "required", "labelAside"],
};

export const GRUPOS: Record<string, Group[]> = {
	Button: [
		{ name: "Lo esencial", props: ["children", "hierarchy", "size"] },
		{ name: "Iconos", props: ["iconLeading", "iconTrailing", "iconOnly", "label"] },
		{ name: "Estado", props: ["destructive", "loading"] },
	],
	Input: [
		{ name: "Lo esencial", props: ["label", "type", "size"] },
		AYUDA_Y_VALIDACION,
		{ name: "Iconos y añadidos", props: ["icon", "prefix"] },
		{
			name: "Solo con algunos tipos",
			props: ["revealable", "chooseFileLabel", "noFileLabel", "pickerLabel"],
		},
	],
	Table: [
		{ name: "Lo esencial", props: ["title", "count", "description", "size"] },
		{ name: "Columnas y orden", props: ["columns", "defaultSort"] },
		{ name: "Selección y filas", props: ["selection", "striped"] },
	],
	NumberInput: [
		{ name: "Lo esencial", props: ["label", "placeholder", "size", "orientation"] },
		{ name: "Rango", props: ["min", "max", "step"] },
		AYUDA_Y_VALIDACION,
		{ name: "Estado", props: ["disabled"] },
		{ name: "Textos de los botones", props: ["decrementLabel", "incrementLabel"] },
	],
	Select: [
		{ name: "Lo esencial", props: ["label", "placeholder", "options", "size", "type"] },
		{ name: "Búsqueda", props: ["searchable", "emptyLabel"] },
		AYUDA_Y_VALIDACION,
		{ name: "Icono y estado", props: ["icon", "disabled"] },
		{ name: "Accesibilidad", props: ["aria-label"] },
	],
	MultiSelect: [
		{ name: "Lo esencial", props: ["label", "placeholder", "display", "size"] },
		AYUDA_Y_VALIDACION,
		{ name: "Estado", props: ["disabled"] },
		{
			name: "Textos de la lista",
			props: [
				"searchLabel",
				"emptyTitle",
				"emptyDescription",
				"clearSearchLabel",
				"resetLabel",
				"selectAllLabel",
			],
		},
	],
	InlineCTA: [
		{ name: "Lo esencial", props: ["type", "title", "description", "actions"] },
		{ name: "Icono e imagen", props: ["icon", "image", "imageAlt"] },
		{ name: "Formulario de correo", props: ["emailLabel", "emailPlaceholder", "submitLabel"] },
		{ name: "Contenido de cada tipo", props: ["plan", "features", "payment", "file"] },
	],
};
