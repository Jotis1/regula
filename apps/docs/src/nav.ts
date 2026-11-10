// Navegación de la web, desde el catálogo (src/lib/catalog.ts): las páginas que no son de componente, que usan
// también la búsqueda y los tests, y la navegación lateral completa de DocNav.dc.html, con los componentes por
// grupos. Los textos van en castellano; las URLs, en inglés.
import { COMPONENT_GROUPS, COMPONENT_KEYWORDS, FOUNDATIONS, labelOf, slugOf } from "./lib/catalog";

export interface NavItem {
	label: string;
	href: string;
	/** Más texto por el que lo encuentra el filtro (no se muestra). */
	keywords?: string;
}
export interface NavGroup {
	id: string;
	label: string;
	items: NavItem[];
}
export interface NavSection {
	id: "start" | "foundations" | "icons" | "components" | "stream";
	title: string;
	items: NavItem[];
	groups: NavGroup[];
	/** Recuento que se muestra junto al título (componentes de la sección). */
	count?: number;
}

const groupsOf = (section: "components" | "stream"): NavGroup[] =>
	COMPONENT_GROUPS.filter((g) => g.section === section).map((g) => ({
		id: g.id,
		label: g.label,
		items: g.components.map((name) => ({
			label: labelOf(name),
			href: `/components/${slugOf(name)}/`,
			keywords: [name, COMPONENT_KEYWORDS[slugOf(name)]].filter(Boolean).join(" "),
		})),
	}));
const countOf = (groups: NavGroup[]) => groups.reduce((n, g) => n + g.items.length, 0);

const components = groupsOf("components");
const stream = groupsOf("stream");

/** La navegación lateral, en el orden del diseño: Empezar, Fundamentos, Iconos, Componentes y Stream. */
export const docNav: NavSection[] = [
	{
		id: "start",
		title: "Empezar",
		items: [
			{ label: "Qué es Regula", href: "/" },
			{ label: "Instalación", href: "/start/install/", keywords: "tailwind next astro" },
		],
		groups: [],
	},
	{
		id: "foundations",
		title: "Fundamentos",
		items: FOUNDATIONS.map((f) => ({ label: f.label, href: `/foundations/${f.slug}/` })),
		groups: [],
	},
	{
		id: "icons",
		title: "Iconos",
		items: [
			{ label: "Galería de iconos", href: "/icons/" },
			{ label: "Logos de terceros", href: "/icons/logos/" },
			{ label: "Banderas", href: "/icons/flags/", keywords: "paises countries" },
			{
				label: "Métodos de pago",
				href: "/icons/payments/",
				keywords: "pagos tarjetas visa mastercard",
			},
			{ label: "Iconos de archivo", href: "/icons/files/", keywords: "carpetas pdf extensiones" },
			{ label: "Cursores", href: "/icons/cursors/", keywords: "puntero mouse" },
		],
		groups: [],
	},
	{ id: "components", title: "Componentes", items: [], groups: components, count: countOf(components) },
	{
		id: "stream",
		title: "Stream",
		items: [{ label: "Guía de Stream", href: "/foundations/stream/", keywords: "twitch obs directo" }],
		groups: stream,
		count: countOf(stream),
	},
];

/** Las páginas que no son de componente (portada, instalación, fundamentos, Stream e iconos), por sección. */
export const nav = docNav.filter((s) => s.items.length > 0).map((s) => ({ title: s.title, items: s.items }));
