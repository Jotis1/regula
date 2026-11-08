"use client";

import { type KeyboardEvent, type PointerEvent, type ReactNode, useRef } from "react";
import { cx } from "../internal/cx.js";
import { defaultStrings } from "../internal/strings.js";
import { useControllable } from "../internal/use-controllable.js";
import { Icon } from "./Icon.js";
import { PaginationDots } from "./PaginationDots.js";

export type CarouselSize = "md" | "lg";

export interface CarouselLabels {
	/** Descripción del rol de la región («carrusel»). */
	carousel: string;
	/** Descripción del rol de cada diapositiva («diapositiva»). */
	slide: string;
	previous: string;
	next: string;
	/** Nombre de cada diapositiva: «2 de 5». */
	slideOf: (n: number, total: number) => string;
	/** Nombre de cada punto: «Ir a la página 2 de 5». */
	goTo: (n: number, total: number) => string;
}

export interface CarouselProps {
	/** Una diapositiva por elemento. Las que no se ven quedan fuera del orden de Tab y de los lectores. */
	slides: ReactNode[];
	/** Qué enseña el carrusel («Fotos del local»). Obligatorio: es el nombre de la región. */
	"aria-label": string;
	/**
	 * Flechas de 36px y puntos `md`, o de 44px y puntos `lg`.
	 * @default "md"
	 */
	size?: CarouselSize;
	/** Diapositiva actual, desde 0. Con ella, el carrusel es controlado. */
	index?: number;
	/** Diapositiva inicial, desde 0. */
	defaultIndex?: number;
	onChange?: (index: number) => void;
	labels?: Partial<CarouselLabels>;
	className?: string;
}

/** Lo que hay que arrastrar, en px, para que cuente como pasar de diapositiva. */
const SWIPE = 48;

const ARROW: Record<CarouselSize, string> = { md: "size-9", lg: "size-11" };

/**
 * Pasa diapositivas con flechas, puntos, el teclado (← y → con el foco dentro) y deslizando el dedo. No da la vuelta
 * ni avanza solo.
 */
export function Carousel({
	slides,
	"aria-label": ariaLabel,
	size = "md",
	index,
	defaultIndex = 0,
	onChange,
	labels,
	className,
}: CarouselProps) {
	const l: CarouselLabels = {
		carousel: labels?.carousel ?? defaultStrings.carousel,
		slide: labels?.slide ?? defaultStrings.slide,
		previous: labels?.previous ?? defaultStrings.previousSlide,
		next: labels?.next ?? defaultStrings.nextSlide,
		slideOf: labels?.slideOf ?? defaultStrings.pageOf,
		goTo: labels?.goTo ?? defaultStrings.goToPage,
	};
	const total = slides.length;
	const [raw, setIndex] = useControllable(index, defaultIndex, onChange);
	const at = Math.max(0, Math.min(total - 1, raw));
	const start = useRef<{ x: number; id: number } | null>(null);
	const go = (next: number) => {
		const clamped = Math.max(0, Math.min(total - 1, next));
		if (clamped !== at) setIndex(clamped);
	};

	const onKeyDown = (e: KeyboardEvent<HTMLElement>) => {
		// Las flechas de un campo de texto o de un control interno son suyas
		const target = e.target as HTMLElement;
		if (target.closest("input, textarea, select, [contenteditable=true], [role=slider]")) return;
		if (e.key === "ArrowLeft") {
			e.preventDefault();
			go(at - 1);
		} else if (e.key === "ArrowRight") {
			e.preventDefault();
			go(at + 1);
		}
	};
	const onPointerDown = (e: PointerEvent<HTMLElement>) => {
		if (e.pointerType === "mouse" && e.button !== 0) return;
		start.current = { x: e.clientX, id: e.pointerId };
	};
	const onPointerUp = (e: PointerEvent<HTMLElement>) => {
		const s = start.current;
		start.current = null;
		if (!s || s.id !== e.pointerId) return;
		const dx = e.clientX - s.x;
		if (Math.abs(dx) >= SWIPE) go(at + (dx < 0 ? 1 : -1));
	};

	const arrow = (dir: "previous" | "next") => {
		const prev = dir === "previous";
		return (
			<button
				type="button"
				aria-label={l[dir]}
				// aria-disabled y no `disabled`: si el foco está en la flecha al llegar al extremo, no se pierde
				aria-disabled={(prev ? at === 0 : at === total - 1) || undefined}
				onClick={() => go(at + (prev ? -1 : 1))}
				className={cx(
					"absolute top-1/2 z-10 inline-flex -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border-0 bg-primary text-fg-secondary shadow-[var(--shadow-xs),inset_0_0_0_1px_var(--border-secondary_alt)] transition-colors duration-100 hover:text-fg-secondary_hover focus-visible:shadow-focus-ring focus-visible:outline-none aria-disabled:cursor-not-allowed aria-disabled:opacity-50 aria-disabled:hover:text-fg-secondary",
					ARROW[size],
					prev ? "left-4" : "right-4",
				)}
			>
				<Icon name={prev ? "chevron-left" : "chevron-right"} size={size === "lg" ? 24 : 20} />
			</button>
		);
	};

	return (
		// biome-ignore lint/a11y/useSemanticElements: una región con nombre y rol descrito, no un <section> con encabezado
		<div
			role="region"
			aria-roledescription={l.carousel}
			aria-label={ariaLabel}
			onKeyDown={onKeyDown}
			className={cx("relative overflow-hidden rounded-xl font-body", className)}
		>
			<div
				onPointerDown={onPointerDown}
				onPointerUp={onPointerUp}
				onPointerCancel={() => {
					start.current = null;
				}}
				// Deslizar de lado es del carrusel; el desplazamiento vertical de la página, no
				className="touch-pan-y overflow-hidden"
			>
				<div
					className="flex transition-transform duration-300 ease-out motion-reduce:transition-none"
					style={{ transform: `translateX(-${at * 100}%)` }}
				>
					{slides.map((slide, i) => (
						// biome-ignore lint/a11y/useSemanticElements: un grupo con rol descrito («diapositiva»); un <fieldset> pintaría un marco de formulario
						<div
							// biome-ignore lint/suspicious/noArrayIndexKey: las diapositivas se identifican por su posición
							key={i}
							role="group"
							aria-roledescription={l.slide}
							aria-label={l.slideOf(i + 1, total)}
							aria-hidden={i === at ? undefined : true}
							inert={i === at ? undefined : true}
							className="w-full flex-none"
						>
							{slide}
						</div>
					))}
				</div>
			</div>
			{arrow("previous")}
			{arrow("next")}
			<div className="absolute inset-x-0 bottom-4 z-10 flex justify-center">
				<PaginationDots
					total={total}
					current={at + 1}
					onChange={(page) => go(page - 1)}
					size={size}
					framed
					labels={{ goTo: l.goTo }}
					aria-label={ariaLabel}
				/>
			</div>
		</div>
	);
}
