"use client";

import { Check, Copy01, Maximize01 } from "@untitledui/icons";
import { Fragment, type KeyboardEvent, type ReactNode, useEffect, useId, useRef, useState } from "react";
import { cx } from "../internal/cx.js";
import { DynIcon } from "../internal/icon.js";
import { defaultStrings } from "../internal/strings.js";

export interface CodeSnippetTab {
	label: string;
	code: string;
	/** Líneas de esta pestaña que se destacan (desde 1). Mandan sobre el `highlight` del bloque. */
	highlight?: number[];
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
	/**
	 * Números de línea que se destacan, desde 1: llevan el fondo `bg-brand-primary_alt` y una raya de 2px en
	 * `fg-brand-primary` a la izquierda. A los lectores de pantalla se les anuncia una vez por cada bloque de líneas seguidas.
	 * Con `tabs`, cada pestaña puede llevar el suyo.
	 */
	highlight?: number[];
	/**
	 * `horizontal` (por defecto): tarjeta con la columna de números a la izquierda. `vertical`: tarjeta gris que enmarca el
	 * código, sin números de línea salvo que se pidan, y con las pestañas (si hay) en su cabecera.
	 * @default "horizontal"
	 */
	variant?: "horizontal" | "vertical";
	/**
	 * Alto máximo en píxeles. Si el código es más largo, se recorta con un degradado y un botón "Ver más" lo despliega
	 * (`Show more` del Figma).
	 */
	maxHeight?: number;
	/** Con él, aparece el botón de ampliar junto al de copiar y se llama al pulsarlo. Qué amplía lo decide quien lo usa. */
	onExpand?: () => void;
	className?: string;
}

// Resaltado deliberadamente simple (JS, TS, bash, Python básico), el mismo que la guía
const KEYWORDS =
	/^(import|from|export|default|const|let|var|function|return|new|if|else|for|while|class|extends|async|await|try|catch|throw|true|false|null|undefined|def|in|of|as|type|interface)$/;
