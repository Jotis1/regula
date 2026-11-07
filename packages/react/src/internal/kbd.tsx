import type { ReactNode } from "react";
import { cx } from "./cx.js";

/** Clases de una tecla o atajo (`jm-menu-kbd` de la guía): texto de 12px con filo `border-secondary`. */
export const KBD =
	"rounded-sm px-1 font-body text-xs font-medium text-quaternary shadow-[inset_0_0_0_1px_var(--border-secondary)]";

/** Tecla o atajo (`jm-menu-kbd` de la guía). */
export function Kbd({ children, className }: { children: ReactNode; className?: string }) {
	return <kbd className={cx(KBD, className)}>{children}</kbd>;
}
