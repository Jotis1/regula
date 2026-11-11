"use client";

import { type ReactNode, useId, useRef, useState } from "react";
import { Button as AriaButton, Dialog, DialogTrigger, Popover } from "react-aria-components";
import { cx } from "../internal/cx.js";
import { defaultStrings } from "../internal/strings.js";
import { Icon } from "./Icon.js";

export type MarketingNavMenu = "dropdown" | "full-width";

/**
 * La disposición del panel, como los tipos del Figma: siete de menú desplegable y siete a todo el ancho; con
 * `floating`, la cabecera flota en una caja (los «Floating …» del Figma). Catorce disposiciones y `floating` cubren los
 * veinte tipos.
 */
export type MarketingNavType =
	| "simple"
	| "featured-card"
	| "simple-with-footer"
	| "2-col-with-links-and-footer"
	| "simple-2-col"
	| "featured-posts"
	| "simple-2-col-with-footer"
	| "2-col-with-sidebar"
	| "4-col-slim-with-footer"
	| "3-col-with-sidebar"
	| "blog-posts-with-footer"
	| "4-col-with-footer"
	| "blog-posts-with-sidebar"
	| "2-col-with-links";

export interface MarketingNavPanel {
	/** Las columnas del panel: `NavMenu.Section` con `NavMenu.Item`, o `NavMenu.Card`. */
	columns: ReactNode[];
	/** Cabecera del panel (título y descripción), encima de las columnas. */
	header?: ReactNode;
	/** Columna aparte con fondo `bg-secondary`: la tarjeta destacada, entradas, vídeos o enlaces. */
	aside?: ReactNode;
	/** Pie con fondo `bg-secondary`: enlaces o botones. */
	footer?: ReactNode;
}

export interface MarketingNavItem {
	label: string;
	/** Un enlace; o, con `panel`, un botón que abre su menú. */
	href?: string;
	panel?: MarketingNavPanel;
	current?: boolean;
}

export interface MarketingNavLabels {
	nav: string;
	openMenu: string;
	closeMenu: string;
}

export interface MarketingNavProps {
	/** La marca, normalmente un enlace a la portada. */
	brand: ReactNode;
	items: MarketingNavItem[];
	/** Acciones a la derecha («Entrar», «Empezar»). En móvil van al pie del menú, a todo el ancho. */
	actions?: ReactNode;
	/**
	 * `dropdown` el panel bajo su botón · `full-width` el panel a todo el ancho de la cabecera.
	 * @default "dropdown"
	 */
	menu?: MarketingNavMenu;
	/** La disposición de los paneles (los tipos del Figma). @default "simple" */
	type?: MarketingNavType;
	/** La cabecera flota en una caja con borde y sombra. */
	floating?: boolean;
	/** Enlaces del pie del menú móvil, en dos columnas. */
	mobileLinks?: { label: string; href: string }[];
	labels?: Partial<MarketingNavLabels>;
	/** Menú abierto de inicio, en línea y sin popover ni foco: para vistas previas y capturas (la etiqueta del apartado). */
	previewItem?: string;
	className?: string;
}

const WRAP = "mx-auto w-full max-w-[1280px] px-8 @max-5xl:px-4";
const LINK =
	"inline-flex cursor-pointer items-center gap-1 rounded-md border-0 bg-transparent px-2 py-1 font-body text-md font-semibold text-secondary no-underline outline-none transition-colors duration-100 hover:text-secondary_hover focus-visible:shadow-focus-ring aria-[current=page]:text-brand-secondary";

// Ancho del panel desplegable por disposición (del Figma, a 1440)
const DROPDOWN_WIDTH: Partial<Record<MarketingNavType, string>> = {
	simple: "w-84",
	"simple-with-footer": "w-84",
	"featured-card": "w-160",
	"simple-2-col": "w-160",
	"simple-2-col-with-footer": "w-160",
	"featured-posts": "w-192",
	"2-col-with-links-and-footer": "w-200",
};
// La columna aparte va a la izquierda en el blog con categorías
const ASIDE_LEFT = new Set<MarketingNavType>(["blog-posts-with-sidebar"]);

