import { type ReactNode, useId } from "react";
import { cx } from "../internal/cx.js";
import { formatNumber } from "../internal/format.js";
import { STREAM_ROOT, TABULAR } from "../internal/stream.js";
import { defaultStrings } from "../internal/strings.js";

export interface StreamGoalLabels {
	/** Pie al llegar a la meta. @default "Meta conseguida. Toca poner otra." */
	done: string;
	/** Pie mientras falta: recibe la cifra con su unidad ("716", "40 €"). */
	remaining: (missing: string) => string;
}

export interface StreamGoalProps {
	/** Nombre de la meta; también nombra la barra. */
	label: ReactNode;
	current: number;
	goal: number;
	/** Se añade a las cifras ("subs", "€"). */
	unit?: string;
	/** @default 420 */
	width?: number | string;
	/** Sustituye los textos del pie (ampliación sobre la guía). */
	labels?: Partial<StreamGoalLabels>;
	className?: string;
}

/** Barra de meta del directo con el avance, lo que falta y el porcentaje, siempre en oscuro. */
export function StreamGoal({ label, current, goal, unit, width, labels, className }: StreamGoalProps) {
	const labelId = useId();
	const cur = current || 0;
	const max = goal > 0 ? goal : 1;
	const pct = Math.min(100, Math.max(0, (cur / max) * 100));
	const done = cur >= max;
	const u = unit ? ` ${unit}` : "";
	const t: StreamGoalLabels = {
		done: defaultStrings.goalDone,
		remaining: defaultStrings.goalRemaining,
		...labels,
	};
	return (
		<div
			className={cx(
				STREAM_ROOT,
				"max-w-full rounded-xl border border-secondary bg-primary_alt px-5 py-4",
				width == null && "w-[420px]",
				className,
			)}
			style={width == null ? undefined : { width }}
		>
			<div className="flex items-baseline justify-between gap-4">
				<span id={labelId} className="text-md font-semibold text-primary">
					{label}
				</span>
				<span className={cx(TABULAR, "text-sm text-tertiary")}>
					<b className="font-semibold text-primary">{formatNumber(cur)}</b>
					{` / ${formatNumber(max)}${u}`}
				</span>
			</div>
			<div
				role="progressbar"
				aria-labelledby={labelId}
				aria-valuemin={0}
				aria-valuemax={max}
				aria-valuenow={Math.min(Math.max(cur, 0), max)}
				className="mt-3 mb-2 h-3.5 overflow-hidden rounded-full bg-quaternary"
			>
				{/* Crece en 300 ms cuando cambia `current` (ficha); con menos movimiento, salta. */}
				<div
					className="h-full rounded-[inherit] bg-brand-solid transition-[width] duration-300 ease-[ease] motion-reduce:transition-none"
					style={{ width: `${pct}%` }}
				/>
			</div>
			<div className={cx(TABULAR, "flex justify-between gap-4 text-sm text-tertiary")}>
				<span>{done ? t.done : t.remaining(`${formatNumber(max - cur)}${u}`)}</span>
				<span>{`${Math.floor(pct)} %`}</span>
			</div>
		</div>
	);
}
