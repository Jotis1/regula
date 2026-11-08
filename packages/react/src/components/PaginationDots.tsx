import { cx } from "../internal/cx.js";
import { defaultStrings } from "../internal/strings.js";

export type PaginationDotsVariant = "dot" | "line";
export type PaginationDotsSize = "md" | "lg";

export interface PaginationDotsLabels {
	/** Texto solo para lectores del indicador sin botones: «2 de 5». */
	pageOf: (n: number, total: number) => string;
	/** Nombre de cada botón: «Ir a la página 2 de 5». */
	goTo: (n: number, total: number) => string;
}

export interface PaginationDotsProps {
	/** Cuántas páginas hay. */
	total: number;
	/** La página actual, desde 1. */
	current: number;
	/** Con él, cada punto es un botón que lleva a esa página. Sin él, es solo un indicador. */
	onChange?: (page: number) => void;
	/**
	 * `dot` (puntos) o `line` (rayas).
	 * @default "dot"
	 */
	variant?: PaginationDotsVariant;
	/**
	 * `md` (punto de 8px) o `lg` (10px).
	 * @default "md"
	 */
	size?: PaginationDotsSize;
	/** Sobre una píldora blanca, para ponerlo encima de una imagen. */
	framed?: boolean;
	labels?: Partial<PaginationDotsLabels>;
	/** Nombre del grupo de botones («Diapositivas»). */
	"aria-label"?: string;
	className?: string;
}

// Medidas del Figma (nodos 1111:1 y 1111:38): punto de 8 o 10px con 12 o 16 de hueco; raya de 44px de largo
const MARK: Record<PaginationDotsVariant, Record<PaginationDotsSize, string>> = {
	dot: { md: "size-2", lg: "size-2.5" },
	line: { md: "h-2 w-11", lg: "h-2.5 w-11" },
};
const GAP: Record<PaginationDotsVariant, Record<PaginationDotsSize, string>> = {
	dot: { md: "gap-3", lg: "gap-4" },
	line: { md: "gap-2", lg: "gap-2.5" },
};
const FRAME: Record<PaginationDotsSize, string> = { md: "p-2", lg: "p-3" };

/** Puntos o rayas que dicen en qué página o diapositiva estás, y llevan a otra si se les da `onChange`. */
export function PaginationDots({
	total,
	current,
	onChange,
	variant = "dot",
	size = "md",
	framed,
	labels,
	"aria-label": ariaLabel,
	className,
}: PaginationDotsProps) {
	const pageOf = labels?.pageOf ?? defaultStrings.pageOf;
	const goTo = labels?.goTo ?? defaultStrings.goToPage;
	const n = Math.max(0, Math.floor(total));
	const at = Math.max(1, Math.min(n, Math.floor(current)));
	const shape = cx("block flex-none rounded-full", MARK[variant][size]);
	const frame = cx(
		"inline-flex items-center rounded-full font-body",
		GAP[variant][size],
		framed && ["bg-primary", FRAME[size]],
		className,
	);
	const pages = Array.from({ length: n }, (_, i) => i + 1);

	if (!onChange)
		return (
			<div className={frame}>
				<span className="sr-only">{pageOf(at, n)}</span>
				{pages.map((p) => (
					<span
						key={p}
						aria-hidden="true"
						className={cx(shape, p === at ? "bg-brand-solid" : "bg-quaternary")}
					/>
				))}
			</div>
		);

	return (
		// biome-ignore lint/a11y/useSemanticElements: un grupo de botones con nombre; un <fieldset> pintaría un marco de formulario
		<div role="group" aria-label={ariaLabel} className={frame}>
			{pages.map((p) => (
				<button
					key={p}
					type="button"
					aria-label={goTo(p, n)}
					aria-current={p === at ? "true" : undefined}
					onClick={() => onChange(p)}
					// El botón mide lo que el punto; el área de pulsación es mayor (`before`)
					className={cx(
						shape,
						"relative cursor-pointer border-0 p-0 transition-colors duration-100 before:absolute before:-inset-1.5 before:content-[''] focus-visible:shadow-focus-ring focus-visible:outline-none",
						p === at ? "bg-brand-solid" : "bg-quaternary hover:bg-fg-quaternary",
					)}
				/>
			))}
		</div>
	);
}
