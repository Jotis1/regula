import type { ReactNode } from "react";
import { cx } from "../internal/cx.js";
import { MessageAudioPlayer } from "../internal/message-audio.js";
import { defaultStrings } from "../internal/strings.js";
import { Avatar, type AvatarProps } from "./Avatar.js";
import { Icon, type IconName, iconSlot } from "./Icon.js";

/** Los nueve tipos del Figma (`Message`, `1242:996`). */
export type MessageType =
	| "message"
	| "reply"
	| "file"
	| "audio"
	| "image"
	| "video"
	| "link-preview"
	| "link"
	| "typing";

export interface MessageReaction {
	/** El emoji, como «❤️». */
	emoji: string;
	/** Cuántas personas reaccionaron. Sin él, una. */
	count?: number;
	/** Nombre para lectores de pantalla, como «Me encanta». Por defecto, el emoji. */
	label?: string;
	/** La reacción es del usuario: se marca y `onReact` la quita. */
	reacted?: boolean;
}

export interface MessageAction {
	icon: IconName | ReactNode;
	label: string;
	onClick?: () => void;
}

export interface MessageLink {
	url: string;
	title?: ReactNode;
	description?: ReactNode;
	/** Imagen de la vista previa (`link-preview`): una URL o un nodo. */
	image?: string | ReactNode;
}

export interface MessageMedia {
	/** URL de la imagen o del vídeo. */
	src?: string;
	/** Un nodo en lugar de `src`, para pintar lo que quieras. */
	node?: ReactNode;
	/** Texto alternativo de la imagen o nombre del vídeo. Sin él, la imagen es decorativa. */
	alt?: string;
	/** Fotograma del vídeo antes de reproducirlo. */
	poster?: string;
	/** Nombre y tamaño bajo la imagen, como en los enviados del Figma. */
	name?: ReactNode;
	size?: ReactNode;
}

export interface MessageFile {
	name: ReactNode;
	size?: ReactNode;
	/** Icono del tipo, como `<FileImageJpg />` de `@jotis-me/icons/files`. */
	icon?: ReactNode;
	href?: string;
}

export interface MessageAudio {
	src?: string;
	/** Duración escrita, como «00:28». */
	duration: string;
}

export type MessageStatus = "unread" | "read" | "failed";

export interface MessageLabels {
	unread: string;
	read: string;
	failed: string;
	retry: string;
	reactions: string;
	reaction: (label: string, count: number) => string;
	actions: string;
	play: string;
	pause: string;
	audio: string;
}

const LABELS: MessageLabels = {
	unread: "Enviado",
	read: "Leído",
	failed: "No se ha enviado",
	retry: "Reintentar el envío",
	reactions: "Reacciones",
	reaction: (label, count) => `${label}: ${count}`,
	actions: "Acciones del mensaje",
	play: "Reproducir el audio",
	pause: "Pausar el audio",
	audio: "Mensaje de voz",
};

export interface MessageProps {
	/** Quien escribe. En los enviados, por defecto "Tú". */
	author?: ReactNode;
	/** Avatar del recibido (32px). Por defecto, las dos primeras letras del autor. */
	avatar?: AvatarProps;
	time?: ReactNode;
	/** Enviado por el usuario: a la derecha, sin avatar, burbuja `bg-primary` con la esquina superior derecha recta. */
	sent?: boolean;
	/** Puntos de "escribiendo" en lugar del contenido. Es lo mismo que `type="typing"`. */
	typing?: boolean;
	/** Punto de en línea en el avatar. */
	online?: boolean;
	/** Bajo la burbuja: reacciones, adjuntos, "Visto". */
	footer?: ReactNode;
	/** Texto del mensaje. Respuestas cortas, en párrafos. */
	children?: ReactNode;
	/**
	 * Tipo del Figma. Sin él, el mensaje de siempre. Cada tipo usa su prop: `reply` (`reply`), `file` (`file`), `audio`
	 * (`audio`), `image` y `video` (`media`), `link-preview` y `link` (`link`).
	 */
	type?: MessageType;
	/** El texto al que responde (`reply`), en una cita encima del mensaje. */
	reply?: ReactNode;
	file?: MessageFile;
	audio?: MessageAudio;
	media?: MessageMedia;
	link?: MessageLink;
	/** Reacciones bajo el mensaje, cada una con su contador. Con `onReact`, son botones. */
	reactions?: MessageReaction[];
	onReact?: (emoji: string) => void;
	/** Estado de un mensaje enviado: enviado sin leer, leído o fallido. */
	status?: MessageStatus;
	/** Con `status="failed"`, el icono de fallo es un botón que avisa aquí. */
	onRetry?: () => void;
	/** Panel de acciones bajo la burbuja (editar, copiar, regenerar…), en una barra oscura. */
	actions?: MessageAction[];
	labels?: Partial<MessageLabels>;
	className?: string;
}

