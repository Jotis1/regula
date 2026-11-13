"use client";

import { Command, FaceSmile, Microphone02, Paperclip, Send01 } from "@untitledui/icons";
import { type KeyboardEvent, type ReactNode, useState } from "react";
import { cx } from "../internal/cx.js";
import { defaultStrings } from "../internal/strings.js";
import { Button } from "./Button.js";

export type MessageInputVariant = "minimal" | "textarea" | "advanced";

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
	/**
	 * Tipo del Figma (`Message action`, `9206:602532`). Sin él, la caja de siempre. `minimal`: una línea con el botón
	 * de enviar al lado. `textarea`: área de texto con micrófono arriba y adjuntar, emoji y «Enviar» abajo. `advanced`:
	 * área de texto con micrófono y una barra inferior con `toolbar` a la izquierda y «Atajos» y «Adjuntar» a la derecha.
	 */
	variant?: MessageInputVariant;
	/** Con ella, el botón de micrófono (`textarea` y `advanced`). */
	onVoice?: () => void;
	/** Con ella, el botón de emoji (`textarea`). */
	onEmoji?: () => void;
	/** Con ella, el botón «Atajos» (`advanced`). */
	onShortcuts?: () => void;
	/** A la izquierda de la barra de `advanced`, como el selector de persona o de modelo. */
	toolbar?: ReactNode;
	/** Textos de los botones nuevos. */
	labels?: Partial<{ voice: string; emoji: string; shortcuts: string }>;
	"aria-label"?: string;
	className?: string;
}

const FRAME =
	"rounded-lg bg-primary font-body shadow-[var(--shadow-xs),inset_0_0_0_1px_var(--border-primary)] focus-within:shadow-[var(--shadow-xs),inset_0_0_0_2px_var(--border-brand)]";
const FIELD =
	"resize-none border-0 bg-transparent p-0 font-body text-md text-primary outline-none placeholder:text-placeholder disabled:cursor-not-allowed";
const TEXT_ACTION =
	"inline-flex cursor-pointer items-center gap-1 rounded-md border-0 bg-transparent px-1.5 py-1 font-body text-xs font-semibold text-tertiary hover:bg-primary_hover hover:text-tertiary_hover focus-visible:shadow-focus-ring focus-visible:outline-none disabled:cursor-not-allowed [&_svg]:text-fg-quaternary";

/** Caja para escribir y enviar un mensaje, con botón de adjuntar opcional. */
export function MessageInput({
	placeholder = defaultStrings.writeMessage,
	onSend,
	onAttach,
	sendLabel = defaultStrings.send,
	attachLabel = defaultStrings.attach,
	disabled,
	variant,
	onVoice,
	onEmoji,
	onShortcuts,
	toolbar,
	labels,
	"aria-label": ariaLabel,
	className,
}: MessageInputProps) {
	const [text, setText] = useState("");
	const empty = !text.trim();
	const t = { voice: "Dictar con la voz", emoji: "Añadir un emoji", shortcuts: "Atajos", ...labels };
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
	const field = (rows: number, extra?: string) => (
		<textarea
			rows={rows}
			value={text}
			placeholder={placeholder}
			aria-label={ariaLabel ?? placeholder ?? defaultStrings.message}
			disabled={disabled}
			onChange={(e) => setText(e.target.value)}
			onKeyDown={onKeyDown}
			className={cx(FIELD, extra)}
		/>
	);
	const voice = onVoice ? (
		<Button
			hierarchy="tertiary"
			size="xs"
			iconOnly={<Microphone02 size={16} />}
			label={t.voice}
			disabled={disabled}
			onClick={onVoice}
		/>
	) : null;

	if (variant === "minimal")
		return (
			<div className={cx("flex items-center gap-3", disabled && "opacity-50", className)}>
				<div className={cx(FRAME, "flex min-w-0 flex-1 items-center px-3.5 py-2.5")}>
					{field(1, "flex-1 leading-6")}
				</div>
				<Button
					hierarchy="secondary"
					size="lg"
					iconOnly={Send01}
					label={sendLabel}
					disabled={disabled || empty}
					onClick={send}
				/>
			</div>
		);

	if (variant === "textarea")
		return (
			<div
				className={cx(
					FRAME,
					"flex flex-col gap-2 px-3.5 pt-3 pb-3",
					disabled && "opacity-50",
					className,
				)}
			>
				<div className="flex items-start gap-2">
					{field(3, "min-w-0 flex-1")}
					{voice}
				</div>
				<div className="flex items-center justify-end gap-1">
					{onAttach ? (
						<Button
							hierarchy="tertiary"
							size="xs"
							iconOnly={Paperclip}
							label={attachLabel}
							disabled={disabled}
							onClick={onAttach}
						/>
					) : null}
					{onEmoji ? (
						<Button
							hierarchy="tertiary"
							size="xs"
							iconOnly={<FaceSmile size={16} />}
							label={t.emoji}
							disabled={disabled}
							onClick={onEmoji}
						/>
					) : null}
					<Button
						hierarchy="link-color"
						size="sm"
						disabled={disabled || empty}
						onClick={send}
						className="ml-2"
					>
						{sendLabel}
					</Button>
				</div>
			</div>
		);

	if (variant === "advanced")
		return (
			<div className={cx(FRAME, "flex flex-col overflow-hidden", disabled && "opacity-50", className)}>
				<div className="flex items-start gap-2 px-3.5 pt-3 pb-2">
					{field(4, "min-w-0 flex-1")}
					{voice}
				</div>
				<div className="flex items-center justify-between gap-2 bg-secondary px-3 py-1.5 shadow-[inset_0_1px_0_var(--border-secondary)]">
					<div className="flex min-w-0 items-center">{toolbar}</div>
					<div className="flex items-center gap-1">
						{onShortcuts ? (
							<button
								type="button"
								onClick={onShortcuts}
								disabled={disabled}
								className={TEXT_ACTION}
							>
								<Command size={14} />
								{t.shortcuts}
							</button>
						) : null}
						{onAttach ? (
							<button
								type="button"
								onClick={onAttach}
								disabled={disabled}
								className={TEXT_ACTION}
							>
								<Paperclip size={14} />
								{attachLabel}
							</button>
						) : null}
						<Button
							size="xs"
							iconOnly={Send01}
							label={sendLabel}
							disabled={disabled || empty}
							onClick={send}
						/>
					</div>
				</div>
			</div>
		);

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
						iconOnly={Paperclip}
						label={attachLabel}
						disabled={disabled}
						onClick={onAttach}
					/>
				) : null}
				<Button size="sm" iconTrailing={Send01} disabled={disabled || empty} onClick={send}>
					{sendLabel}
				</Button>
			</div>
		</div>
	);
}
