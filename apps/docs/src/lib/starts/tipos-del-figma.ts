// Valores preparados para las props de contenido que antes solo alcanzaban los atajos de tipos del Figma (change
// adopt-untitled-ui-icons): cada uno es un valor del Figma, que se elige en el control de su prop. Los iconos van por el
// nombre de su componente (`"Plus"`) y se resuelven en la isla. Generado desde test/fixtures/figma-types.json.
import type { ContentOption } from "../playground";

export const TIPOS_DEL_FIGMA: Record<string, Record<string, ContentOption[]>> = {
	BarChart: {
		marker: [
			{
				label: "Con marcador",
				value: { index: 2, series: 1, value: "210 €" },
				code: '{ index: 2, series: 1, value: "210 €" }',
			},
		],
	},
	ButtonGroup: {
		items: [
			{
				label: "Con icono",
				value: [
					{ value: "dia", label: "Día", icon: "Calendar" },
					{ value: "semana", label: "Semana", icon: "Grid01" },
					{ value: "mes", label: "Mes", icon: "BarChart01" },
				],
				code: '[\n\t{ value: "dia", label: "Día", icon: Calendar },\n\t{ value: "semana", label: "Semana", icon: Grid01 },\n\t{ value: "mes", label: "Mes", icon: BarChart01 },\n]',
			},
			{
				label: "Solo icono",
				value: [
					{ value: "dia", iconOnly: "Calendar", label: "Día" },
					{ value: "semana", iconOnly: "Grid01", label: "Semana" },
					{ value: "mes", iconOnly: "BarChart01", label: "Mes" },
				],
				code: '[\n\t{ value: "dia", iconOnly: Calendar, label: "Día" },\n\t{ value: "semana", iconOnly: Grid01, label: "Semana" },\n\t{ value: "mes", iconOnly: BarChart01, label: "Mes" },\n]',
			},
			{
				label: "Con punto",
				value: [
					{ value: "dia", label: "Día", dot: true },
					{ value: "semana", label: "Semana", dot: true },
					{ value: "mes", label: "Mes", dot: true },
				],
				code: '[\n\t{ value: "dia", label: "Día", dot: true },\n\t{ value: "semana", label: "Semana", dot: true },\n\t{ value: "mes", label: "Mes", dot: true },\n]',
			},
		],
	},
	ChannelPanel: {
		action: [
			{
				label: "Con botón",
				value: { label: "Suscribirme", href: "#" },
				code: '{ label: "Suscribirme", href: "#" }',
			},
		],
	},
	CodeSnippet: {
		tabs: [
			{
				label: "Con pestañas",
				value: [
					{
						label: "bun",
						code: "bun add @jotis-me/react",
						language: "bash",
					},
					{
						label: "npm",
						code: "npm install @jotis-me/react",
						language: "bash",
					},
				],
				code: '[\n\t{\n\t\tlabel: "bun",\n\t\tcode: "bun add @jotis-me/react",\n\t\tlanguage: "bash",\n\t},\n\t{\n\t\tlabel: "npm",\n\t\tcode: "npm install @jotis-me/react",\n\t\tlanguage: "bash",\n\t},\n]',
			},
		],
	},
	CommandMenu: {
		groups: [{ label: "Sin resultados", value: [], code: "[]" }],
	},
	DatePicker: {
		times: [
			{
				label: "Con horas",
				value: ["09:00", "10:30", "12:00", "16:30"],
				code: '["09:00", "10:30", "12:00", "16:30"]',
			},
		],
	},
	FilterMenu: {
		defaultValue: [
			{
				label: "Con filtros",
				value: [
					{ field: "estado", operator: "es", value: ["pendiente"] },
					{ field: "concepto", operator: "contiene", value: "alq" },
				],
				code: '[\n\t{ field: "estado", operator: "es", value: ["pendiente"] },\n\t{ field: "concepto", operator: "contiene", value: "alq" },\n]',
			},
		],
	},
	Footer: {
		cta: [
			{
				label: "Con llamada",
				value: { title: "Empieza hoy", description: "30 días gratis." },
				code: '{ title: "Empieza hoy", description: "30 días gratis." }',
			},
		],
	},
	InlineCTA: {
		features: [
			{
				label: "Mejora de plan",
				value: [
					{
						title: "10 usuarios",
						description: "Hasta 10 personas en el equipo.",
					},
					{ title: "20 GB", description: "20 GB por persona." },
				],
				code: '[\n\t{\n\t\ttitle: "10 usuarios",\n\t\tdescription: "Hasta 10 personas en el equipo.",\n\t},\n\t{ title: "20 GB", description: "20 GB por persona." },\n]',
			},
		],
		file: [
			{
				label: "Recibo",
				value: { name: "Recibo_enero_2027.pdf", size: "200 KB" },
				code: '{ name: "Recibo_enero_2027.pdf", size: "200 KB" }',
			},
		],
		payment: [
			{
				label: "Método de pago",
				value: {
					label: "Visa terminada en 1234",
					expiry: "Caduca el 06/2028",
					email: "pagos@jotis.me",
				},
				code: '{\n\tlabel: "Visa terminada en 1234",\n\texpiry: "Caduca el 06/2028",\n\temail: "pagos@jotis.me",\n}',
			},
		],
		plan: [
			{
				label: "Cambio de plan",
				value: {
					name: "Plan básico",
					icon: "Zap",
					price: "10 €",
					period: "al mes",
					description: "Hasta 10 usuarios, 20 GB por persona y todas las funciones.",
				},
				code: '{\n\tname: "Plan básico",\n\ticon: Zap,\n\tprice: "10 €",\n\tperiod: "al mes",\n\tdescription: "Hasta 10 usuarios, 20 GB por persona y todas las funciones.",\n}',
			},
		],
	},
	LineChart: {
		axisLabels: [
			{
				label: "Con títulos de ejes",
				value: { x: "Mes", y: "Importe" },
				code: '{ x: "Mes", y: "Importe" }',
			},
		],
		marker: [
			{
				label: "Con marcador",
				value: { index: 2, series: 0, value: "1.284 €" },
				code: '{ index: 2, series: 0, value: "1.284 €" }',
			},
		],
	},
	Message: {
		file: [
			{
				label: "Con archivo",
				value: { name: "Presupuesto.pdf", size: "240 KB" },
				code: '{ name: "Presupuesto.pdf", size: "240 KB" }',
			},
		],
		reactions: [
			{
				label: "Con reacciones",
				value: [
					{ emoji: "👍", count: 2 },
					{ emoji: "🎉", count: 1 },
				],
				code: '[{ emoji: "👍", count: 2 }, { emoji: "🎉", count: 1 }]',
			},
		],
	},
	MetricCard: {
		chart: [
			{
				label: "Con gráfica",
				value: [820, 910, 880, 1100, 960, 1284],
				code: "[820, 910, 880, 1100, 960, 1284]",
			},
		],
	},
	Notification: {
		autoClose: [{ label: "Sin cierre automático", value: false, code: "false" }],
		avatar: [{ label: "Con avatar", value: { initials: "AD" }, code: '{ initials: "AD" }' }],
	},
	PageHeader: {
		back: [
			{
				label: "Con botón de volver",
				value: { href: "#", label: "Volver a gastos" },
				code: '{ href: "#", label: "Volver a gastos" }',
			},
		],
		breadcrumbs: [
			{
				label: "Con migas",
				value: [{ label: "Inicio", href: "#" }, { label: "Gastos", href: "#" }, { label: "Octubre" }],
				code: '[\n\t{ label: "Inicio", href: "#" },\n\t{ label: "Gastos", href: "#" },\n\t{ label: "Octubre" },\n]',
			},
		],
	},
	Pagination: {
		pageSizes: [{ label: "Tarjeta avanzada", value: [10, 20, 50], code: "[10, 20, 50]" }],
	},
	RadioGroup: {
		options: [
			{
				label: "Con icono",
				value: [
					{ value: "mensual", label: "Mensual", icon: "Calendar" },
					{
						value: "anual",
						label: "Anual",
						hint: "Dos meses gratis",
						icon: "Star01",
					},
				],
				code: '[\n\t{ value: "mensual", label: "Mensual", icon: Calendar },\n\t{\n\t\tvalue: "anual",\n\t\tlabel: "Anual",\n\t\thint: "Dos meses gratis",\n\t\ticon: Star01,\n\t},\n]',
			},
		],
	},
	Select: {
		options: [
			{
				label: "Con iconos",
				value: [
					{ value: "casa", label: "Casa", icon: "HomeLine" },
					{ value: "coche", label: "Coche", icon: "CurrencyEuro" },
					{ value: "ocio", label: "Ocio", icon: "Star01" },
				],
				code: '[\n\t{ value: "casa", label: "Casa", icon: HomeLine },\n\t{ value: "coche", label: "Coche", icon: CurrencyEuro },\n\t{ value: "ocio", label: "Ocio", icon: Star01 },\n]',
			},
		],
	},
	Slider: {
		defaultValue: [{ label: "Rango", value: [25, 75], code: "[25, 75]" }],
	},
	Table: {
		columns: [
			{
				label: "Con orden",
				value: [
					{
						key: "concepto",
						label: "Concepto",
						primary: true,
						sortable: true,
					},
					{ key: "fecha", label: "Fecha", sortable: true },
					{
						key: "importe",
						label: "Importe",
						align: "right",
						sortable: true,
					},
				],
				code: '[\n\t{\n\t\tkey: "concepto",\n\t\tlabel: "Concepto",\n\t\tprimary: true,\n\t\tsortable: true,\n\t},\n\t{ key: "fecha", label: "Fecha", sortable: true },\n\t{\n\t\tkey: "importe",\n\t\tlabel: "Importe",\n\t\talign: "right",\n\t\tsortable: true,\n\t},\n]',
			},
		],
		defaultSort: [
			{
				label: "Con orden",
				value: { key: "importe", direction: "descending" },
				code: '{ key: "importe", direction: "descending" }',
			},
		],
	},
	Textarea: {
		defaultTags: [
			{ label: "Con etiquetas dentro", value: ["diseño", "código"], code: '["diseño", "código"]' },
		],
	},
};

/** Selectores para props cuyo tipo es un alias que la tabla de props no despliega (`ChartLegendPosition`…). */
export const SELECTORES: Record<string, Record<string, { values: string[]; coerce?: boolean }>> = {
	BarChart: { legend: { values: ["false", "true", "top", "right"], coerce: true } },
	LineChart: { legend: { values: ["false", "true", "top", "right"], coerce: true } },
	Tooltip: { arrow: { values: ["false", "center", "start", "end"], coerce: true } },
	StreamCountdown: { size: { values: ["md", "lg", "xl"] } },
	Input: {
		type: {
			values: [
				"text",
				"email",
				"password",
				"number",
				"tel",
				"url",
				"search",
				"date",
				"datetime-local",
				"file",
				"card",
			],
		},
	},
};
