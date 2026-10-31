// Puertos de las vistas previas de gráficas de la guía (reference/components/*/preview.html).

import { BarChart, ChartLegend, LineChart, PieChart } from "@jotis-me/react";

const MESES = ["Nov", "Dic", "Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct"];

export function LineChartExample() {
	return (
		<LineChart
			labels={MESES}
			series={[
				{ name: "Gastos", data: [820, 910, 1100, 880, 940, 870, 1020, 990, 1150, 1240, 1060, 1284] },
				{
					name: "Presupuesto",
					data: [1000, 1000, 1000, 1000, 1000, 1000, 1100, 1100, 1100, 1100, 1200, 1200],
				},
			]}
			format={(v) => `${v.toLocaleString("es-ES")} €`}
		/>
	);
}

export function BarChartExample() {
	return (
		<BarChart
			labels={MESES}
			series={[
				{ name: "Hogar", data: [650, 650, 650, 650, 650, 650, 700, 700, 700, 700, 700, 700] },
				{ name: "Ocio", data: [120, 240, 180, 90, 140, 110, 220, 260, 150, 190, 170, 210] },
				{ name: "Transporte", data: [60, 80, 70, 90, 75, 60, 120, 140, 90, 85, 70, 95] },
			]}
			format={(v) => `${v} €`}
		/>
	);
}

export function PieChartExample() {
	return (
		<PieChart
			size={200}
			center="1.284 €"
			data={[
				{ name: "Hogar", value: 700 },
				{ name: "Ocio", value: 210 },
				{ name: "Transporte", value: 95 },
				{ name: "Suscripciones", value: 62 },
				{ name: "Otros", value: 217 },
			]}
		/>
	);
}

export function ChartLegendExample() {
	return <ChartLegend series={[{ name: "Gastos" }, { name: "Presupuesto" }, { name: "Ahorro" }]} />;
}
