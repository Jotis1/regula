"use client";

import { SearchLg } from "@untitledui/icons";
import { type KeyboardEvent, type ReactNode, useEffect, useId, useRef, useState } from "react";
import { Dialog, Modal, ModalOverlay } from "react-aria-components";
import { cx } from "../internal/cx.js";
import { type IconProp, iconSlot } from "../internal/icon.js";
import { OVERLAY, OVERLAY_POSITION } from "../internal/overlay.js";
import { defaultStrings } from "../internal/strings.js";
import { FeaturedIcon } from "./FeaturedIcon.js";
import { Kbd } from "./Kbd.js";

export interface CommandItem {
	icon?: IconProp;
	label: string;
	/** Texto de apoyo tras la etiqueta, en `text-tertiary`. */
	description?: string;
	/** Atajo que se muestra a la derecha (solo texto; no lo registra). */
	shortcut?: string;
	/** Palabras extra para el filtro, separadas por espacios. */
	keywords?: string;
	onSelect?: () => void;
}

export interface CommandGroup {
	label: string;
	items: CommandItem[];
}

export interface CommandMenuLabels {
	/** Nombre del diálogo. @default "Menú de comandos" */
	dialog: string;
	/** Nombre del buscador. @default "Buscar comandos" */
	search: string;
	/** Título del estado vacío. @default "Sin resultados" */
	noResults: string;
	/** Pie: "↑ ↓ moverse", "↵ abrir", "esc cerrar". */
	move: string;
	open: string;
	close: string;
}

export interface CommandMenuProps {
	/**
	 * Visible. Con `false` no se pinta.
	 * @default true
	 */
	open?: boolean;
	/** Al pulsar Escape, fuera del panel o tras ejecutar un comando. */
	onClose?: () => void;
	/** Primero las apps de la suite, luego las acciones de la app actual. */
	groups: CommandGroup[];
	/**
	 * Placeholder del buscador.
	 * @default "Busca o escribe un comando"
	 */
	placeholder?: string;
	/**
	 * Texto bajo "Sin resultados".
	 * @default "Prueba con otra palabra."
	 */
	emptyText?: ReactNode;
	/** Se pinta dentro de su contenedor (posición relativa) en vez de sobre toda la página, sin atrapar el foco. */
	contained?: boolean;
	/**
	 * Lleva el foco al buscador al abrirse.
	 * @default true
	 */
	autoFocus?: boolean;
	/** Textos que trae el componente, para sustituirlos. */
	labels?: Partial<CommandMenuLabels>;
	/** Cada cambio del buscador (ampliación sobre la guía): para pedir resultados a otra fuente, como un índice de búsqueda. */
	onQueryChange?: (query: string) => void;
	/**
	 * Texto con el que se abre el buscador. Los resultados salen ya filtrados y se llama a `onQueryChange` con él una vez
	 * al abrir, para que una fuente externa pinte los suyos. Al cerrar y volver a abrir, el buscador parte de él otra vez.
	 */
	defaultQuery?: string;
	/**
	 * Filtra los elementos por lo escrito. Con `false`, los grupos se pintan tal cual y el filtro es de la app (ampliación sobre la guía).
	 * @default true
	 */
	filter?: boolean;
}

const matches = (item: CommandItem, needle: string) =>
	!needle ||
	`${item.label} ${item.description ?? ""} ${item.keywords ?? ""}`.toLowerCase().includes(needle);

/**
 * Menú de comandos (⌘K) para saltar entre apps de la suite y lanzar acciones escribiendo.
 * Filtra mientras escribes (etiqueta, descripción y `keywords`); ↑ ↓ para moverse, ↵ para ejecutar, Esc para cerrar.
 * El atajo global lo registra la app: este componente solo se abre y se cierra con `open` y `onClose`.
 */
