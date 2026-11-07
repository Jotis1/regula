import { cx } from "../internal/cx.js";
import { defaultStrings } from "../internal/strings.js";
import { Icon } from "./Icon.js";

export interface PagerLink {
	href: string;
	/** El nombre de la página a la que lleva. */
	label: string;
}

export interface PagerLabels {
	/** @default "Anterior" */
	previous: string;
	/** @default "Siguiente" */
	next: string;
}

export interface PagerProps {
	/** La página anterior. */
	prev?: PagerLink;
	/** La página siguiente. */
	next?: PagerLink;
	/** Textos que trae el componente, para sustituirlos. */
	labels?: Partial<PagerLabels>;
	/**
	 * Nombre de la navegación para lectores de pantalla.
	 * @default "Anterior y siguiente"
	 */
	"aria-label"?: string;
	className?: string;
}

const LINK =
	"flex flex-1 basis-60 flex-col gap-0.5 rounded-xl p-4 text-primary no-underline shadow-[inset_0_0_0_1px_var(--border-secondary)] hover:bg-primary_hover focus-visible:shadow-focus-ring focus-visible:outline-none";
const DIRECTION = "flex items-center gap-1.5 text-xs text-tertiary";

/**
 * Anterior y siguiente al final de una página: una tarjeta por dirección, con la flecha hacia donde lleva y el nombre de
 * la página. Sin ninguna de las dos no pinta nada. Pásale `className` para separarlo del contenido.
 */
export function Pager({ prev, next, labels, className, ...rest }: PagerProps) {
	if (!prev && !next) return null;
	const t = { previous: defaultStrings.previous, next: defaultStrings.next, ...labels };
	return (
		<nav
			aria-label={rest["aria-label"] ?? defaultStrings.prevNext}
			className={cx("flex flex-col gap-3 md:flex-row md:flex-wrap md:gap-4", className)}
		>
			{prev ? (
				<a href={prev.href} rel="prev" className={LINK}>
					<span className={DIRECTION}>
						<Icon name="arrow-left" size={16} className="text-fg-quaternary" />
						{t.previous}
					</span>
					<span className="text-md font-semibold">{prev.label}</span>
				</a>
			) : null}
			{next ? (
				<a href={next.href} rel="next" className={cx(LINK, "items-end text-right")}>
					<span className={DIRECTION}>
						{t.next}
						<Icon name="arrow-right" size={16} className="text-fg-quaternary" />
					</span>
					<span className="text-md font-semibold">{next.label}</span>
				</a>
			) : null}
		</nav>
	);
}
