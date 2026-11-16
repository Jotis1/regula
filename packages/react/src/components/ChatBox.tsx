import { Pin01 } from "@untitledui/icons";
import type { CSSProperties } from "react";
import { ChatLine, type ChatMessage } from "../internal/chat-line.js";
import { cx } from "../internal/cx.js";
import { keyText, STREAM_ROOT, stableKeys, streamMotion } from "../internal/stream.js";
import { defaultStrings } from "../internal/strings.js";

export type { ChatMessage, ChatTone } from "../internal/chat-line.js";

export interface ChatBoxLabels {
	/** La acción de elegir un mensaje: va en su marca y al principio de su nombre accesible. @default "Destacar" */
	select: string;
	/** La marca del elegido. @default "Destacado" */
	selected: string;
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
	/**
	 * Hace seleccionables los mensajes (ampliación sobre la guía): cada uno con `id` y sin `selectable: false` pasa a
	 * ser un botón que llama a `onSelect` con su mensaje, con una marca a la derecha que dice qué hace («Destacar»).
	 * Sin ella, el chat es de solo lectura.
	 */
	onSelect?: (message: ChatMessage) => void;
	/**
	 * `id` del mensaje elegido: lleva `aria-pressed`, el fondo y la raya de las líneas destacadas de CodeSnippet y la
	 * marca «Destacado». Solo con `onSelect`.
	 */
	selectedId?: string | number;
	/** Textos de la marca y del nombre accesible de cada mensaje. Solo con `onSelect`. */
	labels?: Partial<ChatBoxLabels>;
	/** @default "Chat del directo" */
	"aria-label"?: string;
	className?: string;
}

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
	onSelect,
	selectedId,
	labels,
	"aria-label": ariaLabel,
	className,
}: ChatBoxProps) {
	const selectLabel = labels?.select ?? defaultStrings.chatSelect;
	const selectedLabel = labels?.selected ?? defaultStrings.chatSelected;
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
				{messages.map((m, i) => {
					const row = cx(
						"text-xl wrap-anywhere text-primary",
						i === messages.length - 1 && animate && streamMotion("enter"),
					);
					if (!onSelect)
						return (
							<div key={keys[i]} className={row}>
								<ChatLine message={m} />
							</div>
						);
					// Con `onSelect`, todas las filas llevan el mismo relleno, para que no bailen entre sí.
					const pad = "rounded-md px-2 py-1";
					if (m.id == null || m.selectable === false)
						return (
							<div key={keys[i]} className={cx(row, pad)}>
								<ChatLine message={m} />
							</div>
						);
					const selected = m.id === selectedId;
					return (
						<button
							key={keys[i]}
							type="button"
							aria-pressed={selected}
							// El nombre empieza por la acción (design D3 de clarify-chat-selection); el estado va en aria-pressed.
							aria-label={defaultStrings.chatSelectName(selectLabel, keyText(m.user), m.text)}
							onClick={() => onSelect(m)}
							className={cx(
								row,
								pad,
								// `shrink-0`: la lista es un flex en columna y, cuando no caben todos, encogería los botones y
								// cortaría su texto. `flow-root` contiene el float de la marca.
								"group relative flow-root w-full shrink-0 cursor-pointer overflow-clip text-left transition-colors duration-100 focus-visible:shadow-focus-ring focus-visible:outline-none",
								// Como las líneas destacadas de CodeSnippet (D2), con el fondo de marca al 15 %: en oscuro bg-brand-primary_alt es
								// el mismo gris que el chat y no se vería. La raya es un pseudoelemento y no una sombra,
								// para que el anillo de foco no la tape.
								selected
									? "bg-brand-primary/15 before:absolute before:inset-y-0 before:left-0 before:w-0.5 before:bg-(--fg-brand-primary)"
									: "hover:bg-secondary_hover",
							)}
						>
							{/* Marca de la acción (D1): flota a la derecha con una línea de alto, así que solo la primera línea
							    del mensaje le deja sitio y las demás ocupan todo el ancho. Siempre ocupa su sitio, para que el
							    texto no se mueva al aparecer. */}
							<span
								aria-hidden="true"
								data-chat-action=""
								className={cx(
									"float-right ml-3 flex h-[1lh] items-center transition-opacity duration-100",
									!selected &&
										"opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 [@media(hover:none)]:opacity-100",
								)}
							>
								<span
									className={cx(
										"inline-flex items-center gap-1.5 text-sm font-medium",
										selected ? "text-brand-secondary" : "text-tertiary",
									)}
								>
									<Pin01
										size={16}
										className={cx(
											"flex-none",
											selected ? "text-fg-brand-primary" : "text-fg-quaternary",
										)}
									/>
									<span className={cx(!selected && "[@media(hover:none)]:hidden")}>
										{selected ? selectedLabel : selectLabel}
									</span>
								</span>
							</span>
							<span data-chat-text="">
								<ChatLine message={m} />
							</span>
						</button>
					);
				})}
			</div>
		</div>
	);
}
