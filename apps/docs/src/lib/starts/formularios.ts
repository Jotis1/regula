// Puntos de partida del ejemplo interactivo del grupo «formularios» del catálogo (design D3).
import type { Start } from "../playground";

const CATEGORIAS = [
	{ value: "casa", label: "Casa", icon: "home-line" },
	{ value: "coche", label: "Coche", icon: "currency-euro" },
	{ value: "ocio", label: "Ocio", icon: "star-01" },
];

export const formularios: Record<string, Start> = {
	Input: {
		props: { label: "Correo", type: "email", placeholder: "tu@jotis.me" },
		presets: [
			{ label: "Con icono", props: { icon: "mail-01" } },
			{
				label: "Con prefijo",
				props: { type: "text", label: "Web", prefix: "https://", placeholder: "jotis.me" },
			},
			{
				label: "Contraseña",
				props: { type: "password", label: "Contraseña", placeholder: "", defaultValue: "contraseña" },
			},
			{
				label: "Tarjeta de pago",
				props: { type: "card", label: "Tarjeta", placeholder: "1234 1234 1234 1234" },
			},
			{ label: "Fecha y hora", props: { type: "datetime-local", label: "Cita", placeholder: "" } },
			{ label: "Archivo", props: { type: "file", label: "Adjunto", placeholder: "" } },
			{ label: "Con pista", props: { hint: "Solo lo usamos para avisos." } },
		],
	},
	NumberInput: {
		props: { label: "Invitados", defaultValue: 2, min: 1, max: 12 },
		presets: [
			{ label: "Vertical", props: { orientation: "vertical" } },
			{ label: "Con pista", props: { hint: "Hasta 12 personas." } },
		],
	},
	TagInput: {
		props: { label: "Etiquetas", defaultValue: ["diseño", "código"] },
		presets: [
			{ label: "Etiquetas dentro", props: { placement: "inside" } },
			{ label: "Etiquetas fuera", props: { placement: "outside" } },
			{ label: "En varias líneas", props: { multiline: true } },
		],
	},
	VerificationCodeInput: {
		props: { label: "Código de verificación" },
		presets: [
			{ label: "4 dígitos", props: { digits: 4 } },
			{ label: "6 dígitos", props: { digits: 6 } },
		],
	},
	Textarea: {
		props: { label: "Descripción", hint: "Máximo 300 caracteres." },
		presets: [
			{
				label: "Con etiquetas dentro",
				props: { defaultTags: ["diseño", "código"], tagPlacement: "inside" },
			},
			{
				label: "Con etiquetas fuera",
				props: { defaultTags: ["diseño", "código"], tagPlacement: "outside" },
			},
			{ label: "Pequeño", props: { size: "sm" } },
		],
		rules: [
			{
				when: { tags: null, defaultTags: null },
				disable: ["tagPlacement"],
				reason: "La posición de las etiquetas solo aplica si el campo lleva etiquetas.",
			},
		],
	},
	Select: {
		props: { label: "Categoría", placeholder: "Elige una", options: ["Casa", "Coche", "Ocio"] },
		presets: [
			{ label: "Con iconos", props: { options: CATEGORIAS } },
			{ label: "Con búsqueda", props: { searchable: true } },
			{ label: "Con etiquetas", props: { type: "tags" } },
		],
	},
	MultiSelect: {
		props: {
			label: "Equipos",
			placeholder: "Elige equipos",
			options: ["Ingeniería", "Diseño", "Producto", "Márketing"],
		},
		presets: [
			{ label: "Resumen", props: { display: "summary" } },
			{ label: "Etiquetas", props: { display: "tags" } },
		],
	},
	Checkbox: {
		props: { label: "Recordarme", hint: "Mantén la sesión 30 días." },
		presets: [
			{ label: "Pequeña", props: { size: "sm" } },
			{ label: "Mediana", props: { size: "md" } },
			{ label: "Indeterminada", props: { indeterminate: true } },
		],
	},
	Radio: {
		props: { name: "plan", value: "mensual", label: "Mensual" },
		presets: [
			{ label: "Pequeño", props: { size: "sm" } },
			{ label: "Mediano", props: { size: "md" } },
		],
	},
	RadioGroup: {
		props: {
			"aria-label": "Plan",
			options: [
				{ value: "mensual", label: "Mensual" },
				{ value: "anual", label: "Anual", hint: "Dos meses gratis" },
			],
		},
		presets: [
			{ label: "Tarjetas", props: { appearance: "card" } },
			{ label: "Tarjetas con casilla", props: { appearance: "card", indicator: "checkbox" } },
			{
				label: "Con icono",
				props: {
					appearance: "icon-simple",
					options: [
						{ value: "mensual", label: "Mensual", icon: "calendar" },
						{ value: "anual", label: "Anual", hint: "Dos meses gratis", icon: "star-01" },
					],
				},
			},
		],
	},
	Toggle: {
		props: { label: "Avisos por correo" },
		presets: [
			{ label: "Estrecho", props: { variant: "slim" } },
			{ label: "Mediano", props: { size: "md" } },
			{ label: "Con pista", props: { hint: "Un resumen cada lunes." } },
		],
	},
	Slider: {
		props: { "aria-label": "Volumen" },
		presets: [
			{ label: "Con valor abajo", props: { label: "bottom" } },
			{ label: "Con valor flotante", props: { label: "top-floating" } },
			{ label: "Rango", props: { range: true, defaultValue: [25, 75] } },
		],
	},
	DatePicker: {
		props: { inline: true },
		presets: [
			{ label: "Una fecha", props: { range: false } },
			{ label: "Rango", props: { range: true } },
			{ label: "Con horas", props: { times: ["09:00", "10:30", "12:00", "16:30"] } },
			{ label: "Modal", props: { inline: false, presentation: "modal" } },
		],
	},
	FileUpload: {
		props: { accept: ".csv", hint: "CSV (máx. 10 MB)" },
		presets: [
			{ label: "Varios archivos", props: { multiple: true } },
			{ label: "Progreso de relleno", props: { progressStyle: "fill" } },
		],
	},
	ColorPicker: {
		props: { defaultValue: "#4f39f6", swatches: ["#4f39f6", "#00a63e", "#e7000b", "#fe9a00"] },
		presets: [
			{ label: "Hex", props: { defaultModel: "hex" } },
			{ label: "RGB", props: { defaultModel: "rgb" } },
			{ label: "HSL", props: { defaultModel: "hsl" } },
			{ label: "HSB", props: { defaultModel: "hsb" } },
		],
	},
	ColorPickerDropdown: {
		props: { label: "Color" },
		presets: [
			{ label: "Muestra pequeña", props: { trigger: "swatch-sm" } },
			{ label: "Muestra grande", props: { trigger: "swatch-md" } },
			{ label: "Botón con muestra", props: { trigger: "swatch-button" } },
			{ label: "Campo hexadecimal", props: { trigger: "hex-input" } },
			{ label: "Selector", props: { trigger: "select" } },
		],
	},
	TextEditor: {
		props: { label: "Notas", maxLength: 500 },
		presets: [
			{ label: "Barra simple", props: { toolbar: "simple" } },
			{ label: "Barra avanzada", props: { toolbar: "advanced" } },
			{ label: "Barra flotante", props: { toolbar: "floating" } },
			{ label: "Pequeño", props: { size: "sm" } },
		],
	},
};
