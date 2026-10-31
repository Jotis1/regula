"use client";

import type { CSSProperties, ReactNode } from "react";
import { Dialog, Modal, ModalOverlay } from "react-aria-components";
import { cx } from "./cx.js";
import { OVERLAY, OVERLAY_POSITION } from "./overlay.js";

export interface LayerProps {
	/** Dentro de su contenedor (posición relativa) y sin atrapar el foco: para vistas previas. */
	contained?: boolean;
	/** Sin él, ni Escape ni el clic fuera cierran la capa. */
	onClose?: () => void;
	/** Clases del fondo, además de las comunes (colocación del panel). */
	overlayClassName: string;
	panelClassName: string;
	panelStyle?: CSSProperties;
	/** Id del título que da nombre al diálogo. */
	labelledBy: string;
	describedBy?: string;
	children: ReactNode;
}

/**
 * Capa de diálogo común a Modal y Slideout. Sobre la página usa React Aria: foco atrapado, Escape y clic fuera
 * cierran, el foco vuelve a quien la abrió y la página no se desplaza debajo. Con `contained` es un diálogo no modal
 * dentro de su contenedor; Escape y el clic en el fondo siguen cerrándolo.
 */
export function Layer({
	contained,
	onClose,
	overlayClassName,
	panelClassName,
	panelStyle,
	labelledBy,
	describedBy,
	children,
}: LayerProps) {
	if (contained) {
		return (
			// biome-ignore lint/a11y/noStaticElementInteractions: el clic en el fondo cierra; con teclado, Escape en el panel
			// biome-ignore lint/a11y/useKeyWithClickEvents: el clic en el fondo cierra; con teclado, Escape en el panel
			<div
				className={cx(OVERLAY, OVERLAY_POSITION(true), overlayClassName)}
				onClick={(e) => {
					if (e.target === e.currentTarget) onClose?.();
				}}
			>
				<div
					role="dialog"
					aria-labelledby={labelledBy}
					aria-describedby={describedBy}
					className={panelClassName}
					style={panelStyle}
					onKeyDown={(e) => {
						if (e.key === "Escape" && onClose) {
							e.stopPropagation();
							onClose();
						}
					}}
				>
					{children}
				</div>
			</div>
		);
	}
	return (
		<ModalOverlay
			isOpen
			isDismissable={!!onClose}
			isKeyboardDismissDisabled={!onClose}
			onOpenChange={(open) => {
				if (!open) onClose?.();
			}}
			className={cx(OVERLAY, OVERLAY_POSITION(false), overlayClassName)}
		>
			{/* El panel es el Dialog; Modal solo lo coloca */}
			<Modal className="contents">
				<Dialog
					aria-labelledby={labelledBy}
					aria-describedby={describedBy}
					className={cx(panelClassName, "outline-none")}
					style={panelStyle}
				>
					{children}
				</Dialog>
			</Modal>
		</ModalOverlay>
	);
}
