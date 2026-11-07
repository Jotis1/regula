// Aspecto de la burbuja oscura de `Tooltip`, que comparte `CopyTooltip` para que los dos avisos sean iguales.

/** La burbuja: fondo `bg-primary-solid`, texto blanco de 12px semibold, `radius-lg` y `shadow-lg`. */
export const BUBBLE =
	"z-20 w-max max-w-[320px] rounded-lg bg-primary-solid font-body text-xs font-semibold text-white shadow-lg";

/** Flecha de 12×6 centrada abajo, del color de la burbuja, para una burbuja sobre su elemento. */
export const ARROW =
	"after:absolute after:top-full after:left-1/2 after:-ml-1.5 after:border-[6px] after:border-b-0 after:border-transparent after:border-t-[var(--bg-primary-solid)]";

/** La misma flecha, pero arriba y hacia arriba, para una burbuja bajo su elemento. */
export const ARROW_UP =
	"after:absolute after:bottom-full after:left-1/2 after:-ml-1.5 after:border-[6px] after:border-t-0 after:border-transparent after:border-b-[var(--bg-primary-solid)]";
