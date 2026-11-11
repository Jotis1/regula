// Puertos de las vistas previas de gráficas de la guía (reference/components/*/preview.html).

import { BarChart, ChartLegend, LineChart, PieChart } from "@jotis-me/react";

const MESES = ["Nov", "Dic", "Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct"];

const GASTOS = [820, 910, 1100, 880, 940, 870, 1020, 990, 1150, 1240, 1060, 1284];
const LINEAS = [
	{ name: "Gastos", data: GASTOS },
	{ name: "Presupuesto", data: [1000, 1000, 1000, 1000, 1000, 1000, 1100, 1100, 1100, 1100, 1200, 1200] },
];
const BARRAS = [
	{ name: "Hogar", data: [650, 650, 650, 650, 650, 650, 700, 700, 700, 700, 700, 700] },
	{ name: "Ocio", data: [120, 240, 180, 90, 140, 110, 220, 260, 150, 190, 170, 210] },
	{ name: "Transporte", data: [60, 80, 70, 90, 75, 60, 120, 140, 90, 85, 70, 95] },
];
const EJES = { x: "Mes", y: "Gasto (€)" };
const euros = (v: number) => `${v.toLocaleString("es-ES")} €`;

export function LineChartExample() {
	return (
		<div className="flex flex-col gap-8">
			<LineChart
				labels={MESES}
				series={LINEAS}
				format={euros}
				aria-label="Gastos y presupuesto, leyenda arriba"
			/>
			<LineChart
				labels={MESES}
				series={LINEAS}
				format={euros}
				legend="right"
				aria-label="Gastos y presupuesto, leyenda a la derecha"
			/>
			<LineChart
				labels={MESES}
				series={LINEAS}
				format={euros}
				axisLabels={EJES}
				aria-label="Gastos y presupuesto, con títulos de ejes"
			/>
			<LineChart
				labels={MESES}
				series={LINEAS}
				format={euros}
				legend="right"
				axisLabels={EJES}
				aria-label="Gastos y presupuesto, leyenda y títulos"
			/>
		</div>
	);
}

export function BarChartExample() {
	return (
		<div className="flex flex-col gap-8">
			<BarChart
				labels={MESES}
				series={BARRAS}
				format={(v) => `${v} €`}
				aria-label="Gastos por tipo, leyenda arriba"
			/>
			<BarChart
				labels={MESES}
				series={BARRAS}
				format={(v) => `${v} €`}
				legend="right"
				aria-label="Gastos por tipo, leyenda a la derecha"
			/>
			<BarChart
				labels={MESES}
				series={BARRAS}
				format={(v) => `${v} €`}
				axisLabels={EJES}
				aria-label="Gastos por tipo, con títulos de ejes"
			/>
			<BarChart
				labels={MESES}
				series={BARRAS}
				format={(v) => `${v} €`}
				legend="right"
				axisLabels={EJES}
				aria-label="Gastos por tipo, leyenda y títulos"
			/>
		</div>
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
