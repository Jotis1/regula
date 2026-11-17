import type { ReactNode } from "react";
import { cx } from "../internal/cx.js";
import { formatNumber } from "../internal/format.js";
import { STREAM_ROOT, type StreamMotion, streamMotion, TABULAR } from "../internal/stream.js";

export interface StreamCounterItem {
	/** What the counter measures. */
	label: ReactNode;
	/** Entero de 0 o más; cualquier otro valor se pinta como 0. */
	value: number;
}

export interface StreamCounterProps {
	/** Uno o dos contadores; a partir del tercero no se pintan. */
	items: StreamCounterItem[];
	/** Sin él, la tarjeta mide lo que su contenido. */
	width?: number | string;
	/** Entrada y salida de la tarjeta: `enter` en 250 ms, `exit` en 200 ms. Con menos movimiento, solo fundido. */
	state?: StreamMotion;
	/** Extra classes, merged with the component's own. */
	className?: string;
}

/** Claves fijas de los dos huecos: el orden no cambia. */
const SLOTS = ["first", "second"] as const;
const MAX_ITEMS = SLOTS.length;

const safe = (n: number) => (Number.isInteger(n) && n >= 0 ? n : 0);

/** Contadores del directo («Muertes 37 · Sustos 12») en una fila, siempre en oscuro. */
export function StreamCounter({ items, width, state, className }: StreamCounterProps) {
	return (
		<dl
			className={cx(
				STREAM_ROOT,
				"m-0 inline-flex max-w-full items-center gap-6 rounded-xl border border-secondary bg-primary_alt px-5 py-3",
				streamMotion(state),
				className,
			)}
			style={width == null ? undefined : { width }}
		>
			{items.slice(0, MAX_ITEMS).map((it, i) => {
				const value = safe(it.value);
				return (
					<div
						key={SLOTS[i]}
						className={cx(
							"flex min-w-0 items-baseline gap-2",
							i > 0 && "border-l border-secondary pl-6",
						)}
					>
						<dt className="truncate text-md font-medium text-tertiary">{it.label}</dt>
						<dd className={cx(TABULAR, "m-0 text-display-xs font-semibold text-primary")}>
							{/* La clave es la cifra: al cambiar se monta de nuevo y entra solo con fundido, sin desplazarse. */}
							<span
								key={value}
								className="inline-block transition-opacity duration-250 starting:opacity-0"
							>
								{formatNumber(value)}
							</span>
						</dd>
					</div>
				);
			})}
		</dl>
	);
}
