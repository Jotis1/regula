"use client";

import type { ReactNode } from "react";
import { cx } from "../internal/cx.js";
import { useControllable } from "../internal/use-controllable.js";
import { type IconName, iconSlot } from "./Icon.js";

export interface ButtonGroupItem {
	value: string;
	label?: ReactNode;
	icon?: IconName | ReactNode;
}

export interface ButtonGroupProps {
	/** De 2 a 5 opciones cortas. */
	items: ButtonGroupItem[];
	/** Opción elegida (controlado). */
	value?: string;
	/** Opción elegida al principio (no controlado). */
	defaultValue?: string;
	onChange?: (value: string) => void;
	/** Nombre del grupo para lectores de pantalla. */
	"aria-label"?: string;
	className?: string;
}

/** Botones secundarios unidos para elegir una opción entre pocas. El elegido lleva `aria-pressed`. */
export function ButtonGroup({ items, value, defaultValue, onChange, className, ...rest }: ButtonGroupProps) {
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
			{items.map((item) => (
				<button
					key={item.value}
					type="button"
					aria-pressed={current === item.value}
					onClick={() => select(item.value)}
					className="inline-flex h-10 cursor-pointer items-center gap-2 border-l border-primary bg-primary px-4 py-2.5 font-body text-sm font-semibold text-secondary transition-colors duration-100 first:border-l-0 hover:bg-primary_hover hover:text-secondary_hover focus-visible:relative focus-visible:z-10 focus-visible:shadow-focus-ring focus-visible:outline-none aria-pressed:bg-secondary_hover aria-pressed:text-secondary_hover [&_svg]:text-fg-quaternary"
				>
					{iconSlot(item.icon, 20)}
					{item.label}
				</button>
			))}
		</fieldset>
	);
}
