"use client";

import type { ReactNode } from "react";
import { Tabs as AriaTabs, Tab, TabList, TabPanel } from "react-aria-components";
import { cx } from "../internal/cx.js";
import { useControllable } from "../internal/use-controllable.js";
import { Select } from "./Select.js";

export type TabsType =
	| "underline"
	| "button-brand"
	| "button-gray"
	| "button-border"
	| "button-minimal"
	| "line";
export type TabsOrientation = "horizontal" | "vertical";
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
	 * `horizontal` o `vertical`: apila las pestañas y se recorre con ↑ y ↓. En vertical, por debajo del ancho de escritorio
	 * (`lg`), la lista pasa a un desplegable con las mismas opciones.
	 * @default "horizontal"
	 */
	orientation?: TabsOrientation;
	/**
	 * `underline` para secciones de página; `button-border` como control segmentado dentro de una tarjeta;
	 * `button-brand` cuando la navegación es la protagonista; `button-minimal`, un segmentado sin borde; `line`, una raya de
	 * 2px a la izquierda de la actual (en horizontal se pinta como `underline`).
	 * @default "underline"
	 */
	type?: TabsType;
	/**
	 * Alto: `sm` 36 · `md` 44.
	 * @default "sm"
	 */
	size?: TabsSize;
	/**
	 * Las pestañas se reparten todo el ancho disponible (`Full width` del Figma). Solo en horizontal: en vertical la
	 * lista ya ocupa su columna.
	 * @default false
	 */
	fullWidth?: boolean;
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
	"button-minimal": "inline-flex w-fit rounded-lg bg-secondary_alt",
	line: "gap-0.5",
};

const TAB: Record<TabsType, string> = {
	underline:
		"h-auto rounded-none px-1 pt-0 pb-3 data-selected:text-brand-secondary data-selected:shadow-[inset_0_-2px_0_var(--fg-brand-primary_alt)] data-selected:data-focus-visible:shadow-[inset_0_-2px_0_var(--fg-brand-primary_alt),var(--focus-ring-shadow)]",
	"button-brand":
		"data-hovered:bg-brand-primary_alt data-hovered:text-brand-secondary data-selected:bg-brand-primary_alt data-selected:text-brand-secondary",
	"button-gray":
		"data-hovered:bg-primary_hover data-hovered:text-secondary data-selected:bg-primary_hover data-selected:text-secondary",
	"button-border": "data-selected:bg-primary_alt data-selected:text-secondary data-selected:shadow-sm",
	"button-minimal":
		"data-hovered:text-secondary data-selected:bg-primary data-selected:text-secondary data-selected:shadow-sm",
	line: "h-auto rounded-none py-2 data-selected:text-brand-secondary data-selected:shadow-[inset_2px_0_0_var(--fg-brand-primary_alt)] data-selected:data-focus-visible:shadow-[inset_2px_0_0_var(--fg-brand-primary_alt),var(--focus-ring-shadow)]",
};

/** Pestañas para cambiar entre vistas hermanas dentro de una página. Flechas, Inicio y Fin mueven la selección. */
export function Tabs({
	items,
	value,
	defaultValue,
	onChange,
	orientation = "horizontal",
	type: givenType = "underline",
	size = "sm",
	fullWidth = false,
	children,
	className,
	...rest
}: TabsProps) {
	const [current, setCurrent] = useControllable<string | undefined>(value, defaultValue ?? items[0]?.id);
	const vertical = orientation === "vertical";
	const stretch = fullWidth && !vertical;
	// La raya lateral solo tiene sentido en vertical, y la raya inferior solo en horizontal
	const type: TabsType =
		givenType === "line" && !vertical
			? "underline"
			: givenType === "underline" && vertical
				? "line"
				: givenType;
	const choose = (id: string) => {
		if (id === current) return;
		setCurrent(id);
		onChange?.(id);
	};
	return (
		<AriaTabs
			selectedKey={current}
			orientation={orientation}
			onSelectionChange={(key) => choose(String(key))}
			className={cx(vertical && "flex flex-col gap-4 lg:flex-row lg:gap-6", className)}
		>
			<TabList
				aria-label={rest["aria-label"]}
				className={cx(
					"flex gap-1 font-body",
					// Vertical: columna en escritorio y, por debajo de `lg`, el desplegable ocupa su lugar
					vertical && "max-lg:hidden flex-col items-stretch lg:flex-none",
					// Los segmentados son `inline-flex w-fit`: a todo el ancho pasan a `flex w-full`
					stretch ? LIST[type].replace("inline-flex w-fit", "flex w-full") : LIST[type],
				)}
			>
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
							vertical && "justify-start",
							stretch && "flex-1 justify-center",
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
			{vertical ? (
				// El desplegable de por debajo de `lg`: las mismas opciones, enlazado al mismo estado. Con `display: none` en
				// escritorio, no cuenta para los lectores.
				<div className="lg:hidden">
					<Select
						aria-label={rest["aria-label"]}
						size={size}
						value={current}
						onChange={choose}
						options={items.map((item) => ({
							value: item.id,
							label: item.label,
							supporting: item.count != null ? item.count : undefined,
							textValue: typeof item.label === "string" ? item.label : item.id,
						}))}
					/>
				</div>
			) : null}
			{children
				? items.map((item) => (
						<TabPanel
							key={item.id}
							id={item.id}
							className={cx(
								"rounded-md outline-none data-focus-visible:shadow-focus-ring",
								vertical ? "min-w-0 flex-1" : "mt-4",
							)}
						>
							{children(item.id)}
						</TabPanel>
					))
				: null}
		</AriaTabs>
	);
}
