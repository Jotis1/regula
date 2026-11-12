import { Check, CheckCircle } from "@untitledui/icons";
import { cx } from "../internal/cx.js";

export type CheckIconType = "default" | "line" | "filled";
export type CheckIconColor = "brand" | "gray" | "success";
export type CheckIconSize = "sm" | "md" | "lg" | "xl";

export interface CheckIconProps {
	/**
	 * `default` círculo tintado con el check · `line` círculo de contorno con el check · `filled` círculo sólido con el
	 * check en blanco (Figma `Check icon`, `1254:137887`).
	 * @default "default"
	 */
	type?: CheckIconType;
	/** @default "brand" */
	color?: CheckIconColor;
	/**
	 * Lado: `sm` 20 · `md` 24 · `lg` 28 · `xl` 32.
	 * @default "md"
	 */
	size?: CheckIconSize;
	className?: string;
}

const BOX: Record<CheckIconSize, string> = { sm: "size-5", md: "size-6", lg: "size-7", xl: "size-8" };
const CHECK: Record<CheckIconSize, number> = { sm: 12, md: 14, lg: 16, xl: 18 };
const TINT: Record<CheckIconColor, string> = {
	// La escala utility se invierte en oscuro: el tinte y el check mantienen el contraste en los dos temas
	brand: "bg-utility-brand-100 text-utility-brand-600",
	gray: "bg-utility-neutral-100 text-utility-neutral-600",
	success: "bg-utility-green-100 text-utility-green-600",
};
const LINE: Record<CheckIconColor, string> = {
	brand: "text-fg-brand-primary",
	gray: "text-fg-quaternary",
	success: "text-fg-success-primary",
};
const SOLID: Record<CheckIconColor, string> = {
	brand: "bg-brand-solid",
	gray: "bg-secondary-solid",
	success: "bg-success-solid",
};

/** Check en círculo para listas de lo que incluye un plan o de pasos hechos. Es decorativo: el texto va al lado. */
export function CheckIcon({ type = "default", color = "brand", size = "md", className }: CheckIconProps) {
	if (type === "line")
		return (
			<span aria-hidden="true" className={cx("inline-flex shrink-0", LINE[color], className)}>
				<CheckCircle size={{ sm: 20, md: 24, lg: 28, xl: 32 }[size]} />
			</span>
		);
	return (
		<span
			aria-hidden="true"
			className={cx(
				"inline-flex shrink-0 items-center justify-center rounded-full",
				BOX[size],
				type === "filled" ? [SOLID[color], "text-fg-white"] : TINT[color],
				className,
			)}
		>
			<Check size={CHECK[size]} />
		</span>
	);
}
