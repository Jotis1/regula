import { cx } from "../internal/cx.js";
import { Screen, type ScreenContent } from "../internal/mockup-screen.js";

export type ScreenMockupSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

export interface ScreenMockupProps extends ScreenContent {
	/**
	 * `3-2`: pantalla 3:2 con filo oscuro (Figma `Screen mockup 3:2`, `1293:158480`) · `modern`: marco claro de tres
	 * capas con esquinas grandes (Figma `Modern screen mockup`, `8268:120483`).
	 * @default "3-2"
	 */
	variant?: "3-2" | "modern";
	/**
	 * Ancho máximo de `3-2`: `xs` 342 · `sm` 480 · `md` 640 · `lg` 768 · `xl` 1024 · `2xl` 1216. Se encoge con el
	 * contenedor.
	 * @default "md"
	 */
	size?: ScreenMockupSize;
	/** `modern` en escritorio (3:2) o en móvil (alto). @default "desktop" */
	breakpoint?: "desktop" | "mobile";
	/** Sombra bajo la pantalla `3-2`. @default true */
	shadow?: boolean;
}

const WIDTH: Record<ScreenMockupSize, string> = {
	xs: "max-w-[342px]",
	sm: "max-w-[480px]",
	md: "max-w-[640px]",
	lg: "max-w-[768px]",
	xl: "max-w-[1024px]",
	"2xl": "max-w-[1216px]",
};

/**
 * Maqueta de pantalla para enseñar una captura o una interfaz: la pantalla 3:2 con filo oscuro o el marco moderno, en
 * escritorio o móvil. Se escala al ancho del contenedor.
 */
export function ScreenMockup({
	variant = "3-2",
	size = "md",
	breakpoint = "desktop",
	shadow = true,
	src,
	alt,
	children,
	className,
}: ScreenMockupProps) {
	if (variant === "modern") {
		const mobile = breakpoint === "mobile";
		return (
			<div
				className={cx(
					"w-full rounded-[32px] bg-primary p-1 shadow-[var(--shadow-lg),inset_0_0_0_1px_var(--border-secondary_alt)]",
					mobile ? "max-w-[375px]" : "max-w-[1216px]",
					className,
				)}
			>
				<div className="rounded-[28px] bg-primary p-1 shadow-[inset_0_0_6px_2px_var(--border-secondary_alt)]">
					<div
						className={cx(
							"relative overflow-hidden rounded-[24px] bg-utility-neutral-50 shadow-[inset_0_0_0_2px_var(--utility-neutral-200)]",
							mobile ? "aspect-[355/773]" : "aspect-[3/2]",
						)}
					>
						<Screen src={src} alt={alt}>
							{children}
						</Screen>
					</div>
				</div>
			</div>
		);
	}
	return (
		<div className={cx("relative w-full", WIDTH[size], className)}>
			{shadow ? (
				<span
					aria-hidden="true"
					className="absolute inset-x-6 inset-y-0 bg-primary shadow-[var(--shadow-2xl)]"
				/>
			) : null}
			<div className="relative aspect-[3/2] overflow-hidden rounded-lg bg-primary">
				<Screen src={src} alt={alt}>
					{children}
				</Screen>
				{/* El filo de 4 px, encima de la pantalla */}
				<span
					aria-hidden="true"
					className="pointer-events-none absolute inset-0 rounded-lg shadow-[inset_0_0_0_4px_var(--bg-primary-solid)]"
				/>
			</div>
		</div>
	);
}
