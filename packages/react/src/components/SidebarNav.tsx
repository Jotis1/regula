"use client";

import { type ReactNode, useId, useState } from "react";
import { cx } from "../internal/cx.js";
import { defaultStrings } from "../internal/strings.js";
import { Avatar } from "./Avatar.js";
import { AvatarLabel, type AvatarLabelProps } from "./AvatarLabel.js";
import { Badge } from "./Badge.js";
import { Button } from "./Button.js";
import { CloseButton } from "./CloseButton.js";
import { Dropdown, type DropdownProps } from "./Dropdown.js";
import { Icon, type IconName, iconSlot } from "./Icon.js";
import { Input } from "./Input.js";
import { Kbd } from "./Kbd.js";
import { ProgressBar } from "./ProgressBar.js";
import { ProgressCircle } from "./ProgressCircle.js";
import { Tooltip } from "./Tooltip.js";

export interface SidebarNavItem {
	icon?: IconName | ReactNode;
	label: ReactNode;
	href?: string;
	/** Página actual: fondo `bg-secondary_hover` y `aria-current="page"`. */
	active?: boolean;
	/** Contador o aviso a la derecha, en un `Badge` gris. */
	badge?: ReactNode;
	/** Atajo de teclado a la derecha (`⌘1`), solo se muestra. */
	shortcut?: string;
	/** Algo al final de la fila, como un `chevron-right` o `arrow-up-right`. */
	trailing?: ReactNode;
	/**
	 * Submenú, de un nivel. En `simple` y los de secciones se despliega bajo el elemento (un botón con `aria-expanded`);
	 * en `dual-tier` y `slim` el elemento elige qué se enseña en el segundo panel.
	 */
	children?: Omit<SidebarNavItem, "children" | "defaultOpen">[];
	/** Con `children`: empieza abierto. Por defecto lo está si él o un hijo es la página actual. */
	defaultOpen?: boolean;
}

/** Un grupo de elementos con título opcional, para `sections-dividers` y `sections-subheadings`. */
export interface SidebarNavSection {
	title?: ReactNode;
	items: SidebarNavItem[];
}

export interface SidebarNavLabels {
	/** Nombre de la navegación. @default "Principal" */
	nav: string;
	/** Placeholder y nombre del buscador. @default "Buscar" */
	search: string;
	/** Nombre del botón de salir. @default "Cerrar sesión" */
	logout: string;
	/** Nombre del botón que abre la navegación en pantallas estrechas (`responsive`). @default "Abrir menú" */
	menu: string;
}

/** Tipos del Figma (`Sidebar navigation`, 1158:90768). */
export type SidebarNavType = "simple" | "dual-tier" | "slim" | "sections-dividers" | "sections-subheadings";

/** La tarjeta de cuenta: el `Dropdown` `account-card-md` (en `slim`, `account-avatar`) con sus cuentas y su menú. */
export type SidebarNavAccount = Omit<DropdownProps, "variant" | "trigger" | "triggerVariant">;

