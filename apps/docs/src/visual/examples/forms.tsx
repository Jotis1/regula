// Puertos de las vistas previas de los componentes de formulario.

import { FileDesignFig, FileDocumentPdf, FileMediaMp4 } from "@jotis-me/icons/files";
import {
	PaymentAmexMd,
	PaymentDiscoverMd,
	PaymentMaestroMd,
	PaymentMastercardMd,
	PaymentVisaMd,
} from "@jotis-me/icons/payments";
import {
	Avatar,
	Checkbox,
	DatePicker,
	FeaturedIcon,
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
			<Input
				label="Número de tarjeta"
				type="card"
				defaultValue="4242424242424242"
				hint="Se agrupa de cuatro en cuatro."
				cardLogos={{
					visa: <PaymentVisaMd />,
					mastercard: <PaymentMastercardMd />,
					amex: <PaymentAmexMd />,
					maestro: <PaymentMaestroMd />,
					discover: <PaymentDiscoverMd />,
				}}
			/>
			<Input
				label="Web"
				defaultValue="www.jotis.me"
				trailingButton={{ label: "Copiar", icon: "copy-01" }}
				hint="Botón pegado al campo."
			/>
			<Input label="Fecha" type="datetime-local" defaultValue="2028-04-16T10:30" />
			<Input label="Subir archivo" type="file" hint="SVG, PNG, JPG o GIF (máx. 800x400px)." />
		</div>
	);
}

export function TextareaExample() {
	return (
		<div className="grid max-w-[720px] grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-6">
			<Textarea label="Descripción" placeholder="Escribe una nota…" hint="Máximo 280 caracteres." />
			<Textarea
				label="Descripción (sm)"
				size="sm"
				placeholder="Escribe una nota…"
				hint="Máximo 280 caracteres."
			/>
			<Textarea label="Etiquetas" defaultTags={["Diseño", "Marketing"]} hint="Dentro del campo." />
			<Textarea
				label="Etiquetas fuera"
				defaultTags={["Diseño", "Marketing"]}
				tagPlacement="outside"
				hint="Debajo del campo."
			/>
		</div>
	);
}

const MEMBERS = [
	{ value: "phoenix", label: "Phoenix Baker", supporting: "@phoenix", avatar: {} },
	{ value: "olivia", label: "Olivia Rhye", supporting: "@olivia", avatar: {} },
	{ value: "lana", label: "Lana Steiner", supporting: "@lana", avatar: {} },
	{ value: "demi", label: "Demi Wilkinson", supporting: "@demi", avatar: {} },
	{ value: "candice", label: "Candice Wu", supporting: "@candice", avatar: {} },
	{ value: "natali", label: "Natali Craig", supporting: "@natali", avatar: {} },
];

