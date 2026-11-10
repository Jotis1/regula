"use client";

import { type ReactNode, useState } from "react";
import { TreeItem as AriaTreeItem, type Key, Tree, TreeItemContent } from "react-aria-components";
import { cx } from "../internal/cx.js";
import { useControllable } from "../internal/use-controllable.js";
import { Icon, type IconName, iconSlot } from "./Icon.js";

export interface TreeItem {
	id: string;
	label: ReactNode;
	/** Icono de 16px. Por defecto, `folder` si tiene hijos y `file-04` si no. */
	icon?: IconName | ReactNode;
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

/**
 * Árbol de carpetas y archivos desplegable, con guías de nivel.
 * Clic, Enter o espacio eligen el elemento y abren o cierran la carpeta; las flechas mueven el foco sin elegir (→ ← abren y cierran).
 */
export function TreeView({
	items,
	defaultOpen = [],
	defaultSelected,
	selected,
	onSelect,
	className,
	...rest
}: TreeViewProps) {
	const [current, setCurrent] = useControllable<string | undefined>(selected, defaultSelected);
	const [expanded, setExpanded] = useState<Set<Key>>(() => new Set(defaultOpen));

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
					style={({ level }) => ({ paddingLeft: 8 + (level - 1) * 24 })}
					className="group relative flex cursor-pointer items-center gap-2 rounded-md py-1.5 pr-2 text-sm font-semibold text-tertiary outline-none data-focus-visible:shadow-focus-ring data-hovered:bg-primary_hover data-hovered:text-secondary data-selected:bg-secondary_hover data-selected:text-secondary [&_svg]:text-fg-quaternary data-selected:[&_svg]:text-fg-tertiary"
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
												style={{ left: 19 + k * 24 }}
											/>
										))}
									</span>
								) : null}
								<span className="inline-flex w-4 flex-none">
									{kids ? (
										<Icon
											name={isExpanded ? "chevron-down" : "chevron-right"}
											size={16}
										/>
									) : null}
								</span>
								{iconSlot(item.icon ?? (kids ? "folder" : "file-04"), 16)}
								<span className="min-w-0 flex-1 truncate">{item.label}</span>
								{item.meta != null ? (
									<span className="text-xs font-medium text-quaternary">{item.meta}</span>
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
		<div className={cx("max-w-[280px]", className)}>
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