/** Mensaje de una conversación, recibido (con avatar, a la izquierda) o enviado (a la derecha). Es el chat de Emptor. */
export function Message(props: MessageProps) {
	const { type, reactions, status, actions } = props;
	return type === undefined && !reactions?.length && !status && !actions?.length ? (
		<ClassicMessage {...props} />
	) : (
		<TypedMessage {...props} />
	);
}

function TypingDots() {
	return (
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
	);
}

/** El de siempre: su HTML no cambia. */
function ClassicMessage({
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
					{typing ? <TypingDots /> : children}
				</div>
				{footer ?? null}
			</div>
		</div>
	);
}

const BUBBLE = "text-md wrap-anywhere text-primary shadow-[inset_0_0_0_1px_var(--border-secondary)]";
const bubble = (sent?: boolean) =>
	cx(BUBBLE, sent ? "rounded-lg rounded-tr-none bg-primary" : "rounded-lg rounded-tl-none bg-secondary");

function StatusMark({
	status,
	onRetry,
	t,
}: {
	status: MessageStatus;
	onRetry?: () => void;
	t: MessageLabels;
}) {
	if (status === "failed")
		return onRetry ? (
			<button
				type="button"
				onClick={onRetry}
				aria-label={`${t.failed}. ${t.retry}`}
				title={t.retry}
				className="inline-flex cursor-pointer rounded-full border-0 bg-transparent p-0 text-fg-error-primary focus-visible:shadow-focus-ring focus-visible:outline-none"
			>
				<Icon name="alert-circle" size={16} />
			</button>
		) : (
			<span className="inline-flex text-fg-error-primary">
				<Icon name="alert-circle" size={16} />
				<span className="sr-only">{t.failed}</span>
			</span>
		);
	const read = status === "read";
	return (
		<span
			className={cx(
				"relative inline-flex h-4",
				read ? "w-5 text-fg-brand-primary" : "w-4 text-fg-quaternary",
			)}
		>
			<Icon name="check" size={16} />
			{read ? (
				<span className="absolute top-0 left-1">
					<Icon name="check" size={16} />
				</span>
			) : null}
			<span className="sr-only">{read ? t.read : t.unread}</span>
		</span>
	);
}

function Reactions({
	reactions,
	onReact,
	t,
	sent,
}: {
	reactions: MessageReaction[];
	onReact?: (emoji: string) => void;
	t: MessageLabels;
	sent?: boolean;
}) {
	return (
		<ul
			aria-label={t.reactions}
			className={cx("m-0 flex list-none flex-wrap gap-1 p-0", sent ? "justify-end" : "justify-end")}
		>
			{reactions.map((r) => {
				const count = r.count ?? 1;
				const name = t.reaction(r.label ?? r.emoji, count);
				const pill = cx(
					"inline-flex h-6 items-center gap-1 rounded-full px-2 text-sm font-medium text-secondary shadow-[inset_0_0_0_1px_var(--border-secondary)]",
					r.reacted
						? "bg-brand-primary shadow-[inset_0_0_0_1px_var(--border-brand)]"
						: "bg-primary",
				);
				const content = (
					<>
						<span aria-hidden="true">{r.emoji}</span>
						{count > 1 ? <span aria-hidden="true">{count}</span> : null}
					</>
				);
				return (
					<li key={r.emoji} className="flex">
						{onReact ? (
							<button
								type="button"
								aria-label={name}
								aria-pressed={!!r.reacted}
								onClick={() => onReact(r.emoji)}
								className={cx(
									pill,
									"cursor-pointer border-0 hover:bg-primary_hover focus-visible:shadow-focus-ring focus-visible:outline-none",
								)}
							>
								{content}
							</button>
						) : (
							<span className={pill}>
								{content}
								<span className="sr-only">{name}</span>
							</span>
						)}
					</li>
				);
			})}
		</ul>
	);
}

