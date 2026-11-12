import { type ComponentType, isValidElement, type ReactElement, type ReactNode } from "react";

/** Lo mínimo que se le pide a un icono: lado en px, clase y `aria-hidden`. Lo cumplen los de `@untitledui/icons`. */
export interface IconComponentProps {
	size?: number;
	className?: string;
	strokeWidth?: number;
	"aria-hidden"?: boolean | "true" | "false";
}

/** Un icono como componente (`Plus` de `@untitledui/icons`, una bandera, uno propio). */
export type IconComponent = ComponentType<IconComponentProps>;

/**
 * Lo que aceptan las props de icono (`icon`, `iconLeading`…): un componente de icono o un nodo ya pintado. Un nombre en
 * cadena (`"plus"`) no vale: es error de tipos.
 */
export type IconProp = IconComponent | ReactElement | null | false;

/** Un componente de React, función o con envoltorio (`forwardRef`, `memo`): lo que no es un elemento ni un texto. */
function isComponent(value: unknown): value is IconComponent {
	if (typeof value === "function") return true;
	return typeof value === "object" && value !== null && "$$typeof" in value && !isValidElement(value);
}

/** Pinta el icono que recibe una prop de icono: un componente con el tamaño del sitio, o un nodo tal cual. */
export function iconSlot(icon: IconProp | undefined, size: number, className?: string): ReactNode {
	if (isComponent(icon)) {
		const Icon = icon;
		return <Icon size={size} className={className} aria-hidden="true" />;
	}
	return (icon as ReactNode) ?? null;
}

/** Un icono que se elige al pintar (`abierto ? ChevronUp : ChevronDown`). */
export function DynIcon({ icon: Icon, ...props }: IconComponentProps & { icon: IconComponent }) {
	return <Icon {...props} />;
}
