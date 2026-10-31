"use client";

import { Slider as AriaSlider, SliderThumb, SliderTrack } from "react-aria-components";
import { cx } from "../internal/cx.js";

export interface SliderProps {
	/** @default 0 */
	min?: number;
	/** @default 100 */
	max?: number;
	value?: number;
	/** @default 50 */
	defaultValue?: number;
	onChange?: (value: number) => void;
	/** Qué se ajusta: "Presupuesto", "Volumen". */
	"aria-label"?: string;
	className?: string;
}

/** Control deslizante para un valor dentro de un rango; flechas, Inicio y Fin con teclado. */
export function Slider({
	min = 0,
	max = 100,
	value,
	defaultValue = 50,
	onChange,
	"aria-label": ariaLabel,
	className,
}: SliderProps) {
	return (
		<AriaSlider
			minValue={min}
			maxValue={max}
			value={value}
			defaultValue={value === undefined ? defaultValue : undefined}
			onChange={(v) => onChange?.(v as number)}
			aria-label={ariaLabel}
			// inline-block como el range nativo: el borde inferior se apoya en la línea base
			className={cx("inline-block w-full", className)}
		>
			<SliderTrack className="relative h-2 w-full cursor-pointer rounded-full bg-quaternary">
				{({ state }) => {
					const p = state.getThumbPercent(0);
					return (
						<>
							<div
								className="absolute inset-y-0 left-0 rounded-l-full bg-fg-brand-primary"
								style={{ width: `${p * 100}%` }}
							/>
							{/* El mando no se sale de la pista: su centro va de 12px a (ancho − 12px), como el range nativo */}
							<SliderThumb
								className="top-1/2 size-6 rounded-full border-2 border-slider-handle-border bg-slider-handle-bg shadow-md outline-none data-focus-visible:shadow-focus-ring"
								style={({ defaultStyle }) => ({
									...defaultStyle,
									left: `calc((100% - 24px) * ${p})`,
									transform: "translateY(-50%)",
								})}
							/>
						</>
					);
				}}
			</SliderTrack>
		</AriaSlider>
	);
}
