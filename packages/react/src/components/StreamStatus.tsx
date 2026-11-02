import type { ReactNode } from "react";
import { cx } from "../internal/cx.js";
import { formatNumber } from "../internal/format.js";
import { STREAM_ROOT, TABULAR } from "../internal/stream.js";
import { defaultStrings } from "../internal/strings.js";
import { Icon } from "./Icon.js";

export type StreamStatusValue = "live" | "offline" | "rerun";

export interface StreamStatusLabels {
	/** @default "En directo" */
	live: string;
	/** @default "Reemisión" */
	rerun: string;
	/** @default "Sin directo" */
	offline: string;
	/** Tras la cifra, solo para lectores de pantalla. @default "espectadores" */
	viewers: string;
	/** Tras el tiempo en emisión, solo para lectores de pantalla. @default "en emisión" */
	uptime: string;
}

export interface StreamStatusProps {
	/** @default "live" */
	status?: StreamStatusValue;
	/** Espectadores; solo en `live`. Quítalo si no quieres exponer la cifra. */
	viewers?: number;
	/** Tiempo en emisión como texto ("2:14:05"); solo en `live`. */
	uptime?: string;
	category?: ReactNode;
	/** Sustituye los textos (ampliación sobre la guía). */
	labels?: Partial<StreamStatusLabels>;
	className?: string;
}

// Nunca rojo para "en directo": en el sistema el rojo es error. El punto va siempre junto a la palabra.
const DOT: Record<StreamStatusValue, string> = {
	live: "bg-fg-success-secondary",
	rerun: "bg-fg-warning-secondary",
	offline: "bg-fg-quaternary",
};

/** Píldora de estado del canal (en directo, reemisión o sin directo), siempre en oscuro. */
export function StreamStatus({
	status = "live",
	viewers,
	uptime,
	category,
	labels,
	className,
}: StreamStatusProps) {
	const t: StreamStatusLabels = {
		live: defaultStrings.streamLive,
		rerun: defaultStrings.streamRerun,
		offline: defaultStrings.streamOffline,
		viewers: defaultStrings.viewers,
		uptime: defaultStrings.onAir,
		...labels,
	};
	const live = status === "live";
	const meta = cx(TABULAR, "inline-flex items-center gap-1.5");
	return (
		<div
			role="status"
			className={cx(
				STREAM_ROOT,
				"inline-flex items-center gap-4 rounded-full border border-secondary bg-primary_alt px-4 py-2 text-sm font-medium text-secondary",
				className,
			)}
		>
			<span className="inline-flex items-center gap-2 font-semibold text-primary">
				<span
					aria-hidden="true"
					className={cx("inline-block size-2 flex-none rounded-full", DOT[status])}
				/>
				{t[status]}
			</span>
			{live && viewers != null ? (
				<span className={meta}>
					<Icon name="eye" size={16} className="text-fg-tertiary" />
					{formatNumber(viewers)}
					<span className="sr-only"> {t.viewers}</span>
				</span>
			) : null}
			{live && uptime ? (
				<span className={meta}>
					<Icon name="clock" size={16} className="text-fg-tertiary" />
					{uptime}
					<span className="sr-only"> {t.uptime}</span>
				</span>
			) : null}
			{category ? <span className={meta}>{category}</span> : null}
		</div>
	);
}
