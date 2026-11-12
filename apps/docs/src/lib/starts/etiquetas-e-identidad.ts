// Puntos de partida del ejemplo interactivo del grupo «etiquetas-e-identidad» del catálogo (design D3).
import type { Start } from "../playground";

export const etiquetasEIdentidad: Record<string, Start> = {
	Badge: { children: "Pagado" },
	BadgeGroup: { props: { badge: "Nuevo", href: "#" }, children: "Hemos publicado los estados vacíos" },
	Tag: { children: "Facturas" },
	Avatar: { props: { initials: "AD", alt: "Administrador" } },
	AvatarGroup: { props: { items: [{ initials: "AB" }, { initials: "CD" }, { initials: "+3" }] } },
	AvatarLabel: {
		props: { initials: "AD", name: "Responsable de seguridad", supporting: "admin@jotis.me" },
	},
	FeaturedIcon: { props: { icon: "alert-circle" } },
	Icon: { props: { name: "refresh-cw-01", size: 24 } },
};
