import { Fragment, type ReactNode } from "react";
import { cx } from "../internal/cx.js";
import { defaultStrings } from "../internal/strings.js";
import { Dropdown, type DropdownAccount } from "./Dropdown.js";
import { Icon, type IconName, iconSlot } from "./Icon.js";

export interface BreadcrumbItem {
	label: string;
	href?: string;
	/** Icono en lugar del texto (el texto queda para lectores de pantalla). Pensado para el primero, `home-line`. */
	icon?: IconName | ReactNode;
	/** Avatar o logo delante del texto, para `type="account"` (el logo de la empresa, por ejemplo). */
	avatar?: ReactNode;
	/**
	 * Cuentas entre las que se puede cambiar: el elemento pasa a ser el desplegable de cuentas del Figma
	 * (`account-breadcrumb`), con el nombre de la elegida. Solo en `type="account"`.
	 */
	accounts?: DropdownAccount[];
	/** Cuenta elegida al principio (no controlado). Si falta, la primera. */
	defaultAccount?: string;
	/** Se llama con el `value` de la cuenta elegida. */
	onAccountChange?: (value: string) => void;
}

export type BreadcrumbsDivider = "chevron" | "slash";
export type BreadcrumbsType = "text" | "text-line" | "button" | "account";

export interface BreadcrumbsProps {
	/** Ruta desde el inicio. El último es la página actual: se pinta en `text-brand-secondary` y sin enlace. */
	items: BreadcrumbItem[];
	/**
	 * Separador entre elementos.
	 * @default "chevron"
	 */
	divider?: BreadcrumbsDivider;
	/**
	 * Estilo del Figma: `text` (el de siempre), `text-line` (entre dos rayas), `button` (cada elemento es un botón; la
	 * página actual lleva fondo) y `account` (elementos en `text-primary`, con avatares y desplegables de cuenta).
	 * @default "text"
	 */
	type?: BreadcrumbsType;
	/**
	 * Nombre de la navegación para lectores de pantalla.
	 * @default "Migas de pan"
	 */
	"aria-label"?: string;
	className?: string;
}

const LIST_BASE = "m-0 flex list-none items-center p-0 font-body text-sm font-semibold";
const LIST: Record<BreadcrumbsType, string> = {
	text: "m-0 flex list-none items-center gap-2 p-0 font-body text-sm font-semibold text-quaternary [&_svg]:text-fg-quaternary",
	"text-line": `${LIST_BASE} gap-2 pl-2 text-quaternary max-md:gap-1.5 [&_svg]:text-fg-quaternary`,
	button: `${LIST_BASE} gap-1 text-quaternary max-md:gap-0.5 [&_svg]:text-fg-quaternary`,
	account: `${LIST_BASE} gap-2 text-primary max-md:gap-1.5 [&_svg]:text-fg-quaternary`,
};
const CRUMB = "inline-flex items-center rounded-md px-2 py-1";
const BUTTON_CRUMB = "inline-flex items-center rounded-md px-2 py-1";
const LINK =
	"text-inherit no-underline transition-colors duration-100 hover:bg-primary_hover hover:text-tertiary_hover focus-visible:shadow-focus-ring focus-visible:outline-none";

/** Ruta de navegación encima del título de página. */
export function Breadcrumbs({
	items,
	divider = "chevron",
	type = "text",
	className,
	...rest
}: BreadcrumbsProps) {
	const account = type === "account";
	const button = type === "button";
	const crumb = button ? BUTTON_CRUMB : CRUMB;
	return (
		<nav
			aria-label={rest["aria-label"] ?? defaultStrings.breadcrumbs}
			className={cx(type === "text-line" && "border-y border-secondary py-2", className) || undefined}
		>
			<ol className={LIST[type]}>
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
					const current = button
						? cx(crumb, "bg-primary_hover text-tertiary_hover")
						: cx(crumb, "text-brand-secondary");
					const sameText = account ? cx(crumb, "text-primary", item.avatar && "gap-2") : crumb;
					let node: ReactNode;
					if (account && item.accounts) {
						node = (
							<Dropdown
								variant="account-breadcrumb"
								items={[{ accounts: true }]}
								accounts={item.accounts}
								defaultAccount={item.defaultAccount}
								onAccountChange={item.onAccountChange}
								aria-label={item.label}
							/>
						);
					} else if (last && !account) {
						node = (
							<span aria-current="page" className={current}>
								{item.label}
							</span>
						);
					} else if (item.href) {
						node = (
							<a
								href={item.href}
								aria-current={last ? "page" : undefined}
								className={cx(sameText, LINK)}
							>
								{item.avatar}
								{content}
							</a>
						);
					} else {
						node = (
							<span aria-current={last ? "page" : undefined} className={sameText}>
								{item.avatar}
								{content}
							</span>
						);
					}
					return (
						// biome-ignore lint/suspicious/noArrayIndexKey: la ruta es una lista fija; las etiquetas pueden repetirse
						<Fragment key={i}>
							{i > 0 ? (
								<li aria-hidden="true" className="flex">
									<Icon
										name={divider === "slash" ? "slash-divider" : "chevron-right"}
										size={16}
									/>
								</li>
							) : null}
							<li className="flex">{node}</li>
						</Fragment>
					);
				})}
			</ol>
		</nav>
	);
}
