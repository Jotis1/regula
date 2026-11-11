import {
	type AnchorHTMLAttributes,
	type ButtonHTMLAttributes,
	forwardRef,
	type ReactNode,
	type Ref,
} from "react";
import { cx } from "../internal/cx.js";
import { Icon, type IconName, iconSlot } from "./Icon.js";

export type ButtonHierarchy = "primary" | "secondary" | "tertiary" | "link-color" | "link-gray";
export type ButtonSize = "xs" | "sm" | "md" | "lg" | "xl";

interface ButtonBase {
	/**
	 * Jerarquía: una sola `primary` por vista o modal.
	 * @default "primary"
	 */
	hierarchy?: ButtonHierarchy;
	/**
	 * Alto: `xs` 32 · `sm` 36 · `md` 40 · `lg` 44 · `xl` 48.
	 * @default "md"
	 */
	size?: ButtonSize;
	/** Acción destructiva. Con `primary`, solo cuando borrar es la acción principal. */
	destructive?: boolean;
	/** Muestra un spinner, marca `aria-busy` y desactiva el botón. */
	loading?: boolean;
	className?: string;
}

interface WithText extends ButtonBase {
	/** Icono antes del texto: nombre del set o un nodo. */
	iconLeading?: IconName | ReactNode;
	/** Icono después del texto: nombre del set o un nodo. */
	iconTrailing?: IconName | ReactNode;
	iconOnly?: undefined;
	label?: string;
	children?: ReactNode;
}

interface IconOnly extends ButtonBase {
	/** Botón solo con icono: un nombre del set núcleo o un nodo (`<IconRocket02 />`). Exige `label` para lectores de pantalla. */
	iconOnly: IconName | ReactNode;
	/** Nombre accesible del botón solo con icono. */
	label: string;
	iconLeading?: undefined;
	iconTrailing?: undefined;
	children?: undefined;
}

type AsButton = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "className"> & {
	href?: undefined;
};
type AsLink = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "children" | "className"> & {
	/** Con `href` se pinta como enlace `<a>` con el mismo aspecto. */
	href: string;
	disabled?: boolean;
};

export type ButtonProps = (WithText | IconOnly) & (AsButton | AsLink);

const BASE =
	"relative inline-flex items-center justify-center gap-1 whitespace-nowrap rounded-lg font-body text-sm font-semibold no-underline cursor-pointer transition-colors duration-100 ease-linear focus-visible:outline-none focus-visible:shadow-focus-ring disabled:cursor-not-allowed disabled:opacity-50 aria-disabled:cursor-not-allowed aria-disabled:opacity-50";

const SIZE: Record<ButtonSize, string> = {
	xs: "h-8 px-2.5 py-1.5",
	sm: "h-9 px-3 py-2",
	md: "h-10 px-3.5 py-2.5",
	lg: "h-11 px-4 py-2.5 gap-1.5 text-md",
	xl: "h-12 px-4.5 py-3 gap-1.5 text-md",
};
const ICON_ONLY: Record<ButtonSize, string> = {
	xs: "w-8 p-1.5",
	sm: "w-9 p-2",
	md: "w-10 p-2.5",
	lg: "w-11 p-3",
	xl: "w-12 p-3.5",
};

const SKEUO_BORDER = "shadow-[var(--shadow-xs-skeuomorphic),inset_0_0_0_1px_var(--border-primary)]";
const SKEUO_ERROR_BORDER =
	"shadow-[var(--shadow-xs-skeuomorphic),inset_0_0_0_1px_var(--border-error_subtle)]";
// Borde interior del primario: degradado blanco del 12 % a 0 (ficha de Button)
const HIGHLIGHT =
	// color-fijo: brillo interior del botón primario, blanco 12 % → 0 en ambos temas (ficha de Button)
	"before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:p-0.5 before:content-[''] before:bg-[linear-gradient(180deg,#ffffff1f,#ffffff00)] before:[mask:linear-gradient(black_0_0)_content-box_exclude,linear-gradient(black_0_0)]";

const HIERARCHY: Record<ButtonHierarchy, string> = {
	primary: `bg-brand-solid text-white shadow-xs-skeuomorphic not-disabled:hover:bg-brand-solid_hover ${HIGHLIGHT}`,
	secondary: `bg-primary text-secondary ${SKEUO_BORDER} not-disabled:hover:bg-primary_hover not-disabled:hover:text-secondary_hover [&_svg]:text-fg-quaternary`,
	tertiary:
		"bg-transparent text-tertiary not-disabled:hover:bg-primary_hover not-disabled:hover:text-tertiary_hover [&_svg]:text-fg-quaternary",
	"link-color":
		"h-auto p-0 rounded-sm bg-transparent text-brand-secondary not-disabled:hover:text-brand-secondary_hover not-disabled:hover:underline underline-offset-3",
	"link-gray":
		"h-auto p-0 rounded-sm bg-transparent text-tertiary not-disabled:hover:text-tertiary_hover not-disabled:hover:underline underline-offset-3",
};

const DESTRUCTIVE: Record<ButtonHierarchy, string> = {
	primary: "bg-error-solid not-disabled:hover:bg-error-solid_hover",
	secondary: `text-error-primary ${SKEUO_ERROR_BORDER} not-disabled:hover:bg-error-primary not-disabled:hover:text-error-primary_hover [&_svg]:text-fg-error-secondary`,
	tertiary:
		"text-error-primary not-disabled:hover:bg-error-primary not-disabled:hover:text-error-primary_hover [&_svg]:text-fg-error-secondary",
	"link-color": "text-error-primary",
	"link-gray": "",
};

/** La acción de la pantalla: cinco jerarquías y cinco tamaños. Acepta `ref` (al `<button>` o al `<a>`). */
export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(function Button(
	{
		hierarchy = "primary",
		size = "md",
		destructive,
		loading,
		iconLeading,
		iconTrailing,
		iconOnly,
		label,
		children,
		className,
		...rest
	}: ButtonProps,
	ref,
) {
	const link = hierarchy.startsWith("link");
	const iconSize = size === "xs" ? 16 : 20;
	const classes = cx(
		BASE,
		!link && SIZE[size],
		iconOnly && !link && ICON_ONLY[size],
		HIERARCHY[hierarchy],
		destructive && DESTRUCTIVE[hierarchy],
		destructive && "focus-visible:shadow-focus-ring-error",
		className,
	);
	const spinner = <Icon name="loading-02" size={iconSize} spin />;
	const content = iconOnly ? (
		<>
			{loading ? spinner : iconSlot(iconOnly, iconSize)}
			<span className="sr-only">{label}</span>
		</>
	) : (
		<>
			{loading ? spinner : iconSlot(iconLeading, iconSize)}
			<span className={link ? undefined : "px-0.5"}>{children}</span>
			{iconSlot(iconTrailing, iconSize)}
		</>
	);

	if ("href" in rest && rest.href !== undefined) {
		const { disabled, ...anchor } = rest as AsLink;
		const inactive = disabled || loading;
		return (
			<a
				{...anchor}
				ref={ref as Ref<HTMLAnchorElement>}
				className={classes}
				aria-busy={loading || undefined}
				aria-disabled={inactive || undefined}
				tabIndex={inactive ? -1 : anchor.tabIndex}
				href={inactive ? undefined : anchor.href}
			>
				{content}
			</a>
		);
	}
	const button = rest as AsButton;
	return (
		<button
			type="button"
			{...button}
			ref={ref as Ref<HTMLButtonElement>}
			className={classes}
			aria-busy={loading || undefined}
			disabled={button.disabled || loading || undefined}
		>
			{content}
		</button>
	);
});
