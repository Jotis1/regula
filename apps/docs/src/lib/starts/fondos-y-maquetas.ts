// Puntos de partida del ejemplo interactivo del grupo «fondos-y-maquetas» del catálogo (design D3).
import type { Start } from "../playground";

export const fondosYMaquetas: Record<string, Start> = {
	AppIcon: {
		props: { app: "regula", size: 64 },
		presets: [
			{ label: "Con virgulilla", props: { tilde: true } },
			{ label: "Cuadrado", props: { shape: "square" } },
			{ label: "Monocromo", props: { variant: "mono" } },
		],
	},
	BackgroundPattern: { props: { width: 480, height: 200 }, fill: 200 },
	BackgroundOverlay: {
		props: {},
		fill: 200,
		presets: [
			{ label: "Con desenfoque", props: { type: "default", blur: true } },
			{ label: "Con degradado", props: { type: "gradient" } },
			{ label: "Transparente", props: { type: "transparent" } },
			{ label: "Sin desenfoque", props: { blur: false } },
		],
	},
	TransparencyGrid: { props: { className: "h-40 w-72 rounded-lg" } },
	ScaledPreview: {
		props: { width: 560, box: [280, 90], className: "rounded-lg border border-secondary" },
		children: "Una pieza a 560 px de ancho, encogida a la caja",
	},
	BrowserFrame: { props: { url: "pecunia.jotis.me/resumen", height: 200 }, wide: true },
	CreditCard: { props: { company: "Pecunia", holder: "Administrador", expiry: "06/29", last4: "4821" } },
	ScreenMockup: {
		props: {},
		children: "Pantalla de ejemplo",
		wide: true,
		presets: [
			{ label: "3:2", props: { variant: "3-2" } },
			{ label: "Moderna", props: { variant: "modern" } },
			{ label: "Móvil", props: { breakpoint: "mobile" } },
			{ label: "Grande", props: { size: "2xl" } },
		],
	},
	LaptopMockup: { props: {}, children: "Pantalla de ejemplo", wide: true },
	PhoneMockup: { props: {}, children: "Pantalla de ejemplo" },
};