export interface SidebarNavProps {
	/**
	 * `simple` (por defecto) · `dual-tier` (segundo panel con el submenú del elemento elegido) · `slim` (solo iconos con
	 * tooltip y el submenú en un segundo panel) · `sections-dividers` (grupos separados por rayas) ·
	 * `sections-subheadings` (grupos con subtítulo).
	 * @default "simple"
	 */
	type?: SidebarNavType;
	/** Marca arriba: texto (en Bricolage Grotesque bold) o un nodo, como un `AppIcon` con el nombre. */
	brand?: ReactNode;
	/** Marca compacta de `slim`, donde no cabe el nombre. Sin ella, `brand` recortado a un cuadrado. */
	mark?: ReactNode;
	/**
	 * Muestra el buscador bajo la marca (en `sections-subheadings`, un botón de lupa junto a ella, y en `slim`, nada).
	 */
	search?: boolean;
	items?: SidebarNavItem[];
	/** Grupos con título para `sections-dividers` y `sections-subheadings`. Sustituye a `items`. */
	sections?: SidebarNavSection[];
	/** Ítems pegados abajo, como Ajustes. */
	footerItems?: Omit<SidebarNavItem, "badge">[];
	/** Tarjeta destacada sobre la cuenta: un nodo, como los de `SidebarCards`. No sale en `slim`. */
	featured?: ReactNode;
	/** Tarjeta de cuenta con menú, al pie. Con `user` también, gana `account`. */
	account?: SidebarNavAccount;
	/** Ficha del usuario al pie, con el botón de cerrar sesión. */
	user?: AvatarLabelProps;
	/** Al pulsar el botón de cerrar sesión de la ficha del usuario (ampliación sobre la guía). */
	onLogout?: () => void;
	/**
	 * Diseño adaptable (variantes `Mobile` del Figma): por debajo de `lg` se pinta una barra con la marca y un botón que
	 * abre la navegación a ancho completo; el segundo panel pasa debajo del primero.
	 */
	responsive?: boolean;
	/** Con `responsive`: la navegación empieza abierta en pantallas estrechas (vistas previas y capturas). */
	defaultMenuOpen?: boolean;
	/** Textos que trae el componente, para sustituirlos. */
	labels?: Partial<SidebarNavLabels>;
	className?: string;
}

const ITEM =
	"flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-md font-semibold text-secondary no-underline [&_svg]:text-fg-quaternary";
const LINK =
	"cursor-pointer transition-colors duration-100 hover:bg-primary_hover hover:text-secondary_hover focus-visible:shadow-focus-ring focus-visible:outline-none aria-[current=page]:bg-secondary_hover aria-[current=page]:text-secondary_hover aria-[current=page]:[&_svg]:text-fg-tertiary";
const CURRENT =
	"aria-[current=page]:bg-secondary_hover aria-[current=page]:text-secondary_hover aria-[current=page]:[&_svg]:text-fg-tertiary";
const EXPANDED =
	"aria-expanded:bg-secondary_hover aria-expanded:text-secondary_hover aria-expanded:[&_svg]:text-fg-tertiary";
const SLIM_ITEM = "size-10 justify-center gap-0 p-2";

type Leaf = Omit<SidebarNavItem, "children" | "defaultOpen">;
const hasActive = (item: SidebarNavItem) => item.active || item.children?.some((c) => c.active);

/** Lo que va dentro de una fila: icono, nombre y lo de la derecha. Con `slim`, el nombre solo para lectores. */
function RowContent({ item, slim, chevron }: { item: Leaf; slim?: boolean; chevron?: "down" | "up" }) {
	if (slim) {
		return (
			<>
				{item.icon ? iconSlot(item.icon, 24) : null}
				<span className="sr-only">{item.label}</span>
			</>
		);
	}
	// El primero de lo que va a la derecha empuja al resto con `ml-auto`
	let pushed = false;
	const push = () => {
		const c = pushed ? undefined : "ml-auto";
		pushed = true;
		return c;
	};
	return (
		<>
			{item.icon ? iconSlot(item.icon, 24) : null}
			{item.label}
			{item.badge != null ? (
				<Badge size="sm" color="gray" className={push()}>
					{item.badge}
				</Badge>
			) : null}
			{item.shortcut ? <Kbd className={push()}>{item.shortcut}</Kbd> : null}
			{item.trailing ? <span className={cx("flex shrink-0", push())}>{item.trailing}</span> : null}
			{chevron ? (
				<Icon name={chevron === "up" ? "chevron-up" : "chevron-down"} size={20} className={push()} />
			) : null}
		</>
	);
}

/** Un elemento sin submenú: enlace con `href`, texto sin él. En `slim` lleva tooltip con su nombre. */
function Row({ item, slim }: { item: Leaf; slim?: boolean }) {
	const content = <RowContent item={item} slim={slim} />;
	const row = item.href ? (
		<a
			href={item.href}
			aria-current={item.active ? "page" : undefined}
			className={cx(ITEM, LINK, slim && SLIM_ITEM)}
		>
			{content}
		</a>
	) : (
		<span
			aria-current={item.active ? "page" : undefined}
			className={cx(ITEM, CURRENT, slim && SLIM_ITEM)}
		>
			{content}
		</span>
	);
	return slim ? (
		<Tooltip title={item.label} placement="right">
			{row}
		</Tooltip>
	) : (
		row
	);
}

