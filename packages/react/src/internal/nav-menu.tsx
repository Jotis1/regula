// Plantillas de los menús de MarketingNav (design: «paneles con plantillas exportadas»). Se exportan juntas en el
// objeto `NavMenu` (`NavMenu.Item`, `NavMenu.Section`, `NavMenu.Card`), como `SidebarCards`.
import type { ReactNode } from "react";
import { cx } from "./cx.js";
import { type IconProp, iconSlot } from "./icon.js";

export interface NavMenuItemProps {
	href: string;
	title: ReactNode;
	/** Una o dos líneas bajo el título. */
	description?: ReactNode;
	/** Icono de 24 en el color de la marca: un nombre del núcleo o un nodo. */
	icon?: IconProp;
	/**
	 * `plain` el icono suelto · `boxed` dentro de una caja de 40 con borde (los menús de cuatro columnas del Figma).
	 * @default "plain"
	 */
	iconStyle?: "plain" | "boxed";
	/** Tras el título, como «¡Contratamos!» o «Nuevo». */
	badge?: ReactNode;
	className?: string;
}

/**
 * Elemento de un menú de `MarketingNav` (Figma `_Nav menu item`): icono, título y descripción, o solo el título como
 * enlace corto. Es un enlace con el fondo `bg-primary_hover` al pasar.
 */
export function NavMenuItem({
	href,
	title,
	description,
	icon,
	iconStyle = "plain",
	badge,
	className,
}: NavMenuItemProps) {
	const short = !description && !icon;
	return (
		<a
			href={href}
			className={cx(
				"flex gap-3 rounded-lg font-body no-underline transition-colors duration-100 hover:bg-primary_hover focus-visible:shadow-focus-ring focus-visible:outline-none",
				short
					? "px-0 py-1.5 text-md font-semibold text-tertiary hover:bg-transparent hover:text-tertiary_hover"
					: "p-3",
				className,
			)}
		>
			{icon ? (
				iconStyle === "boxed" ? (
					<span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary text-fg-secondary shadow-[var(--shadow-xs-skeuomorphic),inset_0_0_0_1px_var(--border-primary)]">
						{iconSlot(icon, 20)}
					</span>
				) : (
					<span className="flex shrink-0 pt-0.5 text-fg-brand-primary">{iconSlot(icon, 24)}</span>
				)
			) : null}
			{short ? (
				title
			) : (
				<span className="flex min-w-0 flex-col gap-1">
					<span className="flex flex-wrap items-center gap-2 text-md font-semibold text-primary">
						{title}
						{badge}
					</span>
					{description ? <span className="text-sm text-tertiary">{description}</span> : null}
				</span>
			)}
		</a>
	);
}

export interface NavMenuSectionProps {
	/** Título de la columna, en el color de la marca. */
	title?: ReactNode;
	/** Enlace a la derecha del título («Todos los tutoriales»). */
	action?: ReactNode;
	children: ReactNode;
	className?: string;
}

/** Una columna de un menú: su título y los elementos, en lista. */
export function NavMenuSection({ title, action, children, className }: NavMenuSectionProps) {
	return (
		<section className={cx("flex min-w-0 flex-col gap-2 font-body", className)}>
			{title || action ? (
				<div className="flex items-center justify-between gap-3">
					{title ? (
						<h3 className="m-0 text-sm font-semibold text-brand-secondary">{title}</h3>
					) : (
						<span />
					)}
					{action}
				</div>
			) : null}
			<div className="flex flex-col gap-0.5">{children}</div>
		</section>
	);
}

export interface NavMenuCardProps {
	href?: string;
	/** La imagen o el dibujo de la tarjeta (el paquete no trae fotos). */
	media?: ReactNode;
	title: ReactNode;
	description?: ReactNode;
	/** Acciones bajo el texto: «Descartar», «Ver vídeo»… */
	actions?: ReactNode;
	/**
	 * `vertical` la imagen arriba (la tarjeta destacada) · `horizontal` la imagen a la izquierda (entradas y vídeos).
	 * @default "vertical"
	 */
	layout?: "vertical" | "horizontal";
	className?: string;
}

/**
 * Tarjeta de un menú de `MarketingNav` (Figma `_Nav menu card`): una novedad, una entrada del blog o un vídeo, con su
 * imagen. Con `href`, el título es el enlace.
 */
export function NavMenuCard({
	href,
	media,
	title,
	description,
	actions,
	layout = "vertical",
	className,
}: NavMenuCardProps) {
	const horizontal = layout === "horizontal";
	return (
		<article
			className={cx(
				"relative flex gap-3 rounded-lg font-body",
				horizontal ? "flex-row items-start p-2 hover:bg-primary_hover" : "flex-col",
				className,
			)}
		>
			{media ? (
				<div
					className={cx(
						"shrink-0 overflow-hidden rounded-md bg-tertiary [&>img]:size-full [&>img]:object-cover",
						horizontal ? "h-20 w-34" : "aspect-[3/2] w-full",
					)}
				>
					{media}
				</div>
			) : null}
			<div className="flex min-w-0 flex-col gap-1">
				<p className="m-0 line-clamp-2 text-sm font-semibold text-primary">
					{href ? (
						<a
							href={href}
							className="text-inherit no-underline after:absolute after:inset-0 after:rounded-lg focus-visible:outline-none focus-visible:after:shadow-focus-ring"
						>
							{title}
						</a>
					) : (
						title
					)}
				</p>
				{description ? <p className="m-0 line-clamp-2 text-sm text-tertiary">{description}</p> : null}
				{actions ? <div className="relative mt-2 flex items-center gap-3">{actions}</div> : null}
			</div>
		</article>
	);
}

/** Las plantillas de los menús de `MarketingNav`. */
export const NavMenu = { Item: NavMenuItem, Section: NavMenuSection, Card: NavMenuCard };
