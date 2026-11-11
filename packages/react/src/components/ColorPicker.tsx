"use client";

import {
	type CSSProperties,
	type KeyboardEvent,
	type ReactNode,
	useEffect,
	useId,
	useRef,
	useState,
} from "react";
import {
	type Color,
	ColorArea,
	ColorSlider,
	ColorThumb,
	I18nProvider,
	parseColor,
	SliderTrack,
} from "react-aria-components";
import { cx } from "../internal/cx.js";
import { defaultStrings } from "../internal/strings.js";
import { useControllable } from "../internal/use-controllable.js";
import { CloseButton } from "./CloseButton.js";
import { Icon } from "./Icon.js";
import { Input } from "./Input.js";
import { Select } from "./Select.js";
import { Slider } from "./Slider.js";
import { Tabs } from "./Tabs.js";

/** Los doce tipos del Figma (`Color picker`, `12423:52680`). */
export type ColorPickerType =
	| "solid"
	| "gradient"
	| "image"
	| "swatch"
	| "saved-sm"
	| "saved-md"
	| "brand"
	| "gray"
	| "minimal"
	| "hue-slider"
	| "transparency-slider"
	| "palette";

/** Modelos de color de los campos (`_Color inputs`, `12304:616891`). */
export type ColorModel = "hex" | "rgb" | "css" | "hsl" | "hsb";

export interface GradientStop {
	/** Posición en la barra, de 0 a 100. */
	offset: number;
	/** Hex con `#`. */
	color: string;
	/** De 0 a 1. @default 1 */
	alpha?: number;
}

export interface ColorImageAdjustments {
	exposure: number;
	contrast: number;
	saturation: number;
	temperature: number;
	tint: number;
	highlights: number;
	shadows: number;
}

export type ColorImageFill = "fill" | "fit" | "crop" | "tile";

export interface ColorPickerLabels {
	solid: string;
	gradient: string;
	image: string;
	tabs: string;
	saved: string;
	add: string;
	opacity: string;
	eyedropper: string;
	model: string;
	red: string;
	green: string;
	blue: string;
	saturation: string;
	lightness: string;
	brightness: string;
	css: string;
	stops: string;
	linear: string;
	radial: string;
	gradientKind: string;
	reverse: string;
	stop: (n: number) => string;
	stopPosition: (n: number) => string;
	stopColor: (n: number) => string;
	stopOpacity: (n: number) => string;
	removeStop: (n: number) => string;
	upload: string;
	dragAndDrop: string;
	fill: string;
	fills: Record<ColorImageFill, string>;
	resetImage: string;
	adjustments: Record<keyof ColorImageAdjustments, string>;
	brand: string;
	gray: string;
	custom: string;
	docs: string;
	reset: string;
	palette: string;
	close: string;
}

const LABELS: ColorPickerLabels = {
	solid: "Sólido",
	gradient: "Degradado",
	image: "Imagen",
	tabs: "Tipo de relleno",
	saved: "Guardados",
	add: "Añadir",
	opacity: "Opacidad",
	eyedropper: "Cuentagotas",
	model: "Modelo de color",
	red: "Rojo",
	green: "Verde",
	blue: "Azul",
	saturation: "Saturación",
	lightness: "Luminosidad",
	brightness: "Brillo",
	css: "Color CSS",
	stops: "Paradas",
	linear: "Lineal",
	radial: "Radial",
	gradientKind: "Forma del degradado",
	reverse: "Invertir el degradado",
	stop: (n) => `Parada ${n}`,
	stopPosition: (n) => `Posición de la parada ${n}`,
	stopColor: (n) => `Color de la parada ${n}`,
	stopOpacity: (n) => `Opacidad de la parada ${n}`,
	removeStop: (n) => `Quitar la parada ${n}`,
	upload: "Haz clic para subir",
	dragAndDrop: "o arrastra y suelta",
	fill: "Relleno",
	fills: { fill: "Rellenar", fit: "Ajustar", crop: "Recortar", tile: "Mosaico" },
	resetImage: "Restablecer los ajustes",
	adjustments: {
		exposure: "Exposición",
		contrast: "Contraste",
		saturation: "Saturación",
		temperature: "Temperatura",
		tint: "Matiz",
		highlights: "Luces",
		shadows: "Sombras",
	},
	brand: "Marca",
	gray: "Grises",
	custom: "Personalizado",
	docs: "Documentación",
	reset: "Restablecer",
	palette: "Paleta",
	close: defaultStrings.close,
};

export interface ColorPickerProps {
	/**
	 * Tipo del Figma. Sin él, el selector de siempre (área, tono, hex y muestras). `solid`, `gradient` e `image` son el
	 * mismo panel con sus pestañas, abierto en esa; el resto son piezas sueltas: `swatch`, `saved-sm`, `saved-md`,
	 * `brand`, `gray` (muestras), `minimal`, `hue-slider`, `transparency-slider` (barras) y `palette` (rejilla de colores).
	 */
	type?: ColorPickerType;
	/** Color inicial en hex. Por defecto, el índigo de la marca. */
	defaultValue?: string;
	/** Opacidad inicial, de 0 a 1 (con `type`). @default 1 */
	defaultAlpha?: number;
	/** Recibe el hex en minúsculas con `#` en cada cambio y, con `type`, la opacidad de 0 a 1. */
	onChange?: (hex: string, alpha?: number) => void;
	/** Modelo de los campos (controlado), con `type`. */
	model?: ColorModel;
	/** @default "hex" */
	defaultModel?: ColorModel;
	onModelChange?: (model: ColorModel) => void;
	/** Colores guardados, en hex. En `brand` y `gray`, por defecto los de la paleta de Tailwind. */
	swatches?: string[];
	/** @default "Colores guardados" */
	swatchesLabel?: string;
	/** Con ella sale «Añadir», que guarda el color actual. */
	onAddSwatch?: (hex: string) => void;
	/** Paradas iniciales de `gradient`. Por defecto, del color inicial a uno más oscuro. */
	defaultGradient?: GradientStop[];
	/** Avisa con la lista de paradas, ordenada por posición, en cada cambio del degradado. */
	onGradientChange?: (stops: GradientStop[]) => void;
	/** Avisa al subir una imagen en `image` (o `null` al quitarla). */
	onImageChange?: (file: File | null) => void;
	/** Avisa de los ajustes de la imagen (de -100 a 100). */
	onImageAdjust?: (adjustments: ColorImageAdjustments) => void;
	/** Con ella, la X de cerrar del panel de pestañas. */
	onClose?: () => void;
	/** Fuente de la paleta en `brand` y `gray`, a la derecha del título («Tailwind CSS v4.2»). */
	source?: string;
	/** Enlace «Documentación» del pie de `brand` y `gray`. */
	docsHref?: string;
	/** Con ella, «Restablecer» en el pie de `brand` y `gray`. */
	onReset?: () => void;
	/** Nombre accesible del campo hexadecimal. @default "Hex" */
	hexLabel?: string;
	/** Nombre accesible de la barra de tono. @default "Tono" */
	hueLabel?: string;
	/** Textos sustituibles de los tipos nuevos. */
	labels?: Partial<ColorPickerLabels>;
	className?: string;
}

