"use client";

import { type ReactNode, useId, useState } from "react";
import { cx } from "../internal/cx.js";
import { defaultStrings } from "../internal/strings.js";
import { Badge } from "./Badge.js";
import { Button } from "./Button.js";
import { Icon, type IconName } from "./Icon.js";
import { Slideout } from "./Slideout.js";

export type HeaderNavType = "simple" | "dual-tier" | "tabs" | "centered";

export interface HeaderNavItem {
	label: ReactNode;
	href: string;
	/** Página o sección actual: `aria-current="page"`. */
	current?: boolean;
	/** Contador a la derecha, en un `Badge` gris. */
	badge?: ReactNode;
	/** Icono del menú móvil (24px). En el escritorio no se pinta. */
	icon?: IconName;
	/**
	 * Subsecciones. En `dual-tier`, `tabs` y `centered`, las de la sección actual van en una segunda fila; en el menú móvil,
	 * la sección se despliega.
	 */
	children?: HeaderNavItem[];
}

export interface HeaderNavLabels {
	/** Nombre de la navegación principal. @default "Principal" */
	nav: string;
	/** Nombre de la segunda fila de navegación. @default "Subsecciones" */
	subnav: string;
	/** Nombre del botón que abre el menú móvil. @default "Abrir menú" */
	openMenu: string;
}

export interface HeaderNavMobile {
	/** Enlaces pegados abajo del panel, como Ajustes o Soporte. */
	footerItems?: HeaderNavItem[];
	/** Lo último del panel, como la ficha de la cuenta. */
	footer?: ReactNode;
}

export interface HeaderNavProps {
	/**
	 * `simple` (una fila) · `dual-tier` (una segunda fila con las subsecciones y el buscador) · `tabs` (la segunda fila,
	 * como pestañas) · `centered` (la navegación al centro y la segunda fila centrada).
	 * @default "simple"
	 */
	type?: HeaderNavType;
	/** La marca, a la izquierda: un `AppIcon` con el nombre, por ejemplo. */
	brand: ReactNode;
	/** Las secciones. Con `children`, tienen subsecciones. */
	items: HeaderNavItem[];
	/** Buscador: en la segunda fila de `dual-tier` y arriba del menú móvil. */
	search?: ReactNode;
	/** Botones e iconos de la derecha. */
	actions?: ReactNode;
	/** Lo de la esquina: un `Dropdown` con la cuenta, un botón de entrar… */
	account?: ReactNode;
	/** El menú móvil (con la cabecera por debajo de 1024px de ancho): enlaces de pie y su última pieza. */
	mobile?: HeaderNavMobile;
	labels?: Partial<HeaderNavLabels>;
	className?: string;
}

const WRAP = "mx-auto w-full max-w-[1280px] px-8";
const BORDER = "shadow-[inset_0_-1px_0_var(--border-secondary)]";

const PILL =
	"inline-flex items-center gap-2 rounded-md px-3 py-2 font-semibold text-secondary no-underline transition-colors duration-100 hover:bg-primary_hover hover:text-secondary_hover focus-visible:shadow-focus-ring focus-visible:outline-none aria-[current=page]:bg-primary_hover aria-[current=page]:text-secondary_hover";
const TAB =
	"inline-flex items-center gap-2 px-1 pt-3 pb-3 font-semibold text-quaternary no-underline transition-colors duration-100 hover:text-secondary focus-visible:rounded-sm focus-visible:shadow-focus-ring focus-visible:outline-none aria-[current=page]:text-brand-secondary aria-[current=page]:shadow-[inset_0_-2px_0_var(--fg-brand-primary_alt)] aria-[current=page]:focus-visible:shadow-[inset_0_-2px_0_var(--fg-brand-primary_alt),var(--focus-ring-shadow)]";

function NavLinks({
	items,
	label,
	className,
	linkClass,
	gap = "gap-1",
}: {
	items: HeaderNavItem[];
	label: string;
	className?: string;
	linkClass: string;
	gap?: string;
}) {
	return (
		<nav aria-label={label} className={className}>
			<ul className={cx("m-0 flex list-none items-center p-0", gap)}>
				{items.map((item, i) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: lista fija; las etiquetas pueden ser nodos
					<li key={i}>
						<a
							href={item.href}
							aria-current={item.current ? "page" : undefined}
							className={linkClass}
						>
							{item.label}
							{item.badge != null ? (
								<Badge size="sm" color="gray">
									{item.badge}
								</Badge>
							) : null}
						</a>
					</li>
				))}
			</ul>
		</nav>
	);
}

const MOBILE_ITEM =
	"flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-md font-semibold text-secondary no-underline [&_svg]:text-fg-quaternary";
const MOBILE_LINK =
	"cursor-pointer border-0 bg-transparent transition-colors duration-100 hover:bg-primary_hover hover:text-secondary_hover focus-visible:shadow-focus-ring focus-visible:outline-none aria-[current=page]:bg-secondary_hover aria-[current=page]:text-secondary_hover";

