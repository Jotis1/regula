"use client";

import {
	ArrowLeft,
	ArrowRight,
	ChevronDown,
	ChevronLeft,
	ChevronLeftDouble,
	ChevronRight,
	ChevronRightDouble,
} from "@untitledui/icons";
import { type ReactNode, useEffect, useState } from "react";
import { cx } from "../internal/cx.js";
import type { IconComponent } from "../internal/icon.js";
import { defaultStrings } from "../internal/strings.js";
import { useControllable } from "../internal/use-controllable.js";
import { Button } from "./Button.js";

export interface PaginationLabels {
	/** @default "Anterior" */
	previous: string;
	/** @default "Siguiente" */
	next: string;
	/** Nombre de la navegación. @default "Paginación" */
	nav: string;
	/** Nombre de cada número. @default (n) => `Página ${n}` */
	page: (n: number) => string;
	/** Texto de página actual de las variantes `card-*` y del móvil. @default (n, total) => `Página ${n} de ${total}` */
	pageOf: (n: number, total: number) => string;
	/** Texto de cada tamaño de página. @default (n) => `${n} por página` */
	perPage: (n: number) => string;
	/** Nombre de la lista de tamaños de página. @default "Filas por página" */
	rowsPerPage: string;
	/** Delante del cuadro de página de `card-advanced`. @default "Página" */
	pageWord: string;
	/** Delante del cuadro de página de `card-advanced` con `align="center"`. @default "Mostrando página" */
	showingPage: string;
	/** Tras el cuadro de página. @default (total) => `de ${total}` */
	ofTotal: (total: number) => string;
	/** Nombre del cuadro de página. @default "Ir a la página" */
	goToPage: string;
	/** @default "Primera página" */
	first: string;
	/** @default "Última página" */
	last: string;
}

export type PaginationType =
	| "page-default"
	| "page-minimal"
	| "card-default"
	| "card-minimal"
	| "card-advanced"
	| "card-button-group";

export type PaginationShape = "square" | "circle";

export interface PaginationProps {
	/** Número de páginas. */
	total: number;
	/** Página actual, desde 1 (controlado). */
	page?: number;
	/**
	 * Página al principio (no controlado).
	 * @default 1
	 */
	defaultPage?: number;
	onChange?: (n: number) => void;
	/**
	 * Los diez del Figma. `page-default` lleva Anterior y Siguiente como texto; `page-minimal` (el de siempre) como botones;
	 * `card-default` es el mismo con el relleno de una tarjeta; `card-minimal` es «Página N de T» con botones (`align`
	 * `left`, `center` o `right`); `card-advanced` suma cuadro de página, filas por página y primera y última página
	 * (`align` `left` o `center`); `card-button-group` agrupa todo en una barra (`align` `left` o `right`). En móvil, los
	 * botones quedan solo con el icono y los números se sustituyen por «Página N de T».
	 * @default "page-minimal"
	 */
	type?: PaginationType;
	/**
	 * Forma de los números.
	 * @default "square"
	 */
	shape?: PaginationShape;
	/**
	 * Alineación de `card-minimal` (`right` por defecto), `card-advanced` (`left` por defecto) y `card-button-group`
	 * (`right` por defecto).
	 */
	align?: "left" | "center" | "right";
	/** Tamaños de página de la lista. En `card-advanced` parte de 10, 25, 50 y 100; en `card-minimal`, sin ellos no hay lista. */
	pageSizes?: number[];
	/** Tamaño de página elegido (controlado). */
	pageSize?: number;
	/** Tamaño de página al principio (no controlado). Por defecto, el primero de `pageSizes`. */
	defaultPageSize?: number;
	onPageSizeChange?: (n: number) => void;
	/** Textos que trae el componente, para sustituirlos. */
	labels?: Partial<PaginationLabels>;
	className?: string;
}

/** Números que se muestran: todos hasta 7 páginas; con más, recorta con "…". */
export function pageList(current: number, total: number): (number | "…")[] {
	if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
	if (current <= 3 || current >= total - 2) return [1, 2, 3, "…", total - 2, total - 1, total];
	return [1, "…", current - 1, current, current + 1, "…", total];
}

const NUMBER =
	"cursor-pointer border-0 bg-transparent font-body text-sm font-medium text-quaternary transition-colors duration-100 hover:bg-primary_hover hover:text-secondary focus-visible:shadow-focus-ring focus-visible:outline-none aria-[current=page]:bg-primary_hover aria-[current=page]:text-secondary";
