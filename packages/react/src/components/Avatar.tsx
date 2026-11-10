import type { ReactNode } from "react";
import { cx } from "../internal/cx.js";
import { defaultStrings } from "../internal/strings.js";
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

/** Sello de verificado del Figma: la roseta girada 22,5° y el tick, en una caja de 16. */
function VerifiedSeal() {
	return (
		<svg viewBox="0 0 16 16" className="size-full" aria-hidden="true">
			<path
				className="fill-utility-blue-500"
				transform="rotate(22.5 8 8) translate(0.136 0.137)"
				d="M9.91068 1.42318C10.1917 1.70456 10.573 1.86283 10.9707 1.86318H12.3647C12.7625 1.86318 13.144 2.02121 13.4253 2.30252C13.7066 2.58382 13.8647 2.96535 13.8647 3.36318V4.75618C13.8647 5.15418 14.0227 5.53618 14.3047 5.81718L15.2887 6.80218C15.4281 6.94148 15.5386 7.10688 15.6141 7.28893C15.6895 7.47098 15.7284 7.66612 15.7284 7.86318C15.7284 8.06024 15.6895 8.25538 15.6141 8.43743C15.5386 8.61948 15.4281 8.78488 15.2887 8.92418L14.3037 9.90918C14.0223 10.1902 13.864 10.5715 13.8637 10.9692V12.3632C13.8637 12.761 13.7056 13.1425 13.4243 13.4238C13.143 13.7051 12.7615 13.8632 12.3637 13.8632H10.9707C10.573 13.8635 10.1917 14.0218 9.91068 14.3032L8.92468 15.2882C8.64343 15.5691 8.26218 15.7269 7.86468 15.7269C7.46718 15.7269 7.08593 15.5691 6.80468 15.2882L5.81868 14.3022C5.53765 14.0208 5.15637 13.8625 4.75868 13.8622H3.36468C2.96703 13.8622 2.58565 13.7043 2.30437 13.4232C2.0231 13.1421 1.86495 12.7608 1.86468 12.3632V10.9702C1.86433 10.5725 1.70606 10.1912 1.42468 9.91018L0.43968 8.92318C0.30029 8.78388 0.189715 8.61848 0.114273 8.43643C0.0388305 8.25438 0 8.05924 0 7.86218C0 7.66512 0.0388305 7.46998 0.114273 7.28793C0.189715 7.10588 0.30029 6.94048 0.43968 6.80118L1.42468 5.81618C1.70582 5.53539 1.86407 5.15452 1.86468 4.75718V3.36318C1.86468 2.96535 2.02272 2.58382 2.30402 2.30252C2.58532 2.02121 2.96686 1.86318 3.36468 1.86318H4.75768C5.15537 1.86283 5.53665 1.70456 5.81768 1.42318L6.80468 0.43918C7.08597 0.157973 7.46743 0 7.86518 0C8.26293 0 8.64439 0.157973 8.92568 0.43918L9.91168 1.42518L9.91068 1.42318Z"
			/>
			<path
				className="fill-fg-white"
				fillRule="evenodd"
				transform="translate(4.25 4.75)"
				d="M6.88326 1.1534C6.99014 0.985519 7.02596 0.782055 6.98282 0.587767C6.93969 0.393479 6.82114 0.224284 6.65326 0.117401C6.48538 0.0105191 6.28191 -0.0252947 6.08763 0.0178387C5.89334 0.060972 5.72414 0.179519 5.61726 0.347401L2.68026 4.9624L1.33626 3.2824C1.21201 3.12698 1.0311 3.02729 0.833346 3.00526C0.635589 2.98322 0.437178 3.04065 0.281761 3.1649C0.126344 3.28916 0.0266528 3.47006 0.00461728 3.66782C-0.0174183 3.86557 0.0400075 4.06398 0.164261 4.2194L2.16426 6.7194C2.2388 6.81269 2.33453 6.88683 2.4435 6.93566C2.55246 6.98449 2.67152 7.0066 2.79075 7.00014C2.90998 6.99369 3.02595 6.95886 3.12901 6.89855C3.23207 6.83824 3.31923 6.75419 3.38326 6.6534L6.88326 1.1534V1.1534Z"
			/>
		</svg>
	);
}

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
