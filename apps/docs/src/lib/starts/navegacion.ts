// Puntos de partida del ejemplo interactivo del grupo «navegacion» del catálogo (design D3).
import type { Start } from "../playground";

export const navegacion: Record<string, Start> = {
	Tabs: {
		props: {
			"aria-label": "Secciones",
			items: [
				{ id: "resumen", label: "Resumen" },
				{ id: "movimientos", label: "Movimientos", count: 12 },
			],
		},
	},
	// La marca (el icono de Regula) la pone `src/playground/SidebarNav.tsx`: los nodos no cruzan a la isla.
	// Con submenú, secciones, pie y cuenta, cada `type` se ve distinto: `dual-tier` y `slim` abren el panel de Panel.
	SidebarNav: {
		props: {
			search: true,
			items: [
				{ icon: "home-line", label: "Inicio", href: "#" },
				{
					icon: "bar-chart-01",
					label: "Panel",
					defaultOpen: true,
					children: [
						{ icon: "eye", label: "Resumen", href: "#", active: true },
						{ icon: "bell-01", label: "Avisos", href: "#", badge: 10 },
						{ icon: "star-01", label: "Guardados", href: "#" },
						{ icon: "clock", label: "Programados", href: "#" },
					],
				},
				{ icon: "currency-euro", label: "Pecunia", href: "#", badge: 3 },
				{ icon: "users-01", label: "Equipo", href: "#" },
			],
			sections: [
				{
					title: "General",
					items: [
						{ icon: "home-line", label: "Inicio", href: "#" },
						{ icon: "bar-chart-01", label: "Panel", href: "#", active: true },
					],
				},
				{
					title: "Apps",
					items: [
						{ icon: "currency-euro", label: "Pecunia", href: "#", badge: 3 },
						{
							icon: "folder",
							label: "Carpetas",
							defaultOpen: true,
							children: [
								{ label: "Recientes", href: "#", badge: 8 },
								{ label: "Compartidas", href: "#", badge: 4 },
							],
						},
					],
				},
			],
			footerItems: [{ icon: "settings-02", label: "Ajustes", href: "#" }],
			account: {
				items: [{ icon: "user-01", label: "Ver perfil" }],
				accounts: [
					{
						value: "ana",
						name: "Ana Díaz",
						email: "ana@jotis.me",
						initials: "AD",
						status: "online",
					},
					{ value: "luis", name: "Luis Gil", email: "luis@jotis.me", initials: "LG" },
				],
			},
		},
		fill: 760,
	},
	FilterBar: {
		props: {
			segments: [
				{ value: "todo", label: "Todo" },
				{ value: "gastos", label: "Gastos" },
			],
			defaultSegment: "todo",
		},
		wide: true,
	},
};
