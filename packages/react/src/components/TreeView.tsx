"use client";

import { Check, ChevronDown, ChevronRight, DotsGrid, File04, Folder, Minus } from "@untitledui/icons";
import { type ReactNode, useState } from "react";
import {
	Button as AriaButton,
	Checkbox as AriaCheckbox,
	TreeItem as AriaTreeItem,
	type Key,
	Tree,
	TreeItemContent,
} from "react-aria-components";
import { cx } from "../internal/cx.js";
import { DynIcon, type IconProp, iconSlot } from "../internal/icon.js";
import { useControllable } from "../internal/use-controllable.js";

export interface TreeItem {
	id: string;
	label: ReactNode;
	/** Icono de 16px. Por defecto, `folder` si tiene hijos y `file-04` si no. También un nodo, como un `Avatar` `xs`. */
	icon?: IconProp;
	/** Dato a la derecha, como el tamaño del archivo. */
	meta?: ReactNode;
	children?: TreeItem[];
	/** Texto para la búsqueda por teclado si `label` no es texto. */
	textValue?: string;
}

export interface TreeViewProps {
	/** Más de cuatro niveles es mala señal. */
	items: TreeItem[];
	/** Ids de las carpetas abiertas al principio. */
	defaultOpen?: string[];
	/** Elemento seleccionado al principio (no controlado). */
	defaultSelected?: string;
	/** Elemento seleccionado (controlado). */
	selected?: string;
	/** Al elegir un elemento con clic, Enter o espacio. */
	onSelect?: (item: TreeItem) => void;
	/**
	 * Tamaño de las filas: `sm` (el de siempre) o `md` (más alto y `text-md`), como el Figma (`Tree view`, `12451:566966`).
	 * @default "sm"
	 */
	size?: "sm" | "md";
	/**
	 * `advanced`: cada fila lleva casilla (marcar una carpeta marca todo lo de dentro; con parte marcada, la casilla
	 * queda a medias), el icono de la carpeta o el archivo, el asa de arrastrar y conectores entre niveles. La flecha
	 * abre y cierra; la fila marca y desmarca.
	 * @default "default"
	 */
	type?: "default" | "advanced";
	/** Hojas marcadas (controlado), en `advanced`. Las carpetas se marcan solas según sus hojas. */
	checked?: string[];
	/** Hojas marcadas al principio (no controlado). */
	defaultChecked?: string[];
	/** Avisa con las hojas marcadas. */
	onCheckedChange?: (ids: string[]) => void;
	/** Nombre del árbol para lectores de pantalla. */
	"aria-label"?: string;
	className?: string;
}

function find(items: TreeItem[], id: Key): TreeItem | undefined {
	for (const it of items) {
		if (it.id === id) return it;
		const inner = it.children && find(it.children, id);
		if (inner) return inner;
	}
	return undefined;
}

/** Hojas (elementos sin hijos) de un elemento, o él mismo si es hoja. */
function leaves(item: TreeItem): string[] {
	return item.children?.length ? item.children.flatMap(leaves) : [item.id];
}

/**
 * Árbol de carpetas y archivos desplegable, con guías de nivel.
 * Clic, Enter o espacio eligen el elemento y abren o cierran la carpeta; las flechas mueven el foco sin elegir (→ ← abren y cierran).
 */
export function TreeView(props: TreeViewProps) {
	return props.type === "advanced" ? <AdvancedTreeView {...props} /> : <ClassicTreeView {...props} />;
}

// La fila `sm` es la de siempre, letra a letra; `md` solo cambia el alto y la letra
const ROW_SM =
	"group relative flex cursor-pointer items-center gap-2 rounded-md py-1.5 pr-2 text-sm font-semibold text-tertiary outline-none data-focus-visible:shadow-focus-ring data-hovered:bg-primary_hover data-hovered:text-secondary data-selected:bg-secondary_hover data-selected:text-secondary [&_svg]:text-fg-quaternary data-selected:[&_svg]:text-fg-tertiary";
const ROW_MD = ROW_SM.replace("py-1.5", "py-2").replace("text-sm", "text-md");

