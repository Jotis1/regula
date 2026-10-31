import type { ReactNode } from "react";
import { cx } from "./cx.js";

export type FieldSize = "sm" | "md" | "lg";

export interface FieldProps {
	/** Etiqueta visible encima del campo. El placeholder nunca la sustituye. */
	label?: ReactNode;
	/** Añade el asterisco tras la etiqueta (`text-brand-tertiary`, rojo con error). */
	required?: boolean;
	/** Pista bajo el campo. Con `error` de texto, la sustituye. */
	hint?: ReactNode;
	/** Mensaje de error, o `true` para marcar el error sin texto. */
	error?: string | boolean;
}

// Borde de 1px y shadow-xs; en foco, 2px en border-brand. Con teclado, además el anillo de foco.
const CONTROL =
	"flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-fg-quaternary transition-shadow duration-100 ease-linear shadow-[var(--shadow-xs),inset_0_0_0_1px_var(--border-primary)] focus-within:shadow-[var(--shadow-xs),inset_0_0_0_2px_var(--border-brand)] has-[:focus-visible]:shadow-[var(--shadow-xs),inset_0_0_0_2px_var(--border-brand),var(--focus-ring-shadow)]";
const CONTROL_ERROR =
	"shadow-[var(--shadow-xs),inset_0_0_0_1px_var(--border-error_subtle)] focus-within:shadow-[var(--shadow-xs),inset_0_0_0_2px_var(--border-error)] has-[:focus-visible]:shadow-[var(--shadow-xs),inset_0_0_0_2px_var(--border-error),var(--focus-ring-error-shadow)]";
const CONTROL_SIZE: Record<FieldSize, string> = {
	sm: "",
	md: "min-h-10",
	lg: "min-h-11 px-3.5 py-2.5",
};

/** Clases del elemento nativo: sin borde propio, el control pinta el marco. */
export const nativeClasses = (size: FieldSize = "md") =>
	cx(
		"min-w-0 flex-1 border-0 bg-transparent p-0 font-body text-md font-normal text-primary outline-none placeholder:text-placeholder disabled:cursor-not-allowed",
		size === "sm" && "text-sm",
	);

export const controlClasses = (size: FieldSize | undefined, error: FieldProps["error"], disabled?: boolean) =>
	cx(CONTROL, size && CONTROL_SIZE[size], error && CONTROL_ERROR, disabled && "opacity-50");

interface FieldShellProps extends FieldProps {
	id: string;
	size?: FieldSize;
	className?: string;
	children: ReactNode;
}

/** Etiqueta, control y pista o error, enlazados por `id`. Compartido por Input, Textarea y Select. */
export function FieldShell({
	id,
	label,
	required,
	hint,
	error,
	size = "md",
	className,
	children,
}: FieldShellProps) {
	const message = typeof error === "string" && error ? error : hint;
	return (
		<div className={cx("flex min-w-0 flex-col gap-1.5 font-body", className)}>
			{label ? (
				<label htmlFor={id} className="text-sm font-medium text-secondary">
					{label}
					{required ? (
						<span
							aria-hidden="true"
							className={cx("ml-0.5", error ? "text-error-primary" : "text-brand-tertiary")}
						>
							*
						</span>
					) : null}
				</label>
			) : null}
			{children}
			{message ? (
				<p
					id={`${id}-hint`}
					className={cx(
						"m-0 text-sm font-normal",
						size === "sm" && "text-xs",
						error ? "text-error-primary" : "text-tertiary",
					)}
				>
					{message}
				</p>
			) : null}
		</div>
	);
}

/** Atributos ARIA que enlazan el control con su pista o error. */
export const describedBy = (id: string, { hint, error }: FieldProps) => ({
	"aria-invalid": error ? true : undefined,
	"aria-describedby": hint || (typeof error === "string" && error) ? `${id}-hint` : undefined,
});
