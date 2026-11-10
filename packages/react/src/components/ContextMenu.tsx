"use client";

import { type KeyboardEvent, type MouseEvent, type ReactNode, useCallback, useRef, useState } from "react";
import {
	Menu,
	MenuItem,
	MenuSection,
	MenuTrigger,
	Popover,
	Pressable,
	Separator,
	SubmenuTrigger,
} from "react-aria-components";
import { cx } from "../internal/cx.js";
import { MENU_PANEL, MenuItemContent, menuItemClasses } from "../internal/menu-item.js";
import { defaultStrings } from "../internal/strings.js";
import { Icon, type IconName } from "./Icon.js";

/** Una acción del menú, o un submenú si lleva `items`. */
export interface ContextMenuAction {
	icon?: IconName | ReactNode;
	label: ReactNode;
	/** Atajo de teclado que se muestra a la derecha (solo texto; no lo registra). */
	shortcut?: string;
	/** Acción destructiva. */
	danger?: boolean;
	disabled?: boolean;
	onSelect?: () => void;
	/** Texto para la búsqueda por teclado si `label` no es texto. */
	textValue?: string;
	/** Con `items`, la opción abre un submenú (→ lo abre y ← lo cierra) y `onSelect` no se usa. */
	items?: ContextMenuItem[];
}

/** Una opción de un grupo con elección. */
export interface ContextMenuChoice {
	value: string;
	label: ReactNode;
	disabled?: boolean;
	textValue?: string;
}

/** Un grupo de opciones con elección: varias con check, o una con punto. */
export type ContextMenuSection =
	| {
			/** Nombre del grupo para lectores de pantalla. */
			section: string;
			selection: "multiple";
			selected: string[];
			onSelectionChange: (selected: string[]) => void;
			items: ContextMenuChoice[];
	  }
	| {
			section: string;
			selection: "single";
			selected: string;
			onSelectionChange: (selected: string) => void;
			items: ContextMenuChoice[];
	  };

export type ContextMenuItem = ContextMenuAction | ContextMenuSection | { divider: true };

export interface ContextMenuProps {
	/** Las opciones del menú: acciones, submenús, grupos con elección y separadores. */
	items: ContextMenuItem[];
	/** La zona sobre la que se abre: lo que lleve el botón derecho. */
	children: ReactNode;
	/** Nombre del menú para lectores de pantalla. */
	"aria-label"?: string;
	/** Abierto de inicio, en línea y sin tomar el foco: para vistas previas. */
	defaultOpen?: boolean;
	/** Dónde sale el menú de una vista previa abierta (`defaultOpen`), desde la esquina de la zona, en px. */
	previewAt?: { x: number; y: number };
	className?: string;
}

const isDivider = (item: ContextMenuItem): item is { divider: true } => "divider" in item;
const isSection = (item: ContextMenuItem): item is ContextMenuSection => "section" in item;

/** El hueco de la izquierda de una opción de elección: un check, un punto, o nada pero con el mismo ancho. */
function Mark({ kind, on }: { kind: "multiple" | "single"; on: boolean }) {
	return (
		<span aria-hidden="true" className="inline-flex size-4 flex-none items-center justify-center">
			{on ? (
				kind === "multiple" ? (
					<Icon name="check" size={16} className="text-fg-brand-primary!" />
				) : (
					<span className="size-2 rounded-full bg-fg-success-primary" />
				)
			) : null}
		</span>
	);
}

function renderItems(items: ContextMenuItem[]): ReactNode[] {
	return items.map((item, i) => {
		if (isDivider(item))
			return (
				<Separator
					// biome-ignore lint/suspicious/noArrayIndexKey: los separadores no tienen otra identidad
					key={`sep-${i}`}
					className="my-1 h-px border-0 bg-[var(--border-secondary)]"
				/>
			);
		if (isSection(item)) {
			const multiple = item.selection === "multiple";
			const selected = multiple ? item.selected : [item.selected];
			return (
				<MenuSection
					// biome-ignore lint/suspicious/noArrayIndexKey: los grupos se identifican por su posición
					key={`section-${i}`}
					aria-label={item.section}
					selectionMode={multiple ? "multiple" : "single"}
					selectedKeys={selected}
					onSelectionChange={(keys) => {
						const next = keys === "all" ? item.items.map((c) => c.value) : [...keys].map(String);
						if (item.selection === "multiple") item.onSelectionChange(next);
						else if (next[0] !== undefined) item.onSelectionChange(next[0]);
					}}
				>
					{item.items.map((choice) => (
						<MenuItem
							key={choice.value}
							id={choice.value}
							isDisabled={choice.disabled}
							textValue={
								choice.textValue ??
								(typeof choice.label === "string" ? choice.label : undefined)
							}
							className={cx(
								menuItemClasses(),
								"data-disabled:cursor-not-allowed data-disabled:opacity-50",
							)}
						>
							{({ isSelected }) => (
								<MenuItemContent
									label={choice.label}
									leading={<Mark kind={item.selection} on={isSelected} />}
								/>
							)}
						</MenuItem>
					))}
				</MenuSection>
			);
		}
		const row = (
			<MenuItem
				// biome-ignore lint/suspicious/noArrayIndexKey: las etiquetas pueden ser nodos o repetirse
				key={i}
				id={i}
				isDisabled={item.disabled}
				textValue={item.textValue ?? (typeof item.label === "string" ? item.label : undefined)}
				onAction={item.items ? undefined : () => item.onSelect?.()}
				className={cx(
					menuItemClasses(item.danger),
					"data-disabled:cursor-not-allowed data-disabled:opacity-50 data-open:bg-primary_hover",
				)}
			>
				<MenuItemContent
					icon={item.icon}
					label={item.label}
					shortcut={item.items ? undefined : item.shortcut}
					trailing={
						item.items ? <Icon name="chevron-right" size={16} className="flex-none" /> : null
					}
				/>
			</MenuItem>
		);
		if (!item.items) return row;
		return (
			// biome-ignore lint/suspicious/noArrayIndexKey: los submenús se identifican por su posición
			<SubmenuTrigger key={`sub-${i}`}>
				{row}
				<Popover placement="end top" offset={-4} className={cx("z-30", MENU_PANEL)}>
					<Menu
						aria-label={typeof item.label === "string" ? item.label : item.textValue}
						className="outline-none"
					>
						{renderItems(item.items)}
					</Menu>
				</Popover>
			</SubmenuTrigger>
		);
	});
}

