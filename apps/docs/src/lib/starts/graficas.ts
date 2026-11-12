// Puntos de partida del ejemplo interactivo del grupo «graficas» del catálogo (design D3).
import type { Start } from "../playground";

export const graficas: Record<string, Start> = {
	LineChart: {
		props: {
			"aria-label": "Gastos de agosto a octubre",
			labels: ["Ago", "Sep", "Oct"],
			series: [
				{ name: "Gastos", data: [1240, 1060, 1284] },
				{ name: "Presupuesto", data: [1100, 1200, 1200] },
			],
		},
		wide: true,
	},
	BarChart: {
		props: {
			"aria-label": "Gasto por categoría y mes",
			labels: ["Ago", "Sep", "Oct"],
			series: [
				{ name: "Hogar", data: [700, 700, 700] },
				{ name: "Ocio", data: [190, 170, 210] },
			],
		},
		wide: true,
	},
	PieChart: {
		props: {
			"aria-label": "Gasto de octubre por categoría",
			center: "1.284 €",
			data: [
				{ name: "Hogar", value: 700 },
				{ name: "Ocio", value: 210 },
				{ name: "Otros", value: 374 },
			],
		},
	},
	ChartLegend: { props: { series: [{ name: "Gastos" }, { name: "Presupuesto" }] } },
};
