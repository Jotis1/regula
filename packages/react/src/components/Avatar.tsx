import { cx } from "../internal/cx.js";
import { defaultStrings } from "../internal/strings.js";
import { Icon } from "./Icon.js";

export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
export type AvatarStatus = "online" | "offline";

export interface AvatarProps {
	/** Foto. Sin `src` ni `initials` se muestra el icono de usuario. */
	src?: string;
	/** Texto alternativo de la foto, o nombre accesible de las iniciales. */
	alt?: string;
	initials?: string;
	/** Diámetro: `xs` 24 · `sm` 32 · `md` 40 · `lg` 48 · `xl` 56 · `2xl` 64. */
	size?: AvatarSize;
	/** Punto de estado abajo a la derecha. */
	status?: AvatarStatus;
	/** Texto del estado para lectores de pantalla. Por defecto, "En línea" o "Desconectado". */
	statusLabel?: string;
	/** Anillo `bg-primary` para apilar avatares. */
	ring?: boolean;
	className?: string;
}

const SIZE: Record<AvatarSize, string> = {
	xs: "size-6 text-xs",
	sm: "size-8 text-sm",
	md: "size-10 text-md",
	lg: "size-12 text-lg",
	xl: "size-14 text-xl",
	"2xl": "size-16 text-display-xs",
};
const ICON_SIZE: Record<AvatarSize, number> = { xs: 16, sm: 20, md: 24, lg: 28, xl: 32, "2xl": 32 };

// color-fijo: borde interior de 0,5px al 16 % negro para que la foto no se funda con el fondo (ficha de Avatar)
const EDGE = "shadow-[inset_0_0_0_0.5px_#00000029]";
// color-fijo: el mismo borde interior bajo el anillo para apilar (ficha de Avatar)
const RING = "shadow-[0_0_0_1.5px_var(--bg-primary),inset_0_0_0_0.5px_#00000029]";

/** Foto o iniciales de una persona en círculo, de 24 a 64px. */
export function Avatar({
	src,
	alt,
	initials,
	size = "md",
	status,
	statusLabel,
	ring,
	className,
}: AvatarProps) {
	const statusText = status ? (statusLabel ?? defaultStrings[status]) : undefined;
	// Con iniciales y `alt`, el avatar es una imagen con nombre: el estado entra en el nombre
	const named = Boolean(alt && !src);
	const a11y = named ? { role: "img", "aria-label": [alt, statusText].filter(Boolean).join(", ") } : {};
	return (
		<span
			{...a11y}
			className={cx(
				"relative inline-flex shrink-0 items-center justify-center rounded-full bg-avatar-styles-bg-neutral font-semibold text-(color:--bg-secondary-solid)",
				SIZE[size],
				// Interlineado de la fuente, como la guía: con el de la escala las iniciales bajan un píxel
				"leading-[normal]",
				ring ? RING : EDGE,
				className,
			)}
		>
			{src ? (
				<img src={src} alt={alt ?? ""} className="size-full rounded-[inherit] object-cover" />
			) : initials ? (
				<span aria-hidden={alt ? true : undefined}>{initials}</span>
			) : (
				<Icon name="user-01" size={ICON_SIZE[size]} />
			)}
			{status ? (
				<>
					<span
						aria-hidden="true"
						className={cx(
							"absolute right-0 bottom-0 size-[30%] min-h-1.5 min-w-1.5 rounded-full shadow-[0_0_0_1.5px_var(--bg-primary)]",
							status === "online" ? "bg-fg-success-secondary" : "bg-fg-quaternary",
						)}
					/>
					{named ? null : <span className="sr-only">{statusText}</span>}
				</>
			) : null}
		</span>
	);
}
