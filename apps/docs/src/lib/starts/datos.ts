// Puntos de partida del ejemplo interactivo del grupo «datos» del catálogo (design D3).
import type { Start } from "../playground";

const COLUMNAS = [
	{ key: "concepto", label: "Concepto", primary: true },
	{ key: "fecha", label: "Fecha" },
	{ key: "importe", label: "Importe", align: "right" },
];

const FILAS = [
	{ id: "1", concepto: "Alquiler", fecha: "01 oct", importe: "650,00 €" },
	{ id: "2", concepto: "Electricidad", fecha: "05 oct", importe: "48,20 €" },
	{ id: "3", concepto: "Seguro del coche", fecha: "15 oct", importe: "210,00 €" },
	{ id: "4", concepto: "Gimnasio", fecha: "20 oct", importe: "35,00 €" },
];

const CAMPOS = [
	{
		value: "estado",
		label: "Estado",
		options: [
			{ value: "pagado", label: "Pagado" },
			{ value: "pendiente", label: "Pendiente" },
		],
	},
	{ value: "concepto", label: "Concepto" },
	{ value: "importe", label: "Importe" },
];

const OPERADORES = [
	{ value: "es", label: "es" },
	{ value: "no-es", label: "no es" },
	{ value: "contiene", label: "contiene" },
];

const DOS_FILTROS = [
	{ field: "estado", operator: "es", value: ["pendiente"] },
	{ field: "concepto", operator: "contiene", value: "alq" },
];

export const datos: Record<string, Start> = {
	Table: {
		props: { title: "Movimientos", count: "240", columns: COLUMNAS, rows: FILAS },
		wide: true,
	},
	MetricCard: {
		props: { label: "Gasto del mes", value: "1.284 €", change: "12%", period: "vs. septiembre" },
		rules: [
			{
				when: { chart: null },
				disable: ["chartStyle"],
				reason: "El estilo de la gráfica solo aplica si la tarjeta lleva gráfica.",
			},
			{
				when: { icon: null },
				disable: ["iconStyle"],
				reason: "El estilo del icono solo aplica si la tarjeta lleva icono.",
			},
		],
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
	CalendarView: {
		props: {},
		tweaks: { defaultView: { kind: "hidden" } },
		wide: true,
	},
	FilterMenu: {
		props: { fields: CAMPOS, operators: OPERADORES },
	},
	FilterPanel: {
		props: { fields: CAMPOS, operators: OPERADORES, defaultValue: "Sin filtros" },
		tweaks: {
			defaultValue: {
				kind: "content",
				options: [
					{ label: "Sin filtros", value: [], code: "[]" },
					{ label: "Dos filtros", value: DOS_FILTROS, code: JSON.stringify(DOS_FILTROS) },
				],
			},
		},
	},
};