function ClassicTreeView({
	items,
	defaultOpen = [],
	defaultSelected,
	selected,
	onSelect,
	size = "sm",
	className,
	...rest
}: TreeViewProps) {
	const [current, setCurrent] = useControllable<string | undefined>(selected, defaultSelected);
	const [expanded, setExpanded] = useState<Set<Key>>(() => new Set(defaultOpen));
	const md = size === "md";
	const step = md ? 28 : 24;

	const choose = (id: Key, toggle: boolean) => {
		const item = find(items, id);
		if (!item) return;
		if (toggle && item.children?.length) {
			const next = new Set(expanded);
			if (next.has(id)) next.delete(id);
			else next.add(id);
			setExpanded(next);
		}
		setCurrent(item.id);
		onSelect?.(item);
	};

	const render = (list: TreeItem[]): ReactNode =>
		list.map((item) => {
			const kids = !!item.children?.length;
			return (
				<AriaTreeItem
					key={item.id}
					id={item.id}
					textValue={item.textValue ?? (typeof item.label === "string" ? item.label : item.id)}
					onPress={() => choose(item.id, true)}
					style={({ level }) => ({ paddingLeft: 8 + (level - 1) * step })}
					className={md ? ROW_MD : ROW_SM}
				>
					<TreeItemContent>
						{({ level, isExpanded }) => (
							<>
								{level > 1 ? (
									<span aria-hidden="true">
										{Array.from({ length: level - 1 }, (_, k) => (
											<i
												// biome-ignore lint/suspicious/noArrayIndexKey: una guía por nivel, fija
												key={k}
												className="absolute -top-0.5 -bottom-0.5 w-px bg-[var(--border-secondary)]"
												style={{ left: 19 + k * step }}
											/>
										))}
									</span>
								) : null}
								<span className="inline-flex w-4 flex-none">
									{kids ? (
										<DynIcon icon={isExpanded ? ChevronDown : ChevronRight} size={16} />
									) : null}
								</span>
								{iconSlot(item.icon ?? (kids ? Folder : File04), md ? 20 : 16)}
								<span className="min-w-0 flex-1 truncate">{item.label}</span>
								{item.meta != null ? (
									<span className="text-xs font-medium text-quaternary group-data-selected:text-tertiary">
										{item.meta}
									</span>
								) : null}
							</>
						)}
					</TreeItemContent>
					{kids ? render(item.children as TreeItem[]) : null}
				</AriaTreeItem>
			);
		});

	// Un solo elemento raíz: React Aria deja junto al árbol una plantilla y marcadores ocultos
	return (
		<div className={cx(md ? "max-w-[320px]" : "max-w-[280px]", className)}>
			<Tree
				aria-label={rest["aria-label"]}
				selectionMode="single"
				selectionBehavior="toggle"
				disallowEmptySelection
				selectedKeys={current ? [current] : []}
				// La selección la llevan los clics y Enter o espacio (onPress de cada fila); React Aria solo la pinta
				onSelectionChange={() => {}}
				expandedKeys={expanded}
				onExpandedChange={setExpanded}
				className="flex flex-col gap-0.5 font-body outline-none"
			>
				{render(items)}
			</Tree>
		</div>
	);
}

