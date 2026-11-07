import type { ReactNode } from "react";
import { cx } from "../internal/cx.js";

export type KbdVariant = "menu" | "field";

export interface KbdProps {
	/**
	 * `menu`: el atajo de un elemento de menú, texto de 12px de la fuente del cuerpo con filo `border-secondary`.
	 * `field`: la pista de un campo o botón de búsqueda («Ctrl K»), de 22px de alto, con fondo `bg-secondary` y Geist Mono.
	 * @default "menu"
	 */
	variant?: KbdVariant;
	className?: string;
	children: ReactNode;
}

const BASE =
	"rounded-sm text-xs font-medium text-quaternary shadow-[inset_0_0_0_1px_var(--border-secondary)]";

const VARIANT: Record<KbdVariant, string> = {
	menu: "px-1 font-body",
	field: "inline-flex h-[22px] items-center bg-secondary px-1.5 font-mono",
};

/**
 * Tecla o atajo de teclado. Solo se muestra: no registra nada. Dropdown y CommandMenu lo usan con `menu` para los
 * atajos de sus opciones.
 */
export function Kbd({ variant = "menu", className, children }: KbdProps) {
	return <kbd className={cx(BASE, VARIANT[variant], className)}>{children}</kbd>;
}
