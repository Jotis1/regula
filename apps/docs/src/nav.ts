// Navegación lateral de la web: secciones y páginas en el orden de la guía.
// Los textos van en castellano; las URLs, en inglés.
export interface NavItem {
	label: string;
	href: string;
}
export interface NavSection {
	title: string;
	items: NavItem[];
}

export const nav: NavSection[] = [
	{
		title: "Fundamentos",
		items: [
			{ label: "Principios", href: "/foundations/principles/" },
			{ label: "Contenido y tono", href: "/foundations/content/" },
			{ label: "Color", href: "/foundations/color/" },
			{ label: "Tipografía", href: "/foundations/typography/" },
			{ label: "Espaciado, radios y layout", href: "/foundations/layout/" },
			{ label: "Sombras y estados", href: "/foundations/states/" },
			{ label: "Iconografía", href: "/foundations/iconography/" },
			{ label: "Fondos y adornos", href: "/foundations/backgrounds/" },
			{ label: "Stream (Twitch)", href: "/foundations/stream/" },
			{ label: "Marca e iconos de app", href: "/foundations/brand/" },
		],
	},
	{
		title: "Uso",
		items: [
			{ label: "Instalación con Tailwind v4", href: "/start/install/" },
			{ label: "Iconos", href: "/icons/" },
		],
	},
	{ title: "Componentes", items: [] },
];

/** La navegación con la sección de componentes rellena, en orden alfabético, desde la colección. */
export function withComponents(components: { name: string; slug: string }[]): NavSection[] {
	const items = [...components]
		.sort((a, b) => a.name.localeCompare(b.name))
		.map((c) => ({ label: c.name, href: `/components/${c.slug}/` }));
	return nav.map((s) => (s.title === "Componentes" ? { ...s, items } : s));
}
