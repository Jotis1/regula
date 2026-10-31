"use client";

import { type KeyboardEvent, useState } from "react";
import { cx } from "../internal/cx.js";
import { defaultStrings } from "../internal/strings.js";
import { Button } from "./Button.js";

export interface MessageInputProps {
	/** También es el nombre accesible del campo si no pasas `aria-label`. */
	placeholder?: string;
	/** Recibe el texto sin espacios a los lados. Enter envía y Mayús+Enter salta de línea. */
	onSend?: (text: string) => void;
	/** Con esta prop aparece el botón de adjuntar. */
	onAttach?: () => void;
	/** @default "Enviar" */
	sendLabel?: string;
	/** Nombre accesible del botón de adjuntar. */
	attachLabel?: string;
	disabled?: boolean;
	"aria-label"?: string;
	className?: string;
}

/** Caja para escribir y enviar un mensaje, con botón de adjuntar opcional. */
export function MessageInput({
	placeholder = defaultStrings.writeMessage,
	onSend,
	onAttach,
	sendLabel = defaultStrings.send,
	attachLabel = defaultStrings.attach,
	disabled,
	"aria-label": ariaLabel,
	className,
}: MessageInputProps) {
	const [text, setText] = useState("");
	const empty = !text.trim();
	const send = () => {
		if (disabled || empty) return;
		onSend?.(text.trim());
		setText("");
	};
	const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
		// Con un método de entrada (IME) a medias, Enter confirma la palabra, no envía
		if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
			e.preventDefault();
			send();
		}
	};

	return (
		<div
			className={cx(
				"flex flex-col gap-2 rounded-lg bg-primary pt-3 pr-3 pb-2 pl-3.5 font-body shadow-[var(--shadow-xs),inset_0_0_0_1px_var(--border-primary)] focus-within:shadow-[var(--shadow-xs),inset_0_0_0_2px_var(--border-brand)] has-[textarea:focus-visible]:shadow-[var(--shadow-xs),inset_0_0_0_2px_var(--border-brand),var(--focus-ring-shadow)]",
				disabled && "opacity-50",
				className,
			)}
		>
			<textarea
				rows={2}
				value={text}
				placeholder={placeholder}
				aria-label={ariaLabel ?? placeholder ?? defaultStrings.message}
				disabled={disabled}
				onChange={(e) => setText(e.target.value)}
				onKeyDown={onKeyDown}
				className="resize-none border-0 bg-transparent p-0.5 font-body text-md text-primary outline-none placeholder:text-placeholder disabled:cursor-not-allowed"
			/>
			<div className="flex items-center justify-end gap-1">
				{onAttach ? (
					<Button
						hierarchy="tertiary"
						size="sm"
						iconOnly="paperclip"
						label={attachLabel}
						disabled={disabled}
						onClick={onAttach}
					/>
				) : null}
				<Button size="sm" iconTrailing="send-01" disabled={disabled || empty} onClick={send}>
					{sendLabel}
				</Button>
			</div>
		</div>
	);
}
