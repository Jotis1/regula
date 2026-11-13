import { User01 } from "@untitledui/icons";
import { cx } from "../internal/cx.js";
import { defaultStrings } from "../internal/strings.js";
import { VerifiedSeal } from "../internal/verified-seal.js";

export type AvatarProfilePhotoSize = "sm" | "md" | "lg";

export interface AvatarProfilePhotoProps {
	/** URL de la foto. Sin ella, las iniciales o el icono de usuario. */
	src?: string;
	/** Nombre de la persona: texto alternativo de la foto o nombre accesible de las iniciales. Sin él, es decorativa. */
	alt?: string;
	/** Una o dos letras, en Bricolage Grotesque. */
	initials?: string;
	/**
	 * Lado: `sm` 72 · `md` 96 · `lg` 160, con su filo blanco y su sombra.
	 * @default "md"
	 */
	size?: AvatarProfilePhotoSize;
	/** Sello de verificado abajo a la derecha. */
	verified?: boolean;
	/** Texto para lectores del sello. @default "Verificado" */
	verifiedLabel?: string;
	className?: string;
}

const BOX: Record<AvatarProfilePhotoSize, string> = {
	sm: "size-18 p-[3px]",
	md: "size-24 p-1",
	lg: "size-40 p-1.5",
};
const TEXT: Record<AvatarProfilePhotoSize, string> = {
	sm: "text-display-xs tracking-[-0.02em]",
	md: "text-display-md tracking-[-0.02em]",
	lg: "text-display-xl tracking-[-0.02em]",
};
const ICON: Record<AvatarProfilePhotoSize, number> = { sm: 32, md: 40, lg: 64 };
const SEAL: Record<AvatarProfilePhotoSize, string> = {
	sm: "right-0.5 bottom-0.5 size-5",
	md: "right-1 bottom-1 size-6",
	lg: "right-2 bottom-2 size-8",
};

/**
 * Foto de perfil grande, con el filo blanco y la sombra del Figma (`Avatar profile photo`, `1217:108477`), para
 * cabeceras de perfil y de cuenta. Con foto, iniciales o el icono de usuario, y el sello de verificado.
 */
export function AvatarProfilePhoto({
	src,
	alt,
	initials,
	size = "md",
	verified,
	verifiedLabel = defaultStrings.verified,
	className,
}: AvatarProfilePhotoProps) {
	// Con iniciales y nombre, el conjunto es una imagen con nombre (y el sello entra en él)
	const named = Boolean(alt && !src);
	const a11y = named
		? {
				role: "img",
				"aria-label": [alt, verified ? verifiedLabel : undefined].filter(Boolean).join(", "),
			}
		: {};
	return (
		<span
			{...a11y}
			className={cx(
				"relative inline-flex shrink-0 rounded-full bg-primary shadow-[inset_0_0_0_1px_var(--border-secondary_alt)]",
				BOX[size],
				className,
			)}
		>
			<span className="flex size-full items-center justify-center overflow-hidden rounded-full bg-tertiary text-quaternary shadow-[var(--shadow-2xl),inset_0_0_0_1px_var(--border-secondary_alt)] [&_svg]:text-fg-quaternary">
				{src ? (
					<img src={src} alt={alt ?? ""} className="size-full object-cover" />
				) : initials ? (
					<span
						aria-hidden={alt ? true : undefined}
						className={cx("font-display font-semibold", TEXT[size])}
					>
						{initials}
					</span>
				) : (
					<User01 size={ICON[size]} />
				)}
			</span>
			{verified ? (
				<span className={cx("absolute flex", SEAL[size])}>
					<VerifiedSeal />
					{named ? null : <span className="sr-only">{verifiedLabel}</span>}
				</span>
			) : null}
		</span>
	);
}
