"use client";

import { type ReactNode, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { Button as AriaButton, Dialog, DialogTrigger, Popover } from "react-aria-components";
import { cx } from "../internal/cx.js";
import { OptionSelect, type SelectOption } from "../internal/option-select.js";
import { defaultStrings } from "../internal/strings.js";
import { Icon, type IconName } from "./Icon.js";
import { Tooltip } from "./Tooltip.js";

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
	image: string;
	imagePrompt: string;
	generate: string;
	textColor: string;
	customColor: string;
	font: string;
	fontSize: string;
}

/** Barra de herramientas: `simple` y `advanced` van sobre el área; `floating` sale sobre el texto seleccionado. */
export type TextEditorToolbar = "simple" | "advanced" | "floating";

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
	/**
	 * Barra del Figma en lugar de la de siempre:
	 * - `simple`: negrita, cursiva, subrayado, color, alineación y lista.
	 * - `advanced`: lo anterior más tipo y tamaño de letra, enlace e imagen (y `generate` con `onGenerate`).
	 * - `floating`: una barra sobre el texto seleccionado, con los botones de `simple` en `sm` y de `advanced` en `md`.
	 *   Escape la cierra.
	 *
	 * Sin `toolbar`, la barra de siempre.
	 */
	toolbar?: TextEditorToolbar;
	/**
	 * `sm`: área de 16px de relleno y texto de 14px. `md`: 20px y 16px.
	 * @default "md"
	 */
	size?: "sm" | "md";
	/** Botón de generar texto de la barra `advanced` y de la flotante `md`. Sin él, no se pinta. */
	onGenerate?: () => void;
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
	image: defaultStrings.image,
	imagePrompt: defaultStrings.imagePrompt,
	generate: defaultStrings.generate,
	textColor: defaultStrings.textColor,
	customColor: defaultStrings.customColor,
	font: defaultStrings.font,
	fontSize: defaultStrings.fontSize,
};

// Los colores del selector del Figma, a elegir con un clic
const TEXT_COLORS = [
	"#171717",
	"#262626",
	"#404040",
	"#525252",
	"#737373",
	"#a3a3a3",
	"#d4d4d4",
	"#ffffff",
	"#16a34a",
	"#2563eb",
	"#4f46e5",
	"#9333ea",
	"#c026d3",
	"#db2777",
	"#dc2626",
	"#ea580c",
];
const HEX = /^#?([0-9a-f]{6})$/i;

// execCommand("fontSize") solo admite del 1 al 7
const FONTS: SelectOption[] = [
	{ value: "Inter, sans-serif", label: "Inter" },
	{ value: "Georgia, serif", label: "Georgia" },
	{ value: "ui-monospace, monospace", label: "Mono" },
];
const SIZES: SelectOption[] = [
	{ value: "2", label: "13px" },
	{ value: "3", label: "16px" },
	{ value: "4", label: "18px" },
	{ value: "5", label: "24px" },
	{ value: "6", label: "32px" },
];

type Item =
	| "bold"
	| "italic"
	| "underline"
	| "list"
	| "link"
	| "image"
	| "generate"
	| "left"
	| "center"
	| "color";
const SIMPLE: Item[][] = [["bold", "italic", "underline"], ["color"], ["left", "center", "list"]];
const ADVANCED: Item[][] = [...SIMPLE, ["link", "image"], ["generate"]];

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

const SEPARATOR = "mx-1.5 h-5 w-px bg-[var(--border-secondary)]";
const HAIRLINE = "shadow-[inset_0_0_0_1px_var(--border-secondary_alt)]";

