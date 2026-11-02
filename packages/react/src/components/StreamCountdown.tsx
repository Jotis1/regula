"use client";

import { type CSSProperties, type ReactNode, useEffect, useState } from "react";
import { cx } from "../internal/cx.js";
import { STREAM_ROOT, type StreamTime, secondsLeft, streamClock, TABULAR } from "../internal/stream.js";

export type StreamCountdownSize = "md" | "lg" | "xl";

export interface StreamCountdownProps {
	/** Duración fija en segundos. */
	seconds?: number;
	/** Fecha objetivo; manda sobre `seconds`. */
	target?: StreamTime;
	/** Hora fija: congela la cuenta (pruebas y vistas previas). */
	now?: StreamTime;
	/** Detiene la cuenta. */
	paused?: boolean;
	/**
	 * `md` 36px · `lg` 60px · `xl` 96px, o un número en px.
	 * @default "lg"
	 */
	size?: StreamCountdownSize | number;
	/** Etiqueta debajo; obligatoria en la práctica si hay dos contadores en pantalla. */
	label?: ReactNode;
	className?: string;
}

const SIZE: Record<StreamCountdownSize, string> = { md: "text-[36px]", lg: "text-[60px]", xl: "text-[96px]" };

/** Solo para StreamScene: etiqueta más grande (`.jm-st-scene-main .jm-st-count-label` del bundle). No es pública. */
interface CountdownSlots {
	labelClassName?: string;
}

/**
 * Lógica de la cuenta: un tic por segundo hasta 0, donde se queda. Se reinicia si cambian `seconds`, `target` o
 * `now`; con `now` o `paused` no corre.
 */
function useCountdown({ seconds, target, now, paused }: StreamCountdownProps): number {
	const key = `${target != null ? new Date(target).getTime() : "s"}|${seconds ?? 0}|${now != null ? new Date(now).getTime() : "n"}`;
	const [state, setState] = useState(() => ({ key, left: secondsLeft({ seconds, target, now }) }));
	if (state.key !== key) setState({ key, left: secondsLeft({ seconds, target, now }) });
	const frozen = paused || now != null || state.left === 0;
	useEffect(() => {
		if (frozen) return;
		const id = setInterval(() => {
			setState((s) => ({
				key: s.key,
				left: target != null ? secondsLeft({ target }) : Math.max(0, s.left - 1),
			}));
		}, 1000);
		return () => clearInterval(id);
	}, [frozen, target]);
	return state.left;
}

/** Cuenta atrás en mm:ss (h:mm:ss si pasa de una hora) que llega a 00:00 y se queda ahí, siempre en oscuro. */
export function StreamCountdown(props: StreamCountdownProps) {
	return <CountdownView {...props} />;
}

/** La cuenta con sus huecos internos; la usa StreamScene. */
export function CountdownView({
	size = "lg",
	label,
	className,
	labelClassName,
	...time
}: StreamCountdownProps & CountdownSlots) {
	const left = useCountdown(time);
	const custom = typeof size === "number";
	const style: CSSProperties | undefined = custom ? { fontSize: size } : undefined;
	return (
		// `aria-live="off"`: un lector de pantalla no lee cada tic; el valor está ahí si se consulta.
		<div
			role="timer"
			aria-live="off"
			className={cx(STREAM_ROOT, "inline-flex flex-col items-center gap-1", className)}
		>
			<span
				// Con `target` y sin `now`, el servidor y el navegador pueden ir un segundo distintos.
				suppressHydrationWarning
				className={cx(
					TABULAR,
					// El tamaño antes que `leading-none`: tailwind-merge quita el interlineado que va antes de un `text-*`.
					custom ? null : SIZE[size],
					"leading-none font-semibold tracking-[-0.02em] text-primary",
				)}
				style={style}
			>
				{streamClock(left)}
			</span>
			{label ? (
				<span className={cx("text-sm font-medium text-tertiary", labelClassName)}>{label}</span>
			) : null}
		</div>
	);
}
