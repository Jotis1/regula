// Puntos de partida del ejemplo interactivo del grupo «graficas» del catálogo (design D3).
import type { Start } from "../playground";

const MESES = ["Ago", "Sep", "Oct"];

export const graficas: Record<string, Start> = {
	LineChart: {
		props: {
			"aria-label": "Gastos de agosto a octubre",
			labels: MESES,
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
			labels: MESES,
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
		tweaks: { hole: { kind: "number", min: 0, max: 0.75, step: 0.05 } },
	},
	ActivityGauge: {
		props: {
			"aria-label": "Actividad de hoy",
			label: "Actividad",
			value: "78 %",
			data: [
				{ name: "Mover", value: 320, max: 400 },
				{ name: "Ejercicio", value: 24, max: 30 },
				{ name: "Pie", value: 9, max: 12 },
			],
		},
	},
	RadarChart: {
		props: {
			"aria-label": "Actividad por día",
			axes: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
			series: [
				{ name: "Esta semana", data: [820, 560, 380, 520, 440, 900, 300] },
				{ name: "La anterior", data: [360, 700, 520, 760, 560, 480, 680] },
			],
		},
	},
	ChartMarker: {
		props: { value: "1.218", label: "10 ene" },
	},
	ChartLegend: {
		props: { series: [{ name: "Gastos" }, { name: "Presupuesto" }] },
	},
};
