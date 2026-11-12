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
		presets: [
			{ label: "Primario", props: { hierarchy: "primary" } },
			{ label: "Secundario", props: { hierarchy: "secondary" } },
			{ label: "Terciario", props: { hierarchy: "tertiary" } },
			{ label: "Destructivo", props: { hierarchy: "primary", destructive: true } },
			{ label: "Con icono", props: { iconLeading: "plus" } },
			{ label: "Solo icono", props: { iconOnly: "plus" } },
			{ label: "Cargando", props: { loading: true } },
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
		presets: [
			{
				label: "Con icono",
				props: {
					items: [
						{ value: "dia", label: "Día", icon: "calendar" },
						{ value: "semana", label: "Semana", icon: "grid-01" },
						{ value: "mes", label: "Mes", icon: "bar-chart-01" },
					],
				},
			},
			{
				label: "Solo icono",
				props: {
					items: [
						{ value: "dia", iconOnly: "calendar", label: "Día" },
						{ value: "semana", iconOnly: "grid-01", label: "Semana" },
						{ value: "mes", iconOnly: "bar-chart-01", label: "Mes" },
					],
				},
			},
			{
				label: "Con punto",
				props: { items: DIA_SEMANA_MES.map((i) => ({ ...i, dot: true })) },
			},
		],
	},
	ButtonUtility: {
		props: { icon: "copy-01", label: "Copiar" },
		presets: [
			{ label: "Secundario", props: { hierarchy: "secondary" } },
			{ label: "Terciario", props: { hierarchy: "tertiary" } },
			{ label: "Con tooltip abierto", props: { tooltipOpen: true } },
		],
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
		presets: [
			{ label: "Pequeño", props: { size: "sm" } },
			{ label: "Mediano", props: { size: "md" } },
			{ label: "Grande", props: { size: "lg" } },
		],
	},
	SocialButton: {
		props: { provider: "google", theme: "color", logo: "Google" },
		presets: [
			{ label: "Google", props: { provider: "google", theme: "color", logo: "Google" } },
			{ label: "Facebook", props: { provider: "facebook", theme: "color", logo: "Facebook" } },
			{ label: "Apple", props: { provider: "apple", theme: "color", logo: "Apple" } },
			{ label: "X", props: { provider: "x", theme: "color", logo: "X" } },
			{ label: "Figma", props: { provider: "figma", theme: "color", logo: "Figma" } },
			{ label: "Dribbble", props: { provider: "dribbble", theme: "color", logo: "Dribbble" } },
			{ label: "De marca", props: { theme: "brand", logo: "Google (gris)" } },
			{ label: "Gris", props: { theme: "gray", logo: "Google (gris)" } },
			{ label: "Solo logo", props: { iconOnly: true } },
		],
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
		presets: [
			{ label: "En columna", props: { layout: "column" } },
			{ label: "En fila", props: { layout: "row" } },
		],
	},
	AppStoreBadge: {
		props: { store: "app-store", href: "https://jotis.me", logo: "App Store" },
		presets: [
			{ label: "App Store", props: { store: "app-store", logo: "App Store" } },
			{ label: "Google Play", props: { store: "google-play", logo: "Google Play" } },
			{ label: "Mac App Store", props: { store: "mac-app-store", logo: "Mac App Store" } },
			{ label: "Galaxy Store", props: { store: "galaxy-store", logo: "Galaxy Store" } },
			{ label: "AppGallery", props: { store: "app-gallery", logo: "AppGallery" } },
		],
	},
};
