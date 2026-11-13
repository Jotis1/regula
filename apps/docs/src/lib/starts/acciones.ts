// Puntos de partida del ejemplo interactivo del grupo «acciones» del catálogo (design D3).
import type { Start } from "../playground";

const DIA_SEMANA_MES = [
	{ value: "dia", label: "Día" },
	{ value: "semana", label: "Semana" },
	{ value: "mes", label: "Mes" },
];

export const acciones: Record<string, Start> = {
	Button: {
		children: "Nuevo gasto",
		// Los pies son frases de la ficha (content/components/button.md), letra a letra
		examples: [
			{
				do: {
					caption:
						"Una sola `primary` por vista o por modal: es la acción que esperas que el usuario haga.",
					specimens: [
						{ props: { hierarchy: "secondary" }, children: "Cancelar" },
						{ children: "Guardar" },
					],
				},
				dont: {
					caption: "No apiles dos primarios.",
					specimens: [{ children: "Guardar" }, { children: "Exportar" }],
				},
			},
			{
				section: "evita",
				do: {
					caption: "Si borrar es una opción más, usa `secondary` normal.",
					specimens: [
						{
							props: { hierarchy: "secondary", iconLeading: "Trash01" },
							children: "Eliminar gasto",
						},
					],
				},
				dont: {
					caption: "No todo lo negativo es un botón rojo.",
					specimens: [
						{ props: { destructive: true, iconLeading: "Trash01" }, children: "Eliminar gasto" },
					],
				},
			},
		],
		rules: [
			{
				when: { iconOnly: true },
				disable: ["iconLeading", "iconTrailing", "children"],
				set: { label: "Nuevo gasto" },
				reason: "Un botón de solo icono no lleva texto ni iconos a los lados.",
			},
		],
	},
	ButtonGroup: {
		props: { "aria-label": "Vista", defaultValue: "semana", items: DIA_SEMANA_MES },
	},
	ButtonUtility: {
		props: { icon: "Copy01", label: "Copiar" },
		rules: [
			{
				when: { tooltip: false },
				disable: ["tooltipPlacement", "tooltipOpen"],
				reason: "Sin tooltip no hay posición ni estado abierto.",
			},
		],
	},
	CloseButton: {
		props: {},
	},
	SocialButton: {
		props: { provider: "google", theme: "color", logo: "Google" },
		rules: [
			{
				when: { iconOnly: true },
				disable: ["children"],
				reason: "Con solo el logo, el texto queda solo para lectores de pantalla.",
			},
		],
	},
	SocialButtonGroup: {
		props: { label: "Entrar con", children: "Google, Facebook y Apple" },
	},
	AppStoreBadge: {
		props: { store: "app-store", href: "https://jotis.me", logo: "App Store" },
	},
};