const HEX = /^#?([0-9a-f]{6})$/i;
const toHsb = (hex: string) => parseColor(`#${HEX.exec(hex)?.[1] ?? "4f39f6"}`).toFormat("hsb");
const toHsba = (hex: string, alpha = 1) =>
	parseColor(`#${HEX.exec(hex)?.[1] ?? "4f39f6"}`)
		.toFormat("hsba")
		.withChannelValue("alpha", alpha);
const hexOf = (c: Color) => c.toString("hex").toLowerCase();
const alphaOf = (c: Color) => c.getChannelValue("alpha");
const pct = (a: number) => Math.round(a * 100);
const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));
/** Un hex y una opacidad menor que 1 → su `rgba(…)`; opaco, el hex tal cual. */
const cssColor = (hex: string, alpha = 1) => {
	if (alpha >= 1) return hex;
	const c = toHsba(hex).toFormat("rgb");
	return `rgba(${c.getChannelValue("red")}, ${c.getChannelValue("green")}, ${c.getChannelValue("blue")}, ${alpha})`;
};

// Mandos blancos de 20px con filo oscuro, legibles sobre cualquier color (ficha de ColorPicker)
const THUMB =
	// color-fijo: mando blanco con filo negro al 10 % sobre cualquier color (ficha de ColorPicker)
	"size-5 rounded-full border-2 border-[#ffffff] shadow-[var(--shadow-md),0_0_0_1px_#0000001a] data-focus-visible:shadow-[var(--shadow-md),0_0_0_1px_#0000001a,var(--focus-ring-shadow)]";
// color-fijo: filo negro al 10 % de las muestras, que pueden ser de cualquier color (ficha de ColorPicker)
const HAIRLINE = "shadow-[inset_0_0_0_1px_#0000001a]";
const PANEL =
	"flex flex-col gap-4 rounded-2xl bg-primary_alt font-body shadow-[var(--shadow-xl),inset_0_0_0_1px_var(--border-secondary_alt)]";
const FIELD_GROUP =
	"flex h-9 min-w-0 items-stretch overflow-hidden rounded-lg bg-primary shadow-[var(--shadow-xs),inset_0_0_0_1px_var(--border-primary)] focus-within:shadow-[var(--shadow-xs),inset_0_0_0_2px_var(--border-brand)]";
const CELL =
	"min-w-0 flex-1 border-0 border-l border-solid border-primary bg-transparent px-2.5 font-body text-sm text-primary outline-none first:border-l-0";
const TEXT_BUTTON =
	"inline-flex cursor-pointer items-center gap-1 border-0 bg-transparent p-0 font-body text-sm font-semibold text-tertiary hover:text-tertiary_hover focus-visible:rounded-sm focus-visible:shadow-focus-ring focus-visible:outline-none [&_svg]:text-fg-quaternary";
/** Damero de fondo para lo que tiene transparencia. */
const CHECKER: CSSProperties = {
	backgroundImage: "repeating-conic-gradient(var(--bg-quaternary) 0 25%, var(--bg-primary) 0 50%)",
	backgroundSize: "8px 8px",
};

// Paletas de `brand` y `gray`: los 600 de Tailwind CSS, como el Figma
// biome-ignore format: la paleta va en una línea para que la cubra su comentario color-fijo
// color-fijo: los 600 de las tintas de Tailwind (lima a ámbar), la paleta de marca del Figma (ficha de ColorPicker)
const BRAND = ["#65a30d", "#16a34a", "#059669", "#0891b2", "#0284c7", "#2563eb", "#4f46e5", "#7c3aed", "#9333ea", "#c026d3", "#db2777", "#e11d48", "#dc2626", "#ea580c", "#d97706", "#ca8a04"];
// biome-ignore format: la paleta va en una línea para que la cubra su comentario color-fijo
// color-fijo: los 600 de los grises de Tailwind (slate, gray, zinc, neutral, stone), la paleta de grises del Figma (ficha de ColorPicker)
const GRAY = ["#475569", "#4b5563", "#52525b", "#525252", "#57534e"];

const ADJUSTMENTS: (keyof ColorImageAdjustments)[] = [
	"exposure",
	"contrast",
	"saturation",
	"temperature",
	"tint",
	"highlights",
	"shadows",
];
const NO_ADJUSTMENTS: ColorImageAdjustments = {
	exposure: 0,
	contrast: 0,
	saturation: 0,
	temperature: 0,
	tint: 0,
	highlights: 0,
	shadows: 0,
};

/** Rejilla de `palette`: 18 tonos por columna y 11 luminosidades por fila, de claro a oscuro. */
const PALETTE_ROWS = [96, 90, 82, 72, 62, 52, 44, 36, 28, 20, 12];
const PALETTE_HUES = Array.from({ length: 18 }, (_, i) => i * 20);
const paletteHex = (hue: number, light: number) =>
	parseColor(`hsl(${hue}, ${light > 90 ? 70 : 75}%, ${light}%)`)
		.toString("hex")
		.toLowerCase();

/** Selector de color: área de saturación y brillo, barras, campos en cinco modelos, muestras, degradado e imagen. */
export function ColorPicker(props: ColorPickerProps) {
	return props.type === undefined ? <LegacyColorPicker {...props} /> : <FullColorPicker {...props} />;
}

