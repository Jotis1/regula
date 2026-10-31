import type { ReactNode } from "react";
import { cx } from "../internal/cx.js";
import { defaultStrings } from "../internal/strings.js";
import { AvatarLabel, type AvatarLabelProps } from "./AvatarLabel.js";
import { Badge } from "./Badge.js";
import { Button } from "./Button.js";
import { Icon, type IconName } from "./Icon.js";
import { Input } from "./Input.js";

export interface SidebarNavItem {
	icon?: IconName;
	label: ReactNode;
	href?: string;
	/** Página actual: fondo `bg-secondary_hover` y `aria-current="page"`. */
	active?: boolean;
	/** Contador o aviso a la derecha, en un `Badge` gris. */
	badge?: ReactNode;
}

export interface SidebarNavLabels {
	/** Nombre de la navegación. @default "Principal" */
	nav: string;
	/** Placeholder y nombre del buscador. @default "Buscar" */
	search: string;
	/** Nombre del botón de salir. @default "Cerrar sesión" */
	logout: string;
}

export interface SidebarNavProps {
	/** Marca arriba: texto (en Bricolage Grotesque bold) o un nodo, como un `AppIcon` con el nombre. */
	brand?: ReactNode;
	/** Muestra el buscador bajo la marca. */
	search?: boolean;
	items: SidebarNavItem[];
	/** Ítems pegados abajo, como Ajustes. */
	footerItems?: Omit<SidebarNavItem, "badge">[];
	/** Ficha del usuario al pie, con el botón de cerrar sesión. */
	user?: AvatarLabelProps;
	/** Al pulsar el botón de cerrar sesión de la ficha del usuario (ampliación sobre la guía). */
	onLogout?: () => void;
	/** Textos que trae el componente, para sustituirlos. */
	labels?: Partial<SidebarNavLabels>;
	className?: string;
}

const ITEM =
	"flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-md font-semibold text-secondary no-underline [&_svg]:text-fg-quaternary";
const LINK =
	"cursor-pointer transition-colors duration-100 hover:bg-primary_hover hover:text-secondary_hover focus-visible:shadow-focus-ring focus-visible:outline-none aria-[current=page]:bg-secondary_hover aria-[current=page]:text-secondary_hover aria-[current=page]:[&_svg]:text-fg-tertiary";

function NavList({ items }: { items: SidebarNavItem[] }) {
	return (
		<ul className="m-0 flex list-none flex-col gap-0.5 p-0">
			{items.map((item, i) => {
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
				return (
					// biome-ignore lint/suspicious/noArrayIndexKey: lista fija; las etiquetas pueden ser nodos
					<li key={i}>
						{item.href ? (
							<a
								href={item.href}
								aria-current={item.active ? "page" : undefined}
								className={cx(ITEM, LINK)}
							>
								{content}
							</a>
						) : (
							<span
								aria-current={item.active ? "page" : undefined}
								className={cx(
									ITEM,
									"aria-[current=page]:bg-secondary_hover aria-[current=page]:text-secondary_hover aria-[current=page]:[&_svg]:text-fg-tertiary",
								)}
							>
								{content}
							</span>
						)}
					</li>
				);
			})}
		</ul>
	);
}

/** Navegación lateral de 296px de las apps de la suite: marca, búsqueda, secciones, ajustes y ficha del usuario. */
export function SidebarNav({
	brand,
	search,
	items,
	footerItems,
	user,
	onLogout,
	labels,
	className,
}: SidebarNavProps) {
	const t = {
		nav: defaultStrings.mainNav,
		search: defaultStrings.search,
		logout: defaultStrings.logout,
		...labels,
	};
	return (
		<nav
			aria-label={t.nav}
			className={cx(
				"flex h-full w-[296px] flex-col gap-6 bg-primary px-4 py-6 font-body shadow-[inset_-1px_0_0_var(--border-secondary)]",
				className,
			)}
		>
			{brand ? (
				<div className="flex items-center gap-2 px-2 font-display text-lg font-bold text-primary">
					{brand}
				</div>
			) : null}
			{search ? (
				<Input size="md" icon="search-lg" placeholder={t.search} aria-label={t.search} />
			) : null}
			<NavList items={items} />
			<div className="mt-auto flex flex-col gap-6">
				{footerItems ? <NavList items={footerItems} /> : null}
				{user ? (
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
				) : null}
			</div>
		</nav>
	);
}
