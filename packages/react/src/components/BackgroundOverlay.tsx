import { cx } from "../internal/cx.js";

export interface BackgroundOverlayProps {
	/**
	 * `default` velo `bg-overlay` al 70 % · `gradient` el mismo velo, del 35 % arriba al 70 % abajo · `transparent` sin
	 * velo, solo el desenfoque.
	 * @default "default"
	 */
	type?: "default" | "gradient" | "transparent";
	/**
	 * Desenfoca lo que hay detrás (8 px).
	 * @default true
	 */
	blur?: boolean;
	className?: string;
}

/**
 * Capa sobre una imagen o una composición (Figma `Background overlay`, `4896:411056`): un velo oscuro, en degradado o
 * transparente, con desenfoque. Ocupa su contenedor (`absolute inset-0`), que tiene que ser `relative`; lo que va
 * encima se pone después. Es decorativa. `Modal` y `Slideout` llevan la suya.
 */
export function BackgroundOverlay({ type = "default", blur = true, className }: BackgroundOverlayProps) {
	return (
		<div
			aria-hidden="true"
			className={cx(
				"pointer-events-none absolute inset-0",
				blur && "backdrop-blur-[8px]",
				type === "default" && "bg-overlay/70",
				type === "gradient" && "bg-gradient-to-b from-overlay/35 to-overlay/70",
				className,
			)}
		/>
	);
}
