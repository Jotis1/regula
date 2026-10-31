import { cx } from "../internal/cx.js";
import { Avatar, type AvatarProps } from "./Avatar.js";

export interface AvatarGroupProps {
	/** Props de cada `Avatar`. El último puede ser "+N" en `initials`. */
	items: AvatarProps[];
	/** Tamaño de todos los avatares. Por defecto, `sm`. */
	size?: AvatarProps["size"];
	className?: string;
}

/** Avatares solapados 8px, cada uno con su anillo, para mostrar quién participa. */
export function AvatarGroup({ items, size = "sm", className }: AvatarGroupProps) {
	return (
		<span className={cx("inline-flex [&>*+*]:-ml-2", className)}>
			{items.map((item, i) => (
				// biome-ignore lint/suspicious/noArrayIndexKey: la lista no tiene ids y no se reordena
				<Avatar key={i} size={size} ring {...item} />
			))}
		</span>
	);
}
