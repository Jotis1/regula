// Puntos de partida del ejemplo interactivo del grupo «capas» del catálogo (design D3).
import type { Start } from "../playground";

export const capas: Record<string, Start> = {
	HelpIcon: { props: { title: "Qué incluye", text: "Impuestos incluidos, sin descuentos." } },
	Modal: {
		props: {
			open: true,
			contained: true,
			icon: "trash-01",
			title: "¿Eliminar este gasto?",
			description: "Se borrará también de los informes. No se puede deshacer.",
		},
		// `contained` llena a su padre (`absolute inset-0`): sin marco, su padre no mide nada y el diálogo se encoge
		fill: 360,
	},
};
