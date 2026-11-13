// Puntos de partida del ejemplo interactivo del grupo «formularios» del catálogo (design D3).
import type { Start } from "../playground";
import { SELECTORES } from "./tipos-del-figma";

/** Los tipos del selector `type` de Input (los de `SELECTORES`, en ./tipos-del-figma): sus reglas dicen con cuáles no aplica cada prop. */
const TIPOS_DE_INPUT = SELECTORES.Input?.type?.values ?? [];

export const formularios: Record<string, Start> = {
	Input: {
		props: { label: "Correo", type: "email", placeholder: "tu@jotis.me" },
		rules: [
			{
				when: { type: TIPOS_DE_INPUT.filter((t) => t !== "password") },
				disable: ["revealable"],
				reason: 'Solo con type="password".',
			},
			{
				when: { type: TIPOS_DE_INPUT.filter((t) => t !== "file") },
				disable: ["chooseFileLabel", "noFileLabel"],
				reason: 'Solo con type="file".',
			},
			{
				when: { type: TIPOS_DE_INPUT.filter((t) => t !== "datetime-local") },
				disable: ["pickerLabel"],
				reason: 'Solo con type="datetime-local".',
			},
		],
		// Los pies son frases de la ficha (content/components/input.md), letra a letra
		examples: [
			{
				do: {
					caption:
						"Etiqueta siempre visible (el borde del campo es suave, la etiqueta es lo que lo identifica).",
					specimens: [{ props: { label: "Correo", placeholder: "tu@jotis.me" } }],
					width: 280,
				},
				dont: {
					caption: "El placeholder es un ejemplo, nunca la etiqueta.",
					specimens: [{ props: { "aria-label": "Correo", placeholder: "Correo" } }],
					width: 280,
				},
			},
		],
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
