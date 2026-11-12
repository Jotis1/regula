import type { ReactNode } from "react";
import { cx } from "../internal/cx.js";
import { defaultStrings } from "../internal/strings.js";
import { VerifiedSeal } from "../internal/verified-seal.js";
import { Icon } from "./Icon.js";

export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
export type AvatarStatus = "online" | "offline";
export type AvatarBadge = "verified" | "count" | "company";

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
	/**
	 * Insignia en la esquina, en el sitio del punto de estado (si pasas las dos, se pinta la insignia):
	 * `verified` sello azul con tick · `count` número sobre rojo (`count`) · `company` logo de la empresa
	 * (`company`). Mide 10 a 20px según `size` y sobresale 2px.
	 */
	badge?: AvatarBadge;
	/** Número de `badge="count"`. Desde 100 se escribe «99+». */
	count?: number;
	/**
	 * Logo de `badge="company"`: la URL de una imagen o un nodo, como un logo de `@jotis-me/icons/logos`, que se
	 * estira al círculo.
	 */
	company?: string | ReactNode;
	/**
	 * Texto de la insignia para lectores de pantalla. Por defecto, «Verificado» o «N notificaciones»; el logo de
	 * empresa sin `badgeLabel` es decorativo.
	 */
	badgeLabel?: string;
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

// Caja de la insignia del Figma (Status icon, 11008:45024): 10 a 20px, a -2px de la esquina
const BADGE_BOX: Record<AvatarSize, string> = {
	xs: "size-2.5",
	sm: "size-3",
	md: "size-3.5",
	lg: "size-4",
	xl: "size-4.5",
	"2xl": "size-5",
};
// El número del contador: 10px en la caja de 16, como el Figma, y en proporción en el resto
const COUNT_TEXT: Record<AvatarSize, string> = {
	xs: "text-[6px]",
	sm: "text-[7px]",
	md: "text-[9px]",
	lg: "text-[10px]",
	xl: "text-[11px]",
	"2xl": "text-[13px]",
};

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
	badge,
	count = 0,
	company,
	badgeLabel,
	className,
}: AvatarProps) {
	// La insignia ocupa el sitio del punto de estado
	const dot = badge ? undefined : status;
	const statusText = dot ? (statusLabel ?? defaultStrings[dot]) : undefined;
	const badgeText =
		badge === "verified"
			? (badgeLabel ?? defaultStrings.verified)
			: badge === "count"
				? (badgeLabel ?? defaultStrings.notifications(count))
				: badgeLabel;
	const announced = statusText ?? badgeText;
	// Con iniciales y `alt`, el avatar es una imagen con nombre: el estado entra en el nombre
	const named = Boolean(alt && !src);
	const a11y = named ? { role: "img", "aria-label": [alt, announced].filter(Boolean).join(", ") } : {};
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
			{dot ? (
				<span
					aria-hidden="true"
					className={cx(
						"absolute right-0 bottom-0 size-[30%] min-h-1.5 min-w-1.5 rounded-full shadow-[0_0_0_1.5px_var(--bg-primary)]",
						dot === "online" ? "bg-fg-success-secondary" : "bg-fg-quaternary",
					)}
				/>
			) : null}
			{badge ? (
				<span
					aria-hidden="true"
					className={cx("absolute -right-0.5 -bottom-0.5 flex", BADGE_BOX[size])}
				>
					{badge === "verified" ? (
						<VerifiedSeal />
					) : badge === "count" ? (
						<span
							className={cx(
								// El círculo ocupa 14 de los 16 del Figma; con dos cifras crece a lo ancho
								"m-auto flex h-[87.5%] min-w-[87.5%] items-center justify-center rounded-full border-[1.5px] border-(--bg-primary) bg-fg-error-secondary px-px font-body font-bold leading-none text-fg-white",
								COUNT_TEXT[size],
							)}
						>
							{count > 99 ? "99+" : count}
						</span>
					) : typeof company === "string" ? (
						<img
							src={company}
							alt=""
							className="size-full rounded-full border-[1.5px] border-(--bg-primary) object-cover"
						/>
					) : company ? (
						<span className="flex size-full overflow-hidden rounded-full border-[1.5px] border-(--bg-primary) bg-primary [&>*]:size-full">
							{company}
						</span>
					) : null}
				</span>
			) : null}
			{announced && !named ? <span className="sr-only">{announced}</span> : null}
		</span>
	);
}