/** El de siempre: área, tono, hex y muestras. Su HTML no cambia. */
function LegacyColorPicker({
	// color-fijo: valor inicial, el índigo de marca de la vista previa (ficha de ColorPicker)
	defaultValue = "#4f39f6",
	onChange,
	swatches,
	swatchesLabel = defaultStrings.savedColors,
	hexLabel = defaultStrings.hex,
	hueLabel = defaultStrings.hue,
	className,
}: ColorPickerProps) {
	const [color, setColor] = useState(() => toHsb(defaultValue));
	// Lo que se está tecleando en el campo hex, hasta que sea un color válido
	const [typing, setTyping] = useState<string | null>(null);
	const hex = hexOf(color);
	const set = (next: Color) => {
		setColor(next);
		setTyping(null);
		onChange?.(hexOf(next));
	};

	return (
		<I18nProvider locale="es-ES">
			<div
				className={cx(
					"flex w-80 flex-col gap-4 rounded-2xl bg-primary_alt p-5 font-body shadow-[var(--shadow-xl),inset_0_0_0_1px_var(--border-secondary_alt)]",
					className,
				)}
			>
				<ColorArea
					value={color}
					onChange={set}
					xChannel="saturation"
					yChannel="brightness"
					className="h-50 w-full cursor-crosshair touch-none rounded-lg"
				>
					<ColorThumb className={THUMB} />
				</ColorArea>
				{/* Sin <Label>, react-aria apunta aria-labelledby a una etiqueta que en el HTML de
				    servidor no existe; un nombre explícito evita esa referencia rota. */}
				<ColorSlider
					value={color}
					onChange={set}
					channel="hue"
					colorSpace="hsb"
					aria-label={hueLabel}
				>
					<SliderTrack className="h-3 cursor-pointer touch-none rounded-full">
						<ColorThumb className={cx(THUMB, "top-1/2")} />
					</SliderTrack>
				</ColorSlider>
				<div className="flex items-center gap-2">
					<span
						aria-hidden="true"
						className={cx("size-9 flex-none rounded-lg", HAIRLINE)}
						style={{ background: hex }}
					/>
					<Input
						size="sm"
						aria-label={hexLabel}
						className="flex-1"
						value={typing ?? hex.toUpperCase()}
						onChange={(e) => {
							const v = e.target.value;
							setTyping(v);
							if (HEX.test(v)) {
								const next = toHsb(v);
								setColor(next);
								onChange?.(hexOf(next));
							}
						}}
						onBlur={() => setTyping(null)}
					/>
				</div>
				{swatches?.length ? (
					<div>
						<div className="mb-2 text-sm font-medium text-secondary">{swatchesLabel}</div>
						<div className="flex flex-wrap gap-2">
							{swatches.map((c) => {
								const on = c.toLowerCase() === hex;
								return (
									<button
										key={c}
										type="button"
										aria-label={c.toUpperCase()}
										aria-pressed={on}
										onClick={() => set(toHsb(c))}
										style={{ background: c }}
										className={cx(
											"size-6 cursor-pointer rounded-full border-0 focus-visible:shadow-focus-ring focus-visible:outline-none",
											on ? "shadow-focus-ring" : HAIRLINE,
										)}
									/>
								);
							})}
						</div>
					</div>
				) : null}
			</div>
		</I18nProvider>
	);
}

/* ——— Piezas ——— */

function Dot({ hex, alpha = 1, size = "size-4" }: { hex: string; alpha?: number; size?: string }) {
	return (
		<span
			aria-hidden="true"
			className={cx("relative flex-none overflow-hidden rounded-full", size, HAIRLINE)}
			style={CHECKER}
		>
			<span className="absolute inset-0" style={{ background: cssColor(hex, alpha) }} />
		</span>
	);
}

function HueSlider({
	color,
	onChange,
	label,
}: {
	color: Color;
	onChange: (c: Color) => void;
	label: string;
}) {
	return (
		<ColorSlider
			value={color}
			onChange={onChange}
			channel="hue"
			colorSpace="hsb"
			aria-label={label}
			className="min-w-0 flex-1"
		>
			<SliderTrack className="h-3 cursor-pointer touch-none rounded-full">
				<ColorThumb className={cx(THUMB, "top-1/2")} />
			</SliderTrack>
		</ColorSlider>
	);
}

function AlphaSlider({
	color,
	onChange,
	label,
}: {
	color: Color;
	onChange: (c: Color) => void;
	label: string;
}) {
	return (
		<div className="relative min-w-0 flex-1 rounded-full" style={CHECKER}>
			<ColorSlider value={color} onChange={onChange} channel="alpha" aria-label={label}>
				<SliderTrack className="h-3 cursor-pointer touch-none rounded-full">
					<ColorThumb className={cx(THUMB, "top-1/2")} />
				</SliderTrack>
			</ColorSlider>
		</div>
	);
}

/** Campo de número que avisa en cuanto lo escrito es válido y vuelve al valor real al salir. */
function NumberCell({
	label,
	value,
	min,
	max,
	suffix,
	onCommit,
	className,
}: {
	label: string;
	value: number;
	min: number;
	max: number;
	suffix?: string;
	onCommit: (n: number) => void;
	className?: string;
}) {
	const [draft, setDraft] = useState<string | null>(null);
	return (
		<input
			type="text"
			inputMode="numeric"
			aria-label={label}
			value={draft ?? `${value}${suffix ?? ""}`}
			onChange={(e) => {
				const raw = e.target.value;
				setDraft(raw);
				const n = Number(raw.replace(/[^\d.-]/g, ""));
				if (raw.trim() !== "" && Number.isFinite(n) && n >= min && n <= max) onCommit(n);
			}}
			onBlur={() => setDraft(null)}
			className={cx(CELL, "text-center", className)}
		/>
	);
}

function HexCell({
	label,
	hex,
	onCommit,
	dot,
}: {
	label: string;
	hex: string;
	onCommit: (hex: string) => void;
	dot?: ReactNode;
}) {
	const [draft, setDraft] = useState<string | null>(null);
	return (
		<span className="flex min-w-0 flex-[2] items-center gap-2 pl-2.5">
			{dot}
			<input
				type="text"
				aria-label={label}
				value={draft ?? hex.replace("#", "").toUpperCase()}
				onChange={(e) => {
					const v = e.target.value;
					setDraft(v);
					if (HEX.test(v)) onCommit(`#${HEX.exec(v)?.[1]?.toLowerCase()}`);
				}}
				onBlur={() => setDraft(null)}
				className="min-w-0 flex-1 border-0 bg-transparent p-0 font-body text-sm text-primary outline-none"
			/>
		</span>
	);
}