export function SelectExample() {
	return (
		<div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-6">
			<div className="flex flex-col gap-6">
				<Select
					label="Categoría"
					placeholder="Elige una"
					options={["Hogar", "Transporte", "Ocio", "Suscripciones"]}
				/>
				<Select
					label="Estado"
					defaultValue="activo"
					options={[
						{ value: "activo", label: "Activo", dot: "success" },
						{ value: "pausa", label: "En pausa", dot: "warning" },
						{ value: "baja", label: "De baja", dot: "error" },
					]}
				/>
				<Select
					label="País"
					icon="globe-01"
					defaultValue="es"
					options={[
						{ value: "es", label: "España", supporting: "+34" },
						{ value: "pt", label: "Portugal", supporting: "+351" },
					]}
				/>
				<Select
					label="Categoría"
					placeholder="Elige una"
					options={["Hogar", "Ocio"]}
					error="Elige una categoría."
				/>
			</div>
			<Select label="Responsable" required defaultValue="olivia" options={MEMBERS} defaultOpen />
			<Select
				label="Ciudad"
				searchable
				placeholder="Buscar ciudad"
				hint="Escribe para filtrar la lista."
				options={["Madrid", "Valencia", "Sevilla", "Barcelona", "Bilbao"]}
			/>
			<Select
				type="tags"
				label="Equipo"
				defaultValue={["olivia", "phoenix", "lana"]}
				options={MEMBERS}
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
		<div className="flex flex-col gap-6">
			<RadioGroup
				defaultValue="m"
				aria-label="Frecuencia"
				options={[
					{ value: "d", label: "Diario" },
					{ value: "m", label: "Mensual", hint: "Resumen el día 1." },
					{ value: "n", label: "Nunca" },
				]}
			/>
			<div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-6">
				<RadioGroup
					appearance="card"
					aria-label="Plan"
					defaultValue="equipo"
					options={[
						{
							value: "basico",
							label: "Básico",
							supporting: "10 €/mes",
							hint: "Hasta 10 personas.",
							media: <FeaturedIcon icon="zap" variant="modern" color="gray" size="sm" />,
						},
						{
							value: "equipo",
							label: "Equipo",
							supporting: "20 €/mes",
							hint: "Hasta 20 personas.",
							media: <FeaturedIcon icon="users-01" variant="modern" color="gray" size="sm" />,
						},
					]}
				/>
				<RadioGroup
					appearance="card"
					indicator="checkbox"
					aria-label="Responsable"
					defaultValue="ana"
					options={[
						{
							value: "ana",
							label: "Ana Díaz",
							supporting: "@ana",
							hint: "Producto",
							media: <Avatar initials="AD" size="sm" alt="" />,
						},
						{
							value: "leo",
							label: "Leo Martín",
							supporting: "@leo",
							hint: "Diseño",
							media: <Avatar initials="LM" size="sm" alt="" />,
						},
					]}
				/>
			</div>
			<div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-6">
				<RadioGroup
					appearance="icon-simple"
					aria-label="Plan con icono"
					defaultValue="basico"
					options={[
						{
							value: "basico",
							label: "Básico",
							supporting: "10 €/mes",
							hint: "Hasta 10 personas.",
							icon: "star-01",
						},
						{
							value: "pro",
							label: "Pro",
							supporting: "20 €/mes",
							hint: "Hasta 20 personas.",
							icon: "zap",
						},
					]}
				/>
				<RadioGroup
					appearance="icon-simple"
					indicator="checkbox"
					aria-label="Responsable"
					defaultValue="olivia"
					options={[
						{
							value: "olivia",
							label: "Olivia Rhye",
							supporting: "@olivia",
							hint: "Producto, Integraciones",
							avatar: { initials: "OR", alt: "" },
						},
						{
							value: "phoenix",
							label: "Phoenix Baker",
							supporting: "@phoenix",
							hint: "Frontend, Pagos",
							avatar: { initials: "PB", alt: "" },
						},
					]}
				/>
				<RadioGroup
					appearance="icon-simple"
					indicator="checkbox"
					aria-label="Método de pago"
					defaultValue="visa"
					options={[
						{
							value: "visa",
							label: "Visa terminada en 1234",
							hint: "Caduca 06/2028",
							paymentIcon: <PaymentVisaMd />,
						},
						{
							value: "mc",
							label: "Mastercard terminada en 1234",
							hint: "Caduca 08/2029",
							paymentIcon: <PaymentMastercardMd />,
						},
					]}
				/>
				<RadioGroup
					appearance="icon-simple"
					size="md"
					aria-label="Plan md"
					defaultValue="pro"
					options={[
						{
							value: "basico",
							label: "Básico",
							supporting: "10 €/mes",
							hint: "Hasta 10 personas.",
							icon: "star-01",
						},
						{
							value: "pro",
							label: "Pro",
							supporting: "20 €/mes",
							hint: "Hasta 20 personas.",
							icon: "zap",
						},
					]}
				/>
			</div>
		</div>
	);
}

export function ToggleExample() {
	return (
		<div className={stack}>
			<Toggle label="Notificaciones" hint="Recibe un aviso al vencer un pago." defaultChecked />
			<Toggle label="Modo compacto" size="md" />
			<Toggle label="Deshabilitado" disabled />
			<div className="flex flex-wrap items-center gap-6">
				<Toggle variant="slim" label="Fino" />
				<Toggle variant="slim" label="Fino" defaultChecked />
				<Toggle variant="slim" size="md" label="Fino md" />
				<Toggle variant="slim" size="md" label="Fino md" defaultChecked />
			</div>
		</div>
	);
}

