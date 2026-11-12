// Puntos de partida del ejemplo interactivo del grupo «formularios» del catálogo (design D3).
import type { Start } from "../playground";

export const formularios: Record<string, Start> = {
	Input: {
		props: { label: "Correo", type: "email", placeholder: "tu@jotis.me" },
	},
	NumberInput: {
		props: { label: "Invitados", defaultValue: 2, min: 1, max: 12 },
	},
	TagInput: {
		props: { label: "Etiquetas", defaultValue: ["diseño", "código"] },
	},
	VerificationCodeInput: {
		props: { label: "Código de verificación" },
	},
	Textarea: {
		props: { label: "Descripción", hint: "Máximo 300 caracteres." },
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
	},
	MultiSelect: {
		props: {
			label: "Equipos",
			placeholder: "Elige equipos",
			options: ["Ingeniería", "Diseño", "Producto", "Márketing"],
		},
	},
	Checkbox: {
		props: { label: "Recordarme", hint: "Mantén la sesión 30 días." },
	},
	Radio: {
		props: { name: "plan", value: "mensual", label: "Mensual" },
	},
	RadioGroup: {
		props: {
			"aria-label": "Plan",
			options: [
				{ value: "mensual", label: "Mensual" },
				{ value: "anual", label: "Anual", hint: "Dos meses gratis" },
			],
		},
	},
	Toggle: {
		props: { label: "Avisos por correo" },
	},
	Slider: {
		props: { "aria-label": "Volumen" },
	},
	DatePicker: {
		props: { inline: true },
	},
	FileUpload: {
		props: { accept: ".csv", hint: "CSV (máx. 10 MB)" },
	},
	ColorPicker: {
		props: { defaultValue: "#4f39f6", swatches: ["#4f39f6", "#00a63e", "#e7000b", "#fe9a00"] },
	},
	ColorPickerDropdown: {
		props: { label: "Color" },
	},
	TextEditor: {
		props: { label: "Notas", maxLength: 500 },
	},
};
