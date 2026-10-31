import type { ReactNode } from "react";
import { cx } from "./cx.js";

/** Tecla o atajo (`jm-menu-kbd` de la guía): texto de 12px con filo `border-secondary`. */
export function Kbd({ children, className }: { children: ReactNode; className?: string }) {
	return (
		<kbd
			className={cx(
				"rounded-sm px-1 font-body text-xs font-medium text-quaternary shadow-[inset_0_0_0_1px_var(--border-secondary)]",
				className,
			)}
		>
			{children}
		</kbd>
	);
}
