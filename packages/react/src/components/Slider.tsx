"use client";

import type { ReactNode } from "react";
import { Slider as AriaSlider, SliderThumb, SliderTrack } from "react-aria-components";
import { cx } from "../internal/cx.js";
import { defaultStrings } from "../internal/strings.js";

interface SliderBaseProps {
	/** @default 0 */
	min?: number;
	/** @default 100 */
	max?: number;
	/**
	 * Salto de las flechas.
	 * @default 1
	 */
	step?: number;
	/**
	 * Dónde se enseña el valor de cada mando: `bottom`, debajo del mando, o `top-floating`, en una burbuja encima. Sin
	 * `label`, no se enseña.
	 */
	label?: "bottom" | "top-floating";
	/** Cómo se escribe cada valor en `label`. Por defecto, el número tal cual. */
	formatValue?: (value: number) => ReactNode;
	/** Qué se ajusta: "Presupuesto", "Volumen". */
	"aria-label"?: string;
	className?: string;
}

export interface SingleSliderProps extends SliderBaseProps {
	range?: false;
	value?: number;
	/** @default 50 */
	defaultValue?: number;
	onChange?: (value: number) => void;
}

export interface RangeSliderProps extends SliderBaseProps {
	/** Dos mandos: el mínimo y el máximo. */
	range: true;
	/** `[mínimo, máximo]` (controlado). */
	value?: [number, number];
	/** @default [25, 75] */
	defaultValue?: [number, number];
	onChange?: (value: [number, number]) => void;
	/** Nombre de cada mando para lectores de pantalla. Por defecto, «Mínimo» y «Máximo». */
	thumbLabels?: [string, string];
}

export type SliderProps = SingleSliderProps | RangeSliderProps;

const THUMB =
	"top-1/2 size-6 rounded-full border-2 border-slider-handle-border bg-slider-handle-bg shadow-md outline-none data-focus-visible:shadow-focus-ring";

/** Control deslizante para un valor, o para un rango con dos mandos; flechas, Inicio y Fin con teclado en cada mando. */
export function Slider(props: SliderProps) {
	const { min = 0, max = 100, step, label, formatValue, "aria-label": ariaLabel, className } = props;
	const format = formatValue ?? ((v: number) => v);
	const names = props.range
		? (props.thumbLabels ?? [defaultStrings.sliderMin, defaultStrings.sliderMax])
		: [];
	const controlled = props.value !== undefined;

	return (
		<AriaSlider
			minValue={min}
			maxValue={max}
			step={step}
			value={props.value}
			defaultValue={
				controlled
					? undefined
					: props.range
						? (props.defaultValue ?? [25, 75])
						: (props.defaultValue ?? 50)
			}
			onChange={(v) => {
				if (props.range) props.onChange?.(v as [number, number]);
				else props.onChange?.(v as number);
			}}
			aria-label={ariaLabel}
			// inline-block como el range nativo: el borde inferior se apoya en la línea base.
			// La burbuja de encima y el texto de debajo sobresalen de la pista: su hueco se reserva con relleno.
			className={cx(
				"inline-block w-full",
				label === "top-floating" && "pt-[46px]",
				label === "bottom" && "pb-11",
				className,
			)}
		>
			<SliderTrack className="relative h-2 w-full cursor-pointer rounded-full bg-quaternary">
				{({ state }) => {
					const percents = (props.range ? [0, 1] : [0]).map((i) => state.getThumbPercent(i));
					const first = percents[0] as number;
					const last = percents[percents.length - 1] as number;
					return (
						<>
							<div
								className={
									props.range
										? "absolute inset-y-0 rounded-full bg-fg-brand-primary"
										: "absolute inset-y-0 left-0 rounded-l-full bg-fg-brand-primary"
								}
								style={
									props.range
										? { left: `${first * 100}%`, width: `${(last - first) * 100}%` }
										: { width: `${first * 100}%` }
								}
							/>
							{/* El mando no se sale de la pista: su centro va de 12px a (ancho − 12px), como el range nativo */}
							{percents.map((p, i) => (
								<SliderThumb
									// biome-ignore lint/suspicious/noArrayIndexKey: los mandos son dos, fijos
									key={i}
									index={i}
									aria-label={names[i]}
									className={THUMB}
									style={({ defaultStyle }) => ({
										...defaultStyle,
										left: `calc((100% - 24px) * ${p})`,
										transform: "translateY(-50%)",
									})}
								>
									{label ? (
										// Decorativo: el valor ya lo anuncia el mando
										<span
											aria-hidden="true"
											className={cx(
												"pointer-events-none absolute left-1/2 -translate-x-1/2 whitespace-nowrap font-body",
												label === "bottom"
													? "top-8 -translate-y-1/2 text-md font-medium text-primary"
													: "-top-[38px] rounded-md bg-primary_alt px-2 py-1.5 text-xs font-semibold leading-[18px] text-secondary shadow-[var(--shadow-lg),inset_0_0_0_1px_var(--border-secondary_alt)]",
											)}
										>
											{format(state.values[i] as number)}
										</span>
									) : null}
								</SliderThumb>
							))}
						</>
					);
				}}
			</SliderTrack>
		</AriaSlider>
	);
}