export function SliderExample() {
	const percent = (v: number) => `${v}%`;
	return (
		<div className="flex max-w-[360px] flex-col gap-8">
			<div className="pt-3">
				<Slider defaultValue={40} aria-label="Presupuesto" />
			</div>
			<Slider defaultValue={40} aria-label="Volumen" label="bottom" formatValue={percent} />
			<Slider defaultValue={40} aria-label="Brillo" label="top-floating" formatValue={percent} />
			<Slider range defaultValue={[25, 50]} aria-label="Precio" label="bottom" formatValue={percent} />
			<Slider
				range
				defaultValue={[25, 50]}
				aria-label="Rango"
				label="top-floating"
				formatValue={percent}
			/>
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
			<FileUpload
				className="mt-8"
				accept=".pdf,.mp4,.fig"
				hint="PDF, MP4 o Figma (máx. 50 MB)"
				progressStyle="fill"
				files={[
					{
						name: "requisitos.pdf",
						size: 204800,
						progress: 100,
						status: "complete",
						icon: <FileDocumentPdf />,
					},
					{ name: "grabacion-panel.mp4", size: 16_000_000, progress: 40, icon: <FileMediaMp4 /> },
					{ name: "prototipo-final.fig", size: 4_200_000, progress: 80, icon: <FileDesignFig /> },
				]}
				onRemove={() => {}}
			/>
		</div>
	);
}

const HORAS = ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30"];

export function DatePickerExample() {
	return (
		<div className="flex flex-col items-start gap-6">
			<DatePickerRango />
			<DatePicker
				inline
				today={new Date(2026, 9, 29)}
				times={HORAS}
				defaultValue={{ start: new Date(2026, 9, 15), time: "10:30" }}
				labels={{ dialog: "Selector de fecha y hora" }}
			/>
			<DatePicker
				presentation="modal"
				today={new Date(2026, 9, 29)}
				times={HORAS}
				placeholder="Elegir fecha y hora (modal)"
			/>
		</div>
	);
}

function DatePickerRango() {
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

export function TextEditorExample() {
	const text =
		"<p>Revisar el <b>seguro del coche</b> antes del 15.</p><p>Comparar <i>dos ofertas</i> y llamar al banco.</p>";
	return (
		<div className="grid max-w-[1040px] grid-cols-[repeat(auto-fit,minmax(360px,1fr))] gap-x-8 gap-y-10">
			<TextEditor
				label="Notas"
				maxLength={500}
				defaultValue="<p>Revisar el <b>seguro del coche</b> antes del 15.</p><ul><li>Comparar dos ofertas</li><li>Llamar al banco</li></ul>"
			/>
			<TextEditor label="Simple" toolbar="simple" size="sm" maxLength={500} defaultValue={text} />
			<TextEditor
				className="col-span-full"
				label="Avanzada"
				toolbar="advanced"
				maxLength={500}
				defaultValue={text}
				onGenerate={() => {}}
			/>
			<TextEditor
				label="Flotante"
				toolbar="floating"
				size="sm"
				hint="Selecciona texto para ver la barra."
				defaultValue={text}
			/>
		</div>
	);
}

export function MessageInputExample() {
	return (
		<div className="max-w-[560px]">
			<MessageInput placeholder="Pregunta a Emptor…" onAttach={() => {}} onSend={() => {}} />
			<div className="mt-8 flex flex-col gap-6">
				<MessageInput variant="minimal" placeholder="Mensaje" onSend={() => {}} />
				<MessageInput
					variant="textarea"
					placeholder="Mensaje"
					onVoice={() => {}}
					onAttach={() => {}}
					onEmoji={() => {}}
					onSend={() => {}}
				/>
				<MessageInput
					variant="advanced"
					placeholder="Pregúntame lo que quieras…"
					onVoice={() => {}}
					onShortcuts={() => {}}
					onAttach={() => {}}
					onSend={() => {}}
					toolbar={
						<span className="inline-flex items-center gap-1.5 text-xs font-semibold text-secondary">
							Emptor
						</span>
					}
				/>
			</div>
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
