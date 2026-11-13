import { ChevronRight } from "@untitledui/icons";
import type { ReactNode } from "react";
import { cx } from "../internal/cx.js";

export type DisclosureSize = "sm" | "md";

export interface DisclosureProps {
	/** El título, siempre visible: es lo que se pulsa para abrir y cerrar. */
	title: ReactNode;
	/** Lo que va a la derecha del título: un contador, un `Badge`. */
	aside?: ReactNode;
	/** Empieza abierto. */
	defaultOpen?: boolean;
	/**
	 * Alto de la cabecera: `sm` 40px y `md` 48px.
	 * @default "md"
	 */
	size?: DisclosureSize;
	/**
	 * Raya inferior.
	 * @default true
	 */
	divider?: boolean;
	className?: string;
	/** El contenido que se muestra al abrir. */
	children?: ReactNode;
}

const HEADER: Record<DisclosureSize, string> = {
	sm: "min-h-10",
	md: "min-h-12",
};

/**
 * Bloque plegable con contenido libre y denso (controles, listas, propiedades): un `<details>` con su `<summary>`, que
 * se abre y se cierra sin JavaScript y se pinta en el servidor. Para una lista de preguntas con respuestas de texto,
 * `Accordion`.
 */
export function Disclosure({
	title,
	aside,
	defaultOpen,
	size = "md",
	divider = true,
	className,
	children,
}: DisclosureProps) {
	return (
		<details
			open={defaultOpen}
			className={cx("group/disclosure font-body", divider && "border-b border-secondary", className)}
		>
			<summary
				className={cx(
					"flex cursor-pointer list-none items-center gap-2 rounded-md text-sm font-semibold text-primary [&::-webkit-details-marker]:hidden",
					"focus-visible:shadow-focus-ring focus-visible:outline-none",
					HEADER[size],
				)}
			>
				<ChevronRight
					size={16}
					aria-hidden="true"
					className="shrink-0 text-fg-quaternary transition-transform duration-100 group-open/disclosure:rotate-90 motion-reduce:transition-none"
				/>
				<span className="min-w-0 grow">{title}</span>
				{aside ? <span className="ml-auto flex shrink-0 items-center">{aside}</span> : null}
			</summary>
			<div className="pb-4 pl-6 text-sm text-tertiary">{children}</div>
		</details>
	);
}