/** Elemento con submenú desplegable bajo él (`simple` y los de secciones). */
function Disclosure({ item }: { item: SidebarNavItem }) {
	const [open, setOpen] = useState(item.defaultOpen ?? !!hasActive(item));
	const id = useId();
	return (
		<>
			<button
				type="button"
				aria-expanded={open}
				aria-controls={id}
				onClick={() => setOpen((o) => !o)}
				className={cx(ITEM, LINK, "aria-expanded:[&_svg]:text-fg-tertiary")}
			>
				<RowContent item={item} chevron={open ? "up" : "down"} />
			</button>
			<ul id={id} hidden={!open} className="m-0 mt-0.5 flex list-none flex-col gap-0.5 p-0 pl-9">
				{item.children?.map((child, i) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: lista fija; las etiquetas pueden ser nodos
					<li key={i}>
						<Row item={child} />
					</li>
				))}
			</ul>
		</>
	);
}

interface NavListProps {
	items: SidebarNavItem[];
	slim?: boolean;
	/** Dos niveles o estrecho: los elementos con submenú eligen el segundo panel. */
	tiered?: { openKey: number | null; onToggle: (key: number) => void; panelId: string };
	/** Id del título del grupo, que da nombre a la lista. */
	labelledBy?: string;
}

function NavList({ items, slim, tiered, labelledBy }: NavListProps) {
	return (
		<ul aria-labelledby={labelledBy} className="m-0 flex list-none flex-col gap-0.5 p-0">
			{items.map((item, i) => {
				const key = i;
				let row: ReactNode;
				if (item.children?.length && tiered) {
					const button = (
						<button
							type="button"
							aria-expanded={tiered.openKey === key}
							aria-controls={tiered.panelId}
							onClick={() => tiered.onToggle(key)}
							className={cx(ITEM, LINK, EXPANDED, slim && SLIM_ITEM)}
						>
							<RowContent item={item} slim={slim} />
						</button>
					);
					row = slim ? (
						<Tooltip title={item.label} placement="right">
							{button}
						</Tooltip>
					) : (
						button
					);
				} else if (item.children?.length) {
					row = <Disclosure item={item} />;
				} else {
					row = <Row item={item} slim={slim} />;
				}
				return (
					// biome-ignore lint/suspicious/noArrayIndexKey: lista fija; las etiquetas pueden ser nodos
					<li key={i}>{row}</li>
				);
			})}
		</ul>
	);
}

/** La ficha del usuario de `slim`: solo el avatar, con el nombre para lectores. */
function SlimUser({ user }: { user: AvatarLabelProps }) {
	const { name, supporting: _supporting, size: _size, ...avatar } = user;
	return (
		<span className="relative flex">
			<Avatar size="md" status="online" {...avatar} />
			<span className="sr-only">{name}</span>
		</span>
	);
}