/** Los campos de un modelo de color, sin el desplegable. */
function ModelFields({
	model,
	color,
	onChange,
	t,
	hexLabel,
}: {
	model: ColorModel;
	color: Color;
	onChange: (c: Color) => void;
	t: ColorPickerLabels;
	hexLabel: string;
}) {
	const alpha = alphaOf(color);
	const withAlpha = (c: Color) => c.toFormat("hsba").withChannelValue("alpha", alpha);
	const opacity = (
		<NumberCell
			label={t.opacity}
			value={pct(alpha)}
			min={0}
			max={100}
			suffix="%"
			onCommit={(n) => onChange(color.withChannelValue("alpha", n / 100))}
			className="max-w-16 flex-none"
		/>
	);
	if (model === "css") return <CssField color={color} onChange={onChange} label={t.css} />;
	if (model === "hex")
		return (
			<div className={FIELD_GROUP}>
				<HexCell
					label={hexLabel}
					hex={hexOf(color)}
					dot={<Dot hex={hexOf(color)} alpha={alpha} />}
					onCommit={(h) => onChange(toHsba(h, alpha))}
				/>
				{opacity}
			</div>
		);
	const spec =
		model === "rgb"
			? {
					format: "rgb" as const,
					channels: [
						["red", t.red, 255],
						["green", t.green, 255],
						["blue", t.blue, 255],
					] as const,
					build: (v: number[]) => `rgb(${v[0]}, ${v[1]}, ${v[2]})`,
				}
			: model === "hsl"
				? {
						format: "hsl" as const,
						channels: [
							["hue", defaultStrings.hue, 360],
							["saturation", t.saturation, 100],
							["lightness", t.lightness, 100],
						] as const,
						build: (v: number[]) => `hsl(${v[0]}, ${v[1]}%, ${v[2]}%)`,
					}
				: {
						format: "hsb" as const,
						channels: [
							["hue", defaultStrings.hue, 360],
							["saturation", t.saturation, 100],
							["brightness", t.brightness, 100],
						] as const,
						build: (v: number[]) => `hsb(${v[0]}, ${v[1]}%, ${v[2]}%)`,
					};
	const c = color.toFormat(spec.format);
	const values = spec.channels.map(([ch]) => Math.round(c.getChannelValue(ch)));
	return (
		<div className={FIELD_GROUP}>
			{spec.channels.map(([ch, label, max], i) => (
				<NumberCell
					key={ch}
					label={label}
					value={values[i] ?? 0}
					min={0}
					max={max}
					onCommit={(n) => {
						const next = [...values];
						next[i] = n;
						onChange(withAlpha(parseColor(spec.build(next))));
					}}
				/>
			))}
			{opacity}
		</div>
	);
}

function CssField({ color, onChange, label }: { color: Color; onChange: (c: Color) => void; label: string }) {
	const rgb = color.toFormat("rgb");
	const text = `rgba(${rgb.getChannelValue("red")}, ${rgb.getChannelValue("green")}, ${rgb.getChannelValue("blue")}, ${Number(alphaOf(color).toFixed(2))})`;
	const [draft, setDraft] = useState<string | null>(null);
	return (
		<div className={FIELD_GROUP}>
			<input
				type="text"
				aria-label={label}
				value={draft ?? text}
				onChange={(e) => {
					const v = e.target.value;
					setDraft(v);
					try {
						onChange(parseColor(v.trim()).toFormat("hsba"));
					} catch {
						// Aún no es un color: se espera a que lo sea
					}
				}}
				onBlur={() => setDraft(null)}
				className={cx(CELL, "px-3")}
			/>
		</div>
	);
}

function ModelRow({
	model,
	setModel,
	color,
	onChange,
	t,
	hexLabel,
}: {
	model: ColorModel;
	setModel: (m: ColorModel) => void;
	color: Color;
	onChange: (c: Color) => void;
	t: ColorPickerLabels;
	hexLabel: string;
}) {
	return (
		<div className="flex items-center gap-2">
			<Select
				size="sm"
				aria-label={t.model}
				value={model}
				onChange={(v) => setModel(v as ColorModel)}
				options={[
					{ value: "hex", label: "Hex" },
					{ value: "rgb", label: "RGB" },
					{ value: "css", label: "CSS" },
					{ value: "hsl", label: "HSL" },
					{ value: "hsb", label: "HSB" },
				]}
				className="w-20 flex-none"
			/>
			<div className="min-w-0 flex-1">
				<ModelFields model={model} color={color} onChange={onChange} t={t} hexLabel={hexLabel} />
			</div>
		</div>
	);
}

function SwatchButton({
	hex,
	on,
	onPick,
	label,
	background,
}: {
	hex: string;
	on: boolean;
	onPick: () => void;
	label?: string;
	background?: string;
}) {
	return (
		<button
			type="button"
			aria-label={label ?? hex.toUpperCase()}
			aria-pressed={on}
			onClick={onPick}
			style={{ background: background ?? hex }}
			className={cx(
				"size-6 flex-none cursor-pointer rounded-full border-0 focus-visible:shadow-focus-ring focus-visible:outline-none",
				on ? "shadow-[0_0_0_2px_var(--bg-primary),0_0_0_4px_var(--fg-primary)]" : HAIRLINE,
			)}
		/>
	);
}

function Swatches({
	list,
	current,
	onPick,
	extra,
	label,
}: {
	list: string[];
	current: string;
	onPick: (hex: string) => void;
	extra?: ReactNode;
	label: string;
}) {
	return (
		<fieldset aria-label={label} className="m-0 flex min-w-0 flex-wrap gap-2 border-0 p-1">
			{list.map((c) => (
				<SwatchButton key={c} hex={c} on={c.toLowerCase() === current} onPick={() => onPick(c)} />
			))}
			{extra}
		</fieldset>
	);
}

