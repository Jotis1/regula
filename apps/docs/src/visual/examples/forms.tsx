// Puertos de las vistas previas de los componentes de formulario.

import {
	Checkbox,
	ColorPicker,
	DatePicker,
	FileUpload,
	Input,
	MessageInput,
	MultiSelect,
	NumberInput,
	Radio,
	RadioGroup,
	Select,
	Slider,
	TagInput,
	Textarea,
	TextEditor,
	Toggle,
	VerificationCodeInput,
} from "@jotis-me/react";
import { row, stack } from "./actions";

export function InputExample() {
	return (
		<div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-6">
			<Input
				label="Correo"
				required
				icon="mail-01"
				placeholder="tu@jotis.me"
				hint="Solo lo usamos para avisos."
			/>
			<Input label="Importe" placeholder="0,00" trailing="currency-euro" />
			<Input
				label="Correo"
				icon="mail-01"
				defaultValue="mal@correo"
				error="Introduce un correo válido."
			/>
			<Input label="Usuario" disabled defaultValue="jotis" />
			<Input label="Buscar" size="sm" icon="search-lg" placeholder="sm" />
			<Input label="Nombre" size="lg" placeholder="lg" />
			<Input label="Web" prefix="https://" placeholder="jotis.me" />
			<Input
				label="Teléfono"
				placeholder="612 345 678"
				leadingSelect={{ label: "Prefijo", options: ["+34", "+351", "+33"], defaultValue: "+34" }}
			/>
			<Input
				label="Importe"
				placeholder="1.000,00"
				trailingSelect={{ label: "Divisa", options: ["EUR", "USD", "GBP"], defaultValue: "EUR" }}
			/>
			<Input label="Contraseña" type="password" defaultValue="secreta1" hint="Al menos 8 caracteres." />
		</div>
	);
}

export function TextareaExample() {
	return (
		<div className="max-w-[420px]">
			<Textarea label="Descripción" placeholder="Escribe una nota…" hint="Máximo 280 caracteres." />
		</div>
	);
}

export function SelectExample() {
	return (
		<div className="max-w-[320px]">
			<Select
				label="Categoría"
				placeholder="Elige una"
				options={["Hogar", "Transporte", "Ocio", "Suscripciones"]}
			/>
		</div>
	);
}

export function CheckboxExample() {
	return (
		<div className={stack}>
			<Checkbox label="Recordarme" hint="Mantener la sesión 30 días." defaultChecked />
			<Checkbox label="Selección parcial" indeterminate />
			<Checkbox label="Opción md" size="md" />
			<Checkbox label="Deshabilitado" disabled />
		</div>
	);
}

export function RadioExample() {
	return (
		<div className={row}>
			<Radio name="r" label="Seleccionado" checked readOnly />
			<Radio name="r" label="Sin seleccionar" size="md" />
		</div>
	);
}

export function RadioGroupExample() {
	return (
		<RadioGroup
			defaultValue="m"
			aria-label="Frecuencia"
			options={[
				{ value: "d", label: "Diario" },
				{ value: "m", label: "Mensual", hint: "Resumen el día 1." },
				{ value: "n", label: "Nunca" },
			]}
		/>
	);
}

export function ToggleExample() {
	return (
		<div className={stack}>
			<Toggle label="Notificaciones" hint="Recibe un aviso al vencer un pago." defaultChecked />
			<Toggle label="Modo compacto" size="md" />
			<Toggle label="Deshabilitado" disabled />
		</div>
	);
}

export function SliderExample() {
	return (
		<div className="max-w-[360px] pt-3">
			<Slider defaultValue={40} aria-label="Presupuesto" />
		</div>
	);
}

export function FileUploadExample() {
	return (
		<div className="max-w-[512px]">
			<FileUpload
				accept=".csv,.md"
				multiple
				hint="CSV o Markdown (máx. 10 MB)"
				files={[
					{ name: "extracto-octubre.csv", size: 204800, progress: 100, status: "complete" },
					{ name: "notas-reunion.md", size: 12800, progress: 40 },
					{
						name: "foto-ticket.heic",
						size: 3355443,
						status: "error",
						error: "Formato no admitido",
					},
				]}
				onRemove={() => {}}
			/>
		</div>
	);
}