/** Navegación lateral de 296px de las apps de la suite: marca, búsqueda, secciones, ajustes y ficha del usuario. */
export function SidebarNav({
	type = "simple",
	brand,
	mark,
	search,
	items = [],
	sections,
	footerItems,
	featured,
	account,
	user,
	onLogout,
	responsive,
	defaultMenuOpen,
	labels,
	className,
}: SidebarNavProps) {
	const t = {
		nav: defaultStrings.mainNav,
		search: defaultStrings.search,
		logout: defaultStrings.logout,
		menu: defaultStrings.openMenu,
		...labels,
	};
	const slim = type === "slim";
	const tiered = slim || type === "dual-tier";
	const sectioned = type === "sections-dividers" || type === "sections-subheadings";
	const all = sectioned && sections ? sections.flatMap((s) => s.items) : items;
	const [openKey, setOpenKey] = useState<number | null>(() => {
		const parents = all.map((item, key) => ({ item, key })).filter(({ item }) => item.children?.length);
		const found = parents.find(({ item }) => item.defaultOpen ?? hasActive(item));
		return found ? found.key : null;
	});
	const [menuOpen, setMenuOpen] = useState(defaultMenuOpen ?? false);
	const panelId = useId();
	const bodyId = useId();
	const tier = tiered
		? { openKey, onToggle: (key: number) => setOpenKey((k) => (k === key ? null : key)), panelId }
		: undefined;
	const parent = tiered && openKey !== null ? all[openKey] : undefined;

	const list =
		sectioned && sections ? (
			<div
				className={cx(
					"flex flex-col gap-4",
					type === "sections-dividers" && "[&>*+*]:border-t [&>*+*]:border-secondary [&>*+*]:pt-4",
				)}
			>
				{sections.map((section, i) => {
					const headingId = `${bodyId}-s${i}`;
					return (
						// biome-ignore lint/suspicious/noArrayIndexKey: lista fija; las etiquetas pueden ser nodos
						<div key={i} className="flex flex-col gap-1">
							{section.title ? (
								<h2
									id={headingId}
									className="m-0 px-3 text-xs font-semibold uppercase text-quaternary"
								>
									{section.title}
								</h2>
							) : null}
							<NavList
								items={section.items}
								labelledBy={section.title ? headingId : undefined}
							/>
						</div>
					);
				})}
			</div>
		) : (
			<NavList items={items} slim={slim} tiered={tier} />
		);

	const accountBlock = account ? (
		<Dropdown
			{...account}
			variant={slim ? "account-avatar" : "account-card-md"}
			label={account.label ?? t.nav}
		/>
	) : user ? (
		slim ? (
			<div className="flex flex-col items-center gap-2">
				<SlimUser user={user} />
				<Button
					hierarchy="tertiary"
					size="sm"
					iconOnly="log-out-01"
					label={t.logout}
					onClick={onLogout}
				/>
			</div>
		) : (
			<div className="flex items-center justify-between gap-2 px-2 pt-6 shadow-[inset_0_1px_0_var(--border-secondary)]">
				<AvatarLabel size="md" status="online" {...user} />
				<Button
					hierarchy="tertiary"
					size="sm"
					iconOnly="log-out-01"
					label={t.logout}
					onClick={onLogout}
				/>
			</div>
		)
	) : null;

	const brandBlock = brand ? (
		slim ? (
			<div className="flex size-10 items-center justify-center overflow-hidden font-display text-lg font-bold text-primary">
				{mark ?? brand}
			</div>
		) : (
			<div
				className={cx(
					"flex items-center gap-2 px-2 font-display text-lg font-bold text-primary",
					type === "sections-subheadings" && search && "justify-between pr-0",
					responsive && "max-lg:hidden",
				)}
			>
				{type === "sections-subheadings" && search ? (
					<span className="flex min-w-0 items-center gap-2">{brand}</span>
				) : (
					brand
				)}
				{type === "sections-subheadings" && search ? (
					<Button hierarchy="tertiary" size="sm" iconOnly="search-lg" label={t.search} />
				) : null}
			</div>
		)
	) : null;

	const tierOne = (
		<>
			{brandBlock}
			{search && !slim && type !== "sections-subheadings" ? (
				<Input size="md" icon="search-lg" placeholder={t.search} aria-label={t.search} />
			) : null}
			{list}
			<div className={cx("mt-auto flex flex-col gap-6", slim && "items-center gap-4")}>
				{footerItems ? <NavList items={footerItems} slim={slim} /> : null}
				{featured && !slim ? featured : null}
				{accountBlock}
			</div>
		</>
	);

	const panel = tiered ? (
		// biome-ignore lint/a11y/useSemanticElements: un fieldset traería borde y leyenda que habría que quitar; es un grupo con nombre
		<div
			id={panelId}
			role="group"
			aria-label={typeof parent?.label === "string" ? parent.label : undefined}
			hidden={!parent}
			className={cx(
				"flex flex-col gap-1 bg-primary px-4 py-6 shadow-[inset_1px_0_0_var(--border-secondary)]",
				responsive ? "w-full lg:w-64" : "w-64",
			)}
		>
			{slim && parent ? (
				<h2 className="m-0 px-3 pb-1 text-md font-semibold text-brand-secondary">{parent.label}</h2>
			) : null}
			{parent?.children ? <NavList items={parent.children} /> : null}
		</div>
	) : null;

	const tierOneClass = cx(
		"flex h-full flex-col gap-6 bg-primary py-6",
		slim
			? "w-[68px] items-center rounded-2xl px-3 shadow-[inset_0_0_0_1px_var(--border-secondary)]"
			: "w-[296px] px-4",
		sectioned && "rounded-2xl shadow-[inset_0_0_0_1px_var(--border-secondary)]",
		type === "simple" && "shadow-[inset_-1px_0_0_var(--border-secondary)]",
		responsive && !slim && "max-lg:w-full",
	);

	if (!tiered && !responsive) {
		// El de siempre: una sola columna
		return (
			<nav
				aria-label={t.nav}
				className={cx(
					"flex h-full w-[296px] flex-col gap-6 bg-primary px-4 py-6 font-body",
					sectioned
						? "rounded-2xl shadow-[inset_0_0_0_1px_var(--border-secondary)]"
						: "shadow-[inset_-1px_0_0_var(--border-secondary)]",
					className,
				)}
			>
				{tierOne}
			</nav>
		);
	}

	return (
		<nav
			aria-label={t.nav}
			className={cx("flex h-full font-body", responsive ? "max-lg:flex-col" : null, className)}
		>
			{responsive ? (
				<div className="flex h-14 shrink-0 items-center justify-between bg-primary px-4 shadow-[inset_0_-1px_0_var(--border-secondary)] lg:hidden">
					<div className="flex items-center gap-2 font-display text-lg font-bold text-primary">
						{brand}
					</div>
					<Button
						hierarchy="tertiary"
						iconOnly={menuOpen ? "x-close" : "menu-01"}
						label={t.menu}
						aria-expanded={menuOpen}
						aria-controls={bodyId}
						onClick={() => setMenuOpen((o) => !o)}
					/>
				</div>
			) : null}
			<div
				id={bodyId}
				className={cx(
					"min-h-0 flex-1 lg:flex",
					responsive ? (menuOpen ? "flex flex-col" : "hidden") : "flex",
					responsive && "max-lg:overflow-y-auto",
				)}
			>
				<div className={tierOneClass}>{tierOne}</div>
				{panel}
			</div>
		</nav>
	);
}

