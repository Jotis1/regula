import { type ReactNode, useId } from "react";
import { cx } from "../internal/cx.js";

export type SpotlightPlacement = "top" | "bottom" | "left" | "right";

export interface SpotlightProps {
	/** Rodea el contenido con el anillo y enseña la nota. Sin él, solo se pinta el contenido. */
	active?: boolean;
	/** Lo que quieres decir de esta zona: «Ahora en gris». Va en una burbuja junto al anillo. */
	note?: ReactNode;
	/**
	 * Lado del contenido en el que sale la nota.
	 * @default "bottom"
	 */
	notePlacement?: SpotlightPlacement;
	/** La zona que se señala. */
	children: ReactNode;
}

// Clases enteras, no compuestas: Tailwind solo genera las que encuentra escritas. El anillo está a 8px del contenido y
// la nota a otros 8px del anillo.
const PLACEMENT: Record<SpotlightPlacement, string> = {
	top: "bottom-[calc(100%+16px)] left-1/2 -translate-x-1/2",
	bottom: "top-[calc(100%+16px)] left-1/2 -translate-x-1/2",
	left: "right-[calc(100%+16px)] top-1/2 -translate-y-1/2",
	right: "left-[calc(100%+16px)] top-1/2 -translate-y-1/2",
};

const FADE = "transition-opacity duration-150 starting:opacity-0 motion-reduce:transition-none";

/**
 * Señala una zona: con `active` la rodea de un anillo de marca y enseña su nota, enlazada al contenido como descripción y
 * anunciada al activarse. Sin `active` solo pinta el contenido. Entra con un fundido de 150 ms, que se quita con
 * movimiento reducido. Es una sola zona; no lleva fondo oscurecido ni pasos encadenados.
 */
export function Spotlight({ active = false, note, notePlacement = "bottom", children }: SpotlightProps) {
	const noteId = useId();
	const withNote = active && note !== undefined && note !== null && note !== false;

	return (
		<div className="relative w-fit" aria-describedby={withNote ? noteId : undefined}>
			{children}
			{active ? (
				<span
					aria-hidden="true"
					data-spotlight-ring
					className={cx(
						"pointer-events-none absolute -inset-2 rounded-xl border-2 border-brand",
						FADE,
					)}
				/>
			) : null}
			{withNote ? (
				<div
					id={noteId}
					role="status"
					aria-live="polite"
					data-spotlight-note={notePlacement}
					className={cx(
						"pointer-events-none absolute z-20 w-max max-w-[320px] rounded-lg bg-primary_alt px-3 py-2 font-body text-xs font-semibold text-secondary shadow-[var(--shadow-lg),inset_0_0_0_1px_var(--border-secondary_alt)]",
						PLACEMENT[notePlacement],
						FADE,
					)}
				>
					{note}
				</div>
			) : null}
		</div>
	);
}