const MOBILE_ICON = "max-md:px-2!";
const HIDE_MOBILE = "max-md:hidden";

interface Ctx {
	current: number;
	pages: number;
	go: (n: number) => void;
	text: PaginationLabels;
	shape: PaginationShape;
}

type NumberSize = "size-9" | "size-10";

function Numbers({ ctx, size, grouped }: { ctx: Ctx; size: NumberSize; grouped?: boolean }) {
	const { current, pages, go, text, shape } = ctx;
	const round = shape === "circle" ? "rounded-full" : "rounded-lg";
	return (
		<>
			<div className={cx("flex", grouped ? "gap-0" : "gap-0.5", HIDE_MOBILE)}>
				{pageList(current, pages).map((n, i) =>
					n === "…" ? (
						<span
							// biome-ignore lint/suspicious/noArrayIndexKey: puede haber dos huecos; su posición los distingue
							key={`gap-${i}`}
							aria-hidden="true"
							className={cx(
								"text-center text-sm text-quaternary",
								size === "size-9" ? "w-9 leading-9" : "w-10 leading-10",
								grouped && "border-0 border-l border-solid border-primary",
							)}
						>
							…
						</span>
					) : (
						<button
							key={n}
							type="button"
							aria-label={text.page(n)}
							aria-current={n === current ? "page" : undefined}
							onClick={() => go(n)}
							className={cx(
								NUMBER,
								size,
								grouped ? "rounded-none border-l! border-solid border-primary" : round,
							)}
						>
							{n}
						</button>
					),
				)}
			</div>
			<span className="text-sm font-medium text-secondary md:hidden">
				{text.pageOf(current, pages)}
			</span>
		</>
	);
}

function Nav({
	ctx,
	dir,
	tone,
	grouped,
}: {
	ctx: Ctx;
	dir: "previous" | "next";
	tone: "secondary" | "tertiary";
	grouped?: boolean;
}) {
	const { current, pages, go, text } = ctx;
	const previous = dir === "previous";
	return (
		<Button
			hierarchy={tone}
			size="sm"
			{...(previous ? { iconLeading: ArrowLeft } : { iconTrailing: ArrowRight })}
			disabled={previous ? current <= 1 : current >= pages}
			onClick={() => go(previous ? current - 1 : current + 1)}
			className={cx(MOBILE_ICON, grouped && "rounded-none")}
		>
			<span className="max-md:sr-only">{previous ? text.previous : text.next}</span>
		</Button>
	);
}

function Step({
	ctx,
	dir,
	to,
	label,
	icon,
}: {
	ctx: Ctx;
	dir: "previous" | "next";
	to: number;
	label: string;
	icon: IconComponent;
}) {
	const disabled = dir === "previous" ? ctx.current <= 1 : ctx.current >= ctx.pages;
	return (
		<Button
			hierarchy="secondary"
			size="sm"
			iconOnly={icon}
			label={label}
			disabled={disabled}
			onClick={() => ctx.go(to)}
		/>
	);
}

function PageSizeSelect({
	sizes,
	value,
	onChange,
	text,
	plain,
}: {
	sizes: number[];
	value: number;
	onChange: (n: number) => void;
	text: PaginationLabels;
	plain?: boolean;
}) {
	// `<select>` nativo y no `Select`: este con su lista de React Aria sumaba ~80 kB a todo el que pagina una tabla
	return (
		<span className="relative inline-flex items-center">
			<select
				aria-label={text.rowsPerPage}
				value={value}
				onChange={(e) => onChange(Number(e.target.value))}
				className="h-9 min-w-24 cursor-pointer appearance-none rounded-lg border-0 bg-primary py-0 pr-8 pl-3 font-body text-sm font-medium text-primary shadow-[var(--shadow-xs),inset_0_0_0_1px_var(--border-primary)] focus-visible:shadow-[var(--shadow-xs),inset_0_0_0_2px_var(--border-brand)] focus-visible:outline-none"
			>
				{sizes.map((n) => (
					<option key={n} value={n}>
						{plain ? n : text.perPage(n)}
					</option>
				))}
			</select>
			<span className="pointer-events-none absolute right-2.5 flex text-fg-quaternary">
				<ChevronDown size={16} />
			</span>
		</span>
	);
}

