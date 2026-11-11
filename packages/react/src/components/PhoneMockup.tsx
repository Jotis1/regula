import type { CSSProperties } from "react";
import { cx } from "../internal/cx.js";
import { IPHONE_FRAME } from "../internal/device-frames.js";
import { Screen, type ScreenContent } from "../internal/mockup-screen.js";

export interface PhoneMockupProps extends ScreenContent {
	/** Sombra del teléfono. @default true */
	shadow?: boolean;
}

// La pantalla del iPhone del Figma: 21/19 de 375 × 812 en 418 × 852; el contenido empieza bajo la barra de estado
const PHONE_SCREEN: CSSProperties = { left: "5.02%", top: "2.23%", width: "89.71%", height: "95.31%" };

/**
 * Teléfono (Figma `iPhone mockup`, `1869:445841`) con la captura o el contenido en su pantalla, bajo la barra de estado.
 * Ancho máximo 418, se encoge con el contenedor.
 */
export function PhoneMockup({ shadow = true, src, alt, children, className }: PhoneMockupProps) {
	return (
		<div className={cx("relative aspect-[418/852] w-full max-w-[418px]", className)}>
			{shadow ? (
				<span
					aria-hidden="true"
					className="absolute inset-[0.12%_0.96%_0.35%_0.96%] rounded-[68px] bg-primary shadow-[var(--shadow-3xl)]"
				/>
			) : null}
			<div className="absolute overflow-hidden bg-primary" style={PHONE_SCREEN}>
				<div className="absolute inset-x-0 top-[3.94%] bottom-0 overflow-hidden">
					<Screen src={src} alt={alt}>
						{children}
					</Screen>
				</div>
			</div>
			<svg
				viewBox="0 0 418 852"
				aria-hidden="true"
				className="pointer-events-none absolute inset-0 size-full text-primary"
				// biome-ignore lint/security/noDangerouslySetInnerHtml: dibujo fijo del propio paquete (device-frames.ts)
				dangerouslySetInnerHTML={{ __html: IPHONE_FRAME }}
			/>
		</div>
	);
}
