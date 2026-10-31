"use client";

import { type ReactNode, useEffect, useId, useRef, useState } from "react";
import { cx } from "../internal/cx.js";
import { defaultStrings } from "../internal/strings.js";
import { Icon, type IconName } from "./Icon.js";

export interface TextEditorLabels {
	toolbar: string;
	bold: string;
	italic: string;
	underline: string;
	list: string;
	link: string;
	linkPrompt: string;
	alignLeft: string;
	alignCenter: string;
	alignRight: string;
	charactersLeft: (n: number) => string;
}

export interface TextEditorProps {
	/** Etiqueta visible encima de la barra. */
	label?: ReactNode;
	/** HTML inicial. */
	defaultValue?: string;
	/** Recibe el HTML en cada cambio. Límpialo antes de guardarlo. */
	onChange?: (html: string) => void;
	/** @default "Escribe aquí…" */
	placeholder?: string;
	/** Muestra los caracteres que quedan en lugar de `hint`. No corta el texto. */
	maxLength?: number;
	/** Pista bajo el área, si no hay `maxLength`. */
	hint?: ReactNode;
	/** Alto mínimo del área en px. @default 160 */
	minHeight?: number;
	disabled?: boolean;
	/** Textos sustituibles. */
	labels?: Partial<TextEditorLabels>;
	id?: string;
	className?: string;
}

const DEFAULT_LABELS: TextEditorLabels = {
	toolbar: defaultStrings.formatting,
	bold: defaultStrings.bold,
	italic: defaultStrings.italic,
	underline: defaultStrings.underline,
	list: defaultStrings.list,
	link: defaultStrings.link,
	linkPrompt: defaultStrings.linkPrompt,
	alignLeft: defaultStrings.alignLeft,
	alignCenter: defaultStrings.alignCenter,
	alignRight: defaultStrings.alignRight,
	charactersLeft: defaultStrings.charactersLeft,
};

type Command =
	| "bold"
	| "italic"
	| "underline"
	| "insertUnorderedList"
	| "justifyLeft"
	| "justifyCenter"
	| "justifyRight";
const COMMANDS: Command[] = [
	"bold",
	"italic",
	"underline",
	"insertUnorderedList",
	"justifyLeft",
	"justifyCenter",
	"justifyRight",
];

const BUTTON =
	"inline-flex size-8 cursor-pointer items-center justify-center rounded-md border-0 bg-transparent text-editor-icon-fg transition-colors duration-100 hover:bg-primary_hover hover:text-editor-icon-fg_active focus-visible:shadow-focus-ring focus-visible:outline-none disabled:cursor-not-allowed";