function PageInput({ ctx }: { ctx: Ctx }) {
	const [draft, setDraft] = useState(String(ctx.current));
	useEffect(() => setDraft(String(ctx.current)), [ctx.current]);
	const commit = () => {
		const n = Math.round(Number(draft));
		if (draft !== "" && Number.isFinite(n) && n >= 1 && n <= ctx.pages) ctx.go(n);
		else setDraft(String(ctx.current));
	};
	return (
		<input
			type="text"
			inputMode="numeric"
			aria-label={ctx.text.goToPage}
			value={draft}
			onChange={(e) => setDraft(e.target.value.replace(/\D/g, ""))}
			onBlur={commit}
			onKeyDown={(e) => {
				if (e.key === "Enter") commit();
			}}
			className="h-9 w-10 rounded-lg border-0 bg-primary px-2 text-center font-body text-sm text-primary shadow-[var(--shadow-xs),inset_0_0_0_1px_var(--border-primary)] focus-visible:shadow-[var(--shadow-xs),inset_0_0_0_2px_var(--border-brand)] focus-visible:outline-none"
		/>
	);
}

function LegacyPagination({ ctx, className }: { ctx: Ctx; className?: string }) {
	const { current, pages, go, text } = ctx;
	return (
		<nav
			aria-label={text.nav}
			className={cx(
				"flex items-center justify-between gap-3 pt-3 font-body shadow-[inset_0_1px_0_var(--border-secondary)]",
				className,
			)}
		>
			<Button
				hierarchy="secondary"
				size="sm"
				iconLeading={ArrowLeft}
				disabled={current <= 1}
				onClick={() => go(current - 1)}
			>
				{text.previous}
			</Button>
			<div className="flex gap-0.5">
				{pageList(current, pages).map((n, i) =>
					n === "…" ? (
						<span
							// biome-ignore lint/suspicious/noArrayIndexKey: puede haber dos huecos; su posición los distingue
							key={`gap-${i}`}
							aria-hidden="true"
							className="w-10 text-center text-sm leading-10 text-quaternary"
						>
							…
						</span>
					) : (
						<button
							key={n}
							type="button"
							aria-label={text.page(n)}
							aria-current={n === current ? "page" : undefined}
							onClick={() => go(n)}
							className="size-10 cursor-pointer rounded-lg border-0 bg-transparent font-body text-sm font-medium text-quaternary transition-colors duration-100 hover:bg-primary_hover hover:text-secondary focus-visible:shadow-focus-ring focus-visible:outline-none aria-[current=page]:bg-primary_hover aria-[current=page]:text-secondary"
						>
							{n}
						</button>
					),
				)}
			</div>
			<Button
				hierarchy="secondary"
				size="sm"
				iconTrailing={ArrowRight}
				disabled={current >= pages}
				onClick={() => go(current + 1)}
			>
				{text.next}
			</Button>
		</nav>
	);
}

const ROW = "flex items-center gap-3 font-body shadow-[inset_0_1px_0_var(--border-secondary)]";
const CARD = "px-6 pt-3 pb-4 max-md:px-4 max-md:py-3";

