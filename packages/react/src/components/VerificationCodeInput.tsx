"use client";

import { type ClipboardEvent, type KeyboardEvent, useId, useRef, useState } from "react";
import { cx } from "../internal/cx.js";
import { type FieldProps, FieldShell, type FieldSize } from "../internal/field.js";
import { defaultStrings } from "../internal/strings.js";

export interface VerificationCodeInputProps extends FieldProps {
	/**
	 * Número de dígitos. Con 6 se pinta un guion decorativo entre el tercero y el cuarto.
	 * @default 6
	 */
	digits?: 4 | 6;
	/**
	 * Casillas de 64 (`sm`), 80 (`md`) o 96px (`lg`).
	 * @default "md"
	 */
	size?: FieldSize;
	/** El código escrito, sin huecos. */
	value?: string;
	defaultValue?: string;
	/** Cada cambio, con el código escrito hasta ahora (sin huecos). */
	onChange?: (code: string) => void;
	/** Una vez cada vez que se rellenan todas las casillas, con el código completo. */
	onComplete?: (code: string) => void;
	disabled?: boolean;
	/** Nombre del campo al enviar el formulario. */
	name?: string;
	/** Nombre accesible de cada casilla. Por defecto, "Dígito 1 de 6". */
	digitLabel?: (n: number, total: number) => string;
	autoFocus?: boolean;
	id?: string;
	className?: string;
}

const CELL: Record<FieldSize, string> = {
	sm: "size-16 rounded-[10px] text-display-lg",
	md: "size-20 rounded-xl text-display-lg",
	lg: "size-24 rounded-xl text-display-xl",
};
// Reposo con borde de 1px; con cifra o con foco, 2px en border-brand (sin anillo exterior).
const BORDER =
	"shadow-[var(--shadow-xs),inset_0_0_0_1px_var(--border-primary)] [&:not(:placeholder-shown)]:shadow-[var(--shadow-xs),inset_0_0_0_2px_var(--border-brand)] focus:shadow-[var(--shadow-xs),inset_0_0_0_2px_var(--border-brand)]";
const BORDER_ERROR =
	"shadow-[var(--shadow-xs),inset_0_0_0_1px_var(--border-error_subtle)] [&:not(:placeholder-shown)]:shadow-[var(--shadow-xs),inset_0_0_0_1px_var(--border-error_subtle)] focus:shadow-[var(--shadow-xs),inset_0_0_0_2px_var(--border-error)]";

const cellsOf = (code: string, n: number) =>
	Array.from({ length: n }, (_, i) => code.replace(/\D/g, "")[i] ?? "");

/** Código de verificación de 4 o 6 dígitos, una casilla por dígito, con pegado y autocompletado. */
export function VerificationCodeInput({
	label,
	labelAside,
	required,
	hint,
	error,
	digits = 6,
	size = "md",
	value,
	defaultValue = "",
	onChange,
	onComplete,
	disabled,
	name,
	digitLabel = defaultStrings.digitOf,
	autoFocus,
	id: givenId,
	className,
}: VerificationCodeInputProps) {
	const autoId = useId();
	const id = givenId ?? autoId;
	const [inner, setInner] = useState(() => cellsOf(defaultValue, digits));
	// Controlado: las casillas salen del código del padre (sin huecos).
	const cells = value !== undefined ? cellsOf(value, digits) : inner;
	const refs = useRef<(HTMLInputElement | null)[]>([]);
	const message = typeof error === "string" && error ? error : hint;

	const focus = (i: number) => {
		const el = refs.current[Math.max(0, Math.min(digits - 1, i))];
		el?.focus();
		el?.select();
	};
	const commit = (next: string[]) => {
		const wasComplete = cells.every(Boolean);
		if (value === undefined) setInner(next);
		const code = next.join("");
		onChange?.(code);
		if (!wasComplete && next.every(Boolean)) onComplete?.(code);
	};
	// Reparte las cifras de `text` desde la casilla `i` (escritura, pegado o autocompletado).
	const fill = (i: number, text: string) => {
		const typed = text.replace(/\D/g, "");
		if (!typed) return;
		const next = [...cells];
		for (let k = 0; k < typed.length && i + k < digits; k++) next[i + k] = typed[k] as string;
		commit(next);
		focus(i + typed.length);
	};
	const onKeyDown = (i: number, e: KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Backspace") {
			e.preventDefault();
			const next = [...cells];
			if (cells[i]) {
				next[i] = "";
				commit(next);
			} else if (i > 0) {
				next[i - 1] = "";
				commit(next);
				focus(i - 1);
			}
		} else if (e.key === "ArrowLeft") {
			e.preventDefault();
			focus(i - 1);
		} else if (e.key === "ArrowRight") {
			e.preventDefault();
			focus(i + 1);
		}
	};
	const onPaste = (i: number, e: ClipboardEvent<HTMLInputElement>) => {
		const text = e.clipboardData?.getData("text") ?? "";
		// Sin datos legibles, el navegador pega el texto en la casilla y se reparte desde `onChange`.
		if (!text) return;
		e.preventDefault();
		fill(i, text);
	};

	return (
		<FieldShell
			id={id}
			label={label}
			labelAside={labelAside}
			required={required}
			hint={hint}
			error={error}
			size={size}
			className={className}
		>
			<fieldset
				aria-labelledby={label ? `${id}-label` : undefined}
				aria-describedby={message ? `${id}-hint` : undefined}
				className={cx(
					"m-0 flex min-w-0 items-center border-0 p-0",
					size === "sm" ? "gap-2" : "gap-3",
				)}
			>
				{cells.map((cell, i) => (
					// Las casillas son fijas: el índice es su identidad.
					// biome-ignore lint/suspicious/noArrayIndexKey: posición fija de cada dígito
					<span key={i} className="contents">
						{digits === 6 && i === 3 ? (
							<span
								aria-hidden="true"
								className={cx(
									"text-center font-display text-display-xl font-medium text-utility-neutral-300",
									size === "sm" ? "w-7" : "w-5",
								)}
							>
								-
							</span>
						) : null}
						<input
							ref={(el) => {
								refs.current[i] = el;
							}}
							id={i === 0 ? id : `${id}-${i + 1}`}
							aria-label={digitLabel(i + 1, digits)}
							aria-invalid={error ? true : undefined}
							inputMode="numeric"
							pattern="[0-9]*"
							autoComplete={i === 0 ? "one-time-code" : "off"}
							// biome-ignore lint/a11y/noAutofocus: solo si lo pide quien lo usa (pantalla de un solo código)
							autoFocus={autoFocus && i === 0}
							placeholder="0"
							value={cell}
							disabled={disabled}
							onFocus={(e) => e.target.select()}
							onChange={(e) => {
								const text = e.target.value;
								if (text === "") {
									const next = [...cells];
									next[i] = "";
									commit(next);
								} else if (cell && text.length === 2) {
									// Se escribió junto a la cifra que ya había: queda la nueva.
									fill(i, text.replace(cell, ""));
								} else fill(i, text);
							}}
							onKeyDown={(e) => onKeyDown(i, e)}
							onPaste={(e) => onPaste(i, e)}
							className={cx(
								"flex-none bg-primary p-0 text-center font-display font-medium text-brand-tertiary_alt outline-none transition-shadow duration-100 placeholder:text-placeholder disabled:cursor-not-allowed disabled:opacity-50",
								CELL[size],
								error ? BORDER_ERROR : BORDER,
							)}
						/>
					</span>
				))}
				{name ? <input type="hidden" name={name} value={cells.join("")} /> : null}
			</fieldset>
		</FieldShell>
	);
}