function EyeDropperButton({ onPick, label }: { onPick: (hex: string) => void; label: string }) {
	const [supported, setSupported] = useState(true);
	useEffect(() => setSupported(typeof window !== "undefined" && "EyeDropper" in window), []);
	return (
		<button
			type="button"
			aria-label={label}
			title={label}
			disabled={!supported}
			onClick={async () => {
				const Ctor = (
					window as unknown as {
						EyeDropper?: new () => { open: () => Promise<{ sRGBHex: string }> };
					}
				).EyeDropper;
				if (!Ctor) return;
				try {
					const { sRGBHex } = await new Ctor().open();
					if (HEX.test(sRGBHex)) onPick(sRGBHex.toLowerCase());
				} catch {
					// El usuario canceló
				}
			}}
			className="inline-flex size-9 flex-none cursor-pointer items-center justify-center rounded-lg border-0 bg-primary text-fg-quaternary shadow-[var(--shadow-xs-skeuomorphic),inset_0_0_0_1px_var(--border-primary)] hover:bg-primary_hover focus-visible:shadow-focus-ring focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
		>
			<Icon name="dropper" size={16} />
		</button>
	);
}

function Header({ title, aside }: { title: ReactNode; aside?: ReactNode }) {
	return (
		<div className="flex items-center justify-between gap-2">
			<span className="text-sm font-semibold text-secondary">{title}</span>
			{aside}
		</div>
	);
}

/* ——— Degradado ——— */

const gradientCss = (stops: GradientStop[], kind: "linear" | "radial", angle: number) => {
	const list = [...stops]
		.sort((a, b) => a.offset - b.offset)
		.map((s) => `${cssColor(s.color, s.alpha ?? 1)} ${s.offset}%`)
		.join(", ");
	return kind === "radial" ? `radial-gradient(circle, ${list})` : `linear-gradient(${angle}deg, ${list})`;
};

function GradientEditor({
	stops,
	setStops,
	selected,
	setSelected,
	t,
}: {
	stops: GradientStop[];
	setStops: (s: GradientStop[]) => void;
	selected: number;
	setSelected: (i: number) => void;
	t: ColorPickerLabels;
}) {
	const [kind, setKind] = useState<"linear" | "radial">("linear");
	const track = useRef<HTMLDivElement>(null);
	const handles = useRef<(HTMLDivElement | null)[]>([]);
	const [focusIndex, setFocusIndex] = useState<number | null>(null);
	useEffect(() => {
		if (focusIndex !== null) {
			handles.current[focusIndex]?.focus();
			setFocusIndex(null);
		}
	}, [focusIndex]);
	const update = (i: number, patch: Partial<GradientStop>) =>
		setStops(stops.map((s, k) => (k === i ? { ...s, ...patch } : s)));
	const remove = (i: number) => {
		if (stops.length <= 2) return;
		setStops(stops.filter((_, k) => k !== i));
		const next = Math.max(0, i - 1);
		setSelected(next);
		setFocusIndex(next);
	};
	const add = () => {
		const order = stops.map((s, i) => ({ s, i })).sort((a, b) => a.s.offset - b.s.offset);
		const pos = order.findIndex((o) => o.i === selected);
		const here = order[pos]?.s ?? stops[0];
		if (!here) return;
		const after = order[pos + 1]?.s;
		const offset = after
			? Math.round((here.offset + after.offset) / 2)
			: Math.min(100, Math.round(here.offset + (100 - here.offset) / 2));
		setStops([...stops, { offset, color: here.color, alpha: here.alpha ?? 1 }]);
		setSelected(stops.length);
		setFocusIndex(stops.length);
	};
	const fromPointer = (clientX: number) => {
		const r = track.current?.getBoundingClientRect();
		if (!r || r.width === 0) return 0;
		return clamp(Math.round(((clientX - r.left) / r.width) * 100), 0, 100);
	};
	const onKey = (i: number) => (e: KeyboardEvent<HTMLDivElement>) => {
		const s = stops[i];
		if (!s) return;
		const step = e.shiftKey ? 10 : 1;
		let next: number | null = null;
		if (e.key === "ArrowRight" || e.key === "ArrowUp") next = s.offset + step;
		else if (e.key === "ArrowLeft" || e.key === "ArrowDown") next = s.offset - step;
		else if (e.key === "Home") next = 0;
		else if (e.key === "End") next = 100;
		else if (e.key === "Delete" || e.key === "Backspace") {
			e.preventDefault();
			remove(i);
			return;
		}
		if (next !== null) {
			e.preventDefault();
			update(i, { offset: clamp(next, 0, 100) });
		}
	};
	return (
		<div className="flex flex-col gap-4">
			<div
				className={cx("relative aspect-square w-full overflow-hidden rounded-lg", HAIRLINE)}
				style={CHECKER}
			>
				<div className="absolute inset-0" style={{ background: gradientCss(stops, kind, 135) }} />
			</div>
			<div className="flex items-center justify-between gap-2">
				<Select
					size="sm"
					aria-label={t.gradientKind}
					value={kind}
					onChange={(v) => setKind(v as "linear" | "radial")}
					options={[
						{ value: "linear", label: t.linear },
						{ value: "radial", label: t.radial },
					]}
					className="w-32"
				/>
				<button
					type="button"
					aria-label={t.reverse}
					title={t.reverse}
					onClick={() => setStops(stops.map((s) => ({ ...s, offset: 100 - s.offset })))}
					className={cx(TEXT_BUTTON, "p-1")}
				>
					<Icon name="switch-horizontal-01" size={20} />
				</button>
			</div>
			<div ref={track} className="relative mx-2.5 h-3 rounded-full" style={CHECKER}>
				<div
					className="absolute inset-0 rounded-full"
					style={{ background: gradientCss(stops, "linear", 90) }}
				/>
				{stops.map((s, i) => (
					<div
						// biome-ignore lint/suspicious/noArrayIndexKey: el índice es la identidad de la parada mientras se edita
						key={i}
						ref={(el) => {
							handles.current[i] = el;
						}}
						role="slider"
						tabIndex={0}
						aria-label={t.stop(i + 1)}
						aria-valuemin={0}
						aria-valuemax={100}
						aria-valuenow={s.offset}
						aria-valuetext={`${s.offset} %, ${s.color.toUpperCase()}`}
						data-selected={i === selected || undefined}
						onKeyDown={onKey(i)}
						onFocus={() => setSelected(i)}
						onPointerDown={(e) => {
							setSelected(i);
							e.currentTarget.setPointerCapture?.(e.pointerId);
						}}
						onPointerMove={(e) => {
							if (e.currentTarget.hasPointerCapture?.(e.pointerId))
								update(i, { offset: fromPointer(e.clientX) });
						}}
						style={{ left: `${s.offset}%`, background: cssColor(s.color, s.alpha ?? 1) }}
						className={cx(
							THUMB,
							"absolute top-1/2 -translate-x-1/2 -translate-y-1/2 cursor-grab touch-none outline-none focus-visible:shadow-[var(--shadow-md),0_0_0_1px_#0000001a,var(--focus-ring-shadow)]",
							i === selected && "z-10 ring-2 ring-[var(--fg-primary)] ring-offset-1",
						)}
					/>
				))}
			</div>
			<Header
				title={t.stops}
				aside={
					<button type="button" onClick={add} className={TEXT_BUTTON}>
						<Icon name="plus" size={16} />
						{t.add}
					</button>
				}
			/>
			<ul className="m-0 flex list-none flex-col gap-2 p-0">
				{stops.map((s, i) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: el índice es la identidad de la parada mientras se edita
					<li key={i} className="flex items-center gap-2">
						<div className={cx(FIELD_GROUP, "w-16 flex-none")}>
							<NumberCell
								label={t.stopPosition(i + 1)}
								value={s.offset}
								min={0}
								max={100}
								suffix="%"
								onCommit={(n) => update(i, { offset: n })}
							/>
						</div>
						<div className={cx(FIELD_GROUP, "flex-1")}>
							<HexCell
								label={t.stopColor(i + 1)}
								hex={s.color}
								dot={<Dot hex={s.color} alpha={s.alpha ?? 1} />}
								onCommit={(h) => {
									setSelected(i);
									update(i, { color: h });
								}}
							/>
							<NumberCell
								label={t.stopOpacity(i + 1)}
								value={pct(s.alpha ?? 1)}
								min={0}
								max={100}
								suffix="%"
								onCommit={(n) => update(i, { alpha: n / 100 })}
								className="max-w-16 flex-none"
							/>
						</div>
						<button
							type="button"
							aria-label={t.removeStop(i + 1)}
							disabled={stops.length <= 2}
							onClick={() => remove(i)}
							className={cx(TEXT_BUTTON, "p-1 disabled:cursor-not-allowed disabled:opacity-40")}
						>
							<Icon name="minus" size={16} />
						</button>
					</li>
				))}
			</ul>
		</div>
	);
}