export function CommandMenu({
	open = true,
	onClose,
	groups,
	placeholder,
	emptyText,
	contained,
	autoFocus = true,
	labels,
	onQueryChange,
	defaultQuery,
	filter = true,
}: CommandMenuProps) {
	const t = {
		dialog: defaultStrings.commandMenu,
		search: defaultStrings.searchCommands,
		noResults: defaultStrings.noResults,
		move: defaultStrings.toMove,
		open: defaultStrings.toOpen,
		close: defaultStrings.toClose,
		...labels,
	};
	const [query, setQuery] = useState(defaultQuery ?? "");
	const [active, setActive] = useState(0);
	const id = useId();
	const listRef = useRef<HTMLDivElement>(null);
	// Último `onQueryChange` y si ya se avisó del texto inicial en esta apertura
	const notify = useRef(onQueryChange);
	notify.current = onQueryChange;
	const announced = useRef(false);

	// Cerrado, el buscador vuelve al texto inicial; abierto, se avisa de él una sola vez
	useEffect(() => {
		if (!open) {
			announced.current = false;
			setQuery(defaultQuery ?? "");
			setActive(0);
		} else if (!announced.current) {
			announced.current = true;
			if (defaultQuery) notify.current?.(defaultQuery);
		}
	}, [open, defaultQuery]);

	const needle = filter ? query.trim().toLowerCase() : "";
	const visible = groups
		.map((g) => ({ label: g.label, items: g.items.filter((it) => matches(it, needle)) }))
		.filter((g) => g.items.length);
	const flat = visible.flatMap((g) => g.items);
	const current = Math.min(active, Math.max(flat.length - 1, 0));
	const optionId = (i: number) => `${id}-opt-${i}`;

	// Mantiene la opción activa a la vista desplazando solo la lista (scrollIntoView movería también la página)
	useEffect(() => {
		const list = listRef.current;
		const el = list?.ownerDocument.getElementById(optionId(current));
		if (!list || !el) return;
		const top = el.offsetTop; // la lista es `relative`: offsetTop ya es relativo a ella
		if (top < list.scrollTop) list.scrollTop = top;
		else if (top + el.offsetHeight > list.scrollTop + list.clientHeight)
			list.scrollTop = top + el.offsetHeight - list.clientHeight;
	});

	if (!open) return null;

	const run = (item: CommandItem | undefined) => {
		if (!item) return;
		item.onSelect?.();
		onClose?.();
	};
	const onKeyDown = (e: KeyboardEvent) => {
		const n = Math.max(flat.length, 1);
		if (e.key === "ArrowDown") {
			e.preventDefault();
			setActive((current + 1) % n);
		} else if (e.key === "ArrowUp") {
			e.preventDefault();
			setActive((current - 1 + n) % n);
		} else if (e.key === "Enter") {
			e.preventDefault();
			run(flat[current]);
		} else if (e.key === "Escape" && contained) {
			// Fuera de `contained`, Escape lo gestiona el modal de React Aria
			onClose?.();
		}
	};

	let index = -1;
	const listId = `${id}-list`;
	const body = (
		<>
			<div className="flex items-center gap-2 p-4 text-fg-quaternary shadow-[inset_0_-1px_0_var(--border-secondary)]">
				<SearchLg size={20} />
				<input
					// biome-ignore lint/a11y/noAutofocus: el buscador es lo único que hay que hacer al abrir el menú
					autoFocus={autoFocus}
					value={query}
					placeholder={placeholder ?? defaultStrings.commandPlaceholder}
					aria-label={t.search}
					role="combobox"
					aria-expanded={flat.length > 0}
					aria-controls={flat.length ? listId : undefined}
					aria-autocomplete="list"
					aria-activedescendant={flat.length ? optionId(current) : undefined}
					onChange={(e) => {
						setQuery(e.target.value);
						setActive(0);
						onQueryChange?.(e.target.value);
					}}
					onKeyDown={onKeyDown}
					className="min-w-0 flex-1 border-0 bg-transparent px-0.5 py-px font-body text-md text-primary outline-none placeholder:text-placeholder"
				/>
				<Kbd>⌘K</Kbd>
			</div>
			{flat.length ? (
				<div
					ref={listRef}
					id={listId}
					role="listbox"
					aria-label={t.dialog}
					className="relative max-h-[360px] overflow-auto"
				>
					{visible.map((g, gi) => (
						// biome-ignore lint/a11y/useSemanticElements: grupo de opciones de un listbox; un <fieldset> no vale ahí
						<div
							// biome-ignore lint/suspicious/noArrayIndexKey: los grupos pueden repetir etiqueta
							key={gi}
							role="group"
							aria-labelledby={`${id}-g${gi}`}
							className="py-2 shadow-[inset_0_-1px_0_var(--border-secondary)]"
						>
							<div
								id={`${id}-g${gi}`}
								className="px-[18px] pt-2 pb-1 text-xs font-semibold text-primary"
							>
								{g.label}
							</div>
							{g.items.map((item) => {
								index++;
								const i = index;
								return (
									// biome-ignore lint/a11y/useKeyWithClickEvents: el teclado va por el buscador (aria-activedescendant)
									<div
										key={optionId(i)}
										id={optionId(i)}
										role="option"
										aria-selected={i === current}
										tabIndex={-1}
										onMouseEnter={() => setActive(i)}
										onClick={() => run(item)}
										className="mx-2 my-0.5 flex cursor-pointer items-center gap-2 rounded-lg py-2 pr-2 pl-2.5 text-sm font-medium text-secondary aria-selected:bg-primary_hover aria-selected:text-secondary_hover group-has-[input:focus]/cmd:aria-selected:shadow-focus-ring [&_svg]:text-fg-quaternary"
									>
										{item.icon ? iconSlot(item.icon, 20) : null}
										<span className="flex min-w-0 flex-1 items-baseline gap-2">
											{/* La etiqueta no se parte: si no cabe todo, se recorta la descripción */}
											<span className="shrink-0 whitespace-nowrap">{item.label}</span>
											{item.description ? (
												<span className="truncate font-normal text-tertiary">
													{item.description}
												</span>
											) : null}
										</span>
										{item.shortcut ? <Kbd>{item.shortcut}</Kbd> : null}
									</div>
								);
							})}
						</div>
					))}
				</div>
			) : (
				<div role="status" className="flex flex-col items-center gap-2 px-4 py-8 text-center">
					<FeaturedIcon icon={SearchLg} variant="modern" color="gray" size="md" />
					<div className="m-0 text-md font-semibold text-primary">{t.noResults}</div>
					<div className="mt-1 max-w-[352px] text-sm text-tertiary">
						{emptyText ?? defaultStrings.tryAnother}
					</div>
				</div>
			)}
			<div className="flex gap-4 bg-secondary px-4 py-3 text-xs text-tertiary">
				<span>
					<Kbd className="mr-0.5 bg-primary">↑</Kbd>
					<Kbd className="mr-0.5 bg-primary">↓</Kbd> {t.move}
				</span>
				<span>
					<Kbd className="mr-0.5 bg-primary">↵</Kbd> {t.open}
				</span>
				<span>
					<Kbd className="mr-0.5 bg-primary">esc</Kbd> {t.close}
				</span>
			</div>
		</>
	);
	const PANEL =
		"group/cmd w-full max-w-[640px] overflow-hidden rounded-xl border border-secondary_alt bg-primary_alt font-body shadow-xl outline-none";

	if (contained) {
		return (
			// biome-ignore lint/a11y/noStaticElementInteractions: el clic en el fondo cierra; Escape va por el buscador
			// biome-ignore lint/a11y/useKeyWithClickEvents: el clic en el fondo cierra; Escape va por el buscador
			<div
				className={cx(OVERLAY, OVERLAY_POSITION(true), "items-start justify-center pt-6")}
				onClick={(e) => {
					if (e.target === e.currentTarget) onClose?.();
				}}
			>
				<div role="dialog" aria-label={t.dialog} className={PANEL}>
					{body}
				</div>
			</div>
		);
	}
	return (
		<ModalOverlay
			isOpen
			isDismissable
			onOpenChange={(next) => {
				if (!next) onClose?.();
			}}
			className={cx(OVERLAY, OVERLAY_POSITION(false), "items-start justify-center pt-40")}
		>
			<Modal className={PANEL}>
				<Dialog aria-label={t.dialog} className="outline-none">
					{body}
				</Dialog>
			</Modal>
		</ModalOverlay>
	);
}
