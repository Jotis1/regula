import type { ReactNode } from "react";
import { cx } from "../internal/cx.js";

export interface LinkCardProps {
	/** A dónde lleva la card entera. */
	href: string;
	/** El nombre, en la primera línea del enlace. */
	title: ReactNode;
	/** Una línea de apoyo bajo el título, en `text-tertiary`. Forma parte del nombre accesible del enlace. */
	description?: ReactNode;
	/**
	 * Una muestra sobre el texto, a todo el ancho. Va fuera del enlace, inerte y oculta a lectores de pantalla: puede
	 * contener botones o enlaces dibujados sin que reciban foco ni clics.
	 */
	preview?: ReactNode;
	/**
	 * El elemento raíz: `li` si la card es un elemento de una lista.
	 * @default "div"
	 */
	as?: "div" | "li";
	className?: string;
}

const CARD =
	"group relative flex flex-col overflow-hidden rounded-xl border border-secondary text-primary transition-shadow duration-100 has-[a:hover]:border-primary has-[a:hover]:shadow-sm has-[a:focus-visible]:shadow-focus-ring";
// El enlace estira su ::after sobre toda la card: así pulsar en cualquier punto, también sobre la muestra, lo abre
const LINK =
	"flex flex-1 flex-col gap-0.5 p-4 text-primary no-underline outline-none after:absolute after:inset-0 after:content-['']";

/**
 * Card cuyo enlace cubre toda su superficie. La muestra de arriba no es interactiva y queda fuera del enlace (HTML
 * válido, sin nada interactivo dentro de un enlace); el foco y el ratón marcan la card entera.
 */
export function LinkCard({ href, title, description, preview, as: Root = "div", className }: LinkCardProps) {
	return (
		<Root className={cx(CARD, className)}>
			{preview ? (
				<div aria-hidden="true" inert className="pointer-events-none">
					{preview}
				</div>
			) : null}
			<a href={href} className={LINK}>
				<span className="text-md font-semibold group-hover:underline">{title}</span>
				{description ? <span className="text-sm text-tertiary">{description}</span> : null}
			</a>
		</Root>
	);
}