/* ——— Imagen ——— */

function ImageEditor({
	t,
	onImageChange,
	onImageAdjust,
}: {
	t: ColorPickerLabels;
	onImageChange?: (file: File | null) => void;
	onImageAdjust?: (a: ColorImageAdjustments) => void;
}) {
	const id = useId();
	const [file, setFile] = useState<File | null>(null);
	const [url, setUrl] = useState<string | null>(null);
	const [fill, setFill] = useState<ColorImageFill>("fill");
	const [adj, setAdj] = useState<ColorImageAdjustments>(NO_ADJUSTMENTS);
	const [dragging, setDragging] = useState(false);
	useEffect(() => {
		if (!file || typeof URL.createObjectURL !== "function") {
			setUrl(null);
			return;
		}
		const u = URL.createObjectURL(file);
		setUrl(u);
		return () => URL.revokeObjectURL(u);
	}, [file]);
	const choose = (f: File | null | undefined) => {
		if (!f) return;
		setFile(f);
		onImageChange?.(f);
	};
	const setOne = (k: keyof ColorImageAdjustments, v: number) => {
		const next = { ...adj, [k]: v };
		setAdj(next);
		onImageAdjust?.(next);
	};
	const filter = `brightness(${1 + adj.exposure / 200}) contrast(${1 + adj.contrast / 100}) saturate(${1 + adj.saturation / 100}) sepia(${Math.max(0, adj.temperature) / 200}) hue-rotate(${adj.tint * 0.3}deg)`;
	const fit = fill === "fit" ? "contain" : "cover";
	return (
		<div className="flex flex-col gap-4">
			{/* biome-ignore lint/a11y/noStaticElementInteractions: zona para soltar archivos con el ratón; con el teclado se sube con el botón de dentro */}
			<div
				className={cx(
					"relative flex aspect-square w-full flex-col items-center justify-center gap-3 overflow-hidden rounded-lg",
					HAIRLINE,
					dragging && "shadow-[inset_0_0_0_2px_var(--border-brand)]",
				)}
				style={CHECKER}
				onDragOver={(e) => {
					e.preventDefault();
					setDragging(true);
				}}
				onDragLeave={() => setDragging(false)}
				onDrop={(e) => {
					e.preventDefault();
					setDragging(false);
					choose(e.dataTransfer.files?.[0]);
				}}
			>
				{file ? (
					url ? (
						<div
							aria-hidden="true"
							className="absolute inset-0"
							style={{
								backgroundImage: `url(${url})`,
								backgroundSize: fill === "tile" ? "33%" : fit,
								backgroundRepeat: fill === "tile" ? "repeat" : "no-repeat",
								backgroundPosition: "center",
								filter,
							}}
						/>
					) : null
				) : null}
				<label
					htmlFor={id}
					className={cx(
						"relative inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-secondary shadow-[var(--shadow-xs-skeuomorphic),inset_0_0_0_1px_var(--border-primary)] hover:bg-primary_hover has-[:focus-visible]:shadow-focus-ring [&_svg]:text-fg-quaternary",
						file && url && "opacity-90",
					)}
				>
					<Icon name="upload-cloud-02" size={20} />
					{file ? file.name : t.upload}
					<input
						id={id}
						type="file"
						accept="image/*"
						className="sr-only"
						onChange={(e) => choose(e.target.files?.[0])}
					/>
				</label>
				{file ? null : (
					<span className="relative rounded-md bg-primary/80 px-2 py-0.5 text-sm font-medium text-tertiary">
						{t.dragAndDrop}
					</span>
				)}
			</div>
			<div className="flex items-center justify-between gap-2">
				<Select
					size="sm"
					aria-label={t.fill}
					value={fill}
					onChange={(v) => setFill(v as ColorImageFill)}
					options={(["fill", "fit", "crop", "tile"] as const).map((f) => ({
						value: f,
						label: t.fills[f],
					}))}
					className="w-32"
				/>
				<button
					type="button"
					aria-label={t.resetImage}
					title={t.resetImage}
					onClick={() => {
						setAdj(NO_ADJUSTMENTS);
						onImageAdjust?.(NO_ADJUSTMENTS);
					}}
					className={cx(TEXT_BUTTON, "p-1")}
				>
					<Icon name="refresh-cw-01" size={20} />
				</button>
			</div>
			<div className="flex flex-col gap-3">
				{ADJUSTMENTS.map((k) => (
					<div key={k} className="grid grid-cols-[6.5rem_1fr] items-center gap-3">
						<span className="text-sm font-medium text-secondary" aria-hidden="true">
							{t.adjustments[k]}
						</span>
						<Slider
							aria-label={t.adjustments[k]}
							min={-100}
							max={100}
							value={adj[k]}
							onChange={(v) => setOne(k, v)}
						/>
					</div>
				))}
			</div>
		</div>
	);
}

