import type { ReactNode } from "react";
import { cx } from "../internal/cx.js";
import { defaultStrings } from "../internal/strings.js";
import { Avatar, type AvatarProps } from "./Avatar.js";

export interface MessageProps {
	/** Quien escribe. En los enviados, por defecto "Tú". */
	author?: ReactNode;
	/** Avatar del recibido (32px). Por defecto, las dos primeras letras del autor. */
	avatar?: AvatarProps;
	time?: ReactNode;
	/** Enviado por el usuario: a la derecha, sin avatar, burbuja `bg-primary` con la esquina superior derecha recta. */
	sent?: boolean;
	/** Puntos de "escribiendo" en lugar del contenido. */
	typing?: boolean;
	/** Punto de en línea en el avatar. */
	online?: boolean;
	/** Bajo la burbuja: reacciones, adjuntos, "Visto". */
	footer?: ReactNode;
	/** Texto del mensaje. Respuestas cortas, en párrafos. */
	children?: ReactNode;
	className?: string;
}

/** Mensaje de una conversación, recibido (con avatar, a la izquierda) o enviado (a la derecha). Es el chat de Emptor. */
export function Message({
	author,
	avatar,
	time,
	sent,
	typing,
	online,
	footer,
	children,
	className,
}: MessageProps) {
	return (
		<div className={cx("flex max-w-[480px] gap-3 font-body", sent && "ml-auto justify-end", className)}>
			{sent ? null : (
				<Avatar
					size="sm"
					status={online ? "online" : undefined}
					{...(avatar ?? { initials: typeof author === "string" ? author.slice(0, 2) : "?" })}
				/>
			)}
			<div className="flex min-w-0 flex-col gap-1.5">
				<div className="flex items-baseline justify-between gap-2">
					<span className="text-sm font-medium text-secondary">
						{sent ? (author ?? defaultStrings.you) : author}
					</span>
					{time ? <span className="text-xs text-tertiary">{time}</span> : null}
				</div>
				<div
					className={cx(
						"px-3 py-2 text-md wrap-anywhere whitespace-pre-wrap text-primary shadow-[inset_0_0_0_1px_var(--border-secondary)]",
						sent
							? "rounded-lg rounded-tr-none bg-primary"
							: "rounded-lg rounded-tl-none bg-secondary",
					)}
				>
					{typing ? (
						<span className="inline-flex gap-1 py-2">
							<span className="sr-only">{defaultStrings.typing}</span>
							{[0, 1, 2].map((i) => (
								<i
									key={i}
									aria-hidden="true"
									className={cx(
										"size-1.5 rounded-full bg-fg-quaternary motion-safe:animate-[pulse_1s_infinite]",
										i === 1 && "[animation-delay:.2s]",
										i === 2 && "[animation-delay:.4s]",
									)}
								/>
							))}
						</span>
					) : (
						children
					)}
				</div>
				{footer ?? null}
			</div>
		</div>
	);
}
