// Puntos de partida del ejemplo interactivo del grupo «navegacion» del catálogo (design D3).
import type { Start } from "../playground";

const CUENTAS = [
	{ value: "ana", name: "Ana Díaz", email: "ana@jotis.me", initials: "AD", status: "online" },
	{ value: "luis", name: "Luis Gil", email: "luis@jotis.me", initials: "LG" },
];

const NAVEGADOR = [
	{ icon: "arrow-left", label: "Atrás" },
	{ icon: "refresh-cw-01", label: "Recargar", shortcut: "⌘R" },
	{ divider: true },
	{ icon: "edit-02", label: "Editar página" },
	{ icon: "star-01", label: "Añadir a favoritos" },
];
const EDICION = [
	{ label: "Cortar", shortcut: "⌘X" },
	{ label: "Copiar", shortcut: "⌘C" },
	{ label: "Pegar", shortcut: "⌘V" },
	{ divider: true },
	{ icon: "trash-01", label: "Eliminar", danger: true },
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
		presets: [
			{ label: "Ancho completo", props: { fullWidth: true } },
			{ label: "Vertical", props: { orientation: "vertical" } },
			{ label: "Botones", props: { type: "button-gray" } },
		],
	},
	Breadcrumbs: {
		props: {
			items: [
				{ label: "Inicio", href: "#", icon: "home-line" },
				{ label: "Gastos", href: "#" },
				{ label: "Octubre" },
			],
		},
		presets: [
			{ label: "Con barra", props: { divider: "slash" } },
			{ label: "Con línea", props: { type: "text-line" } },
			{ label: "Con botón", props: { type: "button" } },
		],
	},
	Pagination: {
		props: { total: 12, defaultPage: 3 },
		presets: [
			{ label: "De página", props: { type: "page-default" } },
			{ label: "Mínima", props: { type: "page-minimal" } },
			{ label: "Tarjeta", props: { type: "card-default" } },
			{
				label: "Tarjeta avanzada",
				props: { type: "card-advanced", pageSizes: [10, 20, 50], defaultPageSize: 10 },
			},
			{ label: "Grupo de botones", props: { type: "card-button-group" } },
			{ label: "Redonda", props: { type: "page-default", shape: "circle" } },
		],
	},
	PaginationDots: {
		props: { total: 5, current: 2 },
		presets: [
			{ label: "Puntos", props: { variant: "dot" } },
			{ label: "Líneas", props: { variant: "line" } },
			{ label: "Con marco", props: { framed: true } },
		],
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
				{ icon: "edit-02", label: "Editar", shortcut: "⌘E" },
				{ icon: "copy-01", label: "Duplicar", shortcut: "⌘D" },
				{ divider: true },
				{ icon: "trash-01", label: "Eliminar", danger: true },
			],
		},
		presets: [
			{ label: "Con buscador", props: { searchable: true } },
			{ label: "Enlace", props: { triggerVariant: "link" } },
			{ label: "Integraciones", props: { variant: "integrations" } },
			{ label: "Cuenta con botón", props: { variant: "account-button" } },
			{ label: "Cuenta con avatar", props: { variant: "account-avatar" } },
			{ label: "Tarjeta de cuenta", props: { variant: "account-card-md" } },
		],
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
		presets: [
			{ label: "Sencilla", props: { type: "simple" } },
			{ label: "Dos filas", props: { type: "dual-tier" } },
			{ label: "Pestañas", props: { type: "tabs" } },
			{ label: "Centrada", props: { type: "centered" } },
			{ label: "Subrayada", props: { type: "underline" } },
		],
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
							icon: "currency-euro",
							label: "Pecunia",
							description: "Gastos e ingresos",
							shortcut: "⌘1",
						},
						{ icon: "users-01", label: "Vinculum", description: "Contactos", shortcut: "⌘2" },
					],
				},
				{
					label: "Acciones",
					items: [
						{ icon: "plus", label: "Nuevo gasto" },
						{ icon: "settings-02", label: "Ajustes" },
					],
				},
			],
		},
		fill: 380,
		presets: [
			{ label: "Sin resultados", props: { groups: [], emptyText: "Nada coincide con tu búsqueda." } },
		],
	},
	TreeView: {
		props: {
			defaultOpen: ["notas", "trabajo"],
			defaultSelected: "roadmap",
			items: [
				{
					id: "notas",
					label: "Notas",
					icon: "folder",
					children: [
						{
							id: "trabajo",
							label: "Trabajo",
							icon: "folder",
							children: [
								{ id: "roadmap", label: "roadmap.md", icon: "file-04", meta: "4 KB" },
								{ id: "pentest", label: "pentest.md", icon: "file-04", meta: "2 KB" },
							],
						},
						{ id: "leeme", label: "LEEME.md", icon: "file-04", meta: "2 KB" },
					],
				},
			],
		},
		presets: [
			{ label: "Sencillo", props: { type: "default" } },
			{ label: "Avanzado", props: { type: "advanced" } },
			{ label: "Mediano", props: { size: "md" } },
		],
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