/* ——— El selector con tipos ——— */

function FullColorPicker({
	type = "solid",
	// color-fijo: valor inicial, el índigo de marca de la vista previa (ficha de ColorPicker)
	defaultValue = "#4f39f6",
	defaultAlpha = 1,
	onChange,
	model: modelProp,
	defaultModel = "hex",
	onModelChange,
	swatches,
	swatchesLabel,
	onAddSwatch,
	defaultGradient,
	onGradientChange,
	onImageChange,
	onImageAdjust,
	onClose,
	source,
	docsHref,
	onReset,
	hexLabel = defaultStrings.hex,
	hueLabel = defaultStrings.hue,
	labels,
	className,
}: ColorPickerProps) {
	const t: ColorPickerLabels = { ...LABELS, ...labels };
	const [color, setColor] = useState(() => toHsba(defaultValue, defaultAlpha));
	const [model, setModel] = useControllable(modelProp, defaultModel, onModelChange);
	const [tab, setTab] = useState<string>(type === "gradient" || type === "image" ? type : "solid");
	const [stops, setStopsState] = useState<GradientStop[]>(
		() =>
			defaultGradient ?? [
				{ offset: 0, color: hexOf(toHsba(defaultValue)), alpha: 1 },
				{
					offset: 100,
					color: hexOf(
						toHsba(defaultValue).withChannelValue(
							"brightness",
							Math.max(0, toHsba(defaultValue).getChannelValue("brightness") - 35),
						),
					),
					alpha: 1,
				},
			],
	);
	const [selected, setSelected] = useState(0);
	const hex = hexOf(color);
	const alpha = alphaOf(color);
	const set = (next: Color) => {
		const c = next.toFormat("hsba");
		setColor(c);
		onChange?.(hexOf(c), alphaOf(c));
	};
	const pick = (h: string) => set(toHsba(h, alpha));
	const setStops = (next: GradientStop[]) => {
		setStopsState(next);
		onGradientChange?.([...next].sort((a, b) => a.offset - b.offset));
	};
	const savedLabel = swatchesLabel ?? t.saved;
	const addButton = onAddSwatch ? (
		<button type="button" onClick={() => onAddSwatch(hex)} className={TEXT_BUTTON}>
			<Icon name="plus" size={16} />
			{t.add}
		</button>
	) : null;
	const saved = swatches?.length ? (
		<div className="flex flex-col gap-2">
			<Header title={savedLabel} aside={addButton} />
			<Swatches list={swatches} current={hex} onPick={pick} label={savedLabel} />
		</div>
	) : null;
	const modelRow = (
		<ModelRow model={model} setModel={setModel} color={color} onChange={set} t={t} hexLabel={hexLabel} />
	);
	const hexOnly = <ModelFields model="hex" color={color} onChange={set} t={t} hexLabel={hexLabel} />;

	let body: ReactNode;
	let width = "w-80";
	let padding = "p-4";

	if (type === "solid" || type === "gradient" || type === "image") {
		padding = "p-5 pt-3";
		body = (
			<div className="relative">
				{onClose ? (
					<CloseButton
						size="sm"
						label={t.close}
						onClick={onClose}
						className="absolute top-0 right-0 z-10"
					/>
				) : null}
				<Tabs
					aria-label={t.tabs}
					value={tab}
					onChange={setTab}
					items={[
						{ id: "solid", label: t.solid },
						{ id: "gradient", label: t.gradient },
						{ id: "image", label: t.image },
					]}
				>
					{(id) =>
						id === "gradient" ? (
							<div className="pt-4">
								<GradientEditor
									stops={stops}
									setStops={setStops}
									selected={selected}
									setSelected={setSelected}
									t={t}
								/>
							</div>
						) : id === "image" ? (
							<div className="pt-4">
								<ImageEditor
									t={t}
									onImageChange={onImageChange}
									onImageAdjust={onImageAdjust}
								/>
							</div>
						) : (
							<div className="flex flex-col gap-4 pt-4">
								<ColorArea
									value={color}
									onChange={set}
									xChannel="saturation"
									yChannel="brightness"
									className="h-70 w-full cursor-crosshair touch-none rounded-lg"
								>
									<ColorThumb className={THUMB} />
								</ColorArea>
								<div className="flex items-center gap-3">
									<EyeDropperButton onPick={pick} label={t.eyedropper} />
									<div className="flex min-w-0 flex-1 flex-col gap-3">
										<HueSlider color={color} onChange={set} label={hueLabel} />
										<AlphaSlider color={color} onChange={set} label={t.opacity} />
									</div>
								</div>
								{modelRow}
								{saved}
							</div>
						)
					}
				</Tabs>
			</div>
		);
	} else if (type === "swatch") {
		width = "w-56";
		padding = "p-1";
		const light = color.toFormat("hsl").getChannelValue("lightness") > 65;
		body = (
			<>
				<div
					className={cx(
						"flex h-32 items-center justify-center rounded-xl text-lg font-semibold",
						light ? "text-primary" : "text-white",
					)}
					style={{ background: cssColor(hex, alpha) }}
				>
					<span aria-hidden="true" className="opacity-70">
						#
					</span>
					<span>{hex.replace("#", "").toUpperCase()}</span>
				</div>
				<div className="flex flex-col gap-3 px-3 pb-3">
					<Swatches
						list={swatches ?? BRAND.slice(1, 13)}
						current={hex}
						onPick={pick}
						label={savedLabel}
						extra={
							onAddSwatch ? (
								<button
									type="button"
									aria-label={t.add}
									onClick={() => onAddSwatch(hex)}
									className="inline-flex size-6 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent text-fg-quaternary hover:bg-primary_hover focus-visible:shadow-focus-ring focus-visible:outline-none"
								>
									<Icon name="plus" size={16} />
								</button>
							) : null
						}
					/>
					{hexOnly}
				</div>
			</>
		);
	} else if (type === "saved-sm") {
		width = "w-52";
		padding = "p-3";
		body = (
			<>
				<Swatches list={swatches ?? GRAY} current={hex} onPick={pick} label={savedLabel} />
				<div className="flex items-center gap-3">
					<span className="text-sm font-semibold text-secondary">{t.custom}</span>
					<div className="min-w-0 flex-1">
						<div className={FIELD_GROUP}>
							<HexCell
								label={hexLabel}
								hex={hex}
								dot={<Dot hex={hex} alpha={alpha} />}
								onCommit={(h) => set(toHsba(h, alpha))}
							/>
						</div>
					</div>
				</div>
			</>
		);
	} else if (type === "saved-md") {
		width = "w-62";
		body = (
			<>
				<Header title={savedLabel} aside={addButton} />
				<Swatches list={swatches ?? GRAY} current={hex} onPick={pick} label={savedLabel} />
				{hexOnly}
			</>
		);
	} else if (type === "brand" || type === "gray") {
		width = "w-69";
		const title = type === "brand" ? t.brand : t.gray;
		body = (
			<>
				<Header
					title={title}
					aside={source ? <span className="text-sm text-tertiary">{source}</span> : null}
				/>
				<Swatches
					list={swatches ?? (type === "brand" ? BRAND : GRAY)}
					current={hex}
					onPick={pick}
					label={title}
				/>
				{docsHref || onReset ? (
					<div className="flex items-center justify-between">
						{docsHref ? (
							<a href={docsHref} className={cx(TEXT_BUTTON, "no-underline")}>
								{t.docs}
							</a>
						) : (
							<span />
						)}
						{onReset ? (
							<button type="button" onClick={onReset} className={TEXT_BUTTON}>
								{t.reset}
							</button>
						) : null}
					</div>
				) : null}
			</>
		);
	} else if (type === "minimal") {
		width = "w-78";
		body = (
			<>
				<div className="flex items-center gap-3">
					<EyeDropperButton onPick={pick} label={t.eyedropper} />
					<div className="flex min-w-0 flex-1 flex-col gap-3">
						<HueSlider color={color} onChange={set} label={hueLabel} />
						<AlphaSlider color={color} onChange={set} label={t.opacity} />
					</div>
				</div>
				{hexOnly}
			</>
		);
	} else if (type === "hue-slider" || type === "transparency-slider") {
		width = "w-78";
		body = (
			<div className="flex items-center gap-4">
				<Dot hex={hex} alpha={alpha} size="size-4" />
				{type === "hue-slider" ? (
					<HueSlider color={color} onChange={set} label={hueLabel} />
				) : (
					<AlphaSlider color={color} onChange={set} label={t.opacity} />
				)}
				<span className="w-10 flex-none text-right text-sm text-secondary">{pct(alpha)}%</span>
			</div>
		);
	} else {
		// palette
		width = "w-95";
		padding = "p-5";
		body = (
			<>
				<PaletteGrid current={hex} onPick={pick} label={t.palette} />
				<div className="flex flex-col gap-2">
					<span className="text-sm font-medium text-secondary">{t.opacity}</span>
					<AlphaSlider color={color} onChange={set} label={t.opacity} />
				</div>
				{modelRow}
				{saved}
			</>
		);
	}

	return (
		<I18nProvider locale="es-ES">
			<div className={cx(PANEL, width, padding, "max-w-full", className)}>{body}</div>
		</I18nProvider>
	);
}

