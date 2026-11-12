// Puntos de partida del ejemplo interactivo del grupo «estructura-de-pagina» del catálogo (design D3).
import type { Start } from "../playground";

const MIGAS = [{ label: "Inicio", href: "#" }, { label: "Gastos", href: "#" }, { label: "Octubre" }];

export const estructuraDePagina: Record<string, Start> = {
	PageHeader: {
		props: {
			title: "Gastos",
			description: "Controla lo que entra y lo que sale.",
			actions: "Exportar y nuevo gasto",
		},
		wide: true,
		presets: [
			{ label: "Con migas", props: { breadcrumbs: MIGAS } },
			{ label: "Con botón de volver", props: { back: { href: "#", label: "Volver a gastos" } } },
			{ label: "Centrado", props: { centered: true } },
			{ label: "Sin divisor", props: { divider: false } },
			{ label: "Con avatar", props: { avatar: "Avatar" } },
		],
	},
	CardHeader: {
		props: { title: "Suscripciones", badge: "12 activas", description: "Pagos recurrentes de este mes." },
		wide: true,
		presets: [
			{ label: "Con insignia de color", props: { badgeColor: "success" } },
			{ label: "Con botón", props: { actions: "Ver todas" } },
			{ label: "Con menú", props: { onMenu: "Con menú" } },
		],
	},
	SectionHeader: {
		props: { title: "Contactos", description: "Personas y empresas con las que tratas." },
		wide: true,
		presets: [
			{ label: "Pequeña", props: { size: "sm" } },
			{ label: "Con acciones", props: { actions: "Importar y añadir" } },
			{ label: "Con buscador", props: { search: "Buscador" } },
			{ label: "Con pestañas", props: { tabs: "Pestañas" } },
			{ label: "Sin divisor", props: { divider: false } },
		],
	},
	SectionLabel: {
		props: {
			title: "Equipo",
			help: "Quién puede ver y editar el proyecto.",
			description: "Gestiona quién entra y con qué permisos.",
		},
		presets: [
			{ label: "Obligatorio", props: { required: true } },
			{ label: "Con acciones", props: { actions: "Invitar" } },
			{ label: "Mediano", props: { size: "md" } },
		],
	},
	ContentDivider: {
		props: { label: "o continúa con" },
		wide: true,
		presets: [
			{ label: "Sencillo", props: { variant: "single" } },
			{ label: "Doble", props: { variant: "dual" } },
			{ label: "Con relleno", props: { variant: "fill" } },
			{ label: "Como título", props: { heading: true, label: "Detalles" } },
		],
	},
	SectionFooter: {
		props: { actions: "Cancelar y guardar" },
		wide: true,
		presets: [
			{ label: "De sección", props: { card: false } },
			{ label: "De tarjeta", props: { card: true } },
			{ label: "Con texto a la izquierda", props: { start: "Ayuda" } },
		],
	},
	InlineCTA: {
		props: {
			type: "actions",
			title: "Novedades de noviembre",
			description: "Hemos publicado los estados vacíos y las gráficas.",
			actions: "Ahora no y novedades",
		},
		wide: true,
		presets: [
			{ label: "Con imagen", props: { type: "image", image: "Portada" } },
			{ label: "Con acciones", props: { type: "actions" } },
			{ label: "Con correo", props: { type: "email" } },
			{
				label: "Cambio de plan",
				props: {
					type: "change-plan",
					title: "Cambia de plan",
					description: "Precios flexibles que crecen contigo.",
					plan: {
						name: "Plan básico",
						icon: "zap",
						price: "10 €",
						period: "al mes",
						description: "Hasta 10 usuarios, 20 GB por persona y todas las funciones.",
					},
				},
			},
			{
				label: "Mejora de plan",
				props: {
					type: "upgrade-plan",
					title: "Mejora tu plan",
					description: "¿Necesitas más espacio? Mejora tu plan hoy.",
					features: [
						{ title: "10 usuarios", description: "Hasta 10 personas en el equipo." },
						{ title: "20 GB", description: "20 GB por persona." },
					],
				},
			},
			{
				label: "Método de pago",
				props: {
					type: "payment-method",
					title: "Método de pago",
					description: "Cambia cómo pagas tu plan.",
					payment: {
						label: "Visa terminada en 1234",
						expiry: "Caduca el 06/2028",
						email: "pagos@jotis.me",
					},
				},
			},
			{
				label: "Recibo",
				props: {
					type: "receipt",
					title: "Tu último recibo ya está disponible",
					description: "Descarga el recibo de enero de 2027.",
					file: { name: "Recibo_enero_2027.pdf", size: "200 KB" },
				},
			},
		],
	},
	LinkCard: {
		props: {
			href: "#",
			title: "Pecunia",
			description: "Gastos e ingresos de un vistazo.",
			preview: "Muestra",
		},
		presets: [
			{ label: "Sin muestra", props: { preview: undefined } },
			{ label: "Con muestra", props: { preview: "Muestra" } },
		],
	},
};
