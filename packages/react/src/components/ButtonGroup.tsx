"use client";

import type { ReactNode } from "react";
import { cx } from "../internal/cx.js";
import { type IconProp, iconSlot } from "../internal/icon.js";
import { useControllable } from "../internal/use-controllable.js";

interface ButtonGroupItemBase {
	value: string;
	/** Punto de color delante del texto (estado, como el del Figma). */
	dot?: boolean;
}

export type ButtonGroupItem = ButtonGroupItemBase &
	(
		| {
				label?: ReactNode;
				icon?: IconProp;
				iconOnly?: undefined;
		  }
		| {
				/** Solo icono: `label` pasa a ser el nombre accesible y no se ve. */
				iconOnly: IconProp;
				label: string;
				icon?: undefined;
				dot?: undefined;
		  }
	);

export interface ButtonGroupProps {
	/** De 2 a 5 opciones cortas. */
	items: ButtonGroupItem[];
	/** Opción elegida (controlado). */
	value?: string;
	/** Opción elegida al principio (no controlado). */
	defaultValue?: string;
	onChange?: (value: string) => void;
	/** Alto del grupo: `md` (40 px, por defecto) o `sm` (36 px). */
	size?: "sm" | "md";
	/** Nombre del grupo para lectores de pantalla. */
	"aria-label"?: string;
	className?: string;
}

/** Botones secundarios unidos para elegir una opción entre pocas. El elegido lleva `aria-pressed`. */
export function ButtonGroup({
	items,
	value,
	defaultValue,
	onChange,
	size = "md",
	className,
	...rest
}: ButtonGroupProps) {
	const [current, setCurrent] = useControllable<string | undefined>(value, defaultValue);
	const select = (next: string) => {
		setCurrent(next);
		onChange?.(next);
	};
	return (
		<fieldset
			aria-label={rest["aria-label"]}
			className={cx(
				"m-0 inline-flex min-w-0 overflow-hidden border-0 p-0 rounded-lg shadow-[var(--shadow-xs-skeuomorphic),inset_0_0_0_1px_var(--border-primary)]",
				className,
			)}
		>
			{items.map((item) => {
				const only = item.iconOnly !== undefined;
				const withIcon = !only && item.icon !== undefined;
				const pad = only
					? size === "md"
						? "justify-center px-3 py-2.5"
						: "justify-center px-2.5 py-2"
					: size === "md"
						? "px-4 py-2.5"
						: withIcon
							? "pl-3 pr-3.5 py-2"
							: "px-3.5 py-2";
				return (
					<button
						key={item.value}
						type="button"
						aria-pressed={current === item.value}
						onClick={() => select(item.value)}
						className={cx(
							"inline-flex",
							size === "md" ? "h-10" : "h-9",
							"cursor-pointer items-center",
							// En `md` con `icon` se queda el hueco de siempre; `sm` y los elementos nuevos siguen las medidas del Figma.
							size === "sm" && withIcon ? "gap-1.5" : "gap-2",
							"border-l border-primary bg-primary",
							pad,
							"font-body text-sm font-semibold text-secondary transition-colors duration-100 first:border-l-0 hover:bg-primary_hover hover:text-secondary_hover focus-visible:relative focus-visible:z-10 focus-visible:shadow-focus-ring focus-visible:outline-none aria-pressed:bg-secondary_hover aria-pressed:text-secondary_hover [&_svg]:text-fg-quaternary",
						)}
					>
						{item.dot ? (
							<span
								aria-hidden="true"
								className="size-2.5 shrink-0 rounded-full bg-utility-green-500"
							/>
						) : null}
						{only ? iconSlot(item.iconOnly, 20) : iconSlot(item.icon, 20)}
						{only ? <span className="sr-only">{item.label}</span> : item.label}
					</button>
				);
			})}
		</fieldset>
	);
}
