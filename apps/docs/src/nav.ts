// Navegación de la web, desde el catálogo (src/lib/catalog.ts): las páginas que no son de componente, que usan
// también la búsqueda y los tests, y la navegación lateral completa de DocNav.dc.html, con los componentes por
// grupos. Los textos van en castellano; las URLs, en inglés.
import type { SidebarNavItem } from "@jotis-me/react";
import {
	COMPONENT_GROUPS,
	COMPONENT_KEYWORDS,
	FOUNDATIONS,
	labelOf,
	SECTIONS,
	type SectionId,
	sectionOf,
	slugOf,
} from "./lib/catalog";
import { fold } from "./search/entries";

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

/** Qué lleva la navegación lateral: el árbol de la sección actual o, en el menú móvil, los cinco bloques de la web. */
export type NavScope = "section" | "all";

export interface SidebarTree {
	items: SidebarNavItem[];
	/** Texto extra por el que el filtro encuentra un enlace, ya sin tildes, por `href`. Solo lo que no está en su nombre. */
	keywords: Record<string, string>;
}

/** El bloque de la navegación que contiene la ruta; lo que no es de ninguno (portada, historial, 404) cuenta como Empezar. */
export const navSectionOf = (pathname: string): SectionId => sectionOf(pathname) ?? "start";

const byId = (id: SectionId) => docNav.find((s) => s.id === id) as NavSection;
const ALL_COMPONENTS: NavItem = { label: "Todos los componentes", href: "/components/" };
const wordsOf = (item: NavItem) => (item.keywords ? fold(item.keywords) : undefined);

/**
 * Los elementos de `SidebarNav` de una página. `section`: el árbol de su sección (los grupos de Componentes y de
 * Stream son desplegables, con el de la página actual abierto). `all`: los cinco bloques en el orden de la
 * cabecera, plegados salvo el de la página actual; como `SidebarNav` solo anida un nivel, los grupos de componentes
 * son ahí enlaces a su ancla de `/components/`, y el filtro los encuentra también por los componentes que traen.
 */
export function sidebarTree(current: string, scope: NavScope): SidebarTree {
	const here = navSectionOf(current);
	const keywords: Record<string, string> = {};
	const leaf = (item: NavItem): SidebarNavItem => {
		const extra = wordsOf(item);
		if (extra) keywords[item.href] = extra;
		return { label: item.label, href: item.href, active: item.href === current };
	};
	const groupLeaf = (group: NavGroup): SidebarNavItem => {
		const href = `/components/#${group.id}`;
		keywords[href] = fold(group.items.map((i) => `${i.label} ${i.keywords ?? ""}`).join(" "));
		return { label: group.label, href };
	};
	const groupParent = (group: NavGroup): SidebarNavItem => ({
		label: group.label,
		badge: String(group.items.length),
		children: group.items.map(leaf),
	});
	const pagesOf = (section: NavSection): NavItem[] =>
		section.id === "components" ? [ALL_COMPONENTS, ...section.items] : section.items;

	if (scope === "section") {
		const section = byId(here);
		return { items: [...pagesOf(section).map(leaf), ...section.groups.map(groupParent)], keywords };
	}
	const items = SECTIONS.map((s): SidebarNavItem => {
		const section = byId(s.id);
		return {
			label: section.title,
			defaultOpen: section.id === here,
			children: [...pagesOf(section).map(leaf), ...section.groups.map(groupLeaf)],
		};
	});
	return { items, keywords };
}
