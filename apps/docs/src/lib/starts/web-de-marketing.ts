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
	},
	SubscribeCard: {
		props: { description: "Una vez a la semana, sin spam." },
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
	},
	Accordion: {
		props: { items: PREGUNTAS, defaultExpanded: ["a"] },
		wide: true,
	},
	TeamMemberCard: {
		props: {
			name: "Ana Martín",
			role: "Fundadora y directora",
			bio: "Diez años ordenando cuentas.",
			image: "Foto",
		},
	},
	Testimonial: {
		props: {
			quote: "Nos ahorra horas cada mes.",
			name: "Lucía Ramos",
			role: "Diseñadora",
			company: "Capas",
			image: "Foto",
		},
	},
};
