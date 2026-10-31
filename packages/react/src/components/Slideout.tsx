"use client";

import { type ReactNode, useId } from "react";
import { Layer } from "../internal/layer.js";
import { CloseButton } from "./CloseButton.js";

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
	/** Cierra con la X, Escape o un clic fuera. Sin él no hay X y el panel no se puede descartar. */
	onClose?: () => void;
	/**
	 * Ancho máximo del panel.
	 * @default 400
	 */
	width?: number | string;
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
	onClose,
	width,
	contained,
}: SlideoutProps) {
	const id = useId();
	if (!open) return null;
	return (
		<Layer
			contained={contained}
			onClose={onClose}
			overlayClassName="items-stretch justify-end p-0"
			panelClassName="flex h-full w-full max-w-[400px] flex-col bg-primary_alt font-body shadow-[var(--shadow-xl),inset_1px_0_0_var(--border-secondary_alt)]"
			panelStyle={width !== undefined ? { maxWidth: width } : undefined}
			labelledBy={`${id}-title`}
			describedBy={description ? `${id}-desc` : undefined}
		>
			<div className="flex gap-2 p-6">
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
			{actions ? (
				<div className="flex justify-end gap-3 px-6 py-4 shadow-[inset_0_1px_0_var(--border-secondary)]">
					{actions}
				</div>
			) : null}
		</Layer>
	);
}