// ---------------------------------------------------------------------------------------------------------------
// Tarjetas destacadas (`Nav featured card`, 1157:90307)

interface CardBase {
	/** Con ella sale la X arriba a la derecha. */
	onClose?: () => void;
	closeLabel?: string;
	/** Tarjeta blanca con filo en lugar de la gris rellena. */
	outline?: boolean;
	className?: string;
}

function Card({ onClose, closeLabel, outline, className, children }: CardBase & { children: ReactNode }) {
	return (
		<div
			className={cx(
				"relative flex flex-col gap-4 rounded-xl p-4 font-body",
				outline ? "border border-secondary bg-primary" : "bg-secondary",
				className,
			)}
		>
			{onClose ? (
				<CloseButton
					size="sm"
					label={closeLabel ?? defaultStrings.closeNotice}
					onClick={onClose}
					className="absolute right-1 top-1"
				/>
			) : null}
			{children}
		</div>
	);
}

function CardText({ title, description }: { title?: ReactNode; description?: ReactNode }) {
	return (
		<div className="flex flex-col gap-1 text-sm">
			{title ? <div className="pr-6 font-semibold text-primary">{title}</div> : null}
			{description ? <div className="text-tertiary">{description}</div> : null}
		</div>
	);
}

export interface SidebarProgressCardProps extends CardBase {
	title: ReactNode;
	description?: ReactNode;
	/** De 0 a 100. */
	value: number;
	/** `bar` (por defecto) o `circle`, con el anillo arriba. */
	variant?: "bar" | "circle";
	/** Los botones de texto de abajo, como «Descartar» y «Mejorar plan». */
	actions?: ReactNode;
}

