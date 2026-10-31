import type { ReactNode } from "react";
import { cx } from "../internal/cx.js";
import { defaultStrings } from "../internal/strings.js";
import { Avatar, type AvatarProps } from "./Avatar.js";

export interface ActivityItem {
	author: ReactNode;
	/** Por defecto, las dos primeras letras del autor. */
	avatar?: AvatarProps;
	time?: ReactNode;
	/** Qué pasó. Admite `<strong>` para destacar el objeto. */
	text: ReactNode;
	/** Adjunto, etiquetas… bajo el texto. */
	content?: ReactNode;
	/** Punto `fg-success-secondary` a la derecha. */
	unread?: boolean;
	/** Punto de estado en línea en el avatar. */
	online?: boolean;
}

export interface ActivityFeedProps {
	items: ActivityItem[];
	/** Línea vertical entre avatares en lugar de separadores (historial de un elemento). */
	connector?: boolean;
	/**
	 * Avatar de 40px (`md`) o 32px (`sm`).
	 * @default "md"
	 */
	size?: "sm" | "md";
	className?: string;
}

/** Lista cronológica de lo que ha pasado: quién hizo qué y cuándo. */
export function ActivityFeed({ items, connector, size = "md", className }: ActivityFeedProps) {
	return (
		<ol
			className={cx(
				"m-0 flex max-w-[420px] list-none flex-col p-0 font-body",
				connector ? "gap-0" : "gap-4 [&>li+li]:border-t [&>li+li]:border-secondary [&>li+li]:pt-4",
				className,
			)}
		>
			{items.map((it, i) => (
				// biome-ignore lint/suspicious/noArrayIndexKey: lista cronológica fija; los autores se repiten
				<li key={i} className="relative flex gap-3">
					<div className="flex flex-col items-center gap-1">
						<Avatar
							size={size}
							status={it.online ? "online" : undefined}
							{...(it.avatar ?? {
								initials: typeof it.author === "string" ? it.author.slice(0, 2) : "?",
							})}
						/>
						{connector && i < items.length - 1 ? (
							<span
								aria-hidden="true"
								className="mb-1 min-h-4 w-0.5 flex-1 rounded-xs bg-[var(--border-secondary)]"
							/>
						) : null}
					</div>
					<div className={cx("flex min-w-0 flex-1 flex-col gap-0.5 pr-4", connector && "pb-8")}>
						<div className="flex items-baseline gap-2">
							<span className="text-sm font-semibold text-secondary">{it.author}</span>
							{it.time ? <span className="text-xs text-tertiary">{it.time}</span> : null}
						</div>
						<div className="text-sm text-tertiary [&_b]:font-semibold [&_b]:text-secondary [&_strong]:font-semibold [&_strong]:text-secondary">
							{it.text}
						</div>
						{it.content ? <div className="mt-2">{it.content}</div> : null}
					</div>
					{it.unread ? (
						<span className="absolute top-1 right-0 size-2 rounded-full bg-fg-success-secondary">
							<span className="sr-only">{defaultStrings.unread}</span>
						</span>
					) : null}
				</li>
			))}
		</ol>
	);
}