function ActionsPanel({ actions, t }: { actions: MessageAction[]; t: MessageLabels }) {
	return (
		<div
			role="toolbar"
			aria-label={t.actions}
			className="inline-flex gap-0.5 self-end rounded-lg bg-primary-solid p-1 shadow-lg"
		>
			{actions.map((a) => (
				<button
					key={a.label}
					type="button"
					aria-label={a.label}
					title={a.label}
					onClick={a.onClick}
					className="inline-flex cursor-pointer rounded-md border-0 bg-transparent p-1.5 text-fg-quaternary hover:bg-[var(--alpha-white-10)] hover:text-fg-white focus-visible:shadow-focus-ring focus-visible:outline-none [&_svg]:size-4"
				>
					{iconSlot(a.icon, 16)}
				</button>
			))}
		</div>
	);
}

function LinkCard({ link, preview }: { link: MessageLink; preview: boolean }) {
	return (
		<div className="flex flex-col gap-2">
			{preview && link.image ? (
				<div className="aspect-[16/9] overflow-hidden rounded-md bg-tertiary">
					{typeof link.image === "string" ? (
						<img src={link.image} alt="" className="block size-full object-cover" />
					) : (
						link.image
					)}
				</div>
			) : null}
			{!preview && (link.title || link.description) ? (
				<div className="flex gap-2 rounded-md bg-primary p-2.5 shadow-[inset_0_0_0_1px_var(--border-secondary)]">
					<span className="mt-0.5 flex flex-none text-fg-quaternary">
						<Icon name="link-01" size={16} />
					</span>
					<span className="flex min-w-0 flex-col text-sm">
						{link.title ? (
							<span className="truncate font-medium text-secondary">{link.title}</span>
						) : null}
						{link.description ? (
							<span className="truncate text-tertiary">{link.description}</span>
						) : null}
					</span>
				</div>
			) : null}
			<a
				href={link.url}
				className="truncate text-md text-primary underline decoration-1 underline-offset-2 hover:text-brand-secondary focus-visible:rounded-sm focus-visible:shadow-focus-ring focus-visible:outline-none"
			>
				{link.url}
			</a>
		</div>
	);
}