/** Editor de texto enriquecido sencillo sobre el modo de edición nativo del navegador. */
export function TextEditor({
	label,
	defaultValue,
	onChange,
	placeholder = defaultStrings.writeHere,
	maxLength,
	hint,
	minHeight,
	disabled,
	labels,
	id: givenId,
	className,
}: TextEditorProps) {
	const t = { ...DEFAULT_LABELS, ...labels };
	const autoId = useId();
	const id = givenId ?? autoId;
	const area = useRef<HTMLDivElement>(null);
	// El HTML inicial se pinta una vez (también en servidor); después lo gestiona el navegador
	const [initial] = useState(() => ({ __html: defaultValue ?? "" }));
	const [active, setActive] = useState<Partial<Record<Command, boolean>>>({});
	const [count, setCount] = useState(() => textLength(defaultValue ?? ""));

	const refresh = () => {
		const next: Partial<Record<Command, boolean>> = {};
		for (const c of COMMANDS) {
			try {
				next[c] = document.queryCommandState?.(c) ?? false;
			} catch {
				next[c] = false;
			}
		}
		setActive(next);
		setCount(visibleLength(area.current));
	};
	const changed = () => {
		refresh();
		if (area.current) onChange?.(area.current.innerHTML);
	};
	const run = (command: string, value?: string) => {
		area.current?.focus();
		try {
			document.execCommand?.(command, false, value);
		} catch {
			// Sin modo de edición (entornos sin DOM completo): no hace nada
		}
		changed();
	};
	useEffect(() => {
		setCount(visibleLength(area.current));
	}, []);

	const button = (command: Command | "createLink", icon: IconName, name: string) => {
		const toggles = command !== "createLink";
		return (
			<button
				type="button"
				aria-label={name}
				title={name}
				aria-pressed={toggles ? !!active[command] : undefined}
				disabled={disabled}
				// Sin perder la selección del área al pulsar
				onMouseDown={(e) => e.preventDefault()}
				onClick={() => {
					if (toggles) return run(command);
					const url = window.prompt(t.linkPrompt);
					if (url) run("createLink", url);
				}}
				className={cx(
					BUTTON,
					toggles && active[command] && "bg-primary_hover text-editor-icon-fg_active",
				)}
			>
				<Icon name={icon} size={20} />
			</button>
		);
	};
	const separator = <span aria-hidden="true" className="mx-1.5 h-5 w-px bg-[var(--border-secondary)]" />;
	const below = maxLength !== undefined ? t.charactersLeft(Math.max(0, maxLength - count)) : (hint ?? null);

	return (
		<div className={cx("flex min-w-0 flex-col gap-1.5 font-body", disabled && "opacity-50", className)}>
			{label ? (
				// El área editable no admite <label for>: la etiqueta la nombra con aria-labelledby
				<span id={`${id}-label`} className="text-sm font-medium text-secondary">
					{label}
				</span>
			) : null}
			<div role="toolbar" aria-label={t.toolbar} className="flex flex-wrap items-center gap-0.5">
				{button("bold", "bold-01", t.bold)}
				{button("italic", "italic-01", t.italic)}
				{button("underline", "underline-01", t.underline)}
				{separator}
				{button("insertUnorderedList", "dotpoints-01", t.list)}
				{button("createLink", "link-01", t.link)}
				{separator}
				{button("justifyLeft", "align-left", t.alignLeft)}
				{button("justifyCenter", "align-center", t.alignCenter)}
				{button("justifyRight", "align-right", t.alignRight)}
			</div>
			{/* biome-ignore lint/a11y/useSemanticElements: texto enriquecido con contentEditable; un <textarea> solo admite texto plano */}
			<div
				id={id}
				ref={area}
				role="textbox"
				tabIndex={disabled ? -1 : 0}
				aria-multiline="true"
				aria-labelledby={label ? `${id}-label` : undefined}
				aria-label={label ? undefined : placeholder}
				aria-describedby={below !== null ? `${id}-hint` : undefined}
				aria-disabled={disabled || undefined}
				contentEditable={!disabled}
				suppressContentEditableWarning
				data-placeholder={placeholder}
				// biome-ignore lint/security/noDangerouslySetInnerHtml: el HTML inicial lo da quien usa el componente (la ficha pide limpiarlo antes de guardar)
				dangerouslySetInnerHTML={initial}
				onInput={changed}
				onKeyUp={refresh}
				onMouseUp={refresh}
				style={minHeight ? { minHeight } : undefined}
				className="min-h-40 rounded-xl bg-primary p-5 text-md text-primary shadow-[var(--shadow-xs),inset_0_0_0_1px_var(--border-primary)] outline-none [overflow-wrap:anywhere] focus:shadow-[var(--shadow-xs),inset_0_0_0_2px_var(--border-brand)] focus-visible:shadow-[var(--shadow-xs),inset_0_0_0_2px_var(--border-brand),var(--focus-ring-shadow)] empty:before:text-placeholder empty:before:content-[attr(data-placeholder)] [&_a]:text-brand-secondary [&_a]:underline [&_ol]:list-decimal [&_ol]:pl-10 [&_p]:mt-0 [&_p]:mb-2 [&_ul]:mt-0 [&_ul]:mb-2 [&_ul]:list-disc [&_ul]:pl-10"
			/>
			{below !== null ? (
				<p id={`${id}-hint`} className="m-0 text-sm text-tertiary">
					{below}
				</p>
			) : null}
		</div>
	);
}

/** Caracteres del área como los ve el usuario: innerText separa bloques con saltos de línea. */
function visibleLength(el: HTMLElement | null): number {
	if (!el) return 0;
	// biome-ignore lint/performance/useDomNodeTextContent: textContent no cuenta los saltos entre bloques, como hace la guía
	return (el.innerText ?? el.textContent ?? "").trim().length;
}

/** Longitud del texto visible de un HTML, sin etiquetas ni espacios a los lados. */
function textLength(html: string): number {
	return html
		.replace(/<[^>]*>/g, "")
		.replace(/&nbsp;/g, " ")
		.replace(/&[a-z]+;|&#\d+;/gi, "x")
		.trim().length;
}
