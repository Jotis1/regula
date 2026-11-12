import type { ReactNode } from "react";
import { cx } from "../internal/cx.js";
import { Avatar, type AvatarProps, type AvatarSize } from "./Avatar.js";

export interface AvatarLabelProps extends AvatarProps {
	/** Nombre, en semibold y `text-primary`. */
	name: ReactNode;
	/** Línea de apoyo (correo, rol), en `text-tertiary`. */
	supporting?: ReactNode;
	/**
	 * Tamaño del avatar y del texto, como el Figma (Avatar label group, 82:2793): `sm` avatar de 32 con nombre
	 * `text-sm` y apoyo `text-xs` · `md` avatar de 40 con `text-sm` · `lg` avatar de 48 con `text-md`. El resto de
	 * tamaños de `Avatar` llevan el texto de `md`.
	 * @default "md"
	 */
	size?: AvatarSize;
}

const TEXT: Partial<Record<AvatarSize, [name: string, supporting: string]>> = {
	sm: ["text-sm", "text-xs"],
	lg: ["text-md", "text-md"],
};

/** Avatar con nombre y una línea de apoyo, para menús, filas de tabla y el sidebar. */
export function AvatarLabel({ name, supporting, size = "md", className, ...avatar }: AvatarLabelProps) {
	const [nameText, supportingText] = TEXT[size] ?? ["text-sm", "text-sm"];
	return (
		<span className={cx("inline-flex items-center gap-2 font-body", className)}>
			<Avatar size={size} {...avatar} />
			<span>
				<span className={cx("block", nameText, "font-semibold text-primary")}>{name}</span>
				{supporting ? (
					<span className={cx("block", supportingText, "text-tertiary")}>{supporting}</span>
				) : null}
			</span>
		</span>
	);
}