/** Paginación de tabla, de página o de tarjeta, separada del contenido por una línea `border-secondary`. */
export function Pagination({
	total,
	page,
	defaultPage = 1,
	onChange,
	type: typeProp,
	shape: shapeProp,
	align,
	pageSizes,
	pageSize,
	defaultPageSize,
	onPageSizeChange,
	labels,
	className,
}: PaginationProps) {
	const [current, setCurrent] = useControllable(page, defaultPage);
	// sin `type` ni `shape` sale el HTML de siempre, sin las clases de móvil
	const legacy = typeProp === undefined && shapeProp === undefined;
	const type = typeProp ?? "page-minimal";
	const shape = shapeProp ?? "square";
	const sizes = pageSizes ?? (type === "card-advanced" ? [10, 25, 50, 100] : undefined);
	const [size, setSize] = useControllable(pageSize, defaultPageSize ?? sizes?.[0] ?? 10, onPageSizeChange);
	const pages = Math.max(1, total);
	const text: PaginationLabels = {
		previous: defaultStrings.previous,
		next: defaultStrings.next,
		nav: defaultStrings.pagination,
		page: (n: number) => `${defaultStrings.page} ${n}`,
		pageOf: (n: number, t: number) => `${defaultStrings.page} ${n} de ${t}`,
		perPage: (n: number) => `${n} por página`,
		rowsPerPage: "Filas por página",
		pageWord: defaultStrings.page,
		showingPage: "Mostrando página",
		ofTotal: (t: number) => `de ${t}`,
		goToPage: "Ir a la página",
		first: "Primera página",
		last: "Última página",
		...labels,
	};
	const go = (n: number) => {
		if (n < 1 || n > pages || n === current) return;
		setCurrent(n);
		onChange?.(n);
	};
	const ctx: Ctx = { current, pages, go, text, shape };
	if (legacy) return <LegacyPagination ctx={ctx} className={className} />;

	let body: ReactNode;
	let root: string;
	if (type === "card-minimal") {
		const side = align ?? "right";
		const info = (
			<div className="flex items-center gap-3">
				<span className="whitespace-nowrap text-sm font-medium text-secondary">
					{text.pageOf(current, pages)}
				</span>
				{sizes ? (
					<span className="max-md:hidden">
						<PageSizeSelect sizes={sizes} value={size} onChange={setSize} text={text} />
					</span>
				) : null}
			</div>
		);
		const buttons = (
			<div className="flex gap-3">
				<Nav ctx={ctx} dir="previous" tone="secondary" />
				<Nav ctx={ctx} dir="next" tone="secondary" />
			</div>
		);
		root = cx(CARD, "justify-between");
		body =
			side === "center" ? (
				<>
					<Nav ctx={ctx} dir="previous" tone="secondary" />
					{info}
					<Nav ctx={ctx} dir="next" tone="secondary" />
				</>
			) : side === "left" ? (
				<>
					{buttons}
					{info}
				</>
			) : (
				<>
					{info}
					{buttons}
				</>
			);
	} else if (type === "card-button-group") {
		root = cx(CARD, align === "left" ? "justify-start" : "justify-end");
		body = (
			<div className="inline-flex items-center overflow-hidden rounded-lg bg-primary shadow-[var(--shadow-xs),inset_0_0_0_1px_var(--border-primary)]">
				<Nav ctx={ctx} dir="previous" tone="tertiary" grouped />
				<Numbers ctx={ctx} size="size-9" grouped />
				<span className="inline-flex border-0 border-l border-solid border-primary">
					<Nav ctx={ctx} dir="next" tone="tertiary" grouped />
				</span>
			</div>
		);
	} else if (type === "card-advanced") {
		const center = align === "center";
		root = cx(CARD, "flex-wrap justify-between gap-y-3");
		const rows = sizes ? (
			<span
				className={cx(
					"inline-flex items-center gap-2 whitespace-nowrap text-sm text-secondary",
					HIDE_MOBILE,
				)}
			>
				<span>{text.rowsPerPage}</span>
				<PageSizeSelect sizes={sizes} value={size} onChange={setSize} text={text} plain />
			</span>
		) : null;
		body = (
			<>
				<div
					className={cx(
						"flex items-center gap-3 whitespace-nowrap text-sm text-secondary",
						HIDE_MOBILE,
					)}
				>
					<span className="inline-flex items-center gap-2">
						<span>{center ? text.showingPage : text.pageWord}</span>
						<PageInput ctx={ctx} />
						<span>{text.ofTotal(pages)}</span>
					</span>
					{center ? null : rows}
				</div>
				<div className="flex items-center gap-2">
					<Step ctx={ctx} dir="previous" to={1} label={text.first} icon={ChevronLeftDouble} />
					<Step
						ctx={ctx}
						dir="previous"
						to={current - 1}
						label={text.previous}
						icon={ChevronLeft}
					/>
					<Numbers ctx={ctx} size="size-9" />
					<Step ctx={ctx} dir="next" to={current + 1} label={text.next} icon={ChevronRight} />
					<Step ctx={ctx} dir="next" to={pages} label={text.last} icon={ChevronRightDouble} />
				</div>
				{center ? rows : null}
			</>
		);
	} else if (type === "page-default") {
		root = "pt-3 justify-between";
		body = (
			<>
				<Nav ctx={ctx} dir="previous" tone="tertiary" />
				<Numbers ctx={ctx} size="size-9" />
				<Nav ctx={ctx} dir="next" tone="tertiary" />
			</>
		);
	} else {
		const card = type === "card-default";
		root = cx("justify-between", card ? CARD : "pt-3");
		body = (
			<>
				<Nav ctx={ctx} dir="previous" tone="secondary" />
				<Numbers ctx={ctx} size={card ? "size-9" : "size-10"} />
				<Nav ctx={ctx} dir="next" tone="secondary" />
			</>
		);
	}

	return (
		<nav aria-label={text.nav} className={cx(ROW, root, className)}>
			{body}
		</nav>
	);
}
