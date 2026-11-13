import { type ReactNode, useId } from "react";
import { cx } from "../internal/cx.js";
import { DynIcon } from "../internal/icon.js";
import {
	keyText,
	STREAM_EVENTS,
	STREAM_ROOT,
	type StreamEventType,
	stableKeys,
	streamMotion,
	streamShort,
} from "../internal/stream.js";
import { defaultStrings } from "../internal/strings.js";

export interface StreamEventItem {
	type: StreamEventType;
	user: ReactNode;
	/** Cifra del evento: euros, bits, espectadores del raid o suscripciones regaladas. */
	amount?: number;
	/** Meses de una renovación. */
	months?: number;
	/** Sustituye a la línea generada ("Donación · 5,00 €", "Raid entrante · 1.284"). */
	detail?: ReactNode;
	/** Hora relativa, como "2 min" o "ahora": se entiende al instante, la absoluta obliga a calcular. */
	time?: ReactNode;
	/**
	 * Clave estable del evento (ampliación sobre la guía). Sin ella se deriva del tipo, el usuario y la cifra, para
	 * que con `animate` solo entre la fila nueva cuando llega un evento.
	 */
	id?: string | number;
}

export interface StreamEventsProps {
	/** Del más reciente al más antiguo. */
	items: StreamEventItem[];
	/**
	 * Filas que se ven. Más de siete deja de ser una lista de un vistazo.
	 * @default 5
	 */
	max?: number;
	/** @default "Últimos eventos" */
	title?: ReactNode;
	/**
	 * Ancho de la lista.
	 * @default 360
	 */
	width?: number | string;
	/** La primera fila entra con fundido y 8px de subida al llegar. */
	animate?: boolean;
	className?: string;
}

function contentKey(it: StreamEventItem): string {
	return `${it.type}|${keyText(it.user)}|${it.amount ?? ""}|${it.months ?? ""}`;
}

/** Lista de los últimos eventos del canal con icono, usuario, detalle y hora relativa, siempre en oscuro. */
export function StreamEvents({
	items,
	max = 5,
	title,
	width,
	animate = false,
	className,
}: StreamEventsProps) {
	const titleId = useId();
	const visible = items.slice(0, max);
	// Clave por contenido (y no por posición): al entrar un evento arriba, las demás filas se conservan.
	const keys = stableKeys(visible, contentKey);
	return (
		<div
			className={cx(
				STREAM_ROOT,
				"max-w-full overflow-hidden rounded-xl border border-secondary bg-primary_alt",
				width == null && "w-[360px]",
				className,
			)}
			style={width == null ? undefined : { width }}
		>
			<div
				id={titleId}
				className="border-b border-secondary px-4 py-3 text-sm font-semibold text-tertiary"
			>
				{title ?? defaultStrings.latestEvents}
			</div>
			<ul aria-labelledby={titleId} className="m-0 list-none p-0">
				{visible.map((it, i) => {
					const ev = STREAM_EVENTS[it.type] ?? STREAM_EVENTS.follow;
					return (
						<li
							key={keys[i]}
							className={cx(
								"flex items-center gap-3 border-b border-secondary px-4 py-3 last:border-b-0",
								i === 0 && animate && streamMotion("enter"),
							)}
						>
							<span className="inline-flex size-8 flex-none items-center justify-center rounded-lg bg-tertiary text-fg-secondary">
								<DynIcon icon={ev.icon} size={16} />
							</span>
							<span className="flex min-w-0 flex-1 flex-col">
								<span className="truncate text-md font-semibold text-primary">{it.user}</span>
								<span className="truncate text-sm text-tertiary">
									{it.detail ?? streamShort(it.type, it)}
								</span>
							</span>
							{it.time != null ? (
								<span className="flex-none text-xs text-quaternary">{it.time}</span>
							) : null}
						</li>
					);
				})}
			</ul>
		</div>
	);
}
