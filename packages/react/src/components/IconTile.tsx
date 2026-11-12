import { cx } from "../internal/cx.js";
import { type IconProp, iconSlot } from "../internal/icon.js";

export type IconTileSize = 16 | 20 | 24;

export interface IconTileProps {
	/** El icono: un componente de `@untitledui/icons` o un nodo ya pintado. */
	icon: IconProp;
	/** El nombre, visible bajo el icono. Si no cabe se recorta con puntos suspensivos, pero va entero en `title` y en el nombre accesible. */
	label: string;
	/** Elegida: filo de 2px `border-brand` y fondo `bg-brand-primary_alt`. Con botón se anuncia con `aria-pressed`; con enlace, con `aria-current`. */
	selected?: boolean;
	/** Al pulsarla. Sin `href`, la baldosa es un botón. */
	onSelect?: () => void;
	/** Si lo hay, la baldosa es un enlace a este destino. */
	href?: string;
	/**
	 * Lado de la vista previa del icono, en px.
	 * @default 24
	 */
	size?: IconTileSize;
	className?: string;
}

const TILE =
	"flex min-h-[84px] w-full min-w-0 flex-col items-center justify-center gap-2 rounded-lg px-2 py-3 text-center text-secondary no-underline outline-none transition-shadow duration-100 hover:bg-primary_hover";
const EDGE =
	"shadow-[inset_0_0_0_1px_var(--border-secondary)] focus-visible:shadow-[inset_0_0_0_1px_var(--border-secondary),var(--focus-ring-shadow)]";
const EDGE_SELECTED =
	"bg-brand-primary_alt shadow-[inset_0_0_0_2px_var(--border-brand)] focus-visible:shadow-[inset_0_0_0_2px_var(--border-brand),var(--focus-ring-shadow)]";

/**
 * Baldosa con un icono y su nombre, para rejillas de iconos que se eligen. Es un botón (o un enlace con `href`).
 * El elegido se distingue por un filo más grueso, no solo por el color.
 */
export function IconTile({ icon, label, selected, onSelect, href, size = 24, className }: IconTileProps) {
	const classes = cx(TILE, selected ? EDGE_SELECTED : EDGE, className);
	const content = (
		<>
			<span
				className="flex shrink-0 items-center justify-center text-fg-secondary"
				style={{ height: size }}
			>
				{iconSlot(icon, size)}
			</span>
			<span className="block w-full truncate text-xs font-medium">{label}</span>
		</>
	);
	if (href !== undefined) {
		return (
			<a href={href} title={label} aria-current={selected ? "true" : undefined} className={classes}>
				{content}
			</a>
		);
	}
	return (
		<button
			type="button"
			title={label}
			aria-pressed={selected ?? (onSelect ? false : undefined)}
			onClick={onSelect}
			className={classes}
		>
			{content}
		</button>
	);
}
