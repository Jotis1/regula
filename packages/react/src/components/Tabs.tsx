"use client";

import type { ReactNode } from "react";
import { Tabs as AriaTabs, Tab, TabList, TabPanel } from "react-aria-components";
import { cx } from "../internal/cx.js";
import { useControllable } from "../internal/use-controllable.js";

export type TabsType = "underline" | "button-brand" | "button-gray" | "button-border";
export type TabsSize = "sm" | "md";

export interface TabItem {
	id: string;
	label: ReactNode;
	/** Contador junto a la etiqueta (por ejemplo, elementos sin leer). */
	count?: number;
}

export interface TabsProps {
	items: TabItem[];
	/** Pestaña activa (controlado). */
	value?: string;
	/** Pestaña activa al principio (no controlado). Si falta, la primera. */
	defaultValue?: string;
	onChange?: (id: string) => void;
	/**
	 * `underline` para secciones de página; `button-border` como control segmentado dentro de una tarjeta;
	 * `button-brand` cuando la navegación es la protagonista.
	 * @default "underline"
	 */
	type?: TabsType;
	/**
	 * Alto: `sm` 36 · `md` 44.
	 * @default "sm"
	 */
	size?: TabsSize;
	/** Nombre de la lista de pestañas para lectores de pantalla. */
	"aria-label"?: string;
	/**
	 * Contenido de la pestaña activa (ampliación sobre la guía). Si llega, se pinta en un `tabpanel` enlazado a su
	 * pestaña; si no, el componente es solo la lista y tú pintas el contenido.
	 */
	children?: (id: string) => ReactNode;
	className?: string;
}

const LIST: Record<TabsType, string> = {
	underline: "gap-3 shadow-[inset_0_-1px_0_var(--border-secondary)]",
	"button-brand": "",
	"button-gray": "",
	"button-border":
		"inline-flex w-fit rounded-lg bg-secondary_alt p-1 shadow-[inset_0_0_0_1px_var(--border-secondary)]",
};

const TAB: Record<TabsType, string> = {
	underline:
		"h-auto rounded-none px-1 pt-0 pb-3 data-selected:text-brand-secondary data-selected:shadow-[inset_0_-2px_0_var(--fg-brand-primary_alt)] data-selected:data-focus-visible:shadow-[inset_0_-2px_0_var(--fg-brand-primary_alt),var(--focus-ring-shadow)]",
	"button-brand":
		"data-hovered:bg-brand-primary_alt data-hovered:text-brand-secondary data-selected:bg-brand-primary_alt data-selected:text-brand-secondary",
	"button-gray":
		"data-hovered:bg-primary_hover data-hovered:text-secondary data-selected:bg-primary_hover data-selected:text-secondary",
	"button-border": "data-selected:bg-primary_alt data-selected:text-secondary data-selected:shadow-sm",
};

/** Pestañas para cambiar entre vistas hermanas dentro de una página. Flechas, Inicio y Fin mueven la selección. */
export function Tabs({
	items,
	value,
	defaultValue,
	onChange,
	type = "underline",
	size = "sm",
	children,
	className,
	...rest
}: TabsProps) {
	const [current, setCurrent] = useControllable<string | undefined>(value, defaultValue ?? items[0]?.id);
	return (
		<AriaTabs
			selectedKey={current}
			onSelectionChange={(key) => {
				const id = String(key);
				if (id === current) return;
				setCurrent(id);
				onChange?.(id);
			}}
			className={cx(className)}
		>
			<TabList aria-label={rest["aria-label"]} className={cx("flex gap-1 font-body", LIST[type])}>
				{items.map((item) => (
					<Tab
						key={item.id}
						id={item.id}
						// Sin paneles, React Aria apuntaría aria-controls a un id que no existe
						render={
							children
								? undefined
								: ({ "aria-controls": _, ...props }) => <div {...(props as object)} />
						}
						className={cx(
							"group inline-flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-md px-3 py-2 font-semibold text-quaternary outline-none transition-colors duration-100 data-hovered:text-secondary data-focus-visible:shadow-focus-ring",
							size === "md" ? "h-11 text-md" : "h-9 text-sm",
							TAB[type],
						)}
					>
						{item.label}
						{item.count != null ? (
							<span className="rounded-full bg-utility-neutral-50 px-2 text-xs font-medium text-utility-neutral-700 inset-ring inset-ring-utility-neutral-200 group-data-selected:bg-utility-brand-50 group-data-selected:text-utility-brand-700 group-data-selected:inset-ring-utility-brand-200">
								{item.count}
							</span>
						) : null}
					</Tab>
				))}
			</TabList>
			{children
				? items.map((item) => (
						<TabPanel
							key={item.id}
							id={item.id}
							className="mt-4 rounded-md outline-none data-focus-visible:shadow-focus-ring"
						>
							{children(item.id)}
						</TabPanel>
					))
				: null}
		</AriaTabs>
	);
}
