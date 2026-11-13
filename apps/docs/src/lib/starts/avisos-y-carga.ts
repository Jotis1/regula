// Puntos de partida del ejemplo interactivo del grupo «avisos-y-carga» del catálogo (design D3).
import type { Start } from "../playground";

const PASOS = [
	{ title: "Cuenta", description: "Tus datos" },
	{ title: "Empresa", description: "Dónde trabajas" },
	{ title: "Equipo", description: "A quién invitas" },
];

export const avisosYCarga: Record<string, Start> = {
	Spinner: {
		props: { label: "Importando extracto…" },
	},
	Skeleton: {
		props: { width: 160, height: 40 },
	},
	Alert: {
		props: {
			title: "No se pudo sincronizar",
			description: "Revisa la conexión con el banco.",
			actions: "Reintentar y ver más",
		},
		wide: true,
	},
	Notification: {
		props: { title: "Pago registrado", description: "Has añadido 42,50 € a Suscripciones." },
	},
	Banner: {
		props: {
			icon: "Zap",
			title: "Nueva versión de Pecunia.",
			description: "Ahora con presupuestos compartidos.",
			actions: "Ver novedades",
		},
		wide: true,
	},
	EmptyState: {
		props: {
			title: "Sin resultados",
			description: "Ningún movimiento coincide con «León».",
			actions: "Limpiar filtros",
		},
		wide: true,
		// Los pies son frases de la ficha (content/components/empty-state.md), letra a letra
		examples: [
			{
				do: {
					caption: "Di por qué está vacío y ofrece la siguiente acción.",
					specimens: [
						{
							props: {
								title: "Sin resultados",
								description:
									"Ningún movimiento coincide con «León». Prueba con otro término o quita filtros.",
								actions: [
									{
										component: "Button",
										props: { hierarchy: "secondary", size: "sm" },
										children: "Limpiar búsqueda",
									},
								],
							},
						},
					],
				},
				dont: {
					caption: 'Nada de "¡Ups!".',
					specimens: [{ props: { title: "¡Ups!", description: "Aquí no hay nada." } }],
				},
			},
		],
		rules: [
			{
				when: {
					media: [
						"icon",
						"folder",
						"file",
						"folder-glass",
						"users-radius",
						"users-row",
						"integrations",
					],
				},
				disable: ["illustration"],
				reason: "La ilustración solo se usa con media «illustration».",
			},
			{
				when: {
					media: [
						"folder",
						"file",
						"folder-glass",
						"users-radius",
						"users-row",
						"integrations",
						"illustration",
					],
				},
				disable: ["icon"],
				reason: "El icono solo se usa con media «icon».",
			},
		],
	},
	ProgressBar: {
		props: { value: 62, "aria-label": "Importación" },
	},
	ProgressCircle: {
		props: { value: 62, label: "Usado", "aria-label": "Almacenamiento usado" },
	},
	ProgressSteps: {
		props: { steps: PASOS, current: 1, "aria-label": "Alta" },
		wide: true,
	},
};