/**
 * Menú que se abre con el botón derecho sobre una zona (en el punto del puntero) o, con teclado, con Mayús+F10 o la
 * tecla de menú. Cancela el menú del navegador. Con acciones, atajos, iconos, grupos con elección, separadores y submenús.
 */
export function ContextMenu({
	items,
	children,
	"aria-label": ariaLabel,
	defaultOpen = false,
	previewAt = { x: 24, y: 24 },
	className,
}: ContextMenuProps) {
	const [open, setOpen] = useState(defaultOpen);
	// Abierto por el usuario: popover con el foco dentro. Abierto de inicio: en línea, sin tomar el foco.
	const [byUser, setByUser] = useState(false);
	const [point, setPoint] = useState({ x: 0, y: 0 });
	const area = useRef<HTMLDivElement>(null);
	const inline = open && !byUser;
	const label = ariaLabel ?? defaultStrings.options;

	const openAt = useCallback((x: number, y: number) => {
		setPoint({ x, y });
		setByUser(true);
		setOpen(true);
	}, []);

	const onContextMenu = (e: MouseEvent<HTMLDivElement>) => {
		// El menú del navegador no sale; el del componente, en el punto del puntero
		e.preventDefault();
		// El foco vuelve aquí al cerrar
		area.current?.focus({ preventScroll: true });
		openAt(e.clientX, e.clientY);
	};
	const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
		if (!((e.shiftKey && e.key === "F10") || e.key === "ContextMenu")) return;
		e.preventDefault();
		// Con teclado, bajo el elemento que tiene el foco, o en la esquina de la zona
		const active = document.activeElement;
		const target =
			active && active !== area.current && area.current?.contains(active) ? active : area.current;
		const r = target?.getBoundingClientRect();
		openAt(r?.left ?? 0, (r?.bottom ?? 0) - (target === area.current ? (r?.height ?? 0) : 0));
	};

	const menu = (
		<Menu
			aria-label={label}
			{...(byUser ? { autoFocus: "first" as const } : { autoFocus: false })}
			onAction={inline ? () => setOpen(false) : undefined}
			className="outline-none"
		>
			{renderItems(items)}
		</Menu>
	);

	return (
		// biome-ignore lint/a11y/noStaticElementInteractions: la zona solo escucha el botón derecho y la tecla de menú; sus hijos son los controles
		<div
			ref={area}
			tabIndex={-1}
			onContextMenu={onContextMenu}
			onKeyDown={onKeyDown}
			className={cx("relative outline-none", className)}
		>
			{children}
			<MenuTrigger
				// Abierto de inicio, el panel va en línea y para React Aria está cerrado
				isOpen={open && byUser}
				onOpenChange={(next) => {
					setByUser(next);
					setOpen(next);
				}}
			>
				<Pressable>
					<button
						type="button"
						// React Aria nombra el menú con su disparador (`aria-labelledby`): el invisible lleva el nombre del menú
						aria-label={label}
						aria-hidden="true"
						tabIndex={-1}
						className="pointer-events-none fixed size-0"
						style={{ left: point.x, top: point.y }}
					/>
				</Pressable>
				<Popover placement="bottom start" offset={0} className={cx("z-30", MENU_PANEL)}>
					{menu}
				</Popover>
			</MenuTrigger>
			{inline ? (
				// Vista previa abierta: el panel va en línea desde `previewAt`, sin foco ni capa
				<div
					className={cx("absolute z-30", MENU_PANEL)}
					style={{ left: previewAt.x, top: previewAt.y }}
				>
					{menu}
				</div>
			) : null}
		</div>
	);
}
