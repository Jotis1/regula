import { type ReactNode, useId } from "react";
import { cx } from "../internal/cx.js";
import { STREAM_ROOT, type StreamMotion, streamMotion } from "../internal/stream.js";

export interface StreamMeterProps {
	/** Qué mide («Nivel de miedo»); también nombra la barra. */
	label: ReactNode;
	/** De 0 a 100; fuera de ese rango se acota y `NaN` cuenta como 0. */
	value: number;
	/** Marca el medidor como lleno con un anillo índigo que entra y sale con fundido. */
	full?: boolean;
	/** @default 420 */
	width?: number | string;
	/** `enter` entra en 250 ms; `exit` sale en 200 ms. Con menos movimiento, solo fundido. */
	state?: StreamMotion;
	/** Extra classes, merged with the component's own. */
	className?: string;
}

const clamp = (n: number) => (Number.isFinite(n) ? Math.min(100, Math.max(0, n)) : n === Infinity ? 100 : 0);

/** Barra de 0 a 100 sin cifras, para lo que el chat hace subir y bajar, siempre en oscuro. */
export function StreamMeter({ label, value, full = false, width, state, className }: StreamMeterProps) {
	const labelId = useId();
	const v = clamp(value);
	return (
		<div
			className={cx(
				STREAM_ROOT,
				"relative max-w-full rounded-xl border border-secondary bg-primary_alt px-5 py-4",
				width == null && "w-[420px]",
				streamMotion(state),
				className,
			)}
			style={width == null ? undefined : { width }}
		>
			{/* Lleno: un anillo aparte que solo cambia de opacidad, así que con menos movimiento es el mismo fundido. */}
			<span
				aria-hidden="true"
				data-full={full || undefined}
				className={cx(
					"pointer-events-none absolute -inset-px rounded-xl border border-brand ring-4 ring-brand transition-opacity duration-250",
					full ? "opacity-100" : "opacity-0",
				)}
			/>
			<span id={labelId} className="text-md font-semibold text-primary">
				{label}
			</span>
			{/* biome-ignore lint/a11y/useSemanticElements: <meter> no deja dar forma a la barra igual en todos los navegadores. */}
			<div
				role="meter"
				aria-labelledby={labelId}
				aria-valuemin={0}
				aria-valuemax={100}
				aria-valuenow={Math.round(v)}
				className="mt-3 h-3.5 overflow-hidden rounded-full bg-quaternary"
			>
				<div
					className="h-full rounded-full bg-brand-solid transition-[width] duration-300 motion-reduce:transition-none"
					style={{ width: `${v}%` }}
				/>
			</div>
		</div>
	);
}