/** Tarjeta con progreso (`Progress bar` y `Progress circle` del Figma). */
function ProgressCard({
	title,
	description,
	value,
	variant = "bar",
	actions,
	...card
}: SidebarProgressCardProps) {
	const name = typeof title === "string" ? title : undefined;
	return (
		<Card {...card}>
			{variant === "circle" ? (
				<ProgressCircle value={value} size="xxs" shape="circle" aria-label={name} />
			) : null}
			<CardText title={title} description={description} />
			{variant === "bar" ? <ProgressBar value={value} label={false} aria-label={name} /> : null}
			{actions ? <div className="flex gap-3">{actions}</div> : null}
		</Card>
	);
}

export interface SidebarNoticeCardProps extends CardBase {
	/** Arriba: un `FeaturedIcon`, un avatar, un grupo de avatares… */
	icon?: ReactNode;
	/** Imagen o vídeo bajo el texto, con las esquinas redondeadas, como en el Figma. */
	media?: ReactNode;
	title?: ReactNode;
	description?: ReactNode;
	/** Entre el texto y los botones: un campo, una lista, un código QR… */
	children?: ReactNode;
	/** Los botones de texto de abajo. */
	actions?: ReactNode;
}

/** Tarjeta de aviso o de invitación: imagen o icono, texto, contenido libre y botones. */
function NoticeCard({ icon, media, title, description, children, actions, ...card }: SidebarNoticeCardProps) {
	return (
		<Card {...card}>
			{icon}
			<CardText title={title} description={description} />
			{media ? <div className="overflow-hidden rounded-md">{media}</div> : null}
			{children}
			{actions ? <div className="flex gap-3">{actions}</div> : null}
		</Card>
	);
}

export interface SidebarUpgradeCardProps extends Omit<CardBase, "outline"> {
	/** Icono del cuadro de arriba. */
	icon?: IconName | ReactNode;
	title: ReactNode;
	/** Etiqueta junto al título («20% OFF»). */
	badge?: ReactNode;
	description?: ReactNode;
	/** Texto del botón a ancho completo. */
	cta: ReactNode;
	onCta?: () => void;
	href?: string;
}

/** Invitación a mejorar de plan (`Upgrade CTA` del Figma): tarjeta blanca con icono, etiqueta y botón principal. */
function UpgradeCard({
	icon = "star-01",
	title,
	badge,
	description,
	cta,
	onCta,
	href,
	...card
}: SidebarUpgradeCardProps) {
	return (
		<Card {...card} outline>
			<span className="flex size-10 items-center justify-center rounded-md border border-primary bg-primary text-fg-secondary shadow-[var(--shadow-xs-skeuomorphic)]">
				{iconSlot(icon, 20)}
			</span>
			<div className="flex flex-col gap-1 text-sm">
				<div className="flex items-center gap-1.5 font-semibold text-primary">
					{title}
					{badge ? (
						<Badge size="sm" color="gray">
							{badge}
						</Badge>
					) : null}
				</div>
				{description ? <div className="text-tertiary">{description}</div> : null}
			</div>
			{href ? (
				<Button hierarchy="primary" size="md" className="w-full" href={href}>
					{cta}
				</Button>
			) : (
				<Button hierarchy="primary" size="md" className="w-full" onClick={onCta}>
					{cta}
				</Button>
			)}
		</Card>
	);
}

/**
 * Plantillas de tarjetas destacadas para `SidebarNav featured`. El resto de las del Figma (cookies, referidos, soporte,
 * evento, mensaje, proyectos, prueba gratuita, QR) se hacen con `Notice` y sus huecos; ver la página del componente.
 * Es un objeto y no tres exportaciones para no contar como componentes del catálogo.
 */
export const SidebarCards = {
	Progress: ProgressCard,
	Notice: NoticeCard,
	Upgrade: UpgradeCard,
};