function TypedMessage({
	author,
	avatar,
	time,
	sent,
	typing,
	online,
	footer,
	children,
	type: typeProp,
	reply,
	file,
	audio,
	media,
	link,
	reactions,
	onReact,
	status,
	onRetry,
	actions,
	labels,
	className,
}: MessageProps) {
	const t = { ...LABELS, ...labels };
	const type = typing ? "typing" : (typeProp ?? "message");
	let body: ReactNode;
	if (type === "typing") {
		body = (
			<div className={cx(bubble(sent), "px-3 py-2")}>
				<TypingDots />
			</div>
		);
	} else if (type === "reply") {
		body = (
			<div className={cx(bubble(sent), "flex flex-col gap-2 p-1.5")}>
				{reply ? (
					<blockquote className="m-0 truncate rounded-md bg-secondary px-2.5 py-1.5 text-sm text-tertiary shadow-[inset_2px_0_0_var(--border-brand),inset_0_0_0_1px_var(--border-secondary)]">
						{reply}
					</blockquote>
				) : null}
				<div className="px-1.5 pb-1 whitespace-pre-wrap">{children}</div>
			</div>
		);
	} else if (type === "file" && file) {
		const inner = (
			<>
				<span className="flex size-10 flex-none items-center justify-center [&_svg]:size-10">
					{file.icon ?? <Icon name="file-04" size={32} />}
				</span>
				<span className="flex min-w-0 flex-col text-sm">
					<span className="truncate font-medium text-secondary">{file.name}</span>
					{file.size ? <span className="text-tertiary">{file.size}</span> : null}
				</span>
			</>
		);
		body = file.href ? (
			<a
				href={file.href}
				className={cx(
					bubble(sent),
					"flex items-center gap-3 px-3.5 py-2.5 no-underline hover:bg-primary_hover focus-visible:shadow-focus-ring focus-visible:outline-none",
				)}
			>
				{inner}
			</a>
		) : (
			<div className={cx(bubble(sent), "flex items-center gap-3 px-3.5 py-2.5")}>{inner}</div>
		);
	} else if (type === "audio" && audio) {
		body = (
			<div className={cx(bubble(sent), "px-3 py-2")}>
				<MessageAudioPlayer src={audio.src} duration={audio.duration} labels={t} />
			</div>
		);
	} else if (type === "image" && media) {
		body = (
			<figure className="m-0 flex flex-col gap-1.5">
				<div className="overflow-hidden rounded-lg shadow-[inset_0_0_0_1px_var(--border-secondary)]">
					{media.node ??
						(media.src ? (
							<img src={media.src} alt={media.alt ?? ""} className="block w-full" />
						) : null)}
				</div>
				{media.name || media.size ? (
					<figcaption className="flex justify-between gap-2 text-sm">
						<span className="truncate font-medium text-secondary">{media.name}</span>
						<span className="flex-none text-tertiary">{media.size}</span>
					</figcaption>
				) : null}
			</figure>
		);
	} else if (type === "video" && media) {
		body = (
			<div className="overflow-hidden rounded-lg bg-primary-solid">
				{media.node ??
					(media.src ? (
						// biome-ignore lint/a11y/useMediaCaption: el vídeo lo pone quien lo usa; los subtítulos, con <track> en `node`
						<video
							src={media.src}
							poster={media.poster}
							controls
							preload="none"
							aria-label={media.alt}
							className="block w-full"
						/>
					) : null)}
			</div>
		);
	} else if ((type === "link-preview" || type === "link") && link) {
		body = (
			<div className={cx(bubble(sent), "p-2.5")}>
				<LinkCard link={link} preview={type === "link-preview"} />
				{children ? <div className="mt-2 whitespace-pre-wrap">{children}</div> : null}
			</div>
		);
	} else {
		body = <div className={cx(bubble(sent), "px-3 py-2 whitespace-pre-wrap")}>{children}</div>;
	}

	return (
		<div className={cx("flex max-w-[480px] gap-3 font-body", sent && "ml-auto justify-end", className)}>
			{sent ? null : (
				<Avatar
					size="sm"
					status={online ? "online" : undefined}
					{...(avatar ?? { initials: typeof author === "string" ? author.slice(0, 2) : "?" })}
				/>
			)}
			<div className="flex min-w-0 flex-1 flex-col gap-1.5">
				<div className="flex items-baseline justify-between gap-2">
					<span className="text-sm font-medium text-secondary">
						{sent ? (author ?? defaultStrings.you) : author}
					</span>
					<span className="inline-flex items-center gap-1.5 self-center text-xs text-tertiary">
						{time}
						{sent && status ? <StatusMark status={status} onRetry={onRetry} t={t} /> : null}
					</span>
				</div>
				{body}
				{actions?.length ? <ActionsPanel actions={actions} t={t} /> : null}
				{reactions?.length ? (
					<Reactions reactions={reactions} onReact={onReact} t={t} sent={sent} />
				) : null}
				{footer ?? null}
			</div>
		</div>
	);
}
