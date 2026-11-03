"use client";

import { useState } from "react";
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
import { Input } from "./Input.js";

export interface ColorPickerProps {
	/** Color inicial en hex. Por defecto, el índigo de la marca. */
	defaultValue?: string;
	/** Recibe el hex en minúsculas con `#` en cada cambio. */
	onChange?: (hex: string) => void;
	/** Colores guardados, en hex. */
	swatches?: string[];
	/** @default "Colores guardados" */
	swatchesLabel?: string;
	/** Nombre accesible del campo hexadecimal. @default "Hex" */
	hexLabel?: string;
	/** Nombre accesible de la barra de tono. @default "Tono" */
	hueLabel?: string;
	className?: string;
}

const HEX = /^#?([0-9a-f]{6})$/i;
const toHsb = (hex: string) => parseColor(`#${HEX.exec(hex)?.[1] ?? "4f39f6"}`).toFormat("hsb");
const hexOf = (c: Color) => c.toString("hex").toLowerCase();

// Mandos blancos de 20px con filo oscuro, legibles sobre cualquier color (ficha de ColorPicker)
const THUMB =
	// color-fijo: mando blanco con filo negro al 10 % sobre cualquier color (ficha de ColorPicker)
	"size-5 rounded-full border-2 border-[#ffffff] shadow-[var(--shadow-md),0_0_0_1px_#0000001a] data-focus-visible:shadow-[var(--shadow-md),0_0_0_1px_#0000001a,var(--focus-ring-shadow)]";
// color-fijo: filo negro al 10 % de las muestras, que pueden ser de cualquier color (ficha de ColorPicker)
const HAIRLINE = "shadow-[inset_0_0_0_1px_#0000001a]";

/** Selector de color: área de saturación y brillo, barra de tono, campo hex y muestras guardadas. */
export function ColorPicker({
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
