// Puertos de las vistas previas de gráficas de la guía (reference/components/*/preview.html).

import {
	ActivityGauge,
	BarChart,
	ChartLegend,
	ChartMarker,
	LineChart,
	PieChart,
	RadarChart,
} from "@jotis-me/react";

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
			<LineChart
				labels={MESES}
				series={LINEAS}
				format={euros}
				marker={{ index: 9, label: "Agosto de 2026" }}
				aria-label="Gastos y presupuesto, con el marcador en agosto"
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

const ANILLOS = [
	{ name: "Móvil", value: 72 },
	{ name: "Escritorio", value: 54 },
	{ name: "Tableta", value: 38 },
];

/** Los cuatro tamaños sin leyenda, y `md` con la leyenda debajo y a la derecha. */
export function ActivityGaugeExample() {
	return (
		<div className="flex flex-col gap-10">
			<div className="flex flex-wrap items-center gap-8">
				{(["xs", "sm", "md", "lg"] as const).map((size) => (
					<ActivityGauge
						key={size}
						size={size}
						data={ANILLOS}
						label="Usuarios activos"
						value="1.000"
						aria-label={`Usuarios activos por dispositivo, tamaño ${size}`}
					/>
				))}
			</div>
			<div className="flex flex-wrap items-start gap-10">
				<ActivityGauge
					data={ANILLOS}
					label="Usuarios activos"
					value="1.000"
					legend="bottom"
					aria-label="Con leyenda debajo"
				/>
				<ActivityGauge
					data={ANILLOS}
					label="Usuarios activos"
					value="1.000"
					legend="right"
					aria-label="Con leyenda a la derecha"
				/>
			</div>
		</div>
	);
}

const DIAS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
const RADAR = [
	{ name: "Esta semana", data: [820, 560, 380, 520, 440, 900, 300] },
	{ name: "La anterior", data: [360, 700, 520, 760, 560, 480, 680] },
	{ name: "Media", data: [420, 880, 340, 620, 260, 320, 860] },
];

/** Sin leyenda, con la leyenda debajo y a la derecha, como el Figma. */
export function RadarChartExample() {
	return (
		<div className="grid grid-cols-[repeat(auto-fill,minmax(340px,1fr))] gap-10">
			<RadarChart axes={DIAS} series={RADAR} legend={false} aria-label="Visitas por día, sin leyenda" />
			<RadarChart axes={DIAS} series={RADAR} aria-label="Visitas por día, leyenda debajo" />
			<RadarChart
				axes={DIAS}
				series={RADAR}
				legend="right"
				aria-label="Visitas por día, leyenda a la derecha"
			/>
		</div>
	);
}

/** Los tres tipos sueltos y, debajo, en una gráfica de barras. */
export function ChartMarkerExample() {
	return (
		<div className="flex flex-col gap-10">
			<div className="flex items-end gap-24 pt-16 pl-12">
				<ChartMarker value="1.218" label="10 ene 2027" height={160} />
				<ChartMarker value="1.218" label="10 ene 2027" type="dash" height={160} />
				<ChartMarker value="1.218" type="minimal" height={160} />
			</div>
			<BarChart
				labels={MESES}
				series={BARRAS}
				format={euros}
				marker={{ index: 11, type: "dash", label: "Octubre de 2026" }}
				aria-label="Gastos por categoría, con el marcador en octubre"
			/>
		</div>
	);
}
