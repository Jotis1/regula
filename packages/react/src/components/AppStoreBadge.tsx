import type { AnchorHTMLAttributes, ReactNode } from "react";
import { cx } from "../internal/cx.js";

export type AppStore = "google-play" | "app-store" | "mac-app-store" | "galaxy-store" | "app-gallery";
export type AppStoreBadgeSize = "md" | "lg";

export interface AppStoreBadgeProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "children"> {
	/** La tienda: da el nombre del enlace. */
	store: AppStore;
	/** La página de la app en la tienda. */
	href: string;
	/**
	 * El dibujo de la insignia, de `@jotis-me/icons/logos` (el paquete no lo importa): `StoreAppStoreLogo` en relleno o
	 * `StoreAppStoreOutlineLogo` en contorno, que toma el color del texto.
	 */
	logo: ReactNode;
	/**
	 * Alto: `md` 40 · `lg` 44; el ancho sigue la proporción del dibujo.
	 * @default "md"
	 */
	size?: AppStoreBadgeSize;
	/** Nombre del enlace en lugar del de la tienda («App Store»). */
	label?: string;
}

const STORE_NAMES: Record<AppStore, string> = {
	"google-play": "Google Play",
	"app-store": "App Store",
	"mac-app-store": "Mac App Store",
	"galaxy-store": "Galaxy Store",
	"app-gallery": "AppGallery",
};

/**
 * Insignia de tienda de apps (Figma `Mobile app store badge`, `1303:2162`): Google Play, App Store, Mac App Store,
 * Galaxy Store y AppGallery, en `md` y `lg`, en relleno o en contorno. Es un enlace con el nombre de la tienda.
 */
export function AppStoreBadge({
	store,
	href,
	logo,
	size = "md",
	label,
	className,
	...rest
}: AppStoreBadgeProps) {
	return (
		<a
			{...rest}
			href={href}
			aria-label={label ?? STORE_NAMES[store]}
			className={cx(
				"inline-flex shrink-0 rounded-[7px] text-primary outline-none focus-visible:shadow-focus-ring [&>svg]:w-auto",
				size === "md" ? "[&>svg]:h-10" : "[&>svg]:h-11",
				className,
			)}
		>
			{logo}
		</a>
	);
}
