import type { ReactNode } from "react";
import { cx } from "../internal/cx.js";

export interface ScaledPreviewProps {
	/** El ancho real del contenido, en px: se pinta a este ancho y después se encoge. */
	width: number;
	/** La caja que ocupa la vista previa, `[ancho, alto]` en px. Lo que se salga de ella queda recortado. */
	box: [number, number];
	/**
	 * El alto real del contenido, en px. Con él, la escala automática también cuida que no sobre alto; sin él, solo
	 * mira el ancho.
	 */
	contentHeight?: number;
	/**
	 * La escala. Sin ella, la mayor con la que el contenido cabe en la caja (`box[0] / width`, o menos si hay
	 * `contentHeight`).
	 */
	scale?: number;
	className?: string;
	children: ReactNode;
}

/** La escala con la que el contenido cabe en la caja, sin pasar de 1: encoger sí, ampliar no. */
function scaleToFit(width: number, [boxWidth, boxHeight]: [number, number], contentHeight?: number): number {
	const byWidth = boxWidth / width;
	const byHeight = contentHeight ? boxHeight / contentHeight : Number.POSITIVE_INFINITY;
	return Math.min(byWidth, byHeight, 1);
}

/**
 * Pinta una pieza a su ancho real y la encoge para que quepa en una caja: la vista previa de algo que mide 1920px, como
 * una escena de Stream, en un recuadro de 360. El cálculo no mide nada, así que se pinta en el servidor, sin JavaScript.
 * El contenido sigue siendo el real (con su texto y sus enlaces): si es solo una muestra, envuélvelo en un contenedor
 * con `aria-hidden` e `inert`.
 */
export function ScaledPreview({ width, box, contentHeight, scale, className, children }: ScaledPreviewProps) {
	const factor = scale ?? scaleToFit(width, box, contentHeight);
	return (
		<div className={cx("relative overflow-hidden", className)} style={{ width: box[0], height: box[1] }}>
			<div className="origin-top-left" style={{ width, transform: `scale(${factor})` }}>
				{children}
			</div>
		</div>
	);
}
