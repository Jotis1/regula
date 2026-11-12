import { Check, XClose } from "@untitledui/icons";
import type { ReactNode } from "react";
import { hiddenInput } from "../internal/choice.js";
import { cx } from "../internal/cx.js";
import { defaultStrings } from "../internal/strings.js";

export type TagSize = "sm" | "md" | "lg";

export interface TagProps {
	/** Alto: `sm` 24 · `md` 24 con texto de 14 · `lg` 28. */
	size?: TagSize;
	/** Contador tras el texto. */
	count?: number;
	/** Punto verde antes del texto. */
	dot?: boolean;
	/** Bandera de 13px antes del texto, como `<FlagEs />` de `@untitledui/country-flags`. */
	flag?: ReactNode;
	/** Avatar de 16px antes del texto: la URL de una foto o un nodo. */
	avatar?: string | ReactNode;
	/**
	 * Casilla delante (14, 16 o 18px) que marca y desmarca el tag. El tag entero es su etiqueta: se marca con un clic
	 * en el texto o con Espacio.
	 */
	checkable?: boolean;
	/** Marcado, si lo controlas tú. Sin `checked`, el tag guarda su estado (`defaultChecked`). */
	checked?: boolean;
	defaultChecked?: boolean;
	/** Avisa al marcar o desmarcar. */
	onCheckedChange?: (checked: boolean) => void;
	/** `name` y `value` de la casilla, para enviarla en un formulario. */
	name?: string;
	value?: string;
	/** Muestra una X para quitarlo. */
	onRemove?: () => void;
	/** Nombre accesible de la X. Por defecto, "Quitar" seguido del texto. */
	removeLabel?: string;
	children: ReactNode;
	className?: string;
}

const SIZE: Record<TagSize, string> = {
	sm: "px-2 py-[3px] text-xs",
	md: "px-[9px] py-0.5 text-sm",
	lg: "px-2.5 py-1 text-sm",
};

// Del Figma (Tag, 3307:417515): con algo delante del texto, el hueco izquierdo se estrecha (con la casilla, 5, 4 y
// 5px; con bandera o avatar, 4, 5 y 7px) y lo de delante se separa 4, 5 y 6px del texto. La separación general del
// tag es de 3px: el grupo añade lo que falta con su margen.
const LEAD_PAD: Record<"check" | "media", Record<TagSize, string>> = {
	check: { sm: "pl-[5px]", md: "pl-1", lg: "pl-[5px]" },
	media: { sm: "pl-1", md: "pl-[5px]", lg: "pl-[7px]" },
};
const LEAD_GROUP: Record<TagSize, string> = {
	sm: "gap-1 mr-px",
	md: "gap-[5px] mr-0.5",
	lg: "gap-1.5 mr-[3px]",
};
// Casilla del Figma (Tag checkbox, 3308:406033)
const BOX: Record<TagSize, string> = { sm: "size-3.5", md: "size-4", lg: "size-4.5" };
const CHECK: Record<TagSize, number> = { sm: 10, md: 12, lg: 14 };

// color-fijo: borde interior de 0,33px al 16 % negro del avatar del Figma, por encima de la foto
const AVATAR_EDGE =
	"after:absolute after:inset-0 after:rounded-full after:shadow-[inset_0_0_0_0.33px_#00000029]";

/** Chip neutro que pone o quita el usuario: filtros aplicados, etiquetas, selecciones. */
export function Tag({
	size = "sm",
	count,
	dot,
	flag,
	avatar,
	checkable,
	checked,
	defaultChecked,
	onCheckedChange,
	name,
	value,
	onRemove,
	removeLabel,
	children,
	className,
}: TagProps) {
	const label =
		removeLabel ??
		(typeof children === "string" ? `${defaultStrings.remove} ${children}` : defaultStrings.remove);
	const media = flag ? (
		<span aria-hidden="true" className="flex size-[13.33px] shrink-0 [&>*]:size-full">
			{flag}
		</span>
	) : avatar ? (
		<span
			aria-hidden="true"
			className={cx(
				"relative flex size-4 shrink-0 overflow-hidden rounded-full [&>*]:size-full",
				AVATAR_EDGE,
			)}
		>
			{typeof avatar === "string" ? <img src={avatar} alt="" className="object-cover" /> : avatar}
		</span>
	) : null;
	const lead = checkable ? "check" : media ? "media" : undefined;
	const Root = checkable ? "label" : "span";
	return (
		<Root
			className={cx(
				"inline-flex items-center gap-[3px] whitespace-nowrap rounded-md bg-primary font-body font-medium text-secondary inset-ring inset-ring-primary",
				SIZE[size],
				lead && LEAD_PAD[lead][size],
				checkable && "relative cursor-pointer",
				className,
			)}
		>
			{lead ? (
				<span className={cx("flex shrink-0 items-center", LEAD_GROUP[size])}>
					{checkable ? (
						<>
							<input
								type="checkbox"
								className={hiddenInput}
								checked={checked}
								defaultChecked={checked === undefined ? defaultChecked : undefined}
								onChange={(e) => onCheckedChange?.(e.target.checked)}
								name={name}
								value={value}
							/>
							<span
								aria-hidden="true"
								className={cx(
									"inline-flex shrink-0 items-center justify-center rounded-sm bg-primary text-fg-white shadow-[inset_0_0_0_1px_var(--border-primary)] transition-colors duration-100",
									"peer-checked:bg-brand-solid peer-checked:shadow-none peer-checked:hover:bg-brand-solid_hover peer-focus-visible:shadow-focus-ring",
									"[&>svg]:hidden peer-checked:[&>svg]:block",
									BOX[size],
								)}
							>
								<Check size={CHECK[size]} strokeWidth={1.67} />
							</span>
						</>
					) : null}
					{media}
				</span>
			) : null}
			{dot ? (
				<span
					aria-hidden="true"
					className="m-px size-1.5 shrink-0 rounded-full bg-fg-success-secondary"
				/>
			) : null}
			{children}
			{count != null ? (
				<span className="rounded-[3px] bg-tertiary px-[5px] text-xs text-secondary">{count}</span>
			) : null}
			{onRemove ? (
				<button
					type="button"
					onClick={onRemove}
					aria-label={label}
					className="inline-flex cursor-pointer rounded-[3px] bg-transparent p-0.5 text-fg-quaternary transition-colors duration-100 hover:bg-primary_hover hover:text-fg-quaternary_hover focus-visible:shadow-focus-ring focus-visible:outline-none"
				>
					<XClose size={size === "sm" ? 12 : 14} />
				</button>
			) : null}
		</Root>
	);
}
