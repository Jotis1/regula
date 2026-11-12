// Puntos de partida del ejemplo interactivo del grupo «capas» del catálogo (design D3).
import type { Start } from "../playground";

export const capas: Record<string, Start> = {
	HelpIcon: { props: { title: "Qué incluye", text: "Impuestos incluidos, sin descuentos." } },
	Tooltip: {
		props: {
			title: "Exporta a CSV",
			text: "Con los filtros que tengas puestos.",
			open: true,
			children: "Botón",
		},
	},
	Spotlight: {
		props: { active: true, note: "Ahora en gris" },
		children: "Guardar cambios",
	},
	CopyTooltip: { props: { copyAttribute: "data-copy" } },
	Slideout: {
		props: {
			open: true,
			contained: true,
			title: "Alquiler",
			description: "Movimiento del 1 de octubre",
			children: "Importe 650,00 €",
			actions: "Guardar y cancelar",
		},
		fill: 360,
	},
	Modal: {
		props: {
			open: true,
			contained: true,
			icon: "Trash01",
			title: "¿Eliminar este gasto?",
			description: "Se borrará también de los informes. No se puede deshacer.",
		},
		// `contained` llena a su padre (`absolute inset-0`): sin marco, su padre no mide nada y el diálogo se encoge
		fill: 360,
	},
};
