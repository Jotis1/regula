"use client";

import type { ReactNode } from "react";
import { Radio as AriaRadio, RadioGroup as AriaRadioGroup } from "react-aria-components";
import { type ChoiceSize, ChoiceText, choiceBox, choiceLabel, radioDot } from "../internal/choice.js";
import { cx } from "../internal/cx.js";
import { Avatar, type AvatarProps } from "./Avatar.js";
import { type IconName, iconSlot } from "./Icon.js";

export interface RadioGroupOption {
	value: string;
	label: ReactNode;
	hint?: ReactNode;
	/** Solo en tarjetas: apoyo en línea tras la etiqueta, en `text-tertiary` (p. ej. "10 €/mes"). */
	supporting?: ReactNode;
	/** Solo en tarjetas: lo que va delante del texto, de 32px: un `FeaturedIcon`, un `Avatar` o un logo de pago. */
	media?: ReactNode;
	/** Solo en tarjetas: opción deshabilitada. */
	disabled?: boolean;
	/** Solo en tarjetas: icono en una caja de 32px (40 en `md`) con borde y sombra (`Icon simple` del Figma). */
	icon?: IconName | ReactNode;
	/** Solo en tarjetas: avatar redondo de 32px (40 en `md`) delante del texto. */
	avatar?: Pick<AvatarProps, "src" | "alt" | "initials">;
	/**
	 * Solo en tarjetas: logo de pago en una caja de 46×32px (58×40 en `md`), como un nodo de `@jotis-me/icons/payments`. El
	 * paquete no los importa.
	 */
	paymentIcon?: ReactNode;
}

export interface RadioGroupProps {
	/** Hasta cinco opciones; con más, `Select`. */
	options: RadioGroupOption[];
	value?: string;
	defaultValue?: string;
	onChange?: (value: string) => void;
	/**
	 * Círculos de 16px (`sm`) o 20px (`md`).
	 * @default "sm"
	 */
	size?: ChoiceSize;
	/** Nombre del campo al enviar el formulario. */
	name?: string;
	/**
	 * `card`: cada opción es una tarjeta con borde `border-secondary` que pasa a 2px `border-brand` al elegirla.
	 * `icon-simple`: la misma tarjeta pensada para llevar delante un `icon`, un `avatar` o un `paymentIcon` por opción
	 * (también los admite `card`).
	 * @default "default"
	 */
	appearance?: "default" | "card" | "icon-simple";
	/**
	 * Solo en tarjetas: círculo (`radio`) o casilla con check (`checkbox`), arriba a la derecha.
	 * @default "radio"
	 */
	indicator?: "radio" | "checkbox";
	/** Qué se elige, si no hay una etiqueta visible. */
	"aria-label"?: string;
	className?: string;
}

/** Grupo de opciones excluyentes con flechas para moverse entre ellas. */
export function RadioGroup({
	options,
	value,
	defaultValue,
	onChange,
	size = "sm",
	name,
	appearance = "default",
	indicator = "radio",
	"aria-label": ariaLabel,
	className,
}: RadioGroupProps) {
	if (appearance !== "default") {
		const md = size === "md";
		return (
			<AriaRadioGroup
				value={value}
				defaultValue={defaultValue}
				onChange={onChange}
				name={name}
				aria-label={ariaLabel}
				className={cx("flex flex-col gap-3 font-body", className)}
			>
				{options.map((o) => (
					<AriaRadio
						key={o.value}
						value={o.value}
						isDisabled={o.disabled}
						className="group flex cursor-pointer items-start gap-1 rounded-xl bg-primary p-4 shadow-[inset_0_0_0_1px_var(--border-secondary)] transition-shadow duration-100 data-selected:shadow-[inset_0_0_0_2px_var(--border-brand)] data-disabled:cursor-not-allowed data-disabled:opacity-50"
					>
						<span className="flex min-w-0 flex-1 items-start gap-3">
							{o.media != null ? <span className="flex flex-none">{o.media}</span> : null}
							{o.media == null && o.paymentIcon != null ? (
								<span
									aria-hidden="true"
									className={cx(
										"flex flex-none items-center justify-center overflow-hidden rounded-xs bg-fg-white shadow-[inset_0_0_0_1px_var(--border-secondary)] [&>*]:h-full [&>*]:w-full",
										md ? "h-10 w-[58px]" : "h-8 w-[46px]",
									)}
								>
									{o.paymentIcon}
								</span>
							) : null}
							{o.media == null && o.paymentIcon == null && o.avatar ? (
								<span aria-hidden="true" className="flex flex-none">
									<Avatar size={md ? "md" : "sm"} {...o.avatar} />
								</span>
							) : null}
							{o.media == null && o.paymentIcon == null && !o.avatar && o.icon ? (
								<span
									aria-hidden="true"
									className={cx(
										"flex flex-none items-center justify-center rounded-md bg-primary text-fg-secondary shadow-[var(--shadow-xs-skeuomorphic),inset_0_0_0_1px_var(--border-primary)]",
										md ? "size-10" : "size-8",
									)}
								>
									{iconSlot(o.icon, md ? 20 : 16)}
								</span>
							) : null}
							<span className={cx("flex min-w-0 flex-col", md ? "text-md" : "text-sm")}>
								<span className="flex flex-wrap gap-x-1">
									<span className="font-medium text-secondary">{o.label}</span>
									{o.supporting != null ? (
										<span className="font-normal text-tertiary">{o.supporting}</span>
									) : null}
								</span>
								{o.hint != null ? (
									<span className="font-normal text-tertiary">{o.hint}</span>
								) : null}
							</span>
						</span>
						<span
							aria-hidden="true"
							className={cx(
								choiceBox(size, indicator === "radio"),
								"group-data-selected:bg-brand-solid group-data-selected:shadow-none group-data-focus-visible:shadow-focus-ring",
							)}
						>
							{indicator === "radio" ? (
								<span className={cx(radioDot(size), "hidden group-data-selected:block")} />
							) : (
								<span className="hidden group-data-selected:inline-flex">
									{/* El check del icono `check`, en línea: importar Icon traería el set entero a RadioGroup. */}
									<svg
										width={md ? 14 : 12}
										height={md ? 14 : 12}
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth={1.67}
										strokeLinecap="round"
										strokeLinejoin="round"
										aria-hidden="true"
										focusable="false"
									>
										<path d="M20 6L9 17L4 12" />
									</svg>
								</span>
							)}
						</span>
					</AriaRadio>
				))}
			</AriaRadioGroup>
		);
	}
	return (
		<AriaRadioGroup
			value={value}
			defaultValue={defaultValue}
			onChange={onChange}
			name={name}
			aria-label={ariaLabel}
			className={cx("flex flex-col gap-3", className)}
		>
			{options.map((o) => (
				<AriaRadio key={o.value} value={o.value} className={choiceLabel(size)}>
					<span
						aria-hidden="true"
						className={cx(
							choiceBox(size, true),
							"group-data-selected:bg-brand-solid group-data-selected:shadow-none group-data-focus-visible:shadow-focus-ring group-data-disabled:opacity-50",
						)}
					>
						<span className={cx(radioDot(size), "hidden group-data-selected:block")} />
					</span>
					<ChoiceText
						label={o.label}
						hint={o.hint}
						size={size}
						className="group-data-disabled:opacity-50"
					/>
				</AriaRadio>
			))}
		</AriaRadioGroup>
	);
}
