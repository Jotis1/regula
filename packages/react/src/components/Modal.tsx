"use client";

import { type ReactNode, useId } from "react";
import { cx } from "../internal/cx.js";
import { Layer } from "../internal/layer.js";
import type { StatusColor } from "./Badge.js";
import { CloseButton } from "./CloseButton.js";
import { FeaturedIcon, type FeaturedIconVariant } from "./FeaturedIcon.js";
import type { IconName } from "./Icon.js";

export interface ModalProps {
	/**
	 * Visible. Con `false` no se pinta.
	 * @default true
	 */
	open?: boolean;
	/** Pregunta o tarea. El botón de confirmar repite su verbo ("Eliminar", no "Aceptar"). */
	title: ReactNode;
	description?: ReactNode;
	/** Icono destacado sobre el título (`FeaturedIcon` de 48px). */
	icon?: IconName | ReactNode;
	/** Color del icono. Por defecto, `brand` (`error` si es `destructive`). */
	color?: StatusColor;
	/**
	 * Estilo del icono destacado.
	 * @default "light"
	 */
	iconVariant?: FeaturedIconVariant;
	/** Confirma una acción destructiva: icono en `error`. */
	destructive?: boolean;
	/**
	 * `stacked`: icono encima y botones a partes iguales. `horizontal`: icono a la izquierda y botones a la derecha.
	 * @default "stacked"
	 */
	layout?: "stacked" | "horizontal";
	/** Botones del pie: normalmente `Button` secundario + primario. Una sola acción principal. */
	actions?: ReactNode;
	/** Contenido, como un formulario corto. */
	children?: ReactNode;
	/** Cierra con la X, Escape o un clic fuera. Sin él no hay X y el modal no se puede descartar. */
	onClose?: () => void;
	/**
	 * Ancho máximo.
	 * @default 480
	 */
	width?: number | string;
	/** Se pinta dentro de su contenedor (posición relativa) en vez de sobre toda la página, sin atrapar el foco. */
	contained?: boolean;
}

/** Diálogo sobre la página para confirmar o completar una tarea corta sin salir de ella. Un modal, una decisión. */
export function Modal({
	open = true,
	title,
	description,
	icon,
	color,
	iconVariant = "light",
	destructive,
	layout = "stacked",
	actions,
	children,
	onClose,
	width,
	contained,
}: ModalProps) {
	const id = useId();
	if (!open) return null;
	const horizontal = layout === "horizontal";
	return (
		<Layer
			contained={contained}
			onClose={onClose}
			overlayClassName="items-center justify-center"
			panelClassName="relative w-full max-w-[var(--width-sm)] rounded-2xl bg-primary_alt font-body shadow-xl"
			panelStyle={width !== undefined ? { maxWidth: width } : undefined}
			labelledBy={`${id}-title`}
			describedBy={description ? `${id}-desc` : undefined}
		>
			<div className={cx("flex gap-4 px-6 pt-6", horizontal ? "flex-row" : "flex-col")}>
				{icon ? (
					<FeaturedIcon
						icon={icon}
						color={color ?? (destructive ? "error" : "brand")}
						size="lg"
						variant={iconVariant}
					/>
				) : null}
				<div>
					<h2 id={`${id}-title`} className="m-0 text-lg font-semibold text-primary">
						{title}
					</h2>
					{description ? (
						<p id={`${id}-desc`} className="mt-1 mb-0 text-sm text-tertiary">
							{description}
						</p>
					) : null}
				</div>
			</div>
			{children ? <div className="px-6 pt-5">{children}</div> : null}
			{actions ? (
				<div
					className={cx(
						"flex gap-3 px-6 pt-8 pb-6",
						horizontal ? "justify-end [&>*]:flex-none" : "[&>*]:flex-1",
					)}
				>
					{actions}
				</div>
			) : null}
			{onClose ? <CloseButton onClick={onClose} className="absolute top-4 right-4" /> : null}
		</Layer>
	);
}