export function DatePickerExample() {
	return (
		<DatePicker
			range
			inline
			today={new Date(2026, 9, 29)}
			defaultValue={{ start: new Date(2026, 9, 6), end: new Date(2026, 9, 17) }}
			presets={[
				{ label: "Hoy", start: new Date(2026, 9, 29) },
				{ label: "Últimos 7 días", start: new Date(2026, 9, 22), end: new Date(2026, 9, 29) },
				{ label: "Este mes", start: new Date(2026, 9, 1), end: new Date(2026, 9, 31) },
				{ label: "Mes pasado", start: new Date(2026, 8, 1), end: new Date(2026, 8, 30) },
				{ label: "Este año", start: new Date(2026, 0, 1), end: new Date(2026, 11, 31) },
			]}
		/>
	);
}

export function ColorPickerExample() {
	return (
		<ColorPicker
			defaultValue="#4f39f6"
			swatches={[
				"#4f39f6",
				"#615fff",
				"#00a63e",
				"#d08700",
				"#e7000b",
				"#00a6f4",
				"#e12afb",
				"#171717",
			]}
		/>
	);
}

export function TextEditorExample() {
	return (
		<div className="max-w-[640px]">
			<TextEditor
				label="Notas"
				maxLength={500}
				defaultValue="<p>Revisar el <b>seguro del coche</b> antes del 15.</p><ul><li>Comparar dos ofertas</li><li>Llamar al banco</li></ul>"
			/>
		</div>
	);
}

export function MessageInputExample() {
	return (
		<div className="max-w-[560px]">
			<MessageInput placeholder="Pregunta a Emptor…" onAttach={() => {}} onSend={() => {}} />
		</div>
	);
}

export function NumberInputExample() {
	return (
		<div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-6">
			<NumberInput
				label="Invitados"
				required
				defaultValue={2}
				min={1}
				max={12}
				hint="Hasta 12 personas."
			/>
			<NumberInput label="Horas" orientation="vertical" defaultValue={1.5} step={0.5} min={0} />
			<NumberInput label="Noches" defaultValue={20} error="Como mucho, 14." />
			<NumberInput label="Plazas" disabled defaultValue={4} />
		</div>
	);
}

export function TagInputExample() {
	return (
		<div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-6">
			<TagInput
				label="Etiquetas"
				required
				defaultValue={["diseño", "código"]}
				hint="Enter o coma para añadir."
			/>
			<TagInput label="Temas" placement="outside" defaultValue={["finanzas", "hogar", "viajes"]} />
			<TagInput label="Palabras clave" error="Pon al menos una." />
			<TagInput label="Archivadas" disabled defaultValue={["2025"]} />
		</div>
	);
}

export function VerificationCodeInputExample() {
	return (
		<div className="flex flex-col gap-6">
			<VerificationCodeInput
				label="Código de verificación"
				defaultValue="482"
				hint="Te lo hemos enviado a tu@jotis.me."
			/>
			<VerificationCodeInput
				label="PIN"
				digits={4}
				size="sm"
				defaultValue="7351"
				error="Ese PIN no es."
			/>
		</div>
	);
}

const TEAMS = [
	{ value: "ing", label: "Ingeniería", supporting: "12 usuarios" },
	{ value: "dis", label: "Diseño", supporting: "10 usuarios" },
	{ value: "pro", label: "Producto", supporting: "6 usuarios" },
	{ value: "mkt", label: "Márketing", supporting: "8 usuarios" },
	{ value: "ven", label: "Ventas" },
	{ value: "cli", label: "Atención al cliente", supporting: "4 usuarios" },
	{ value: "ope", label: "Operaciones", supporting: "2 usuarios" },
];
// Suma los usuarios de los equipos elegidos para el apoyo del resumen, como el Figma («16 usuarios»).
const users = (selected: { supporting?: unknown }[]) =>
	`${selected.reduce((n, o) => n + (Number.parseInt(String(o.supporting ?? "0"), 10) || 0), 0)} usuarios`;

export function MultiSelectExample() {
	return (
		<div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-6">
			<div className="flex flex-col gap-6">
				<MultiSelect
					label="Equipos"
					required
					options={TEAMS}
					placeholder="Elige equipos"
					hint="Quién verá el informe."
				/>
				<MultiSelect
					label="Equipos"
					options={TEAMS}
					defaultValue={["ing", "dis"]}
					summarySupporting={users}
				/>
				<MultiSelect
					label="Equipos"
					options={TEAMS}
					placeholder="Elige equipos"
					error="Elige al menos uno."
				/>
			</div>
			<MultiSelect
				label="Equipos"
				options={TEAMS}
				defaultValue={["ing", "dis"]}
				summarySupporting={users}
				defaultOpen
			/>
		</div>
	);
}
