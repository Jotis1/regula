import type { CSSProperties, ReactNode } from "react";
import { cx } from "../internal/cx.js";
import { keyText, STREAM_ROOT, stableKeys, streamMotion } from "../internal/stream.js";
import { defaultStrings } from "../internal/strings.js";
import { ChatBadge, type ChatBadgeKind } from "./ChatBadge.js";

export type ChatTone = "brand" | "sky" | "emerald" | "pink" | "purple" | "orange" | "indigo" | "neutral";

export interface ChatMessage {
	user: ReactNode;
	/**
	 * Lo que escribe el espectador. Siempre texto plano: llega del público y se pinta tal cual, nunca como HTML
	 * (por eso es `string` y no un nodo).
	 */
	text: string;
	/**
	 * Tono del nombre: escala `utility-<tono>-700`.
	 * @default "neutral"
	 */
	tone?: ChatTone;
	/** Insignias delante del nombre; no más de tres. */
	badges?: ChatBadgeKind[];
	/** Clave estable. Sin ella se deriva del usuario y el texto. */
	id?: string | number;
}

export interface ChatBoxProps {
	/** Del más antiguo al más reciente; no más de 12 visibles. */
	messages: ChatMessage[];
	/** @default 420 */
	width?: number | string;
	/** @default 520 */
	height?: number | string;
	/** Fondo mezclado con transparencia y desenfoque de 16px; sólido si el navegador no tiene `color-mix`. */
	translucent?: boolean;
	/**
	 * Desvanece la parte de arriba de la lista.
	 * @default true
	 */
	fade?: boolean;
	/** Solo el último mensaje entra con fundido y 8px de subida. */
	animate?: boolean;
	/** @default "Chat del directo" */
	"aria-label"?: string;
	className?: string;
}

// Clases enteras: Tailwind solo genera las que ve escritas.
const TONE: Record<ChatTone, string> = {
	brand: "text-utility-brand-700",
	sky: "text-utility-sky-700",
	emerald: "text-utility-emerald-700",
	pink: "text-utility-pink-700",
	purple: "text-utility-purple-700",
	orange: "text-utility-orange-700",
	indigo: "text-utility-indigo-700",
	neutral: "text-utility-neutral-700",
};

// La máscara solo usa el alfa: negro opaco arriba del 30 %, transparente en el borde.
const FADE: CSSProperties = {
	// color-fijo: máscara de desvanecido (solo cuenta el alfa), como BackgroundPattern
	maskImage: "linear-gradient(to bottom, transparent 0, black 30%)",
	WebkitMaskImage: "linear-gradient(to bottom, transparent 0, black 30%)",
};

const contentKey = (m: ChatMessage) => `${keyText(m.user)}|${m.text}`;

/** Chat del directo para overlay: anclado abajo, desvanecido arriba y siempre en oscuro. */
export function ChatBox({
	messages,
	width,
	height,
	translucent = false,
	fade = true,
	animate = false,
	"aria-label": ariaLabel,
	className,
}: ChatBoxProps) {
	const keys = stableKeys(messages, contentKey);
	const size: CSSProperties = {};
	if (width != null) size.width = width;
	if (height != null) size.height = height;
	return (
		<div
			role="log"
			aria-live="polite"
			aria-label={ariaLabel ?? defaultStrings.streamChat}
			className={cx(
				STREAM_ROOT,
				"max-w-full overflow-hidden rounded-2xl border border-secondary",
				width == null && "w-[420px]",
				height == null && "h-[520px]",
				// Tailwind emite el sólido y, con `@supports (color: color-mix(…))`, la mezcla al 72 %.
				translucent ? "bg-primary_alt/72 backdrop-blur-lg" : "bg-primary_alt",
				className,
			)}
			style={size}
		>
			<div className="flex h-full flex-col justify-end gap-3 p-4" style={fade ? FADE : undefined}>
				{messages.map((m, i) => (
					<div
						key={keys[i]}
						className={cx(
							"text-xl wrap-anywhere text-primary",
							i === messages.length - 1 && animate && streamMotion("enter"),
						)}
					>
						{m.badges?.length ? (
							<span className="mr-2 inline-flex gap-1 align-[-4px]">
								{m.badges.map((b) => (
									<ChatBadge key={b} kind={b} />
								))}
							</span>
						) : null}
						<span className={cx("font-semibold", TONE[m.tone ?? "neutral"] ?? TONE.neutral)}>
							{m.user}
							<span className="mr-2">:</span>
						</span>
						<span className="text-primary">{m.text}</span>
					</div>
				))}
			</div>
		</div>
	);
}