const TOKENS =
	/(\/\/[^\n]*|#[^\n]*|\/\*[\s\S]*?\*\/)|('(?:\\.|[^'\\])*'|"(?:\\.|[^"\\])*"|`(?:\\.|[^`\\])*`)|([A-Za-z_$][\w$]*)|([\s\S])/g;

/** Un trozo de código: con `cls` va en un `span` con ese color; sin él, es texto suelto. */
type Piece = { cls?: string; text: string };

function tokenize(src: string): Piece[] {
	const out: Piece[] = [];
	for (const m of src.matchAll(TOKENS)) {
		const at = m.index ?? 0;
		if (m[1]) out.push({ cls: "text-utility-green-700", text: m[1] });
		else if (m[2]) out.push({ cls: "text-primary", text: m[2] });
		else if (m[3]) {
			const word = m[3];
			const next = /^\s*[:(]/.test(src.slice(at + word.length));
			const prev = src[at - 1];
			if (KEYWORDS.test(word)) out.push({ cls: "text-utility-pink-600", text: word });
			else if (/^[A-Z]/.test(word) || prev === "." || next)
				out.push({ cls: "text-utility-blue-600", text: word });
			else out.push({ text: word });
		} else out.push({ text: m[4] as string });
	}
	return out;
}

const pieceNode = (p: Piece, key: number): ReactNode =>
	p.cls ? (
		<span key={key} className={p.cls}>
			{p.text}
		</span>
	) : (
		p.text
	);

/** Trocea el código en comentarios, cadenas, palabras clave y nombres con los colores de la guía. */
export function highlight(src: string): ReactNode[] {
	return tokenize(src).map(pieceNode);
}

/** Lo mismo que `highlight`, repartido por líneas: un comentario o una cadena de varias líneas se parte con ellas. */
function highlightLines(src: string): ReactNode[][] {
	const lines: ReactNode[][] = [[]];
	let k = 0;
	for (const piece of tokenize(src)) {
		const parts = piece.text.split("\n");
		parts.forEach((text, i) => {
			if (i > 0) lines.push([]);
			if (text) (lines[lines.length - 1] as ReactNode[]).push(pieceNode({ cls: piece.cls, text }, k++));
		});
	}
	return lines;
}

/** Bloque de código con números de línea, resaltado sencillo, pestañas y botón de copiar. */
export function CodeSnippet({
	code,
	language,
	tabs,
	lineNumbers: lineNumbersProp,
	highlight: highlightProp,
	variant = "horizontal",
	maxHeight,
	onExpand,
	className,
}: CodeSnippetProps) {
	const vertical = variant === "vertical";
	const lineNumbers = lineNumbersProp ?? !vertical;
	const list = tabs ?? [{ label: language ?? defaultStrings.code, code: code ?? "" }];
	const [index, setIndex] = useState(0);
	const [copied, setCopied] = useState(false);
	const [expanded, setExpanded] = useState(false);
	const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
	const id = useId();
	const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
	const current = list[Math.min(index, list.length - 1)] as CodeSnippetTab;
	const lines = current.code.replace(/\n$/, "").split("\n");
	const marked = new Set(
		(current.highlight ?? highlightProp ?? []).filter(
			(n) => Number.isInteger(n) && n >= 1 && n <= lines.length,
		),
	);

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
	// Cada línea mide 20 px y el bloque lleva 20 de relleno arriba y abajo: se sabe sin medir si hace falta el recorte
	const collapsible = maxHeight !== undefined && lines.length * 20 + 40 > maxHeight;
	const collapsed = collapsible && !expanded;
	const headerCopy = vertical && multi;

	const buttonBase =
		"inline-flex cursor-pointer rounded-md border-0 bg-primary p-1.5 text-fg-quaternary shadow-[inset_0_0_0_1px_var(--border-secondary)] hover:bg-primary_hover hover:text-fg-quaternary_hover focus-visible:shadow-focus-ring focus-visible:outline-none";
	const copyButton = (position: string) => (
		<button
			type="button"
			onClick={copy}
			aria-label={copied ? defaultStrings.copied : defaultStrings.copyCode}
			className={cx(position, buttonBase)}
		>
			<DynIcon icon={copied ? Check : Copy01} size={16} />
		</button>
	);

	const tablist = multi ? (
		<div
			role="tablist"
			aria-label={defaultStrings.code}
			className={
				vertical
					? "flex flex-1 items-start"
					: "flex gap-1 bg-secondary px-3 py-2 shadow-[inset_0_-1px_0_var(--border-secondary)]"
			}
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
					className={
						vertical
							? "cursor-pointer rounded-sm border-0 bg-transparent px-2 py-1 font-body text-sm font-semibold text-quaternary hover:text-primary focus-visible:shadow-focus-ring focus-visible:outline-none aria-selected:text-primary"
							: "cursor-pointer rounded-md border-0 bg-transparent px-2 py-1 font-body text-sm font-semibold text-quaternary focus-visible:shadow-focus-ring focus-visible:outline-none aria-selected:bg-primary aria-selected:text-primary aria-selected:shadow-[var(--shadow-xs),inset_0_0_0_1px_var(--border-secondary)]"
					}
				>
					{t.label}
				</button>
			))}
		</div>
	) : null;

	const showMore = collapsible ? (
		<div
			className={
				collapsed
					? "absolute inset-x-0 bottom-0 flex justify-center px-8 pb-8"
					: "flex justify-center px-8 pt-2 pb-5"
			}
		>
			<button
				type="button"
				aria-expanded={expanded}
				aria-controls={`${id}-code`}
				onClick={() => setExpanded(!expanded)}
				className="inline-flex cursor-pointer items-center rounded-lg border-0 bg-primary px-3 py-2 font-body text-sm font-semibold text-secondary shadow-[var(--shadow-xs-skeuomorphic),inset_0_0_0_1px_var(--border-primary)] hover:bg-primary_hover hover:text-secondary_hover focus-visible:shadow-focus-ring focus-visible:outline-none"
			>
				{expanded ? defaultStrings.showLessCode : defaultStrings.showMoreCode}
			</button>
		</div>
	) : null;

	const body = (
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
				id={collapsible ? `${id}-code` : undefined}
				// biome-ignore lint/a11y/noNoninteractiveTabindex: si una línea no cabe, el bloque se desplaza y tiene que poder hacerse con teclado
				tabIndex={0}
				className={`m-0 flex-1 overflow-auto p-5 ${onExpand ? "pr-20" : "pr-14"} font-mono text-code-sm text-primary [tab-size:2] focus-visible:shadow-[inset_0_0_0_2px_var(--focus-ring)] focus-visible:outline-none`}
			>
				<code>
					{marked.size === 0
						? highlight(lines.join("\n"))
						: highlightLines(lines.join("\n")).map((nodes, i) => (
								// biome-ignore lint/suspicious/noArrayIndexKey: una entrada por línea
								<Fragment key={i}>
									{marked.has(i + 1) ? (
										<span className="-mx-5 inline-block min-h-5 min-w-[calc(100%+2.5rem)] bg-brand-primary_alt px-5 align-top shadow-[inset_2px_0_0_var(--fg-brand-primary)]">
											{marked.has(i) ? null : (
												<span className="sr-only">
													{defaultStrings.highlightedLine}
												</span>
											)}
											{nodes}
										</span>
									) : (
										nodes
									)}
									{i < lines.length - 1 ? "\n" : null}
								</Fragment>
							))}
				</code>
			</pre>
			{headerCopy ? null : copyButton(vertical ? "absolute top-2 right-2" : "absolute top-3 right-3")}
			{onExpand ? (
				<button
					type="button"
					onClick={onExpand}
					aria-label={defaultStrings.expandCode}
					className={cx(
						vertical ? "absolute top-2 right-10" : "absolute top-3 right-11",
						buttonBase,
					)}
				>
					<Maximize01 size={16} />
				</button>
			) : null}
			<span className="sr-only" aria-live="polite">
				{copied ? defaultStrings.copied : ""}
			</span>
		</div>
	);

	// El recorte lo lleva el contenedor de la tarjeta, y el degradado solo el código: el botón queda por encima
	const clipped = collapsible ? (
		<div
			className={cx(
				"relative",
				collapsed &&
					"overflow-hidden [mask-image:linear-gradient(to_bottom,#000_calc(100%-96px),transparent)]",
			)}
			style={collapsed ? { maxHeight } : undefined}
		>
			{body}
		</div>
	) : (
		body
	);

	if (vertical) {
		return (
			<div
				className={cx(
					"relative border border-secondary bg-secondary_alt font-body shadow-[var(--shadow-xs)]",
					multi ? "rounded-t-xl rounded-b-3xl" : "rounded-3xl",
					className,
				)}
			>
				{multi ? (
					<div className="flex items-start gap-3 pt-2 pr-2 pl-3">
						{tablist}
						{copyButton("")}
					</div>
				) : null}
				<div className="p-2">
					<div className="relative overflow-hidden rounded-xl border border-secondary_alt bg-primary_alt shadow-[var(--shadow-lg)]">
						{clipped}
						{collapsed ? showMore : null}
						{expanded ? showMore : null}
					</div>
				</div>
			</div>
		);
	}

	return (
		<div
			className={cx(
				"relative overflow-hidden rounded-xl border border-secondary bg-primary font-body",
				className,
			)}
		>
			{tablist}
			{clipped}
			{collapsed ? showMore : null}
			{expanded ? showMore : null}
		</div>
	);
}
