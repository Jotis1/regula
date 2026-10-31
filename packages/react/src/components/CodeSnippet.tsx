"use client";

import { type KeyboardEvent, type ReactNode, useEffect, useId, useRef, useState } from "react";
import { cx } from "../internal/cx.js";
import { defaultStrings } from "../internal/strings.js";
import { Icon } from "./Icon.js";

export interface CodeSnippetTab {
	label: string;
	code: string;
}

export interface CodeSnippetProps {
	/** Código de una sola pestaña. */
	code?: string;
	/** Nombre de esa pestaña única (no cambia el resaltado, que es el mismo para todos). */
	language?: string;
	/** Varias versiones del mismo código, cada una en su pestaña. */
	tabs?: CodeSnippetTab[];
	/**
	 * Columna de números de línea.
	 * @default true
	 */
	lineNumbers?: boolean;
	className?: string;
}

// Resaltado deliberadamente simple (JS, TS, bash, Python básico), el mismo que la guía
const KEYWORDS =
	/^(import|from|export|default|const|let|var|function|return|new|if|else|for|while|class|extends|async|await|try|catch|throw|true|false|null|undefined|def|in|of|as|type|interface)$/;
const TOKENS =
	/(\/\/[^\n]*|#[^\n]*|\/\*[\s\S]*?\*\/)|('(?:\\.|[^'\\])*'|"(?:\\.|[^"\\])*"|`(?:\\.|[^`\\])*`)|([A-Za-z_$][\w$]*)|([\s\S])/g;

/** Trocea el código en comentarios, cadenas, palabras clave y nombres con los colores de la guía. */
export function highlight(src: string): ReactNode[] {
	const out: ReactNode[] = [];
	let k = 0;
	for (const m of src.matchAll(TOKENS)) {
		const at = m.index ?? 0;
		if (m[1])
			out.push(
				<span key={k++} className="text-utility-green-700">
					{m[1]}
				</span>,
			);
		else if (m[2])
			out.push(
				<span key={k++} className="text-primary">
					{m[2]}
				</span>,
			);
		else if (m[3]) {
			const word = m[3];
			const next = /^\s*[:(]/.test(src.slice(at + word.length));
			const prev = src[at - 1];
			if (KEYWORDS.test(word))
				out.push(
					<span key={k++} className="text-utility-pink-600">
						{word}
					</span>,
				);
			else if (/^[A-Z]/.test(word) || prev === "." || next)
				out.push(
					<span key={k++} className="text-utility-blue-600">
						{word}
					</span>,
				);
			else out.push(word);
		} else out.push(m[4]);
	}
	return out;
}

/** Bloque de código con números de línea, resaltado sencillo, pestañas y botón de copiar. */
export function CodeSnippet({ code, language, tabs, lineNumbers = true, className }: CodeSnippetProps) {
	const list = tabs ?? [{ label: language ?? defaultStrings.code, code: code ?? "" }];
	const [index, setIndex] = useState(0);
	const [copied, setCopied] = useState(false);
	const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
	const id = useId();
	const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
	const current = list[Math.min(index, list.length - 1)] as CodeSnippetTab;
	const lines = current.code.replace(/\n$/, "").split("\n");

	useEffect(() => () => clearTimeout(timer.current), []);

	const copy = async () => {
		try {
			await navigator.clipboard.writeText(current.code);
		} catch {
			// Sin permiso de portapapeles: el botón confirma igual, como en la guía
		}
		setCopied(true);
		clearTimeout(timer.current);
		timer.current = setTimeout(() => setCopied(false), 1500);
	};

	const onTabKey = (e: KeyboardEvent, i: number) => {
		const step = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
		if (!step) return;
		e.preventDefault();
		const next = (i + step + list.length) % list.length;
		setIndex(next);
		tabRefs.current[next]?.focus();
	};

	const multi = list.length > 1;
	return (
		<div
			className={cx(
				"relative overflow-hidden rounded-xl bg-primary font-body shadow-[inset_0_0_0_1px_var(--border-secondary)]",
				className,
			)}
		>
			{multi ? (
				<div
					role="tablist"
					aria-label={defaultStrings.code}
					className="flex gap-1 bg-secondary px-3 py-2 shadow-[inset_0_-1px_0_var(--border-secondary)]"
				>
					{list.map((t, i) => (
						<button
							// biome-ignore lint/suspicious/noArrayIndexKey: las pestañas pueden repetir etiqueta
							key={i}
							ref={(el) => {
								tabRefs.current[i] = el;
							}}
							type="button"
							role="tab"
							id={`${id}-tab-${i}`}
							aria-selected={i === index}
							aria-controls={`${id}-panel`}
							tabIndex={i === index ? 0 : -1}
							onClick={() => setIndex(i)}
							onKeyDown={(e) => onTabKey(e, i)}
							className="cursor-pointer rounded-md border-0 bg-transparent px-2 py-1 font-body text-sm font-semibold text-quaternary focus-visible:shadow-focus-ring focus-visible:outline-none aria-selected:bg-primary aria-selected:text-primary aria-selected:shadow-[var(--shadow-xs),inset_0_0_0_1px_var(--border-secondary)]"
						>
							{t.label}
						</button>
					))}
				</div>
			) : null}
			<div
				className="relative flex"
				{...(multi
					? { role: "tabpanel", id: `${id}-panel`, "aria-labelledby": `${id}-tab-${index}` }
					: {})}
			>
				{lineNumbers ? (
					<div
						aria-hidden="true"
						className="flex-none bg-secondary px-4 py-5 text-right font-mono text-code-sm text-quaternary shadow-[inset_-1px_0_0_var(--border-secondary)] select-none"
					>
						{lines.map((_, i) => (
							// biome-ignore lint/suspicious/noArrayIndexKey: un número por línea
							<div key={i}>{i + 1}</div>
						))}
					</div>
				) : null}
				<pre
					// biome-ignore lint/a11y/noNoninteractiveTabindex: si una línea no cabe, el bloque se desplaza y tiene que poder hacerse con teclado
					tabIndex={0}
					className="m-0 flex-1 overflow-auto p-5 pr-14 font-mono text-code-sm text-primary [tab-size:2] focus-visible:shadow-[inset_0_0_0_2px_var(--focus-ring)] focus-visible:outline-none"
				>
					<code>{highlight(lines.join("\n"))}</code>
				</pre>
				<button
					type="button"
					onClick={copy}
					aria-label={copied ? defaultStrings.copied : defaultStrings.copyCode}
					className="absolute top-3 right-3 inline-flex cursor-pointer rounded-md border-0 bg-primary p-1.5 text-fg-quaternary shadow-[inset_0_0_0_1px_var(--border-secondary)] hover:bg-primary_hover hover:text-fg-quaternary_hover focus-visible:shadow-focus-ring focus-visible:outline-none"
				>
					<Icon name={copied ? "check" : "copy-01"} size={16} />
				</button>
				<span className="sr-only" aria-live="polite">
					{copied ? defaultStrings.copied : ""}
				</span>
			</div>
		</div>
	);
}
