import { Icon, type IconName, type IconProps } from "@jotis-me/icons";
import type { ReactNode } from "react";

export { Icon, type IconName, type IconProps };

/** Pinta un icono por nombre o deja pasar un nodo ya hecho (para props como `iconLeading`). */
export function iconSlot(icon: IconName | ReactNode | undefined, size: number): ReactNode {
	if (typeof icon === "string") return <Icon name={icon as IconName} size={size} />;
	return icon ?? null;
}
