"use client";

import { isValidElement, type ReactElement, type ReactNode, useRef, useState } from "react";
import { Menu, MenuItem, MenuTrigger, Popover, Pressable, Separator } from "react-aria-components";
import { cx } from "../internal/cx.js";
import { Kbd } from "../internal/kbd.js";
import { defaultStrings } from "../internal/strings.js";
import { useControllable } from "../internal/use-controllable.js";
import { Button } from "./Button.js";
import { Icon, type IconName } from "./Icon.js";

export interface DropdownAction {
	icon?: IconName;
	label: ReactNode;
	/** Atajo de teclado que se muestra a la derecha (solo texto; no lo registra). */
	shortcut?: string;
	/** Acción destructiva: va al final, tras un separador. */
	danger?: boolean;
	onSelect?: () => void;
	/** Texto para la búsqueda por teclado si `label` no es texto. */
	textValue?: string;
}

export type DropdownItem = DropdownAction | { divider: true };

export interface DropdownProps {
	/**
	 * Texto del botón que abre el menú.
	 * @default "Opciones"
	 */
	label?: ReactNode;
	/** Disparador propio en lugar del botón: un elemento que pase `ref` y props al DOM, como un `Button` solo icono. */
	trigger?: ReactNode;
	/** Cabecera del panel, por ejemplo un `AvatarLabel`. */
	header?: ReactNode;
	/** Abierto (controlado). */
	open?: boolean;
	/** Abierto al principio (no controlado). Así abierto no se lleva el foco ni bloquea la página. */
	defaultOpen?: boolean;
	/** Avisa al abrir y cerrar (ampliación sobre la guía, para el modo controlado). */
	onOpenChange?: (open: boolean) => void;
	items: DropdownItem[];
	/** Nombre del menú para lectores de pantalla. Por defecto, el texto del botón. */
	"aria-label"?: string;
	className?: string;
}

const PANEL =
	"min-w-60 rounded-lg bg-primary_alt py-1 font-body shadow-[var(--shadow-lg),inset_0_0_0_1px_var(--border-secondary_alt)] outline-none";

const isDivider = (item: DropdownItem): item is { divider: true } => "divider" in item;

/** Menú de acciones que se abre desde un botón. La acción destructiva va al final, tras un separador, con `danger`. */
export function Dropdown({
	label,
	trigger,
	header,
	open: openProp,
	defaultOpen = false,
	onOpenChange,
	items,
	className,
	...rest
}: DropdownProps) {
	const [open, setOpen] = useControllable(openProp, defaultOpen, onOpenChange);
	// Abierto por el usuario: menú modal con el foco dentro, y React Aria lo devuelve al disparador al cerrar.
	// Abierto de inicio (defaultOpen): sin foco ni bloqueo de la página.
	const [byUser, setByUser] = useState(false);
	// MenuTrigger abre (no alterna) al pulsar con ratón; el menú abierto de inicio no es modal y nada lo cerraría.
	const closeOnPress = useRef(false);
	const menuLabel = rest["aria-label"] ?? (typeof label === "string" ? label : defaultStrings.options);

	const panel = (
		<>
			{header ? (
				<div className="mb-1 flex items-center gap-3 px-4 py-3 shadow-[inset_0_-1px_0_var(--border-secondary)]">
					{header}
				</div>
			) : null}
			<Menu aria-label={menuLabel} {...(byUser ? {} : { autoFocus: false })} className="outline-none">
				{items.map((item, i) =>
					isDivider(item) ? (
						<Separator
							// biome-ignore lint/suspicious/noArrayIndexKey: los separadores no tienen otra identidad
							key={`sep-${i}`}
							className="my-1 h-px border-0 bg-[var(--border-secondary)]"
						/>
					) : (
						<MenuItem
							// biome-ignore lint/suspicious/noArrayIndexKey: las etiquetas pueden ser nodos o repetirse
							key={i}
							id={i}
							textValue={
								item.textValue ?? (typeof item.label === "string" ? item.label : undefined)
							}
							onAction={() => item.onSelect?.()}
							className={cx(
								"mx-1.5 my-px flex cursor-pointer items-center gap-2 rounded-md px-2.5 py-[9px] text-sm font-medium outline-none data-focused:bg-primary_hover",
								item.danger
									? "text-error-primary [&_svg]:text-fg-error-secondary"
									: "text-secondary data-focused:text-secondary_hover [&_svg]:text-fg-quaternary",
							)}
						>
							{item.icon ? <Icon name={item.icon} size={16} /> : null}
							{item.label}
							{item.shortcut ? <Kbd className="ml-auto">{item.shortcut}</Kbd> : null}
						</MenuItem>
					),
				)}
			</Menu>
		</>
	);

	return (
		<div className={cx("relative inline-block", className)}>
			<MenuTrigger
				isOpen={open}
				onOpenChange={(next) => {
					setByUser(next);
					setOpen(next);
				}}
			>
				<Pressable
					onPressStart={() => {
						closeOnPress.current = open && !byUser;
					}}
					onPress={() => {
						if (closeOnPress.current) setOpen(false);
						closeOnPress.current = false;
					}}
				>
					{trigger && isValidElement(trigger) ? (
						(trigger as ReactElement)
					) : (
						<Button hierarchy="secondary" iconTrailing="chevron-down">
							{label ?? defaultStrings.options}
						</Button>
					)}
				</Pressable>
				{open && !byUser ? (
					// Abierto de inicio (vista previa): el panel va en línea bajo el botón, como en la guía. Un popover
					// flotante se daría la vuelta, se recortaría a la ventana y se cerraría al desplazar la página.
					<div className={cx("absolute top-[calc(100%+4px)] left-0 z-30", PANEL)}>{panel}</div>
				) : (
					<Popover placement="bottom start" offset={4} className={cx("z-30", PANEL)}>
						{panel}
					</Popover>
				)}
			</MenuTrigger>
		</div>
	);
}
