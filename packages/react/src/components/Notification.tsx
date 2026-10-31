"use client";

import { useEffect, useRef, useState } from "react";
import { cx } from "../internal/cx.js";
import { ALERT_BASE, type AlertProps, alertBody } from "./Alert.js";

export interface NotificationProps extends Omit<AlertProps, "variant"> {
	/**
	 * Milisegundos hasta cerrarse sola (llama a `onClose`), o `false` para que no se cierre. Solo cuenta si hay
	 * `onClose` y no hay `actions`; el tiempo se para mientras el ratón está encima o el foco dentro.
	 * Ampliación sobre la guía.
	 * @default 6000
	 */
	autoClose?: number | false;
}

/**
 * Aviso flotante y temporal (toast) tras una acción del usuario, de 320px de ancho. La app lo coloca abajo a la
 * derecha, apilado; se cierra solo a los 6 s salvo que tenga acciones.
 */
export function Notification({ autoClose = 6000, className, ...props }: NotificationProps) {
	const { color = "gray", onClose, actions } = props;
	const enabled = autoClose !== false && !!onClose && !actions;
	const [hovered, setHovered] = useState(false);
	const [focused, setFocused] = useState(false);
	const paused = hovered || focused;
	const remaining = useRef(autoClose || 0);
	const close = useRef(onClose);
	close.current = onClose;

	useEffect(() => {
		if (!enabled || paused) return;
		const start = Date.now();
		const timer = setTimeout(() => close.current?.(), remaining.current);
		return () => {
			clearTimeout(timer);
			remaining.current = Math.max(0, remaining.current - (Date.now() - start));
		};
	}, [enabled, paused]);

	return (
		// biome-ignore lint/a11y/noStaticElementInteractions: ratón y foco solo paran el cierre automático; no es un control
		<div
			role={color === "error" ? "alert" : "status"}
			onMouseEnter={() => setHovered(true)}
			onMouseLeave={() => setHovered(false)}
			onFocus={() => setFocused(true)}
			onBlur={(e) => {
				if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocused(false);
			}}
			className={cx(
				ALERT_BASE,
				"w-full max-w-[var(--width-xxs)] rounded-xl shadow-[var(--shadow-lg),inset_0_0_0_1px_var(--border-secondary_alt)]",
				className,
			)}
		>
			{alertBody(props)}
		</div>
	);
}
