// Puntos de partida del ejemplo interactivo del grupo «web-de-marketing» del catálogo (design D3).
import type { Start } from "../playground";

const PLAN = ["Hasta 10 usuarios", "20 GB por persona", "Informes y gráficas", "Soporte por correo"];

const PREGUNTAS = [
	{ id: "a", title: "¿Hay prueba gratis?", content: "Sí, 30 días, sin tarjeta." },
	{ id: "b", title: "¿Puedo cancelar cuando quiera?", content: "Sí, desde ajustes, sin permanencia." },
	{ id: "c", title: "¿Hay descuento anual?", content: "Dos meses gratis al pagar el año." },
];

export const webDeMarketing: Record<string, Start> = {
	MarketingNav: {
		props: { items: "Con menús", brand: "Regula", actions: "Entrar y empezar", previewItem: "Producto" },
		wide: true,
		presets: [
			{ label: "Sencillo", props: { type: "simple" } },
			{ label: "Con tarjeta destacada", props: { type: "featured-card" } },
			{ label: "Con pie", props: { type: "simple-with-footer" } },
			{ label: "Dos columnas", props: { type: "simple-2-col" } },
			{ label: "Ancho completo", props: { menu: "full-width" } },
			{ label: "Flotante", props: { floating: true } },
			{ label: "Solo enlaces", props: { items: "Solo enlaces" } },
		],
	},
	Footer: {
		props: {
			type: "large-04",
			brand: "Regula",
			description: "Las reglas de la suite jotis.me, con su código al lado.",
			copyright: "© 2026 Regula. Todos los derechos reservados.",
			columns: [
				{
					title: "Producto",
					links: [
						{ label: "Resumen", href: "#" },
						{ label: "Funciones", href: "#" },
						{ label: "Precios", href: "#", badge: "Nuevo" },
					],
				},
				{
					title: "Empresa",
					links: [
						{ label: "Sobre nosotros", href: "#" },
						{ label: "Empleo", href: "#" },
						{ label: "Contacto", href: "#" },
					],
				},
			],
			legal: [
				{ label: "Términos", href: "#" },
				{ label: "Privacidad", href: "#" },
				{ label: "Cookies", href: "#" },
			],
		},
		wide: true,
		presets: [
			{ label: "Grande 01", props: { type: "large-01" } },
			{ label: "Con redes", props: { type: "large-02" } },
			{ label: "Con aside", props: { type: "large-03" } },
			{
				label: "Con llamada",
				props: { type: "large-09", cta: { title: "Empieza hoy", description: "30 días gratis." } },
			},
			{ label: "Pequeño", props: { type: "small-01" } },
			{ label: "De marca", props: { theme: "brand" } },
		],
	},
	BlogPostCard: {
		props: {
			href: "#",
			title: "Cómo ordenar tus gastos en una tarde",
			description: "Una guía corta para dejar las cuentas al día sin hojas de cálculo.",
			category: "Guías",
			readTime: "5 min",
			author: { name: "Ana Martín", date: "29 oct 2026" },
			tags: [
				{ label: "Finanzas", color: "brand" },
				{ label: "Guías", color: "gray" },
			],
			image: "Portada",
		},
		presets: [
			{ label: "Sencilla 01", props: { type: "simple-01" } },
			{ label: "Sencilla 02", props: { type: "simple-02" } },
			{ label: "Tarjeta 01", props: { type: "card-01" } },
			{ label: "Tarjeta 04", props: { type: "card-04" } },
			{ label: "Horizontal", props: { orientation: "horizontal" } },
		],
	},
	SubscribeCard: {
		props: { description: "Una vez a la semana, sin spam." },
		presets: [
			{ label: "Por defecto", props: { type: "default" } },
			{ label: "Con línea", props: { type: "line" } },
			{ label: "Con aviso de privacidad", props: { privacy: "Puedes darte de baja cuando quieras." } },
		],
	},
	PricingCard: {
		props: {
			name: "Básico",
			price: "10 €",
			period: "al mes",
			description: "Lo justo para ordenar tus cuentas.",
			features: PLAN,
			actions: "Empezar y comparar",
		},
		wide: true,
		presets: [
			{ label: "Con icono", props: { type: "icon" } },
			{ label: "Destacado", props: { type: "call-out", callout: "¡El más elegido!" } },
			{ label: "Icono desplazado", props: { type: "icon-offset" } },
			{
				label: "Dos listas",
				props: {
					type: "dual-check-items",
					featuresTitle: "Funciones",
					featuresDescription: "Todo lo del plan gratis, y además:",
				},
			},
			{ label: "Con insignia", props: { type: "badge", badge: "Popular" } },
			{ label: "Con aviso", props: { type: "banner", banner: "Dos meses gratis" } },
		],
	},
	JobPostCard: {
		props: {
			href: "#",
			title: "Diseñador de producto",
			description: "Buscamos a alguien para el equipo de diseño.",
			department: "Diseño",
			location: "Remoto, España",
			employment: "Jornada completa",
			salary: "40.000–50.000 €",
		},
		presets: [
			{ label: "Sencilla", props: { type: "simple" } },
			{ label: "Tarjeta 01", props: { type: "card-01" } },
			{ label: "Tarjeta 02", props: { type: "card-02" } },
			{ label: "Con bandera", props: { flag: "Bandera" } },
		],
	},
	Accordion: {
		props: { items: PREGUNTAS, defaultExpanded: ["a"] },
		wide: true,
		presets: [
			{ label: "Icono a la derecha", props: { iconPosition: "right" } },
			{ label: "Icono a la izquierda", props: { iconPosition: "left" } },
			{ label: "Con divisor", props: { divider: true } },
			{ label: "Solo uno abierto", props: { single: true } },
		],
	},
	TeamMemberCard: {
		props: {
			name: "Ana Martín",
			role: "Fundadora y directora",
			bio: "Diez años ordenando cuentas.",
			image: "Foto",
		},
		presets: [
			{ label: "Sencilla a la izquierda", props: { type: "simple-left" } },
			{ label: "Sencilla centrada", props: { type: "simple-center" } },
			{ label: "Imagen arriba", props: { type: "image-top" } },
			{ label: "Imagen a la izquierda", props: { type: "image-left" } },
			{ label: "Con redes", props: { socials: "Redes" } },
		],
	},
	Testimonial: {
		props: {
			quote: "Nos ahorra horas cada mes.",
			name: "Lucía Ramos",
			role: "Diseñadora",
			company: "Capas",
			image: "Foto",
		},
		presets: [
			{ label: "Flotante", props: { type: "floating" } },
			{ label: "A todo el ancho", props: { type: "full-width" } },
			{ label: "Con valoración", props: { rating: 5 } },
			{ label: "Con flechas", props: { onPrevious: "Con flechas", onNext: "Con flechas" } },
			{ label: "Pequeño", props: { size: "sm" } },
		],
	},
};
