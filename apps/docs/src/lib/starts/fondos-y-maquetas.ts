// Puntos de partida del ejemplo interactivo del grupo «fondos-y-maquetas» del catálogo (design D3).
import type { Start } from "../playground";

export const fondosYMaquetas: Record<string, Start> = {
	AppIcon: {
		props: { app: "regula", size: 64 },
	},
	BackgroundPattern: { props: { width: 480, height: 200 }, fill: 200 },
	BackgroundOverlay: {
		props: {},
		fill: 200,
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
	},
	LaptopMockup: { props: {}, children: "Pantalla de ejemplo", wide: true },
	PhoneMockup: { props: {}, children: "Pantalla de ejemplo" },
};
