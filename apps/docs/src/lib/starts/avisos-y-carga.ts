// Puntos de partida del ejemplo interactivo del grupo «avisos-y-carga» del catálogo (design D3).
import type { Start } from "../playground";

export const avisosYCarga: Record<string, Start> = {
	Spinner: { props: { label: "Importando extracto…" } },
	Skeleton: { props: { width: 160, height: 40 } },
	Alert: {
		props: { title: "No se pudo sincronizar", description: "Revisa la conexión con el banco." },
		wide: true,
	},
	Notification: {
		props: { title: "Pago registrado", description: "Has añadido 42,50 € a Suscripciones." },
	},
	Banner: {
		props: {
			icon: "zap",
			title: "Nueva versión de Pecunia.",
			description: "Ahora con presupuestos compartidos.",
		},
		wide: true,
	},
};
