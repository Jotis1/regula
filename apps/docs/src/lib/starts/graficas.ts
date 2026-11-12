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
		presets: [
			{ label: "Sin área", props: { area: false } },
			{ label: "Leyenda arriba", props: { legend: "top" } },
			{ label: "Leyenda a la derecha", props: { legend: "right" } },
			{ label: "Con títulos de ejes", props: { axisLabels: { x: "Mes", y: "Importe" } } },
			{ label: "Con marcador", props: { marker: { index: 2, series: 0, value: "1.284 €" } } },
		],
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
		presets: [
			{ label: "Apiladas", props: { stacked: true } },
			{ label: "Agrupadas", props: { stacked: false } },
			{ label: "Leyenda a la derecha", props: { legend: "right" } },
			{ label: "Con marcador", props: { marker: { index: 2, series: 1, value: "210 €" } } },
		],
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
		presets: [
			{ label: "Dónut", props: { hole: 0.6 } },
			{ label: "Tarta", props: { hole: 0, center: undefined } },
			{ label: "Sin leyenda", props: { legend: false } },
		],
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
		presets: [
			{ label: "Sin leyenda", props: { legend: false } },
			{ label: "Leyenda abajo", props: { legend: "bottom" } },
			{ label: "Leyenda a la derecha", props: { legend: "right" } },
		],
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
		presets: [
			{ label: "Leyenda abajo", props: { legend: "bottom" } },
			{ label: "Leyenda a la derecha", props: { legend: "right" } },
			{ label: "Tres niveles", props: { levels: 3 } },
		],
	},
	ChartMarker: {
		props: { value: "1.218", label: "10 ene" },
		presets: [
			{ label: "Con línea", props: { type: "line" } },
			{ label: "Discontinuo", props: { type: "dash" } },
			{ label: "Mínimo", props: { type: "minimal" } },
		],
	},
	ChartLegend: {
		props: { series: [{ name: "Gastos" }, { name: "Presupuesto" }] },
		presets: [
			{ label: "En fila", props: { vertical: false } },
			{ label: "En columna", props: { vertical: true } },
		],
	},
};