/** Una sección del menú móvil: un enlace, o un botón que despliega sus subsecciones. */
function MobileSection({ item, onNavigate }: { item: HeaderNavItem; onNavigate: () => void }) {
	const id = useId();
	const [open, setOpen] = useState(Boolean(item.current && item.children?.length));
	const content = (
		<>
			{item.icon ? <Icon name={item.icon} size={24} /> : null}
			{item.label}
			{item.badge != null ? (
				<Badge size="sm" color="gray" className="ml-auto">
					{item.badge}
				</Badge>
			) : null}
		</>
	);
	if (!item.children?.length)
		return (
			<a
				href={item.href}
				aria-current={item.current ? "page" : undefined}
				onClick={onNavigate}
				className={cx(MOBILE_ITEM, MOBILE_LINK)}
			>
				{content}
			</a>
		);
	return (
		<>
			<button
				type="button"
				aria-expanded={open}
				aria-controls={id}
				onClick={() => setOpen(!open)}
				className={cx(MOBILE_ITEM, MOBILE_LINK, open && "bg-secondary_hover text-secondary_hover")}
			>
				{content}
				<span className={cx("inline-flex flex-none", item.badge == null && "ml-auto")}>
					<Icon name={open ? "chevron-up" : "chevron-down"} size={20} />
				</span>
			</button>
			<ul id={id} hidden={!open} className="m-0 flex list-none flex-col gap-0.5 p-0">
				{item.children.map((child, i) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: lista fija; las etiquetas pueden ser nodos
					<li key={i}>
						<a
							href={child.href}
							aria-current={child.current ? "page" : undefined}
							onClick={onNavigate}
							className={cx(MOBILE_ITEM, MOBILE_LINK, "pl-12")}
						>
							{child.label}
						</a>
					</li>
				))}
			</ul>
		</>
	);
}

/**
 * Cabecera de una app con la marca, las secciones, las acciones y la cuenta, en cuatro tipos. Escritorio y móvil van en
 * el HTML y la CSS elige por el ancho de la propia cabecera (1024px, una consulta de contenedor, que a pantalla completa
 * es el `lg` de la página); por debajo hay un botón de menú que abre un panel desde la izquierda.
 */
export function HeaderNav({
	type = "simple",
	brand,
	items,
	search,
	actions,
	account,
	mobile,
	labels,
	className,
}: HeaderNavProps) {
	const l: HeaderNavLabels = {
		nav: labels?.nav ?? defaultStrings.mainNav,
		subnav: labels?.subnav ?? defaultStrings.subsections,
		openMenu: labels?.openMenu ?? defaultStrings.openMenu,
	};
	const [menuOpen, setMenuOpen] = useState(false);
	const centered = type === "centered";
	const sub = items.find((item) => item.current && item.children?.length)?.children;
	const second = type !== "simple" && sub ? sub : undefined;
	const close = () => setMenuOpen(false);

	const right = (
		<div className={cx("flex items-center gap-3", centered && "justify-end")}>
			{actions}
			{account}
		</div>
	);

	return (
		<header className={cx("@container bg-primary font-body", BORDER, className)}>
			{/* Escritorio */}
			<div className="@max-5xl:hidden">
				<div className={cx(type !== "tabs" && second && BORDER)}>
					<div
						className={cx(
							WRAP,
							"h-16 items-center gap-8",
							centered ? "grid grid-cols-[1fr_auto_1fr]" : "flex",
						)}
					>
						<div className="flex flex-none items-center">{brand}</div>
						<NavLinks
							items={items}
							label={l.nav}
							linkClass={cx(PILL, "text-md")}
							className={centered ? "" : "flex-1"}
						/>
						{right}
					</div>
				</div>
				{second ? (
					<div>
						<div
							className={cx(
								WRAP,
								"flex items-center gap-8",
								type === "tabs" ? "h-11" : "h-16",
								centered && "justify-center",
							)}
						>
							<NavLinks
								items={second}
								label={l.subnav}
								linkClass={cx(
									type === "tabs" ? TAB : PILL,
									type === "tabs" ? "text-md" : "text-sm",
								)}
								gap={type === "tabs" ? "gap-3" : undefined}
								className={type === "dual-tier" ? "flex-1" : ""}
							/>
							{type === "dual-tier" && search ? (
								<div className="w-[320px] flex-none">{search}</div>
							) : null}
						</div>
					</div>
				) : null}
			</div>

			{/* Móvil */}
			<div className="@5xl:hidden">
				<div className="flex h-16 items-center justify-between gap-4 px-4">
					<div className="flex min-w-0 items-center">{brand}</div>
					<Button
						hierarchy="tertiary"
						iconOnly="menu-01"
						label={l.openMenu}
						aria-expanded={menuOpen}
						onClick={() => setMenuOpen(true)}
					/>
				</div>
				<Slideout open={menuOpen} side="left" width={296} title={brand} onClose={close}>
					{search ? <div>{search}</div> : null}
					<nav aria-label={l.nav}>
						<ul className="m-0 flex list-none flex-col gap-0.5 p-0">
							{items.map((item, i) => (
								// biome-ignore lint/suspicious/noArrayIndexKey: lista fija; las etiquetas pueden ser nodos
								<li key={i} className="flex flex-col gap-0.5">
									<MobileSection item={item} onNavigate={close} />
								</li>
							))}
						</ul>
					</nav>
					{mobile?.footerItems?.length || mobile?.footer ? (
						<div className="mt-auto flex flex-col gap-4">
							{mobile?.footerItems?.length ? (
								<ul className="m-0 flex list-none flex-col gap-0.5 p-0">
									{mobile.footerItems.map((item, i) => (
										// biome-ignore lint/suspicious/noArrayIndexKey: lista fija; las etiquetas pueden ser nodos
										<li key={i}>
											<a
												href={item.href}
												aria-current={item.current ? "page" : undefined}
												onClick={close}
												className={cx(MOBILE_ITEM, MOBILE_LINK)}
											>
												{item.icon ? <Icon name={item.icon} size={24} /> : null}
												{item.label}
												{item.badge != null ? (
													<span className="ml-auto">{item.badge}</span>
												) : null}
											</a>
										</li>
									))}
								</ul>
							) : null}
							{mobile?.footer}
						</div>
					) : null}
				</Slideout>
			</div>
		</header>
	);
}
