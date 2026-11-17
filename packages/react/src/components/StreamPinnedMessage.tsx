import { Pin01 } from "@untitledui/icons";
import { ChatLine, type ChatMessage } from "../internal/chat-line.js";
import { cx } from "../internal/cx.js";
import { STREAM_ROOT, type StreamMotion, streamMotion } from "../internal/stream.js";
import { defaultStrings } from "../internal/strings.js";

export interface StreamPinnedMessageLabels {
	/** @default "Mensaje destacado" */
	pinned: string;
}

export interface StreamPinnedMessageProps {
	/** El mensaje, como en ChatBox. `text` es texto plano. */
	message: ChatMessage;
	/** Texts of the card, to translate. */
	labels?: Partial<StreamPinnedMessageLabels>;
	/** @default 420 */
	width?: number | string;
	/** `enter` entra en 250 ms; `exit` sale en 200 ms. Con menos movimiento, solo fundido. */
	state?: StreamMotion;
	/** Extra classes, merged with the component's own. */
	className?: string;
}

/** Un mensaje del chat destacado en pantalla, con la misma fila que ChatBox, siempre en oscuro. */
export function StreamPinnedMessage({ message, labels, width, state, className }: StreamPinnedMessageProps) {
	const pinned = labels?.pinned ?? defaultStrings.pinnedMessage;
	return (
		<div
			className={cx(
				STREAM_ROOT,
				"max-w-full rounded-2xl border border-secondary bg-primary_alt px-5 py-4 shadow-xl",
				width == null && "w-[420px]",
				streamMotion(state),
				className,
			)}
			style={width == null ? undefined : { width }}
		>
			<div className="flex items-center gap-1.5 text-sm font-medium text-tertiary">
				<Pin01 size={16} aria-hidden="true" className="flex-none text-fg-brand-primary" />
				{pinned}
			</div>
			{/* 500 caracteres no caben: como mucho cuatro líneas. */}
			<p className="m-0 mt-2 line-clamp-4 text-xl wrap-anywhere text-primary">
				<ChatLine message={message} />
			</p>
		</div>
	);
}
