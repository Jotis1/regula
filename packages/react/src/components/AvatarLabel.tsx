import type { ReactNode } from "react";
import { cx } from "../internal/cx.js";
import { Avatar, type AvatarProps } from "./Avatar.js";

export interface AvatarLabelProps extends AvatarProps {
	/** Nombre, en `text-sm` semibold y `text-primary`. */
	name: ReactNode;
	/** Línea de apoyo (correo, rol), en `text-tertiary`. */
	supporting?: ReactNode;
}

/** Avatar con nombre y una línea de apoyo, para menús, filas de tabla y el sidebar. */
export function AvatarLabel({ name, supporting, className, ...avatar }: AvatarLabelProps) {
	return (
		<span className={cx("inline-flex items-center gap-2 font-body", className)}>
			<Avatar {...avatar} />
			<span>
				<span className="block text-sm font-semibold text-primary">{name}</span>
				{supporting ? <span className="block text-sm text-tertiary">{supporting}</span> : null}
			</span>
		</span>
	);
}
