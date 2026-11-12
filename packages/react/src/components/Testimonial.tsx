import { ArrowLeft, ArrowRight } from "@untitledui/icons";
import type { ReactNode } from "react";
import { cx } from "../internal/cx.js";
import { Rating } from "./Rating.js";

export interface TestimonialProps {
	/** La cita, sin comillas: las pone el componente. */
	quote?: ReactNode;
	name: ReactNode;
	/** Cargo y empresa: «Diseñadora, Capas». */
	role?: ReactNode;
	/** Segunda línea: «Agencia de diseño web». */
	company?: ReactNode;
	/** Estrellas, de 0 a 5. Sin ella, no hay estrellas. */
	rating?: number;
	/** La foto del fondo (un nodo; si es decorativa, con \`alt=""\`). */
	image?: ReactNode;
	/** \`floating\` el panel separado de los bordes y con radio · \`full-width\` a todo el ancho. @default "floating" */
	type?: "floating" | "full-width";
	/** \`sm\` texto y estrellas pequeños · \`md\` la cita grande. @default "md" */
	size?: "sm" | "md";
	/** Con ellas, las flechas para pasar de testimonio (en un carrusel propio). */
	onPrevious?: () => void;
	onNext?: () => void;
	labels?: { previous?: string; next?: string };
	className?: string;
}

const ARROW =
	"inline-flex cursor-pointer items-center justify-center rounded-full border-0 bg-transparent text-white shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--fg-white)_50%,transparent)] outline-none transition-colors hover:bg-overlay/40 focus-visible:shadow-focus-ring";

/**
 * Testimonio sobre una foto (Figma `_Quote image bottom panel`, `1376:1163`): un panel de cristal abajo con la cita,
 * las estrellas, el nombre, el cargo y, si las pasas, las flechas. Flotante o a todo el ancho, en dos tamaños.
 */
export function Testimonial({
	quote,
	name,
	role,
	company,
	rating,
	image,
	type = "floating",
	size = "md",
	onPrevious,
	onNext,
	labels,
	className,
}: TestimonialProps) {
	const md = size === "md";
	const stars =
		rating !== undefined ? <Rating value={rating} color="white" size={md ? "md" : "sm"} /> : null;
	const person = (
		<div className="flex min-w-0 flex-col gap-1">
			<p
				className={cx(
					"m-0 font-display font-semibold text-white",
					md ? "text-display-xs" : "text-xl",
				)}
			>
				{name}
			</p>
			{role ? <p className="m-0 text-md font-semibold text-white">{role}</p> : null}
			{company ? <p className="m-0 text-sm font-medium text-white">{company}</p> : null}
		</div>
	);
	const arrows =
		onPrevious || onNext ? (
			<div className="flex gap-4">
				<button
					type="button"
					aria-label={labels?.previous ?? "Testimonio anterior"}
					onClick={onPrevious}
					className={cx(ARROW, md ? "size-12" : "size-10")}
				>
					<ArrowLeft size={md ? 24 : 20} />
				</button>
				<button
					type="button"
					aria-label={labels?.next ?? "Testimonio siguiente"}
					onClick={onNext}
					className={cx(ARROW, md ? "size-12" : "size-10")}
				>
					<ArrowRight size={md ? 24 : 20} />
				</button>
			</div>
		) : null;
	return (
		<figure
			className={cx(
				"@container relative m-0 flex min-h-[420px] flex-col justify-end overflow-hidden font-body",
				type === "floating" ? "p-4 @md:p-6" : "",
				className,
			)}
		>
			<div className="absolute inset-0 bg-tertiary [&>img]:size-full [&>img]:object-cover">{image}</div>
			<div
				className={cx(
					"relative flex flex-col gap-6 bg-overlay/60 p-5 backdrop-blur-md @md:p-6",
					type === "floating"
						? "rounded-2xl shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--fg-white)_30%,transparent)]"
						: "shadow-[inset_0_1px_0_color-mix(in_srgb,var(--fg-white)_30%,transparent)]",
				)}
			>
				{md ? null : stars}
				{quote ? (
					<blockquote
						className={cx(
							"m-0 font-semibold text-white",
							md ? "font-display text-display-xs @max-md:text-xl" : "text-lg",
						)}
					>
						“{quote}”
					</blockquote>
				) : null}
				<figcaption className="flex flex-wrap items-end justify-between gap-4">
					{person}
					{md ? (
						<div className="flex flex-col items-end gap-4">
							{stars}
							{arrows}
						</div>
					) : (
						arrows
					)}
				</figcaption>
			</div>
		</figure>
	);
}
