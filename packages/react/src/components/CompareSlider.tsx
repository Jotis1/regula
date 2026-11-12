"use client";

import { ChevronLeft, ChevronRight } from "@untitledui/icons";
import { type CSSProperties, type KeyboardEvent, type ReactNode, useEffect, useState } from "react";
import { cx } from "../internal/cx.js";
import { defaultStrings } from "../internal/strings.js";
import { useControllable } from "../internal/use-controllable.js";
import { Badge } from "./Badge.js";

export interface CompareSliderProps {
	/** La capa de abajo: lo que se ve a la izquierda de la línea. */
	before: ReactNode;
	/** La capa de arriba: lo que se ve a la derecha de la línea. */
	after: ReactNode;
	/**
	 * Etiqueta de la esquina de abajo a la izquierda.
	 * @default "Antes"
	 */
	beforeLabel?: string;
	/**
	 * Etiqueta de la esquina de abajo a la derecha; también es la capa que anuncia el valor.
	 * @default "Después"
	 */
	afterLabel?: string;
	/** Posición de la línea, de 0 a 100 (controlado). */
	value?: number;
	/**
	 * Posición inicial de la línea, de 0 a 100.
	 * @default 50
	 */
	defaultValue?: number;
	onChange?: (value: number) => void;
	/**
	 * Alto de la caja, en px.
	 * @default 320
	 */
	height?: number;
	/** Nombre del control para lectores de pantalla: qué se compara. */
	label: string;
	className?: string;
}

const clamp = (n: number) => Math.min(100, Math.max(0, Math.round(n)));

// Tecla → cuánto se mueve la línea (o a dónde salta). El valor lo calculamos nosotros y no el navegador: así Re Pág y
// Av Pág valen 10 en todos y un test puede comprobarlo.
const STEP: Record<string, number> = {
	ArrowRight: 1,
	ArrowUp: 1,
	ArrowLeft: -1,
	ArrowDown: -1,
	PageUp: 10,
	PageDown: -10,
};

// El mando nativo lo dejamos sin dibujo y con un tirador de ancho cero: la línea sigue al puntero sin desfase.
const RANGE =
	"peer absolute inset-0 z-10 m-0 h-full w-full cursor-ew-resize touch-pan-y appearance-none bg-transparent opacity-0 outline-none [&::-moz-range-thumb]:size-0 [&::-moz-range-thumb]:border-0 [&::-moz-range-track]:bg-transparent [&::-webkit-slider-runnable-track]:bg-transparent [&::-webkit-slider-thumb]:size-0 [&::-webkit-slider-thumb]:appearance-none disabled:cursor-default";

/**
 * Dos capas superpuestas y una línea que las reparte: `before` a la izquierda y `after` a la derecha. La línea se mueve
 * con el ratón, el dedo y el teclado (flechas, Re Pág y Av Pág de 10, Inicio y Fin). Se pinta en el servidor en
 * `defaultValue`; sin JavaScript se ve, pero no se mueve.
 */
export function CompareSlider({
	before,
	after,
	beforeLabel = defaultStrings.compareBefore,
	afterLabel = defaultStrings.compareAfter,
	value,
	defaultValue = 50,
	onChange,
	height = 320,
	label,
	className,
}: CompareSliderProps) {
	const [raw, set] = useControllable(value, defaultValue, onChange);
	const at = clamp(raw);
	// Sin JavaScript el mando no puede mover nada: va desactivado hasta que el cliente lo hidrata
	const [ready, setReady] = useState(false);
	useEffect(() => setReady(true), []);

	const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
		const next =
			e.key === "Home"
				? 0
				: e.key === "End"
					? 100
					: STEP[e.key] === undefined
						? null
						: at + (STEP[e.key] as number);
		if (next === null) return;
		e.preventDefault();
		const clamped = clamp(next);
		if (clamped !== at) set(clamped);
	};

	return (
		<div
			className={cx(
				"relative w-full select-none overflow-hidden rounded-xl bg-secondary font-body shadow-[inset_0_0_0_1px_var(--border-secondary)]",
				className,
			)}
			style={{ height, "--compare-at": `${at}%` } as CSSProperties}
		>
			{/* La de abajo no se lee ni recibe el foco: la que cuenta para los lectores es la de encima */}
			<div aria-hidden="true" inert className="absolute inset-0">
				{before}
			</div>
			<div className="absolute inset-0 [clip-path:inset(0_0_0_var(--compare-at))]">{after}</div>

			{/* Va antes que el tirador para que este pinte su anillo de foco (`peer`) */}
			<input
				type="range"
				min={0}
				max={100}
				step={1}
				value={at}
				disabled={!ready}
				aria-label={label}
				aria-valuetext={`${at} % ${afterLabel}`}
				onChange={(e) => set(clamp(Number(e.target.value)))}
				onKeyDown={onKeyDown}
				className={RANGE}
			/>
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-y-0 left-[var(--compare-at)] z-[5] w-0.5 -translate-x-1/2 bg-fg-brand-primary"
			/>
			<span
				aria-hidden="true"
				className="pointer-events-none absolute top-1/2 left-[var(--compare-at)] z-[5] flex size-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-brand-solid text-white shadow-lg peer-focus-visible:shadow-focus-ring"
			>
				<ChevronLeft className="-mr-1 size-4" aria-hidden="true" />
				<ChevronRight className="-ml-1 size-4" aria-hidden="true" />
			</span>

			<div className="pointer-events-none absolute inset-x-3 bottom-3 z-[6] flex items-end justify-between">
				<Badge type="modern" color="gray" size="md">
					{beforeLabel}
				</Badge>
				<Badge type="modern" color="gray" size="md">
					{afterLabel}
				</Badge>
			</div>
		</div>
	);
}
