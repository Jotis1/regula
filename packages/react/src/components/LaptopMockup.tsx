import { type CSSProperties, useId } from "react";
import { cx } from "../internal/cx.js";
import { MACBOOK_FRAME } from "../internal/device-frames.js";
import { Screen, type ScreenContent } from "../internal/mockup-screen.js";

export interface LaptopMockupProps extends ScreenContent {
	/** Sombra bajo la base. @default true */
	shadow?: boolean;
}

// La pantalla del MacBook del Figma: 101,9/18,5 de 828,6 × 517,1 en 1024 × 598
const LAPTOP_SCREEN: CSSProperties = { left: "9.95%", top: "3.1%", width: "80.92%", height: "86.46%" };

/**
 * Portátil (Figma `Macbook Pro mockup`, `1316:213`) con la captura o el contenido en su pantalla. Ancho máximo 1024,
 * se encoge con el contenedor.
 */
export function LaptopMockup({ shadow = true, src, alt, children, className }: LaptopMockupProps) {
	const id = useId().replace(/:/g, "");
	const frame = (shadow ? MACBOOK_FRAME : MACBOOK_FRAME.replace(/<ellipse[^>]*\/>/, "")).replaceAll(
		"mb-",
		`${id}-`,
	);
	return (
		<div className={cx("relative aspect-[1024/598] w-full max-w-[1024px]", className)}>
			<svg
				viewBox="0 0 1024 598"
				aria-hidden="true"
				className="absolute inset-0 size-full overflow-visible"
				// biome-ignore lint/security/noDangerouslySetInnerHtml: dibujo fijo del propio paquete (device-frames.ts)
				dangerouslySetInnerHTML={{ __html: frame }}
			/>
			<div className="absolute overflow-hidden bg-primary" style={LAPTOP_SCREEN}>
				<Screen src={src} alt={alt}>
					{children}
				</Screen>
			</div>
		</div>
	);
}
