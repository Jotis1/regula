"use client";

import { UploadCloud02 } from "@untitledui/icons";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { cx } from "../internal/cx.js";
import { ALERT_BASE, type AlertProps, alertBody } from "./Alert.js";
import { Avatar, type AvatarProps } from "./Avatar.js";
import { FeaturedIcon } from "./FeaturedIcon.js";
import { ProgressBar } from "./ProgressBar.js";

export interface NotificationProps extends Omit<AlertProps, "variant"> {
	/**
	 * Milisegundos hasta cerrarse sola (llama a `onClose`), o `false` para que no se cierre. Solo cuenta si hay
	 * `onClose` y no hay `actions`; el tiempo se para mientras el ratón está encima o el foco dentro.
	 * Ampliación sobre la guía.
	 * @default 6000
	 */
	autoClose?: number | false;
	/**
	 * Imagen del aviso (Figma «Image»): la URL de una foto o un nodo. En un contenedor de 448px o más va a la
	 * izquierda, de 160px de ancho; en uno más estrecho, arriba. Es decorativa (el título ya dice de qué va).
	 */
	image?: string | ReactNode;
	/** Avatar de quien lo envía, en el sitio del icono (Figma «Avatar»). Con `time`, el aviso es un mensaje. */
	avatar?: AvatarProps;
	/** Hora o tiempo junto al título, como «Hace 2 min». Pensado para `avatar`. */
	time?: ReactNode;
	/**
	 * Progreso de 0 a 100 (Figma «Progress indicator»): una barra con el porcentaje bajo el texto, anunciada como
	 * `progressbar`. Sin `icon` lleva `upload-cloud-02` en un cuadro.
	 */
	progress?: number;
	/** Nombre accesible de la barra de `progress`. Por defecto, el título. */
	progressLabel?: string;
}

/**
 * Aviso flotante y temporal (toast) tras una acción del usuario, de 320px de ancho (560px con imagen o avatar).
 * La app lo coloca abajo a la derecha, apilado; se cierra solo a los 6 s salvo que tenga acciones.
 */
export function Notification({
	autoClose = 6000,
	className,
	image,
	avatar,
	time,
	progress,
	progressLabel,
	...props
}: NotificationProps) {
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

	const hasImage = image !== undefined && image !== null && image !== false;
	const wide = hasImage || !!avatar;
	const lead = avatar ? (
		<Avatar size="md" {...avatar} />
	) : progress !== undefined && props.icon === undefined ? (
		<FeaturedIcon icon={UploadCloud02} color="gray" size="md" variant="modern" />
	) : undefined;
	const extra =
		progress !== undefined ? (
			<ProgressBar
				value={progress}
				label="bottom"
				aria-label={progressLabel ?? (typeof props.title === "string" ? props.title : undefined)}
			/>
		) : undefined;
	const body = alertBody({ ...props, lead, time, extra });

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
				"w-full",
				wide ? "max-w-[var(--width-md)]" : "max-w-[var(--width-xxs)]",
				"rounded-xl shadow-[var(--shadow-lg),inset_0_0_0_1px_var(--border-secondary_alt)]",
				hasImage && "@container flex-col gap-0 overflow-hidden p-0",
				className,
			)}
		>
			{hasImage ? (
				<div className="flex flex-col @md:flex-row">
					<div
						aria-hidden="true"
						className="h-40 shrink-0 overflow-hidden bg-secondary @md:h-auto @md:w-40 [&>img]:size-full [&>img]:object-cover"
					>
						{typeof image === "string" ? <img src={image} alt="" /> : image}
					</div>
					<div className="flex min-w-0 flex-1 gap-4 p-4 @md:pl-5">{body}</div>
				</div>
			) : (
				body
			)}
		</div>
	);
}
