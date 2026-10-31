// Componente solo para probar la plantilla de página de componente. No se publica.
import type { ReactNode } from "react";

export interface EjemploProps {
	/** Jerarquía visual del ejemplo. */
	hierarchy?: "primary" | "secondary";
	/** Tamaño en px. */
	size?: number;
	/** Texto obligatorio. */
	label: string;
	children?: ReactNode;
}

/** Componente de ejemplo con dos variantes. */
export function Ejemplo({ hierarchy = "primary", size = 40, label, children }: EjemploProps) {
	return (
		<button type="button" data-hierarchy={hierarchy} style={{ height: size }}>
			{label}
			{children}
		</button>
	);
}
