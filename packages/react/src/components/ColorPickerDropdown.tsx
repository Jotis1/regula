"use client";

import { type ReactNode, useId, useState } from "react";
import { Button as AriaButton, Dialog, DialogTrigger, Popover } from "react-aria-components";
import { cx } from "../internal/cx.js";
import { ColorPicker, type ColorPickerProps } from "./ColorPicker.js";
import { Icon } from "./Icon.js";

export type ColorPickerDropdownTrigger =
	| "swatch-sm"
	| "swatch-md"
	| "swatch-button"
	| "swatch-button-link"
	| "hex-input"
	| "select";

export interface ColorPickerDropdownProps {
	/**
	 * El disparador del Figma: `swatch-sm` (muestra de 20) · `swatch-md` (28) · `swatch-button` (botón con muestra y
	 * texto) · `swatch-button-link` (lo mismo, sin borde) · `hex-input` (campo con muestra, hex y opacidad) · `select`
	 * (campo con etiqueta y el hex).
	 * @default "swatch-button"
	 */
	trigger?: ColorPickerDropdownTrigger;
	/** Color en hex (controlado). */
	value?: string;
	/** Color inicial en hex. Por defecto, el violeta del Figma. */
	defaultValue?: string;
	/** Opacidad, de 0 a 1 (controlada). */
	alpha?: number;
	/** @default 1 */
	defaultAlpha?: number;
	/** Recibe el hex en minúsculas con `#` y la opacidad en cada cambio. */
	onChange?: (hex: string, alpha: number) => void;
	/** Texto del botón y etiqueta del campo; con las muestras solas, su nombre para lectores. @default "Color" */
	label?: string;
	/** Props del `ColorPicker` del panel: muestras guardadas, «Añadir», modelo… */
	pickerProps?: Omit<
		ColorPickerProps,
		"type" | "defaultValue" | "defaultAlpha" | "onChange" | "onClose" | "className"
	>;
	/** Abierto (controlado). */
	isOpen?: boolean;
	onOpenChange?: (open: boolean) => void;
	className?: string;
}

// color-fijo: el violeta de ejemplo del Figma (`Color picker dropdown`), color inicial del selector
const FIGMA_VIOLET = "#7f56d9";
const RING = "outline-none focus-visible:shadow-focus-ring";
const SWATCH = "rounded-full shadow-[inset_0_0_0_1px_var(--border-secondary_alt)]";
const SECONDARY =
	"bg-primary shadow-[var(--shadow-xs-skeuomorphic),inset_0_0_0_1px_var(--border-primary)] hover:bg-primary_hover";
const FIELD = "rounded-lg bg-primary shadow-[var(--shadow-xs),inset_0_0_0_1px_var(--border-primary)]";

/**
 * Selector de color en un desplegable (Figma `Color picker dropdown`, `12424:15898`): uno de los seis disparadores abre,
 * en un popover, el `ColorPicker` con sus pestañas. Escape o la X lo cierran y el foco vuelve al disparador.
 */
export function ColorPickerDropdown({
	trigger = "swatch-button",
	value,
	defaultValue = FIGMA_VIOLET,
	alpha,
	defaultAlpha = 1,
	onChange,
	label = "Color",
	pickerProps,
	isOpen,
	onOpenChange,
	className,
}: ColorPickerDropdownProps) {
	const [innerHex, setInnerHex] = useState(defaultValue.toLowerCase());
	const [innerAlpha, setInnerAlpha] = useState(defaultAlpha);
	const [innerOpen, setInnerOpen] = useState(false);
	const hex = (value ?? innerHex).toLowerCase();
	const a = alpha ?? innerAlpha;
	const open = isOpen ?? innerOpen;
	const setOpen = (o: boolean) => {
		setInnerOpen(o);
		onOpenChange?.(o);
	};
	const labelId = useId();
	const shown = hex.replace("#", "").toUpperCase();
	const percent = `${Math.round(a * 100)}%`;
	const swatch = (size: string) => (
		<span aria-hidden="true" className={cx("shrink-0", SWATCH, size)} style={{ background: hex }} />
	);
	const chevron = (size: number) => (
		<Icon name="chevron-down" size={size} className="shrink-0 text-fg-quaternary" />
	);
	const named = `${label}: #${shown}`;

	let button: ReactNode;
	if (trigger === "swatch-sm" || trigger === "swatch-md")
		button = (
			<AriaButton
				aria-label={named}
				className={cx(
					"inline-flex cursor-pointer rounded-full",
					RING,
					trigger === "swatch-sm" ? "size-5" : "size-7",
				)}
			>
				{swatch("size-full")}
			</AriaButton>
		);
	else if (trigger === "swatch-button")
		button = (
			<AriaButton
				aria-label={named}
				className={cx(
					"inline-flex h-9 cursor-pointer items-center gap-1 rounded-lg px-3 py-2 font-body text-sm font-semibold text-secondary",
					SECONDARY,
					RING,
				)}
			>
				{swatch("size-4")}
				<span className="px-0.5">{label}</span>
				{chevron(16)}
			</AriaButton>
		);
	else if (trigger === "swatch-button-link")
		button = (
			<AriaButton
				aria-label={named}
				className={cx(
					"inline-flex cursor-pointer items-center gap-1.5 rounded-sm font-body text-sm font-semibold text-tertiary hover:text-tertiary_hover",
					RING,
				)}
			>
				{swatch("size-4")}
				<span className="inline-flex items-center gap-1">
					{label}
					{chevron(12)}
				</span>
			</AriaButton>
		);
	else if (trigger === "hex-input")
		button = (
			<AriaButton
				aria-label={`${named}, ${percent}`}
				className={cx(
					"inline-flex h-9 cursor-pointer items-stretch font-body text-sm text-primary",
					FIELD,
					RING,
				)}
			>
				<span className="flex w-25 items-center gap-2 px-2.5">
					{swatch("size-4")}
					<span className="truncate">{shown}</span>
				</span>
				<span className="flex w-14 items-center border-l border-primary px-2.5">{percent}</span>
			</AriaButton>
		);
	else
		button = (
			<AriaButton
				aria-labelledby={`${labelId} ${labelId}-value`}
				className={cx(
					"flex h-10 w-full cursor-pointer items-center gap-2 py-2 pr-2.5 pl-3 font-body text-sm font-medium text-primary",
					FIELD,
					RING,
				)}
			>
				{swatch("size-4")}
				<span id={`${labelId}-value`} className="min-w-0 flex-1 truncate text-left">
					#{shown}
				</span>
				{chevron(16)}
			</AriaButton>
		);

	return (
		<div className={cx("inline-flex flex-col gap-1.5", trigger === "select" && "w-80", className)}>
			{trigger === "select" ? (
				<span id={labelId} className="font-body text-sm font-medium text-secondary">
					{label}
				</span>
			) : null}
			<DialogTrigger isOpen={open} onOpenChange={setOpen}>
				{button}
				<Popover placement="bottom end" offset={8} className="z-30 outline-none">
					<Dialog aria-label={label} className="outline-none">
						<ColorPicker
							{...pickerProps}
							type="solid"
							defaultValue={hex}
							defaultAlpha={a}
							onChange={(h, al) => {
								setInnerHex(h);
								if (al !== undefined) setInnerAlpha(al);
								onChange?.(h, al ?? a);
							}}
							onClose={() => setOpen(false)}
						/>
					</Dialog>
				</Popover>
			</DialogTrigger>
		</div>
	);
}
