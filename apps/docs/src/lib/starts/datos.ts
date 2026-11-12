// Puntos de partida del ejemplo interactivo del grupo «datos» del catálogo (design D3).
import type { Start } from "../playground";

export const datos: Record<string, Start> = {
	Table: {
		props: {
			title: "Movimientos",
			count: "240",
			columns: [
				{ key: "concepto", label: "Concepto", primary: true },
				{ key: "fecha", label: "Fecha" },
				{ key: "importe", label: "Importe", align: "right" },
			],
			rows: [{ id: "1", concepto: "Alquiler", fecha: "01 oct", importe: "650,00 €" }],
		},
		wide: true,
	},
	MetricCard: {
		props: { label: "Gasto del mes", value: "1.284 €", change: "12%", period: "vs. septiembre" },
	},
	ActivityFeed: {
		props: {
			items: [
				{
					author: "Ana Martín",
					avatar: { initials: "AM" },
					time: "Hace 2 h",
					text: "Ha pagado el alquiler",
				},
				{
					author: "Luis Gil",
					avatar: { initials: "LG" },
					time: "Ayer",
					text: "Ha añadido una factura",
				},
			],
		},
	},
};