/** Editor de texto enriquecido sencillo sobre el modo de edición nativo del navegador. */
export function TextEditor({
	label,
	defaultValue,
	onChange,
	placeholder = defaultStrings.writeHere,
	maxLength,
	hint,
	minHeight,
	toolbar,
	size = "md",
	onGenerate,
	disabled,
	labels,
	id: givenId,
	className,
}: TextEditorProps) {
	const t = { ...DEFAULT_LABELS, ...labels };
	const autoId = useId();
	const id = givenId ?? autoId;
	const root = useRef<HTMLDivElement>(null);
	const floatBar = useRef<HTMLDivElement>(null);
	const area = useRef<HTMLDivElement>(null);
	// El HTML inicial se pinta una vez (también en servidor); después lo gestiona el navegador
	const [initial] = useState(() => ({ __html: defaultValue ?? "" }));
	const [active, setActive] = useState<Partial<Record<Command, boolean>>>({});
	const [count, setCount] = useState(() => textLength(defaultValue ?? ""));
	// Sin elegir, la muestra es el color de texto del tema (en oscuro, claro)
	const [textColor, setTextColor] = useState<string | null>(null);
	// Barra flotante: dónde está (relativo al editor) o null si no se ve
	const [float, setFloat] = useState<{ x: number; y: number } | null>(null);
	const dismissed = useRef(false);
	const holding = useRef(false);
	// La selección del área, guardada al salir el foco a un menú o a un selector
	const saved = useRef<Range | null>(null);
	const floating = toolbar === "floating";

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
	const save = () => {
		const sel = window.getSelection();
		if (sel?.rangeCount && area.current?.contains(sel.anchorNode))
			saved.current = sel.getRangeAt(0).cloneRange();
	};
	const restore = () => {
		area.current?.focus();
		const range = saved.current;
		const sel = window.getSelection();
		if (range && sel) {
			sel.removeAllRanges();
			sel.addRange(range);
		}
	};
	const exec = (command: string, value?: string) => {
		try {
			document.execCommand?.(command, false, value);
		} catch {
			// Sin modo de edición (entornos sin DOM completo): no hace nada
		}
	};
	const run = (command: string, value?: string, fromMenu?: boolean) => {
		if (fromMenu) restore();
		else area.current?.focus();
		exec(command, value);
		changed();
	};
	// Con un menú abierto, React Aria deja el resto de la página inerte y la selección no puede estar en el área: se
	// recupera cuando el menú se ha cerrado y ha devuelto el foco, y entonces se aplica el formato.
	const afterMenu = (apply?: () => void) => {
		requestAnimationFrame(() =>
			requestAnimationFrame(() => {
				restore();
				if (!apply) return;
				apply();
				save();
				changed();
			}),
		);
	};
	const colorText = (color: string) => {
		setTextColor(color);
		afterMenu(() => {
			// Con estilos en línea (un span con color) y no con <font color>
			exec("styleWithCSS", "true");
			exec("foreColor", color);
		});
	};
	useEffect(() => {
		setCount(visibleLength(area.current));
	}, []);

	// Guarda la selección del área y, con la barra flotante, la sigue
	// biome-ignore lint/correctness/useExhaustiveDependencies: refresh y save solo leen el DOM y fijan estado o refs; no hay que reenganchar el oyente en cada render
	useEffect(() => {
		const onSelect = () => {
			// Siempre la última selección del área: los selectores de letra y de color la recuperan al cerrarse
			save();
			if (!floating) return;
			const sel = document.getSelection();
			const el = area.current;
			const inside =
				sel &&
				el &&
				sel.rangeCount > 0 &&
				!sel.isCollapsed &&
				el.contains(sel.anchorNode) &&
				el.contains(sel.focusNode);
			if (!inside) {
				if (!holding.current) {
					dismissed.current = false;
					setFloat(null);
				}
				return;
			}
			if (dismissed.current) return;
			const rect = sel.getRangeAt(0).getBoundingClientRect?.();
			const box = root.current?.getBoundingClientRect();
			setFloat({
				x: rect && box ? rect.left + rect.width / 2 - box.left : 0,
				y: rect && box ? rect.top - box.top : 0,
			});
			refresh();
		};
		document.addEventListener("selectionchange", onSelect);
		return () => document.removeEventListener("selectionchange", onSelect);
	}, [floating]);

	// La barra flotante, centrada en la selección pero sin salirse del editor por los lados
	useLayoutEffect(() => {
		const el = floatBar.current;
		const host = root.current;
		if (!el || !host || !float) return;
		const half = el.offsetWidth / 2;
		el.style.left = `${Math.max(half, Math.min(float.x, host.clientWidth - half))}px`;
	}, [float]);

	const tooltips = toolbar !== undefined;
	const button = (
		command: Command | "createLink" | "insertImage" | "generate",
		icon: IconName,
		name: string,
	) => {
		const toggles = command !== "createLink" && command !== "insertImage" && command !== "generate";
		const control = (
			<button
				type="button"
				aria-label={name}
				// Con toolbar, el tooltip de React Aria; sin ella, el título nativo de siempre
				title={tooltips ? undefined : name}
				aria-pressed={toggles ? !!active[command] : undefined}
				disabled={disabled}
				// Sin perder la selección del área al pulsar
				onMouseDown={(e) => e.preventDefault()}
				onClick={() => {
					if (command === "generate") return onGenerate?.();
					if (command === "createLink" || command === "insertImage") {
						const url = window.prompt(command === "createLink" ? t.linkPrompt : t.imagePrompt);
						if (url) run(command, url);
						return;
					}
					run(command);
				}}
				className={cx(
					BUTTON,
					toggles && active[command] && "bg-primary_hover text-editor-icon-fg_active",
				)}
			>
				<Icon name={icon} size={20} />
			</button>
		);
		return tooltips ? <Tooltip title={name}>{control}</Tooltip> : control;
	};
	const colorButton = (
		<DialogTrigger
			onOpenChange={(open) => {
				holding.current = open;
				if (open) save();
				else afterMenu();
			}}
		>
			<Tooltip title={t.textColor}>
				<AriaButton
					aria-label={t.textColor}
					isDisabled={disabled}
					onPressStart={save}
					className={cx(BUTTON, "data-[pressed]:bg-primary_hover")}
				>
					<span
						aria-hidden="true"
						className={cx("size-4 rounded-full", HAIRLINE, !textColor && "bg-fg-primary")}
						style={textColor ? { backgroundColor: textColor } : undefined}
					/>
				</AriaButton>
			</Tooltip>
			<Popover
				placement="bottom start"
				offset={8}
				className={cx("z-30 w-52 rounded-xl bg-primary p-3 shadow-[var(--shadow-xl)]")}
			>
				<Dialog aria-label={t.textColor} className="flex flex-col gap-3 outline-none">
					{({ close }) => (
						<>
							<div className="flex flex-wrap gap-2">
								{TEXT_COLORS.map((c) => (
									<AriaButton
										key={c}
										aria-label={c}
										onPress={() => {
											colorText(c);
											close();
										}}
										className={cx(
											"size-4 cursor-pointer rounded-full border-0 p-0 outline-none data-[focus-visible]:shadow-focus-ring",
											HAIRLINE,
										)}
										style={{ backgroundColor: c }}
									/>
								))}
							</div>
							<label className="flex items-center gap-3 text-sm font-semibold text-primary">
								{t.customColor}
								<input
									aria-label={t.customColor}
									defaultValue={textColor?.slice(1).toUpperCase() ?? ""}
									maxLength={7}
									onKeyDown={(e) => {
										if (e.key !== "Enter") return;
										e.preventDefault();
										const hex = HEX.exec(e.currentTarget.value.trim());
										if (!hex) return;
										colorText(`#${hex[1]}`);
										close();
									}}
									className="min-w-0 flex-1 rounded-md border-0 bg-primary px-3 py-2 text-sm font-normal text-primary shadow-[var(--shadow-xs),inset_0_0_0_1px_var(--border-primary)] outline-none focus:shadow-[var(--shadow-xs),inset_0_0_0_2px_var(--border-brand)]"
								/>
							</label>
						</>
					)}
				</Dialog>
			</Popover>
		</DialogTrigger>
	);
	const item = (name: Item) => {
		switch (name) {
			case "bold":
				return button("bold", "bold-01", t.bold);
			case "italic":
				return button("italic", "italic-01", t.italic);
			case "underline":
				return button("underline", "underline-01", t.underline);
			case "list":
				return button("insertUnorderedList", "dotpoints-01", t.list);
			case "link":
				return button("createLink", "link-01", t.link);
			case "image":
				return button("insertImage", "image-01", t.image);
			case "generate":
				return button("generate", "stars-02", t.generate);
			case "left":
				return button("justifyLeft", "align-left", t.alignLeft);
			case "center":
				return button("justifyCenter", "align-center", t.alignCenter);
			case "color":
				return colorButton;
		}
	};
	const groups = (kind: "simple" | "advanced") =>
		(kind === "simple" ? SIMPLE : ADVANCED)
			// Generar solo sale con onGenerate: un botón sin acción no sirve
			.map((g) => g.filter((n) => n !== "generate" || onGenerate))
			.filter((g) => g.length > 0)
			.flatMap((g, i) => [
				i > 0 ? <span key={`s${g[0]}`} aria-hidden="true" className={SEPARATOR} /> : null,
				...g.map((n) => (
					<span key={n} className="contents">
						{item(n)}
					</span>
				)),
			]);
	const selects = (
		<div className="flex items-center gap-2">
			<div className="w-[152px]">
				<OptionSelect
					options={FONTS}
					onChange={(v) =>
						afterMenu(() => {
							exec("styleWithCSS", "true");
							exec("fontName", v);
						})
					}
					aria-label={t.font}
					size="sm"
					variant="field"
					icon="type-01"
				/>
			</div>
			<div className="w-[88px]">
				<OptionSelect
					options={SIZES}
					defaultValue="3"
					onChange={(v) =>
						afterMenu(() => {
							exec("styleWithCSS", "false");
							exec("fontSize", v);
						})
					}
					aria-label={t.fontSize}
					size="sm"
					variant="field"
				/>
			</div>
		</div>
	);
	const below = maxLength !== undefined ? t.charactersLeft(Math.max(0, maxLength - count)) : (hint ?? null);
	const small = size === "sm";

	let bar: ReactNode = null;
	if (toolbar === undefined) {
		const separator = (
			<span aria-hidden="true" className="mx-1.5 h-5 w-px bg-[var(--border-secondary)]" />
		);
		bar = (
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
		);
	} else if (toolbar === "simple" || toolbar === "advanced") {
		bar = (
			<div
				role="toolbar"
				aria-label={t.toolbar}
				className="flex flex-wrap items-center gap-x-3 gap-y-2"
			>
				{toolbar === "advanced" ? selects : null}
				<div className="flex flex-wrap items-center gap-0.5">{groups(toolbar)}</div>
			</div>
		);
	} else if (float) {
		bar = (
			<div
				ref={floatBar}
				role="toolbar"
				aria-label={t.toolbar}
				onMouseDown={(e) => {
					// Entre los botones, sin perder la selección
					if (!(e.target instanceof HTMLInputElement)) e.preventDefault();
				}}
				style={{ left: float.x, top: float.y - 8 }}
				className={cx(
					"absolute z-20 flex -translate-x-1/2 -translate-y-full items-center gap-0.5 bg-primary shadow-[inset_0_0_0_1px_var(--border-secondary_alt),var(--shadow-lg)]",
					small ? "rounded-md p-1" : "rounded-xl p-2",
				)}
			>
				{groups(small ? "simple" : "advanced")}
			</div>
		);
	}

	return (
		// biome-ignore lint/a11y/noStaticElementInteractions: solo recoge Escape de la barra flotante y del área, que ya son interactivos
		<div
			ref={root}
			onKeyDown={(e) => {
				if (e.key !== "Escape" || !float) return;
				dismissed.current = true;
				holding.current = false;
				setFloat(null);
				area.current?.focus();
			}}
			className={cx(
				"flex min-w-0 flex-col gap-1.5 font-body",
				floating && "relative",
				disabled && "opacity-50",
				className,
			)}
		>
			{label ? (
				// El área editable no admite <label for>: la etiqueta la nombra con aria-labelledby
				<span id={`${id}-label`} className="text-sm font-medium text-secondary">
					{label}
				</span>
			) : null}
			{bar}
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
				className={cx(
					"min-h-40 bg-primary text-primary shadow-[var(--shadow-xs),inset_0_0_0_1px_var(--border-primary)] outline-none [overflow-wrap:anywhere] focus:shadow-[var(--shadow-xs),inset_0_0_0_2px_var(--border-brand)] focus-visible:shadow-[var(--shadow-xs),inset_0_0_0_2px_var(--border-brand),var(--focus-ring-shadow)] empty:before:text-placeholder empty:before:content-[attr(data-placeholder)] [&_a]:text-brand-secondary [&_a]:underline [&_ol]:list-decimal [&_ol]:pl-10 [&_p]:mt-0 [&_p]:mb-2 [&_ul]:mt-0 [&_ul]:mb-2 [&_ul]:list-disc [&_ul]:pl-10",
					small ? "rounded-md p-4 text-sm" : "rounded-xl p-5 text-md",
					toolbar !== undefined && "[&_img]:max-w-full",
				)}
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
