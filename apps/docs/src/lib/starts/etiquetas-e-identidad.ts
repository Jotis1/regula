// Puntos de partida del ejemplo interactivo del grupo «etiquetas-e-identidad» del catálogo (design D3).
import type { Start } from "../playground";

export const etiquetasEIdentidad: Record<string, Start> = {
	Badge: {
		children: "Pagado",
		rules: [
			{
				when: { iconOnly: true },
				disable: ["icon", "iconTrailing", "dot", "flag", "avatar", "children"],
				set: { label: "Nuevo" },
				reason: "Una insignia de solo icono no lleva texto, punto, bandera ni avatar.",
			},
		],
	},
	BadgeGroup: {
		props: { badge: "Nuevo", href: "#" },
		children: "Hemos publicado los estados vacíos",
	},
	Tag: {
		children: "Facturas",
	},
	Avatar: {
		props: { initials: "AD", alt: "Administrador" },
	},
	AvatarGroup: {
		props: { items: [{ initials: "AB" }, { initials: "CD" }, { initials: "+3" }] },
	},
	AvatarLabel: {
		props: { initials: "AD", name: "Responsable de seguridad", supporting: "admin@jotis.me" },
	},
	AvatarProfilePhoto: {
		props: { initials: "OR", alt: "Olivia Rhye" },
	},
	CheckIcon: {
		props: {},
	},
	CheckItem: {
		// Fuera de una lista, un `li` no es válido: el ejemplo empieza como `div`
		props: { as: "div" },
		children: "Hasta 10 usuarios",
	},
	Rating: {
		props: { value: 4.5, "aria-label": "Valoración" },
	},
	RatingBadge: {
		props: { title: "Mejor del año", supportingText: "2.000+ reseñas" },
	},
	FeaturedIcon: {
		props: { icon: "AlertCircle" },
	},
	Kbd: {
		children: "⌘K",
	},
	IconTile: {
		props: { icon: "Mail01", label: "Mail01" },
	},
	TokenSwatch: {
		props: {
			name: "text-primary",
			light: "#171717",
			dark: "#fafafa",
			utility: "text-primary",
			usage: "Texto y titulares sobre bg-primary.",
		},
	},
};
