import { cx } from "../internal/cx.js";

export interface SkeletonProps {
	/** Por defecto, `100%`. */
	width?: number | string;
	/** Por defecto, 16px. */
	height?: number | string;
	/** Radio; por defecto, `radius-md`. */
	radius?: number | string;
	/** Círculo, para avatares. */
	circle?: boolean;
	/** N líneas de texto de 12px; la última al 60 %. */
	lines?: number;
	className?: string;
}

// Pulso suave de la guía (1,4 s); sin animación si el sistema pide menos movimiento
const BLOCK =
	"block rounded-md bg-tertiary motion-safe:animate-[pulse_1.4s_ease-in-out_infinite] motion-reduce:animate-none";

/** Bloque gris que reserva el sitio del contenido mientras carga. Imita la forma real. */
export function Skeleton({ width, height, radius, circle, lines, className }: SkeletonProps) {
	if (lines)
		return (
			<div aria-hidden="true" className={cx("flex flex-col gap-2", className)}>
				{Array.from({ length: lines }, (_, i) => (
					<span
						// biome-ignore lint/suspicious/noArrayIndexKey: líneas idénticas sin identidad propia
						key={i}
						className={BLOCK}
						style={{ height: 12, width: i === lines - 1 ? "60%" : "100%" }}
					/>
				))}
			</div>
		);
	return (
		<span
			aria-hidden="true"
			className={cx(BLOCK, circle && "rounded-full", className)}
			style={{ width: width ?? "100%", height: height ?? 16, borderRadius: radius }}
		/>
	);
}
