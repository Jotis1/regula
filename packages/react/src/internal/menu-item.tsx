import type { ReactNode } from "react";
import { Keyboard, Text } from "react-aria-components";
import { Icon, type IconName, iconSlot } from "../components/Icon.js";
import { Kbd } from "../components/Kbd.js";
import { cx } from "./cx.js";

/** Panel de un menú de opciones (`Dropdown`, `ContextMenu`): `bg-primary_alt`, `radius-lg`, `shadow-lg` y filo `border-secondary_alt`. */
export const MENU_PANEL =
	"min-w-60 rounded-lg bg-primary_alt py-1 font-body shadow-[var(--shadow-lg),inset_0_0_0_1px_var(--border-secondary_alt)] outline-none";

/** Clases de una opción del menú: 14px medium, `bg-primary_hover` con el ratón o el teclado, y los iconos en `fg-quaternary`. */
export const menuItemClasses = (danger?: boolean) =>
	cx(
		"mx-1.5 my-px flex cursor-pointer items-center gap-2 rounded-md px-2.5 py-[9px] text-sm font-medium outline-none data-focused:bg-primary_hover",
		danger
			? "text-error-primary [&_svg]:text-fg-error-secondary"
			: "text-secondary data-focused:text-secondary_hover [&_svg]:text-fg-quaternary",
	);

interface MenuItemContentProps {
	icon?: IconName | ReactNode;
	label: ReactNode;
	shortcut?: string;
	/** Check de la opción elegida a la derecha (menú de elección única de `Dropdown`). */
	checked?: boolean;
	/** Algo a la derecha tras la etiqueta, como el chevron de un submenú. */
	trailing?: ReactNode;
	/** Algo a la izquierda de todo, como la marca de una opción de elección. */
	leading?: ReactNode;
}

/**
 * Lo de dentro de una opción: icono, etiqueta con su atajo y, si toca, el check. Etiqueta, descripción y atajo van en
 * sus huecos de React Aria: así `aria-labelledby` y `aria-describedby` de la opción apuntan a algo también en el HTML de
 * servidor. El atajo va dentro de la etiqueta, para que el nombre accesible sea todo lo que se ve; descripción y teclado
 * quedan vacíos.
 */
export function MenuItemContent({ icon, label, shortcut, checked, trailing, leading }: MenuItemContentProps) {
	return (
		<>
			{leading}
			{icon ? iconSlot(icon, 16) : null}
			<Text slot="label" className="flex min-w-0 flex-1 items-center gap-2">
				{label}
				{shortcut ? <Kbd className="ml-auto">{shortcut}</Kbd> : null}
			</Text>
			<Text slot="description" className="hidden" />
			<Keyboard className="hidden" />
			{/* El check de la opción elegida: decorativo, el estado ya lo dice aria-checked. El `!` es para que no
			    lo pise el color de iconos de la opción (`[&_svg]:text-fg-quaternary`) */}
			{checked ? <Icon name="check" size={16} className="flex-none text-fg-brand-primary!" /> : null}
			{trailing}
		</>
	);
}
