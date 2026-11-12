// Puntos de partida del ejemplo interactivo del grupo «navegacion» del catálogo (design D3).
import type { Start } from "../playground";

const CUENTAS = [
	{ value: "ana", name: "Ana Díaz", email: "ana@jotis.me", initials: "AD", status: "online" },
	{ value: "luis", name: "Luis Gil", email: "luis@jotis.me", initials: "LG" },
];

const NAVEGADOR = [
	{ icon: "ArrowLeft", label: "Atrás" },
	{ icon: "RefreshCw01", label: "Recargar", shortcut: "⌘R" },
	{ divider: true },
	{ icon: "Edit02", label: "Editar página" },
	{ icon: "Star01", label: "Añadir a favoritos" },
];
const EDICION = [
	{ label: "Cortar", shortcut: "⌘X" },
	{ label: "Copiar", shortcut: "⌘C" },
	{ label: "Pegar", shortcut: "⌘V" },
	{ divider: true },
	{ icon: "Trash01", label: "Eliminar", danger: true },
];

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
	Breadcrumbs: {
		props: {
			items: [
				{ label: "Inicio", href: "#", icon: "HomeLine" },
				{ label: "Gastos", href: "#" },
				{ label: "Octubre" },
			],
		},
	},
	Pagination: {
		props: { total: 12, defaultPage: 3 },
	},
	PaginationDots: {
		props: { total: 5, current: 2 },
	},
	Pager: {
		props: { prev: "Color", next: "Tipografía" },
		tweaks: {
			prev: {
				kind: "content",
				options: [
					{
						label: "Color",
						value: { href: "#", label: "Color" },
						code: '{ href: "#", label: "Color" }',
					},
					{
						label: "Contenido y tono",
						value: { href: "#", label: "Contenido y tono" },
						code: '{ href: "#", label: "Contenido y tono" }',
					},
				],
			},
			next: {
				kind: "content",
				options: [
					{
						label: "Tipografía",
						value: { href: "#", label: "Tipografía" },
						code: '{ href: "#", label: "Tipografía" }',
					},
					{
						label: "Espaciado",
						value: { href: "#", label: "Espaciado" },
						code: '{ href: "#", label: "Espaciado" }',
					},
				],
			},
		},
	},
	Dropdown: {
		props: {
			label: "Opciones",
			accounts: CUENTAS,
			items: [
				{ icon: "Edit02", label: "Editar", shortcut: "⌘E" },
				{ icon: "Copy01", label: "Duplicar", shortcut: "⌘D" },
				{ divider: true },
				{ icon: "Trash01", label: "Eliminar", danger: true },
			],
		},
	},
	ContextMenu: {
		props: { defaultOpen: true, items: "Navegador" },
		children: "Pulsa con el botón derecho",
		fill: 260,
		tweaks: {
			items: {
				kind: "content",
				options: [
					{ label: "Navegador", value: NAVEGADOR, code: JSON.stringify(NAVEGADOR) },
					{ label: "Edición", value: EDICION, code: JSON.stringify(EDICION) },
				],
			},
		},
	},
	HeaderNav: {
		props: {
			items: [
				{ label: "Inicio", href: "#" },
				{
					label: "Panel",
					href: "#",
					current: true,
					children: [
						{ label: "Resumen", href: "#", current: true },
						{ label: "Avisos", href: "#", badge: 2 },
						{ label: "Analítica", href: "#" },
					],
				},
				{ label: "Proyectos", href: "#" },
				{ label: "Tareas", href: "#", badge: 8 },
			],
		},
		wide: true,
	},
	CommandMenu: {
		props: {
			open: true,
			contained: true,
			autoFocus: false,
			groups: [
				{
					label: "Apps",
					items: [
						{
							icon: "CurrencyEuro",
							label: "Pecunia",
							description: "Gastos e ingresos",
							shortcut: "⌘1",
						},
						{ icon: "Users01", label: "Vinculum", description: "Contactos", shortcut: "⌘2" },
					],
				},
				{
					label: "Acciones",
					items: [
						{ icon: "Plus", label: "Nuevo gasto" },
						{ icon: "Settings02", label: "Ajustes" },
					],
				},
			],
		},
		fill: 380,
	},
	TreeView: {
		props: {
			defaultOpen: ["notas", "trabajo"],
			defaultSelected: "roadmap",
			items: [
				{
					id: "notas",
					label: "Notas",
					icon: "Folder",
					children: [
						{
							id: "trabajo",
							label: "Trabajo",
							icon: "Folder",
							children: [
								{ id: "roadmap", label: "roadmap.md", icon: "File04", meta: "4 KB" },
								{ id: "pentest", label: "pentest.md", icon: "File04", meta: "2 KB" },
							],
						},
						{ id: "leeme", label: "LEEME.md", icon: "File04", meta: "2 KB" },
					],
				},
			],
		},
	},
	// La marca (el icono de Regula) la pone `src/playground/SidebarNav.tsx`: los nodos no cruzan a la isla.
	// Con submenú, secciones, pie y cuenta, cada `type` se ve distinto: `dual-tier` y `slim` abren el panel de Panel.
	SidebarNav: {
		props: {
			search: true,
			items: [
				{ icon: "HomeLine", label: "Inicio", href: "#" },
				{
					icon: "BarChart01",
					label: "Panel",
					defaultOpen: true,
					children: [
						{ icon: "Eye", label: "Resumen", href: "#", active: true },
						{ icon: "Bell01", label: "Avisos", href: "#", badge: 10 },
						{ icon: "Star01", label: "Guardados", href: "#" },
						{ icon: "Clock", label: "Programados", href: "#" },
					],
				},
				{ icon: "CurrencyEuro", label: "Pecunia", href: "#", badge: 3 },
				{ icon: "Users01", label: "Equipo", href: "#" },
			],
			sections: [
				{
					title: "General",
					items: [
						{ icon: "HomeLine", label: "Inicio", href: "#" },
						{ icon: "BarChart01", label: "Panel", href: "#", active: true },
					],
				},
				{
					title: "Apps",
					items: [
						{ icon: "CurrencyEuro", label: "Pecunia", href: "#", badge: 3 },
						{
							icon: "Folder",
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
			footerItems: [{ icon: "Settings02", label: "Ajustes", href: "#" }],
			account: {
				items: [{ icon: "User01", label: "Ver perfil" }],
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