function AdvancedTreeView({
	items,
	defaultOpen = [],
	size = "sm",
	checked: checkedProp,
	defaultChecked = [],
	onCheckedChange,
	className,
	...rest
}: TreeViewProps) {
	const [checked, setChecked] = useControllable<string[]>(checkedProp, defaultChecked, onCheckedChange);
	const [expanded, setExpanded] = useState<Set<Key>>(() => new Set(defaultOpen));
	const md = size === "md";
	const step = md ? 28 : 24;
	const on = new Set(checked);
	const stateOf = (item: TreeItem): boolean | "mixed" => {
		const l = leaves(item);
		const n = l.filter((id) => on.has(id)).length;
		return n === 0 ? false : n === l.length ? true : "mixed";
	};
	// React Aria lleva como seleccionados los elementos marcados del todo (hojas y carpetas completas)
	const selectedKeys = new Set<Key>();
	const walk = (list: TreeItem[]) => {
		for (const it of list) {
			if (stateOf(it) === true) selectedKeys.add(it.id);
			if (it.children) walk(it.children);
		}
	};
	walk(items);

	const onSelectionChange = (keys: "all" | Set<Key>) => {
		if (keys === "all") return;
		const added = [...keys].find((k) => !selectedKeys.has(k));
		const removed = [...selectedKeys].find((k) => !keys.has(k));
		const toggledId = added ?? removed;
		const item = toggledId !== undefined ? find(items, toggledId) : undefined;
		if (!item) return;
		const l = leaves(item);
		// Una carpeta a medias se marca entera al pulsarla
		const turnOn = added !== undefined;
		setChecked(turnOn ? [...new Set([...checked, ...l])] : checked.filter((id) => !l.includes(id)));
	};

	const render = (list: TreeItem[], parentLast: boolean[] = []): ReactNode =>
		list.map((item, idx) => {
			const kids = !!item.children?.length;
			const state = stateOf(item);
			const last = idx === list.length - 1;
			return (
				<AriaTreeItem
					key={item.id}
					id={item.id}
					textValue={item.textValue ?? (typeof item.label === "string" ? item.label : item.id)}
					style={({ level }) => ({ paddingLeft: 8 + (level - 1) * step })}
					className={cx(
						"group relative flex cursor-pointer items-center gap-2 rounded-md pr-2 font-medium text-secondary outline-none data-focus-visible:shadow-focus-ring data-hovered:bg-primary_hover [&_svg]:text-fg-quaternary",
						state !== false && "bg-secondary_hover",
						md ? "py-2 text-md" : "py-1.5 text-sm",
					)}
				>
					<TreeItemContent>
						{({ level, isExpanded }) => (
							<>
								{level > 1 ? (
									<span aria-hidden="true">
										{Array.from({ length: level - 1 }, (_, k) => (
											<i
												// biome-ignore lint/suspicious/noArrayIndexKey: un conector por nivel, fijo
												key={k}
												className={cx(
													"absolute w-px bg-[var(--border-primary)]",
													k === level - 2 && last
														? "-top-0.5 h-1/2"
														: "-top-0.5 -bottom-0.5",
													k < level - 2 && parentLast[k + 1] && "hidden",
												)}
												style={{ left: 15 + k * step }}
											/>
										))}
										<i
											className="absolute top-1/2 h-px w-2 bg-[var(--border-primary)]"
											style={{ left: 15 + (level - 2) * step }}
										/>
									</span>
								) : null}
								{kids ? (
									<AriaButton
										slot="chevron"
										className="inline-flex w-4 flex-none cursor-pointer rounded-sm border-0 bg-transparent p-0 outline-none data-focus-visible:shadow-focus-ring"
									>
										<DynIcon icon={isExpanded ? ChevronDown : ChevronRight} size={16} />
									</AriaButton>
								) : (
									<span className="w-4 flex-none" />
								)}
								<AriaCheckbox
									slot="selection"
									isIndeterminate={state === "mixed"}
									className="group/check flex flex-none cursor-pointer outline-none"
								>
									{({ isSelected, isIndeterminate, isFocusVisible }) => (
										<span
											className={cx(
												"flex size-4 items-center justify-center rounded-[4px] text-fg-white [&_svg]:text-fg-white",
												isSelected || isIndeterminate
													? "bg-brand-solid"
													: "bg-primary shadow-[inset_0_0_0_1px_var(--border-primary)]",
												isFocusVisible && "shadow-focus-ring",
											)}
										>
											{isIndeterminate ? (
												<Minus size={12} />
											) : isSelected ? (
												<Check size={12} />
											) : null}
										</span>
									)}
								</AriaCheckbox>
								{iconSlot(item.icon ?? (kids ? Folder : File04), md ? 20 : 16)}
								<span className="min-w-0 flex-1 truncate">{item.label}</span>
								{item.meta != null ? (
									<span className="text-xs font-medium text-quaternary group-data-selected:text-tertiary">
										{item.meta}
									</span>
								) : null}
								<span
									aria-hidden="true"
									className={cx(
										"flex flex-none opacity-0 group-data-hovered:opacity-100",
										state !== false && "opacity-100",
									)}
								>
									<DotsGrid size={16} />
								</span>
							</>
						)}
					</TreeItemContent>
					{kids ? render(item.children as TreeItem[], [...parentLast, last]) : null}
				</AriaTreeItem>
			);
		});

	return (
		<div className={cx(md ? "max-w-[360px]" : "max-w-[320px]", className)}>
			<Tree
				aria-label={rest["aria-label"]}
				selectionMode="multiple"
				selectionBehavior="toggle"
				selectedKeys={selectedKeys}
				onSelectionChange={onSelectionChange}
				expandedKeys={expanded}
				onExpandedChange={setExpanded}
				className="flex flex-col gap-0.5 font-body outline-none"
			>
				{render(items)}
			</Tree>
		</div>
	);
}
