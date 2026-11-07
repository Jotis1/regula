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

/** Lado del disparador en el que va la burbuja. */
export type BubbleSide = "top" | "bottom" | "left" | "right";
/** Dónde va la flecha en el borde de la burbuja: centrada, o a 12px de su principio o de su final. */
export type BubbleAlign = "center" | "start" | "end";

// Clases enteras, no compuestas: Tailwind solo genera las que encuentra escritas.
const ARROW_BASE = "after:absolute after:border-[6px] after:border-transparent";

/**
 * Flecha de 6px en el borde de la burbuja que mira al disparador. `top`: burbuja encima, flecha abajo; `bottom`:
 * burbuja debajo, flecha arriba; `left` y `right`: burbuja a ese lado, flecha en el borde contrario.
 */
export const ARROWS: Record<BubbleSide, Record<BubbleAlign, string>> = {
	top: {
		center: ARROW,
		start: `${ARROW_BASE} after:top-full after:left-3 after:border-b-0 after:border-t-[var(--bg-primary-solid)]`,
		end: `${ARROW_BASE} after:top-full after:right-3 after:border-b-0 after:border-t-[var(--bg-primary-solid)]`,
	},
	bottom: {
		center: ARROW_UP,
		start: `${ARROW_BASE} after:bottom-full after:left-3 after:border-t-0 after:border-b-[var(--bg-primary-solid)]`,
		end: `${ARROW_BASE} after:bottom-full after:right-3 after:border-t-0 after:border-b-[var(--bg-primary-solid)]`,
	},
	left: {
		center: `${ARROW_BASE} after:left-full after:top-1/2 after:-mt-1.5 after:border-r-0 after:border-l-[var(--bg-primary-solid)]`,
		start: `${ARROW_BASE} after:left-full after:top-3 after:border-r-0 after:border-l-[var(--bg-primary-solid)]`,
		end: `${ARROW_BASE} after:left-full after:bottom-3 after:border-r-0 after:border-l-[var(--bg-primary-solid)]`,
	},
	right: {
		center: `${ARROW_BASE} after:right-full after:top-1/2 after:-mt-1.5 after:border-l-0 after:border-r-[var(--bg-primary-solid)]`,
		start: `${ARROW_BASE} after:right-full after:top-3 after:border-l-0 after:border-r-[var(--bg-primary-solid)]`,
		end: `${ARROW_BASE} after:right-full after:bottom-3 after:border-l-0 after:border-r-[var(--bg-primary-solid)]`,
	},
};

/** Dónde se coloca la burbuja de una vista previa (`open`) respecto a su disparador, a 10px. */
export const OPEN_POSITION: Record<BubbleSide, Record<BubbleAlign, string>> = {
	top: {
		center: "bottom-[calc(100%+10px)] left-1/2 -translate-x-1/2",
		start: "bottom-[calc(100%+10px)] left-0",
		end: "bottom-[calc(100%+10px)] right-0",
	},
	bottom: {
		center: "top-[calc(100%+10px)] left-1/2 -translate-x-1/2",
		start: "top-[calc(100%+10px)] left-0",
		end: "top-[calc(100%+10px)] right-0",
	},
	left: {
		center: "right-[calc(100%+10px)] top-1/2 -translate-y-1/2",
		start: "right-[calc(100%+10px)] top-0",
		end: "right-[calc(100%+10px)] bottom-0",
	},
	right: {
		center: "left-[calc(100%+10px)] top-1/2 -translate-y-1/2",
		start: "left-[calc(100%+10px)] top-0",
		end: "left-[calc(100%+10px)] bottom-0",
	},
};
