import type { HTMLAttributes } from "react";
import { cx } from "../internal/cx.js";

export type TransparencyGridSize = "sm" | "md";

export interface TransparencyGridProps extends HTMLAttributes<HTMLDivElement> {
	/**
	 * Tamaño de cada cuadro: `sm` de 8px y `md` de 16px.
	 * @default "sm"
	 */
	size?: TransparencyGridSize;
}

// Damero de dos capas de degradado, con los tokens de fondo para que siga el tema: `bg-secondary` sobre `bg-primary`.
// Las clases van escritas enteras para que Tailwind las encuentre.
const SIZE: Record<TransparencyGridSize, string> = {
	sm: "bg-[length:16px_16px] bg-[position:0_0,8px_8px] bg-[image:linear-gradient(45deg,var(--bg-secondary)_25%,transparent_25%,transparent_75%,var(--bg-secondary)_75%),linear-gradient(45deg,var(--bg-secondary)_25%,transparent_25%,transparent_75%,var(--bg-secondary)_75%)]",
	md: "bg-[length:32px_32px] bg-[position:0_0,16px_16px] bg-[image:linear-gradient(45deg,var(--bg-secondary)_25%,transparent_25%,transparent_75%,var(--bg-secondary)_75%),linear-gradient(45deg,var(--bg-secondary)_25%,transparent_25%,transparent_75%,var(--bg-secondary)_75%)]",
};

/**
 * Fondo de damero que indica transparencia: se pone detrás de lo que tiene huecos (un marco de cámara, una escena con
 * fondo transparente, una muestra). Es decorativo, sin papel en el árbol de accesibilidad. Acepta los atributos de un
 * `div` (`className`, `style`, `aria-hidden`…) y se pinta en el servidor, sin JavaScript.
 */
export function TransparencyGrid({ size = "sm", className, children, ...rest }: TransparencyGridProps) {
	return (
		<div {...rest} className={cx("bg-primary", SIZE[size], className)}>
			{children}
		</div>
	);
}
