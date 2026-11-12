// Puntos de partida del ejemplo interactivo del grupo «avisos-y-carga» del catálogo (design D3).
import type { Start } from "../playground";

const PASOS = [
	{ title: "Cuenta", description: "Tus datos" },
	{ title: "Empresa", description: "Dónde trabajas" },
	{ title: "Equipo", description: "A quién invitas" },
	{ title: "Listo", description: "A trabajar" },
];

export const avisosYCarga: Record<string, Start> = {
	Spinner: {
		props: { label: "Importando extracto…" },
		presets: [
			{ label: "Línea simple", props: { variant: "line-simple" } },
			{ label: "Línea con giro", props: { variant: "line-spinner" } },
			{ label: "Círculo de puntos", props: { variant: "dot-circle" } },
		],
	},
	Skeleton: {
		props: { width: 160, height: 40 },
		presets: [
			{ label: "Círculo", props: { circle: true, width: 48, height: 48 } },
			{ label: "Texto", props: { lines: 3, width: 240, height: 12 } },
		],
	},
	Alert: {
		props: {
			title: "No se pudo sincronizar",
			description: "Revisa la conexión con el banco.",
			actions: "Reintentar y ver más",
		},
		wide: true,
		presets: [
			{ label: "Error", props: { color: "error", icon: "alert-circle" } },
			{ label: "Aviso", props: { color: "warning", icon: "alert-triangle" } },
			{ label: "Éxito", props: { color: "success", icon: "check-circle" } },
			{ label: "De marca", props: { color: "brand", icon: "info-circle" } },
			{ label: "A todo el ancho", props: { variant: "full" } },
		],
	},
	Notification: {
		props: { title: "Pago registrado", description: "Has añadido 42,50 € a Suscripciones." },
		presets: [
			{ label: "Con icono", props: { icon: "check-circle", color: "success" } },
			{ label: "Con avatar", props: { avatar: { initials: "AD" }, time: "Hace 2 min" } },
			{ label: "Con progreso", props: { progress: 60, progressLabel: "Importando…" } },
			{ label: "Sin cierre automático", props: { autoClose: false } },
		],
	},
	Banner: {
		props: {
			icon: "zap",
			title: "Nueva versión de Pecunia.",
			description: "Ahora con presupuestos compartidos.",
			actions: "Ver novedades",
		},
		wide: true,
		presets: [
			{ label: "Flotante", props: { layout: "floating" } },
			{ label: "A todo el ancho", props: { layout: "full" } },
			{ label: "De marca", props: { theme: "brand" } },
			{ label: "Estrecho", props: { slim: true } },
		],
	},
	EmptyState: {
		props: {
			title: "Sin resultados",
			description: "Ningún movimiento coincide con «León».",
			actions: "Limpiar filtros",
		},
		wide: true,
		presets: [
			{ label: "Con icono", props: { media: "icon", icon: "search-lg" } },
			{ label: "Con carpeta", props: { media: "folder" } },
			{ label: "Con archivo", props: { media: "file" } },
			{ label: "Con personas", props: { media: "users-row" } },
			{ label: "Con integraciones", props: { media: "integrations" } },
			{ label: "Con ilustración", props: { media: "illustration", illustration: "box" } },
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
		presets: [
			{ label: "Etiqueta a la derecha", props: { label: "right" } },
			{ label: "Etiqueta abajo", props: { label: "bottom" } },
			{ label: "Etiqueta flotante arriba", props: { label: "top-floating" } },
			{ label: "Etiqueta flotante abajo", props: { label: "bottom-floating" } },
		],
	},
	ProgressCircle: {
		props: { value: 62, label: "Usado", "aria-label": "Almacenamiento usado" },
		presets: [
			{ label: "Círculo", props: { shape: "circle" } },
			{ label: "Medio círculo", props: { shape: "half" } },
		],
	},
	ProgressSteps: {
		props: { steps: PASOS, current: 1, "aria-label": "Alta" },
		wide: true,
		presets: [
			{ label: "Iconos centrados", props: { type: "icons-centered" } },
			{ label: "Iconos y texto", props: { type: "icons-text" } },
			{ label: "Texto con línea", props: { type: "text-line" } },
			{ label: "Mínima", props: { type: "minimal" } },
			{ label: "Mínima conectada", props: { type: "minimal-connected" } },
			{ label: "Vertical", props: { orientation: "vertical" } },
		],
	},
};