function PanelBody({
	panel,
	menu,
	type,
}: {
	panel: MarketingNavPanel;
	menu: MarketingNavMenu;
	type: MarketingNavType;
}) {
	const full = menu === "full-width";
	const asideLeft = ASIDE_LEFT.has(type);
	const columns = (
		<div
			className="grid min-w-0 flex-1 gap-x-8 gap-y-4"
			style={{ gridTemplateColumns: `repeat(${panel.columns.length}, minmax(0, 1fr))` }}
		>
			{panel.columns.map((c, i) => (
				// biome-ignore lint/suspicious/noArrayIndexKey: columnas fijas
				<div key={i} className="min-w-0">
					{c}
				</div>
			))}
		</div>
	);
	const aside = panel.aside ? (
		<div
			className={cx(
				"min-w-0 bg-secondary",
				full ? "rounded-2xl p-5" : "p-5",
				full ? "w-[392px] shrink-0" : "w-76 shrink-0",
				asideLeft && (full ? "w-60 bg-transparent p-0" : ""),
			)}
		>
			{panel.aside}
		</div>
	) : null;
	return (
		<div className="flex flex-col">
			<div className={cx(full ? cx(WRAP, "flex gap-8 py-8") : "flex")}>
				{asideLeft ? aside : null}
				<div className={cx("flex min-w-0 flex-1 flex-col gap-5", full ? "" : "p-3")}>
					{panel.header ? <div className={full ? "" : "px-3 pt-2"}>{panel.header}</div> : null}
					{columns}
				</div>
				{asideLeft ? null : aside}
			</div>
			{panel.footer ? (
				full ? (
					<div className={cx(WRAP, "pb-8")}>
						<div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-secondary px-8 py-5">
							{panel.footer}
						</div>
					</div>
				) : (
					<div className="flex flex-wrap items-center justify-between gap-4 border-t border-secondary bg-secondary px-5 py-4">
						{panel.footer}
					</div>
				)
			) : null}
		</div>
	);
}

/** Un elemento de escritorio: un enlace o un botón con su menú en un popover. */
function DesktopItem({
	item,
	menu,
	type,
	headerRef,
	preview,
}: {
	item: MarketingNavItem;
	menu: MarketingNavMenu;
	type: MarketingNavType;
	headerRef: React.RefObject<HTMLElement | null>;
	preview?: boolean;
}) {
	const [open, setOpen] = useState(false);
	if (!item.panel)
		return (
			<a href={item.href} aria-current={item.current ? "page" : undefined} className={LINK}>
				{item.label}
			</a>
		);
	const full = menu === "full-width";
	const panelClass = cx(
		"overflow-hidden bg-primary font-body outline-none",
		full
			? "shadow-[var(--shadow-lg),inset_0_1px_0_var(--border-secondary)]"
			: cx(
					"rounded-xl shadow-[var(--shadow-lg),inset_0_0_0_1px_var(--border-secondary_alt)]",
					DROPDOWN_WIDTH[type] ?? "w-160",
				),
	);
	if (preview)
		return (
			<>
				<span className={LINK}>
					{item.label}
					<Icon name="chevron-up" size={16} className="text-fg-quaternary" />
				</span>
				{/* La vista previa: el panel en línea, bajo el botón o a todo el ancho de la cabecera */}
				<div className={cx("absolute z-10", full ? "inset-x-0 top-full" : "top-full mt-1")}>
					<div className={panelClass}>
						<PanelBody panel={item.panel} menu={menu} type={type} />
					</div>
				</div>
			</>
		);
	return (
		<DialogTrigger isOpen={open} onOpenChange={setOpen}>
			<AriaButton className={LINK}>
				{item.label}
				<Icon name={open ? "chevron-up" : "chevron-down"} size={16} className="text-fg-quaternary" />
			</AriaButton>
			<Popover
				triggerRef={full ? headerRef : undefined}
				placement={full ? "bottom" : "bottom start"}
				offset={full ? 0 : 12}
				className={cx(
					"z-40 outline-none",
					full ? "w-[var(--trigger-width)]" : "max-w-[calc(100vw-32px)]",
				)}
			>
				<Dialog aria-label={item.label} className={panelClass}>
					<PanelBody panel={item.panel} menu={menu} type={type} />
				</Dialog>
			</Popover>
		</DialogTrigger>
	);
}

/** Una sección del menú móvil: un enlace o un botón que despliega su panel en una caja. */
function MobileItem({ item }: { item: MarketingNavItem }) {
	const id = useId();
	const [open, setOpen] = useState(false);
	const row =
		"flex w-full cursor-pointer items-center justify-between gap-3 border-0 bg-transparent px-4 py-3 text-left font-body text-md font-semibold text-primary no-underline outline-none focus-visible:shadow-focus-ring";
	if (!item.panel)
		return (
			<a href={item.href} aria-current={item.current ? "page" : undefined} className={row}>
				{item.label}
			</a>
		);
	return (
		<>
			<button
				type="button"
				aria-expanded={open}
				aria-controls={id}
				onClick={() => setOpen(!open)}
				className={row}
			>
				{item.label}
				<Icon name={open ? "chevron-up" : "chevron-down"} size={20} className="text-fg-quaternary" />
			</button>
			<div
				id={id}
				hidden={!open}
				className="mx-4 mb-2 flex flex-col gap-4 rounded-xl p-2 shadow-[inset_0_0_0_1px_var(--border-secondary)]"
			>
				{item.panel.columns.map((c, i) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: columnas fijas
					<div key={i}>{c}</div>
				))}
				{item.panel.aside ? (
					<div className="rounded-lg bg-secondary p-3">{item.panel.aside}</div>
				) : null}
			</div>
		</>
	);
}

