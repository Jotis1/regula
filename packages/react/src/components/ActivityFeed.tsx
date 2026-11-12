import { File04 } from "@untitledui/icons";
import type { ReactNode } from "react";
import { cx } from "../internal/cx.js";
import { defaultStrings } from "../internal/strings.js";
import { Avatar, type AvatarProps } from "./Avatar.js";
import { Tag } from "./Tag.js";

/** Lo que va bajo el texto de un elemento: etiquetas, un archivo o un texto citado. */
export type ActivitySupporting =
	| {
			type: "tags";
			/** Una etiqueta por texto. */
			tags: string[];
	  }
	| {
			type: "file";
			name: ReactNode;
			/** «720 KB». */
			size?: ReactNode;
			/** Icono del archivo, como `<FileIcon type="pdf" />` de `@untitledui/file-icons`. Por defecto, un icono genérico. */
			icon?: ReactNode;
	  }
	| {
			type: "text";
			/** Texto en un recuadro, como una respuesta o una cita. */
			text: ReactNode;
	  };

export interface ActivityItem {
	author: ReactNode;
	/** Por defecto, las dos primeras letras del autor. */
	avatar?: AvatarProps;
	time?: ReactNode;
	/** Nombre de usuario bajo el autor (`@lana`), en el tipo `messages`. */
	handle?: ReactNode;
	/**
	 * Qué pasó. Admite `<strong>` para destacar el objeto. En el tipo `messages` es el mensaje y va en una burbuja.
	 */
	text: ReactNode;
	/** Adjunto, etiquetas… bajo el texto. */
	content?: ReactNode;
	/** Elemento de apoyo bajo el texto: etiquetas, archivo o texto citado. */
	supporting?: ActivitySupporting;
	/** Punto `fg-success-secondary` a la derecha. */
	unread?: boolean;
	/** Punto de estado en línea en el avatar. */
	online?: boolean;
}

export type ActivityDivider = "line" | "divider" | "connector" | "none";

export interface ActivityFeedProps {
	items: ActivityItem[];
	/**
	 * Cómo se separan los elementos: `line` y `divider` con una línea entre ellos, `connector` con una línea
	 * vertical entre avatares (historial de un elemento) y `none` sin nada.
	 * @default "line"
	 */
	divider?: ActivityDivider;
	/** Alias de `divider="connector"`, de antes de que existiera `divider`. */
	connector?: boolean;
	/**
	 * `notifications`: quién hizo qué. `messages`: el texto va en una burbuja bajo el autor y su usuario.
	 * @default "notifications"
	 */
	type?: "notifications" | "messages";
	/**
	 * Avatar de 40px (`md`) o 32px (`sm`).
	 * @default "md"
	 */
	size?: "sm" | "md";
	className?: string;
}

function Supporting({ item }: { item: ActivitySupporting }) {
	if (item.type === "tags") {
		return (
			<ul className="m-0 flex list-none flex-wrap gap-1.5 p-0">
				{item.tags.map((t) => (
					<li key={t}>
						<Tag size="md">{t}</Tag>
					</li>
				))}
			</ul>
		);
	}
	if (item.type === "file") {
		return (
			<div className="flex items-start gap-3">
				<span className="flex size-10 shrink-0 items-center justify-center text-fg-quaternary">
					{item.icon ?? <File04 size={32} />}
				</span>
				<div className="flex min-w-0 flex-col text-sm">
					<span className="font-medium text-secondary">{item.name}</span>
					{item.size ? <span className="text-tertiary">{item.size}</span> : null}
				</div>
			</div>
		);
	}
	return (
		<div className="rounded-lg border border-secondary bg-primary_alt p-3 text-sm text-secondary">
			{item.text}
		</div>
	);
}

/** Lista cronológica de lo que ha pasado: quién hizo qué y cuándo. */
export function ActivityFeed({
	items,
	divider,
	connector,
	type = "notifications",
	size = "md",
	className,
}: ActivityFeedProps) {
	const mode: ActivityDivider = divider ?? (connector ? "connector" : "line");
	const joined = mode === "connector";
	const messages = type === "messages";
	return (
		<ol
			className={cx(
				"m-0 flex max-w-[420px] list-none flex-col p-0 font-body",
				joined
					? "gap-0"
					: mode === "none"
						? "gap-4"
						: "gap-4 [&>li+li]:border-t [&>li+li]:border-secondary [&>li+li]:pt-4",
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
						{joined && i < items.length - 1 ? (
							<span
								aria-hidden="true"
								className="mb-1 min-h-4 w-0.5 flex-1 rounded-xs bg-[var(--border-secondary)]"
							/>
						) : null}
					</div>
					<div
						className={cx(
							"flex min-w-0 flex-1 flex-col",
							messages ? "gap-3" : "gap-0.5",
							"pr-4",
							joined && "pb-8",
						)}
					>
						{messages ? (
							<>
								<div className="flex flex-col">
									<div className="flex items-center gap-2">
										<span className="text-sm font-medium text-secondary">
											{it.author}
										</span>
										{it.time ? (
											<span className="text-xs text-tertiary">{it.time}</span>
										) : null}
									</div>
									{it.handle ? (
										<span className="text-sm text-tertiary">{it.handle}</span>
									) : null}
								</div>
								{it.supporting ? (
									<Supporting item={it.supporting} />
								) : (
									<div className="rounded-tr-lg rounded-b-lg border border-secondary bg-primary_alt p-3 text-sm text-secondary">
										{it.text}
									</div>
								)}
							</>
						) : (
							<>
								<div className="flex items-baseline gap-2">
									<span className="text-sm font-semibold text-secondary">{it.author}</span>
									{it.time ? (
										<span className="text-xs text-tertiary">{it.time}</span>
									) : null}
								</div>
								<div className="text-sm text-tertiary [&_b]:font-semibold [&_b]:text-secondary [&_strong]:font-semibold [&_strong]:text-secondary">
									{it.text}
								</div>
								{it.supporting ? (
									<div className="mt-2">
										<Supporting item={it.supporting} />
									</div>
								) : null}
							</>
						)}
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
