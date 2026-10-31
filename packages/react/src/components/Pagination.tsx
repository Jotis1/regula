"use client";

import { cx } from "../internal/cx.js";
import { defaultStrings } from "../internal/strings.js";
import { useControllable } from "../internal/use-controllable.js";
import { Button } from "./Button.js";

export interface PaginationLabels {
	/** @default "Anterior" */
	previous: string;
	/** @default "Siguiente" */
	next: string;
	/** Nombre de la navegación. @default "Paginación" */
	nav: string;
	/** Nombre de cada número. @default (n) => `Página ${n}` */
	page: (n: number) => string;
}

export interface PaginationProps {
	/** Número de páginas. */
	total: number;
	/** Página actual, desde 1 (controlado). */
	page?: number;
	/**
	 * Página al principio (no controlado).
	 * @default 1
	 */
	defaultPage?: number;
	onChange?: (n: number) => void;
	/** Textos que trae el componente, para sustituirlos. */
	labels?: Partial<PaginationLabels>;
	className?: string;
}

/** Números que se muestran: todos hasta 7 páginas; con más, recorta con "…". */
export function pageList(current: number, total: number): (number | "…")[] {
	if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
	if (current <= 3 || current >= total - 2) return [1, 2, 3, "…", total - 2, total - 1, total];
	return [1, "…", current - 1, current, current + 1, "…", total];
}

/** Paginación con Anterior/Siguiente y números, separada de la tabla por una línea `border-secondary`. */
export function Pagination({ total, page, defaultPage = 1, onChange, labels, className }: PaginationProps) {
	const [current, setCurrent] = useControllable(page, defaultPage);
	const pages = Math.max(1, total);
	const text = {
		previous: defaultStrings.previous,
		next: defaultStrings.next,
		nav: defaultStrings.pagination,
		page: (n: number) => `${defaultStrings.page} ${n}`,
		...labels,
	};
	const go = (n: number) => {
		if (n < 1 || n > pages || n === current) return;
		setCurrent(n);
		onChange?.(n);
	};
	return (
		<nav
			aria-label={text.nav}
			className={cx(
				"flex items-center justify-between gap-3 pt-3 font-body shadow-[inset_0_1px_0_var(--border-secondary)]",
				className,
			)}
		>
			<Button
				hierarchy="secondary"
				size="sm"
				iconLeading="arrow-left"
				disabled={current <= 1}
				onClick={() => go(current - 1)}
			>
				{text.previous}
			</Button>
			<div className="flex gap-0.5">
				{pageList(current, pages).map((n, i) =>
					n === "…" ? (
						<span
							// biome-ignore lint/suspicious/noArrayIndexKey: puede haber dos huecos; su posición los distingue
							key={`gap-${i}`}
							aria-hidden="true"
							className="w-10 text-center text-sm leading-10 text-quaternary"
						>
							…
						</span>
					) : (
						<button
							key={n}
							type="button"
							aria-label={text.page(n)}
							aria-current={n === current ? "page" : undefined}
							onClick={() => go(n)}
							className="size-10 cursor-pointer rounded-lg border-0 bg-transparent font-body text-sm font-medium text-quaternary transition-colors duration-100 hover:bg-primary_hover hover:text-secondary focus-visible:shadow-focus-ring focus-visible:outline-none aria-[current=page]:bg-primary_hover aria-[current=page]:text-secondary"
						>
							{n}
						</button>
					),
				)}
			</div>
			<Button
				hierarchy="secondary"
				size="sm"
				iconTrailing="arrow-right"
				disabled={current >= pages}
				onClick={() => go(current + 1)}
			>
				{text.next}
			</Button>
		</nav>
	);
}