/**
 * Cabecera de una web de marketing (Figma `Dropdown header navigation`, `1288:26576`, y `Full-width header
 * navigation`, `1287:2392`): la marca, los apartados (enlaces o menús) y las acciones. Los menús se abren en un popover
 * de React Aria, bajo su botón o a todo el ancho; Escape los cierra y el foco vuelve al botón. Por debajo de 1024 px de
 * ancho de la cabecera, un botón abre el menú móvil, con cada menú desplegable dentro.
 */
export function MarketingNav({
	brand,
	items,
	actions,
	menu = "dropdown",
	type = "simple",
	floating,
	mobileLinks,
	labels,
	previewItem,
	className,
}: MarketingNavProps) {
	const l: MarketingNavLabels = {
		nav: labels?.nav ?? defaultStrings.mainNav,
		openMenu: labels?.openMenu ?? defaultStrings.openMenu,
		closeMenu: labels?.closeMenu ?? defaultStrings.close,
	};
	const headerRef = useRef<HTMLElement>(null);
	const [mobileOpen, setMobileOpen] = useState(false);
	const bar = (
		<>
			{/* Escritorio */}
			<div className={cx("flex h-18 items-center gap-10 @max-5xl:hidden", floating ? "px-6" : WRAP)}>
				<div className="flex flex-none items-center">{brand}</div>
				<nav aria-label={l.nav} className="flex-1">
					<ul className="m-0 flex list-none items-center gap-1 p-0">
						{items.map((item) => (
							<li key={item.label} className={menu === "dropdown" ? "relative" : undefined}>
								<DesktopItem
									item={item}
									menu={menu}
									type={type}
									headerRef={headerRef}
									preview={previewItem === item.label}
								/>
							</li>
						))}
					</ul>
				</nav>
				<div className="flex items-center gap-3">{actions}</div>
			</div>
			{/* Móvil */}
			<div className="flex h-16 items-center justify-between gap-4 px-4 @5xl:hidden">
				<div className="flex min-w-0 items-center">{brand}</div>
				<DialogTrigger isOpen={mobileOpen} onOpenChange={setMobileOpen}>
					<AriaButton
						aria-label={mobileOpen ? l.closeMenu : l.openMenu}
						className="inline-flex size-10 cursor-pointer items-center justify-center rounded-md border-0 bg-transparent text-fg-secondary outline-none hover:bg-primary_hover focus-visible:shadow-focus-ring"
					>
						<Icon name={mobileOpen ? "x-close" : "menu-01"} size={24} />
					</AriaButton>
					<Popover
						triggerRef={headerRef}
						placement="bottom"
						offset={0}
						className="z-40 w-[var(--trigger-width)] outline-none"
					>
						<Dialog
							aria-label={l.nav}
							className="flex max-h-[calc(100dvh-64px)] flex-col overflow-auto bg-primary font-body shadow-[var(--shadow-lg)] outline-none"
						>
							<nav aria-label={l.nav}>
								<ul className="m-0 flex list-none flex-col p-0 py-2">
									{items.map((item) => (
										<li key={item.label}>
											<MobileItem item={item} />
										</li>
									))}
								</ul>
							</nav>
							{mobileLinks?.length || actions ? (
								<div className="flex flex-col gap-6 border-t border-secondary px-4 py-6">
									{mobileLinks?.length ? (
										<ul className="m-0 grid list-none grid-cols-2 gap-x-8 gap-y-3 p-0">
											{mobileLinks.map((link) => (
												<li key={link.href + link.label}>
													<a
														href={link.href}
														className="text-md font-semibold text-tertiary no-underline hover:text-tertiary_hover"
													>
														{link.label}
													</a>
												</li>
											))}
										</ul>
									) : null}
									{actions ? (
										<div className="flex flex-col-reverse gap-3 [&>*]:w-full">
											{actions}
										</div>
									) : null}
								</div>
							) : null}
						</Dialog>
					</Popover>
				</DialogTrigger>
			</div>
		</>
	);
	return (
		<header
			ref={headerRef}
			className={cx(
				"@container relative font-body",
				floating ? "px-4 pt-3" : "bg-primary shadow-[inset_0_-1px_0_var(--border-secondary)]",
				className,
			)}
		>
			{floating ? (
				<div className="mx-auto max-w-[1280px] rounded-2xl bg-primary shadow-[var(--shadow-xs),inset_0_0_0_1px_var(--border-secondary)]">
					{bar}
				</div>
			) : (
				bar
			)}
		</header>
	);
}