/** Rejilla de colores de `palette`: un grupo de opciones que se recorre con las flechas (una sola parada de tabulación). */
function PaletteGrid({
	current,
	onPick,
	label,
}: {
	current: string;
	onPick: (hex: string) => void;
	label: string;
}) {
	const cols = PALETTE_HUES.length;
	const cells = PALETTE_ROWS.flatMap((l) => PALETTE_HUES.map((h) => paletteHex(h, l)));
	const chosen = cells.indexOf(current);
	const [focus, setFocus] = useState(Math.max(chosen, 0));
	const refs = useRef<(HTMLButtonElement | null)[]>([]);
	const move = (to: number) => {
		const i = clamp(to, 0, cells.length - 1);
		setFocus(i);
		refs.current[i]?.focus();
	};
	return (
		<div
			role="radiogroup"
			aria-label={label}
			className="grid overflow-hidden rounded-lg"
			style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
			onKeyDown={(e) => {
				const delta =
					e.key === "ArrowRight"
						? 1
						: e.key === "ArrowLeft"
							? -1
							: e.key === "ArrowDown"
								? cols
								: e.key === "ArrowUp"
									? -cols
									: 0;
				if (delta) {
					e.preventDefault();
					move(focus + delta);
				}
			}}
		>
			{cells.map((c, i) => (
				// biome-ignore lint/a11y/useSemanticElements: celdas de color de una rejilla que se recorre con flechas en dos dimensiones; un <input type=radio> no admite el fondo de color
				<button
					key={c + String(i)}
					ref={(el) => {
						refs.current[i] = el;
					}}
					type="button"
					role="radio"
					aria-checked={c === current}
					aria-label={c.toUpperCase()}
					tabIndex={i === focus ? 0 : -1}
					onClick={() => {
						setFocus(i);
						onPick(c);
					}}
					style={{ background: c }}
					className={cx(
						"aspect-square min-w-0 cursor-pointer border-0 p-0 focus-visible:relative focus-visible:z-10 focus-visible:shadow-focus-ring focus-visible:outline-none",
						// color-fijo: el marco blanco de la celda elegida, sobre cualquier color de la rejilla (ficha de ColorPicker)
						c === current && "relative z-10 shadow-[inset_0_0_0_2px_#ffffff,0_0_0_1px_#0000001a]",
					)}
				/>
			))}
		</div>
	);
}
