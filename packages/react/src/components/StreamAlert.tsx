import type { ReactNode } from "react";
import { cx } from "../internal/cx.js";
import { type IconProp, iconSlot } from "../internal/icon.js";
import {
	STREAM_EVENTS,
	STREAM_ROOT,
	type StreamEventType,
	type StreamMotion,
	streamDetail,
	streamMotion,
} from "../internal/stream.js";

export interface StreamAlertProps {
	/**
	 * Tipo de evento: decide la etiqueta, el icono y el texto por defecto.
	 * @default "follow"
	 */
	type?: StreamEventType;
	/** Quien provoca el evento, en Bricolage 24/32 semibold. */
	user: ReactNode;
	/** Cifra del evento: suscripciones regaladas, espectadores del raid, bits o euros donados. */
	amount?: number;
	/** Meses de una renovación. */
	months?: number;
	/** Nivel de una suscripción. */
	tier?: number | string;
	/**
	 * Mensaje del espectador. Siempre texto plano: llega del público y se pinta tal cual, nunca como HTML
	 * (por eso es `string` y no un nodo). Modéralo antes.
	 */
	message?: string;
	/** Sustituye al texto por defecto del tipo ("Ya no hay vuelta atrás.", "5,00 €"…). */
	detail?: ReactNode;
	/** Sustituye a la etiqueta del tipo ("Nuevo seguidor"…). */
	label?: ReactNode;
	/** Sustituye al icono del tipo. */
	icon?: IconProp;
	/** `enter` entra con fundido y 8px de subida en 250 ms; `exit` sale en 200 ms. Con menos movimiento, solo fundido. */
	state?: StreamMotion;
	className?: string;
}

/** Alerta de un evento del directo en una tarjeta de 480px, siempre en oscuro. */
export function StreamAlert({
	type = "follow",
	user,
	amount,
	months,
	tier,
	message,
	detail,
	label,
	icon,
	state,
	className,
}: StreamAlertProps) {
	const ev = STREAM_EVENTS[type] ?? STREAM_EVENTS.follow;
	const text = detail ?? streamDetail(type, { amount, months, tier });
	return (
		<div
			role="status"
			aria-live="polite"
			className={cx(
				STREAM_ROOT,
				"flex w-[480px] max-w-full items-start gap-4 rounded-2xl border border-secondary bg-primary_alt p-6 shadow-xl",
				streamMotion(state),
				className,
			)}
		>
			<span className="inline-flex size-12 flex-none items-center justify-center rounded-xl bg-brand-solid text-white">
				{iconSlot(icon ?? ev.icon, 24)}
			</span>
			<div className="flex min-w-0 flex-col gap-0.5">
				<span className="block text-sm font-medium text-tertiary">{label ?? ev.label}</span>
				<span className="font-display text-display-xs font-semibold wrap-anywhere text-primary">
					{user}
				</span>
				{text ? <span className="text-md text-secondary">{text}</span> : null}
				{message ? (
					<span className="mt-2 rounded-lg bg-tertiary px-3 py-2 text-md wrap-anywhere text-secondary">
						{message}
					</span>
				) : null}
			</div>
		</div>
	);
}
