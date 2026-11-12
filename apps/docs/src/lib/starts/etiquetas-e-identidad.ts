// Puntos de partida del ejemplo interactivo del grupo «etiquetas-e-identidad» del catálogo (design D3).
import type { Start } from "../playground";

export const etiquetasEIdentidad: Record<string, Start> = {
	Badge: {
		children: "Pagado",
		presets: [
			{ label: "Píldora", props: { type: "pill" } },
			{ label: "Cuadrada", props: { type: "badge" } },
			{ label: "Moderna", props: { type: "modern" } },
			{ label: "Con punto", props: { dot: true, color: "success" } },
			{ label: "Con bandera", props: { flag: "Bandera" } },
			{ label: "Con avatar", props: { avatar: "Avatar" } },
			{ label: "Con icono delante", props: { icon: "check-circle" } },
			{ label: "Con icono detrás", props: { iconTrailing: "arrow-right" } },
			{ label: "Solo icono", props: { iconOnly: "plus", label: "Nuevo" } },
		],
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
		presets: [
			{ label: "Píldora", props: { type: "pill" } },
			{ label: "Moderna", props: { type: "modern" } },
			{ label: "Insignia detrás", props: { badgePosition: "trailing" } },
			{ label: "Grande", props: { size: "lg" } },
		],
	},
	Tag: {
		children: "Facturas",
		presets: [
			{ label: "Con cierre", props: { onRemove: "Con cierre" } },
			{ label: "Con punto", props: { dot: true } },
			{ label: "Con contador", props: { count: 12 } },
			{ label: "Con casilla", props: { checkable: true } },
			{ label: "Con bandera", props: { flag: "Bandera" } },
			{ label: "Con avatar", props: { avatar: "Avatar" } },
		],
	},
	Avatar: {
		props: { initials: "AD", alt: "Administrador" },
		presets: [
			{ label: "Con estado", props: { status: "online" } },
			{ label: "Verificado", props: { badge: "verified" } },
			{ label: "Con contador", props: { badge: "count", count: 3 } },
			{ label: "Con anillo", props: { ring: true } },
			{ label: "Grande", props: { size: "2xl" } },
		],
	},
	AvatarGroup: {
		props: { items: [{ initials: "AB" }, { initials: "CD" }, { initials: "+3" }] },
		presets: [
			{
				label: "Con botón de añadir",
				props: { onAdd: "Con botón de añadir" },
			},
			{ label: "Grande", props: { size: "lg" } },
		],
	},
	AvatarLabel: {
		props: { initials: "AD", name: "Responsable de seguridad", supporting: "admin@jotis.me" },
		presets: [
			{ label: "Pequeño", props: { size: "sm" } },
			{ label: "Mediano", props: { size: "md" } },
			{ label: "Grande", props: { size: "lg" } },
		],
	},
	AvatarProfilePhoto: {
		props: { initials: "OR", alt: "Olivia Rhye" },
		presets: [
			{ label: "Con iniciales", props: { initials: "OR" } },
			{ label: "Verificada", props: { verified: true } },
			{ label: "Grande", props: { size: "lg" } },
		],
	},
	CheckIcon: {
		props: {},
		presets: [
			{ label: "Con círculo", props: { type: "default" } },
			{ label: "De contorno", props: { type: "line" } },
			{ label: "Sólido", props: { type: "filled", color: "success" } },
		],
	},
	CheckItem: {
		// Fuera de una lista, un `li` no es válido: el ejemplo empieza como `div`
		props: { as: "div" },
		children: "Hasta 10 usuarios",
		presets: [
			{ label: "Con círculo", props: { type: "default" } },
			{ label: "De contorno", props: { type: "line" } },
			{ label: "Sólido", props: { type: "filled", color: "success" } },
			{ label: "Gris", props: { color: "gray" } },
		],
	},
	Rating: {
		props: { value: 4.5, "aria-label": "Valoración" },
		presets: [
			{ label: "Amarilla", props: { color: "yellow" } },
			{ label: "Gris", props: { color: "gray" } },
			{ label: "Pequeña", props: { size: "sm" } },
		],
	},
	RatingBadge: {
		props: { title: "Mejor del año", supportingText: "2.000+ reseñas" },
		presets: [
			{ label: "Con estrellas", props: { stars: true } },
			{ label: "Sin estrellas", props: { stars: false } },
			{ label: "Cuatro estrellas", props: { rating: 4 } },
		],
	},
	FeaturedIcon: {
		props: { icon: "alert-circle" },
		presets: [
			{ label: "Clara", props: { variant: "light" } },
			{ label: "Con degradado", props: { variant: "gradient" } },
			{ label: "Oscura", props: { variant: "dark" } },
			{ label: "Moderna", props: { variant: "modern" } },
			{ label: "De contorno", props: { variant: "outline" } },
		],
	},
	Icon: {
		props: { name: "refresh-cw-01", size: 24 },
		presets: [
			{ label: "Trazo fino", props: { strokeWidth: 1.5 } },
			{ label: "Girando", props: { spin: true, name: "loading-02" } },
		],
	},
	Kbd: {
		children: "⌘K",
		presets: [
			{ label: "De menú", props: { variant: "menu" } },
			{ label: "De campo", props: { variant: "field" } },
		],
	},
};
