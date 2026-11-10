import { cx } from "../internal/cx.js";
import { defaultStrings } from "../internal/strings.js";
import { Avatar, type AvatarProps, type AvatarSize } from "./Avatar.js";
import { Icon } from "./Icon.js";
import { Tooltip } from "./Tooltip.js";

export interface AvatarGroupProps {
	/** Props de cada `Avatar`. El último puede ser "+N" en `initials`. */
	items: AvatarProps[];
	/** Tamaño de todos los avatares. Por defecto, `sm`. */
	size?: AvatarProps["size"];
	/** Con `onAdd`, al final va un botón redondo de borde discontinuo con el icono de más, a 8px del grupo. */
	onAdd?: () => void;
	/**
	 * Nombre accesible del botón de añadir y texto de su tooltip.
	 * @default "Añadir persona"
	 */
	addLabel?: string;
	className?: string;
}

// El Figma (Avatar add button, 1102:4864) tiene xs, sm y md; de lg en adelante el icono sigue creciendo
const ADD_SIZE: Record<AvatarSize, string> = {
	xs: "size-6",
	sm: "size-8",
	md: "size-10",
	lg: "size-12",
	xl: "size-14",
	"2xl": "size-16",
};
const ADD_ICON: Record<AvatarSize, number> = { xs: 16, sm: 16, md: 20, lg: 20, xl: 24, "2xl": 24 };

/** Avatares solapados 8px, cada uno con su anillo, para mostrar quién participa. */
export function AvatarGroup({ items, size = "sm", onAdd, addLabel, className }: AvatarGroupProps) {
	const avatars = (
		<span className={cx("inline-flex [&>*+*]:-ml-2", onAdd ? undefined : className)}>
			{items.map((item, i) => (
				// biome-ignore lint/suspicious/noArrayIndexKey: la lista no tiene ids y no se reordena
				<Avatar key={i} size={size} ring {...item} />
			))}
		</span>
	);
	if (!onAdd) return avatars;
	const label = addLabel ?? defaultStrings.addPerson;
	return (
		<span className={cx("inline-flex items-start gap-2", className)}>
			{avatars}
			<Tooltip title={label}>
				<button
					type="button"
					aria-label={label}
					onClick={onAdd}
					className={cx(
						"inline-flex shrink-0 cursor-pointer items-center justify-center rounded-full border border-dashed border-primary bg-primary text-fg-quaternary transition-colors duration-100 ease-linear hover:bg-primary_hover hover:text-fg-quaternary_hover focus-visible:shadow-focus-ring focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
						ADD_SIZE[size],
					)}
				>
					<Icon name="plus" size={ADD_ICON[size]} />
				</button>
			</Tooltip>
		</span>
	);
}
