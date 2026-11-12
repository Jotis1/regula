// Puntos de partida del ejemplo interactivo del grupo «fondos-y-maquetas» del catálogo (design D3).
import type { Start } from "../playground";

export const fondosYMaquetas: Record<string, Start> = {
	AppIcon: { props: { app: "regula", size: 64 } },
	BackgroundPattern: { props: { width: 480, height: 200 }, fill: 200 },
	BrowserFrame: { props: { url: "pecunia.jotis.me/resumen", height: 200 }, wide: true },
	CreditCard: { props: { company: "Pecunia", holder: "Administrador", expiry: "06/29", last4: "4821" } },
};
