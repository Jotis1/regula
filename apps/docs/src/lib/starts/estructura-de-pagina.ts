// Puntos de partida del ejemplo interactivo del grupo «estructura-de-pagina» del catálogo (design D3).
import type { Start } from "../playground";

export const estructuraDePagina: Record<string, Start> = {
	PageHeader: {
		props: {
			title: "Gastos",
			description: "Controla lo que entra y lo que sale.",
			actions: "Exportar y nuevo gasto",
		},
		wide: true,
	},
	CardHeader: {
		props: { title: "Suscripciones", badge: "12 activas", description: "Pagos recurrentes de este mes." },
		wide: true,
	},
	SectionHeader: {
		props: { title: "Contactos", description: "Personas y empresas con las que tratas." },
		wide: true,
	},
	SectionLabel: {
		props: {
			title: "Equipo",
			help: "Quién puede ver y editar el proyecto.",
			description: "Gestiona quién entra y con qué permisos.",
		},
	},
	ContentDivider: {
		props: { label: "o continúa con" },
		wide: true,
	},
	Disclosure: {
		props: { title: "Iconos", defaultOpen: true },
		children: "icon, iconLeading e iconTrailing.",
		wide: true,
	},
	SectionFooter: {
		props: { actions: "Cancelar y guardar" },
		wide: true,
	},
	InlineCTA: {
		props: {
			type: "actions",
			title: "Novedades de noviembre",
			description: "Hemos publicado los estados vacíos y las gráficas.",
			actions: "Ahora no y novedades",
		},
		wide: true,
	},
	LinkCard: {
		props: {
			href: "#",
			title: "Pecunia",
			description: "Gastos e ingresos de un vistazo.",
			preview: "Muestra",
		},
	},
};
