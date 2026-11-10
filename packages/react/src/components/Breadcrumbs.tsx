import { Fragment, type ReactNode } from "react";
import { cx } from "../internal/cx.js";
import { defaultStrings } from "../internal/strings.js";
import { Icon, type IconName, iconSlot } from "./Icon.js";

export interface BreadcrumbItem {
	label: string;
	href?: string;
	/** Icono en lugar del texto (el texto queda para lectores de pantalla). Pensado para el primero, `home-line`. */
	icon?: IconName | ReactNode;
}

export interface BreadcrumbsProps {
	/** Ruta desde el inicio. El último es la página actual: se pinta en `text-brand-secondary` y sin enlace. */
	items: BreadcrumbItem[];
	/**
	 * Nombre de la navegación para lectores de pantalla.
	 * @default "Migas de pan"
	 */
	"aria-label"?: string;
	className?: string;
}

const CRUMB = "inline-flex items-center rounded-md px-2 py-1";

/** Ruta de navegación encima del título de página. */
export function Breadcrumbs({ items, className, ...rest }: BreadcrumbsProps) {
	return (
		<nav aria-label={rest["aria-label"] ?? defaultStrings.breadcrumbs} className={className}>
			<ol className="m-0 flex list-none items-center gap-2 p-0 font-body text-sm font-semibold text-quaternary [&_svg]:text-fg-quaternary">
				{items.map((item, i) => {
					const last = i === items.length - 1;
					const content =
						item.icon && !last ? (
							<>
								{iconSlot(item.icon, 20)}
								<span className="sr-only">{item.label}</span>
							</>
						) : (
							item.label
						);
					return (
						// biome-ignore lint/suspicious/noArrayIndexKey: la ruta es una lista fija; las etiquetas pueden repetirse
						<Fragment key={i}>
							{i > 0 ? (
								<li aria-hidden="true" className="flex">
									<Icon name="chevron-right" size={16} />
								</li>
							) : null}
							<li className="flex">
								{last ? (
									<span aria-current="page" className={cx(CRUMB, "text-brand-secondary")}>
										{item.label}
									</span>
								) : item.href ? (
									<a
										href={item.href}
										className={cx(
											CRUMB,
											"text-inherit no-underline transition-colors duration-100 hover:bg-primary_hover hover:text-tertiary_hover focus-visible:shadow-focus-ring focus-visible:outline-none",
										)}
									>
										{content}
									</a>
								) : (
									<span className={CRUMB}>{content}</span>
								)}
							</li>
						</Fragment>
					);
				})}
			</ol>
		</nav>
	);
}
