"use client";

import { type ReactNode, useId } from "react";
import { cx } from "../internal/cx.js";
import type { IconProp } from "../internal/icon.js";
import { Layer } from "../internal/layer.js";
import { CloseButton } from "./CloseButton.js";
import { FeaturedIcon } from "./FeaturedIcon.js";

export interface SlideoutProps {
	/**
	 * Visible. Con `false` no se pinta.
	 * @default true
	 */
	open?: boolean;
	title: ReactNode;
	description?: ReactNode;
	/** Contenido: detalle o formulario. Se desplaza si no cabe. */
	children?: ReactNode;
	/** Botones del pie, alineados a la derecha. */
	actions?: ReactNode;
	/** Icono destacado (`modern`, gris) a la izquierda del título, como varios tipos del Figma. */
	icon?: IconProp;
	/** A la izquierda del pie, frente a los botones: «Guardar filtro», «Código para incrustar», «¿Vas?»… */
	footerStart?: ReactNode;
	/** Cierra con la X, Escape o un clic fuera. Sin él no hay X y el panel no se puede descartar. */
	onClose?: () => void;
	/**
	 * Ancho máximo del panel.
	 * @default 400
	 */
	width?: number | string;
	/**
	 * Lado del que sale el panel: a la derecha, o a la izquierda (el menú móvil de `HeaderNav`).
	 * @default "right"
	 */
	side?: "right" | "left";
	/** Se pinta dentro de su contenedor (posición relativa) en vez de sobre toda la página, sin atrapar el foco. */
	contained?: boolean;
}

/**
 * Panel lateral derecho para ver o editar el detalle de un elemento sin perder la lista de fondo.
 * Más de tres campos, o comparar con la lista: slideout. Para confirmar una decisión, `Modal`.
 */
export function Slideout({
	open = true,
	title,
	description,
	children,
	actions,
	icon,
	footerStart,
	onClose,
	width,
	side = "right",
	contained,
}: SlideoutProps) {
	const id = useId();
	if (!open) return null;
	return (
		<Layer
			contained={contained}
			onClose={onClose}
			overlayClassName={
				side === "left" ? "items-stretch justify-start p-0" : "items-stretch justify-end p-0"
			}
			panelClassName={cx(
				"flex h-full w-full max-w-[400px] flex-col bg-primary_alt font-body",
				side === "left"
					? "shadow-[var(--shadow-xl),inset_-1px_0_0_var(--border-secondary_alt)]"
					: "shadow-[var(--shadow-xl),inset_1px_0_0_var(--border-secondary_alt)]",
			)}
			panelStyle={width !== undefined ? { maxWidth: width } : undefined}
			labelledBy={`${id}-title`}
			describedBy={description ? `${id}-desc` : undefined}
		>
			<div className={icon ? "flex gap-4 p-6" : "flex gap-2 p-6"}>
				{icon ? <FeaturedIcon icon={icon} color="gray" size="lg" variant="modern" /> : null}
				<div className="min-w-0 flex-1">
					<h2 id={`${id}-title`} className="m-0 text-lg font-semibold text-primary">
						{title}
					</h2>
					{description ? (
						<p id={`${id}-desc`} className="mt-1 mb-0 text-sm text-tertiary">
							{description}
						</p>
					) : null}
				</div>
				{onClose ? <CloseButton onClick={onClose} className="-mt-2 -mr-2" /> : null}
			</div>
			<div className="flex flex-1 flex-col gap-6 overflow-auto px-6 pb-6">{children}</div>
			{actions && !footerStart ? (
				<div className="flex justify-end gap-3 px-6 py-4 shadow-[inset_0_1px_0_var(--border-secondary)]">
					{actions}
				</div>
			) : null}
			{footerStart ? (
				<div className="flex flex-wrap items-center gap-3 px-6 py-4 shadow-[inset_0_1px_0_var(--border-secondary)]">
					<div className="mr-auto flex items-center gap-3">{footerStart}</div>
					{actions ? <div className="flex gap-3">{actions}</div> : null}
				</div>
			) : null}
		</Layer>
	);
}
