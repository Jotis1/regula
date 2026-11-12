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
		presets: [
			{ label: "Arriba", props: { placement: "top" } },
			{ label: "Abajo", props: { placement: "bottom" } },
			{ label: "A la izquierda", props: { placement: "left" } },
			{ label: "A la derecha", props: { placement: "right" } },
			{ label: "Sin flecha", props: { arrow: false } },
		],
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
		presets: [
			{ label: "Con icono", props: { icon: "edit-02" } },
			{ label: "A la izquierda", props: { side: "left" } },
			{ label: "Ancho", props: { width: 560 } },
			{ label: "Con ayuda al pie", props: { footerStart: "Ayuda" } },
		],
	},
	Modal: {
		props: {
			open: true,
			contained: true,
			icon: "trash-01",
			title: "¿Eliminar este gasto?",
			description: "Se borrará también de los informes. No se puede deshacer.",
		},
		presets: [
			{ label: "Alerta", props: { icon: "alert-triangle", color: "warning" } },
			{ label: "Destructivo", props: { icon: "trash-01", destructive: true } },
			{ label: "Éxito", props: { icon: "check-circle", color: "success" } },
			{ label: "Horizontal", props: { layout: "horizontal" } },
			{ label: "A la izquierda", props: { align: "left" } },
			{ label: "Con divisores", props: { dividers: true, footerStart: "Ayuda" } },
		],
		// `contained` llena a su padre (`absolute inset-0`): sin marco, su padre no mide nada y el diálogo se encoge
		fill: 360,
	},
};
