import type { CSSProperties, ReactNode } from "react";
import { cx } from "../internal/cx.js";
import { STREAM_ROOT } from "../internal/stream.js";
import { defaultStrings } from "../internal/strings.js";

export type CamFrameRatio = "16:9" | "4:3" | "1:1";

export interface CamFrameProps {
	/** @default "16:9" */
	ratio?: CamFrameRatio;
	/** @default 480 */
	width?: number | string;
	/** Añade el punto verde y la palabra "En directo": nunca solo el color. */
	live?: boolean;
	name?: ReactNode;
	/** Pronombres o cargo, junto al nombre. */
	role?: ReactNode;
	/** Solo para maquetar: en directo no se pasa nada y OBS pone la cámara debajo. */
	children?: ReactNode;
	/** Sustituye a "En directo" (ampliación sobre la guía). */
	liveLabel?: string;
	className?: string;
	style?: CSSProperties;
}

/** Marco de cámara con el interior vacío (transparente) y etiqueta de nombre y estado, siempre en oscuro. */
export function CamFrame({
	ratio = "16:9",
	width,
	live = false,
	name,
	role,
	children,
	liveLabel,
	className,
	style,
}: CamFrameProps) {
	const [w, h] = ratio.split(":");
	return (
		<div
			className={cx(
				STREAM_ROOT,
				// Sin fondo: taparía la cámara. El borde va encima del contenido, en un ::after.
				"relative max-w-full overflow-hidden rounded-2xl after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:border-2 after:border-primary",
				width == null && "w-[480px]",
				className,
			)}
			style={{ aspectRatio: `${w} / ${h ?? w}`, ...(width == null ? null : { width }), ...style }}
		>
			{children ?? null}
			{name || live ? (
				<div className="absolute bottom-4 left-4 z-1 inline-flex max-w-[calc(100%-32px)] items-center gap-3 rounded-lg border border-secondary bg-primary_alt px-3 py-1.5 text-sm font-medium text-secondary">
					{live ? (
						<span className="inline-flex items-center gap-2 font-semibold text-primary">
							<span
								aria-hidden="true"
								className="inline-block size-2 flex-none rounded-full bg-fg-success-secondary"
							/>
							{liveLabel ?? defaultStrings.streamLive}
						</span>
					) : null}
					{name ? <span className="truncate font-semibold text-primary">{name}</span> : null}
					{role ? <span className="whitespace-nowrap text-tertiary">{role}</span> : null}
				</div>
			) : null}
		</div>
	);
}
