"use client";

import type { ReactNode } from "react";
import {
	Button as AriaButton,
	Select as AriaSelect,
	ListBox,
	ListBoxItem,
	Popover,
	SelectValue,
	Text,
} from "react-aria-components";
import { Avatar, type AvatarProps } from "../components/Avatar.js";
import { COLOR, type StatusColor } from "../components/Badge.js";
import { Icon, type IconName, iconSlot } from "../components/Icon.js";
import { cx } from "./cx.js";
import { addonClasses, controlClasses, type FieldSize } from "./field.js";

/** Opción de una lista corta: texto, o con apoyo y un icono, avatar o punto delante. */
export type SelectOption =
	| string
	| {
			value: string;
			label: ReactNode;
			/** Texto de apoyo tras la etiqueta, en `text-tertiary` (p. ej. "@olivia"). */
			supporting?: ReactNode;
			/** Icono delante, 20px en `fg-quaternary`. */
			icon?: IconName | ReactNode;
			/** Avatar delante (`xs`, 24px). */
			avatar?: Pick<AvatarProps, "src" | "alt" | "initials">;
			/** Punto de estado delante, del color indicado. */
			dot?: StatusColor;
			disabled?: boolean;
			/** Texto para buscar por letra y para lectores si `label` no es texto. */
			textValue?: string;
	  };

export interface Option {
	value: string;
	label: ReactNode;
	supporting?: ReactNode;
	icon?: IconName | ReactNode;
	avatar?: Pick<AvatarProps, "src" | "alt" | "initials">;
	dot?: StatusColor;
	disabled?: boolean;
	textValue: string;
}

export const toOption = (o: SelectOption): Option => {
	const full = typeof o === "string" ? { value: o, label: o } : o;
	return {
		...full,
		textValue: full.textValue ?? (typeof full.label === "string" ? full.label : full.value),
	};
};

/** Lo que va en una opción y en el campo: lo de delante, la etiqueta y el apoyo. */
export function OptionBody({ option }: { option: Option }) {
	return (
		<>
			{option.icon ? (
				<span className="inline-flex flex-none text-fg-quaternary">{iconSlot(option.icon, 20)}</span>
			) : null}
			{option.avatar ? (
				<span aria-hidden="true" className="inline-flex flex-none">
					<Avatar size="xs" {...option.avatar} />
				</span>
			) : null}
			{option.dot ? (
				<span
					aria-hidden="true"
					className={cx("size-2 flex-none rounded-full", COLOR[option.dot].dot)}
				/>
			) : null}
			<span className={cx("truncate font-medium text-primary")}>{option.label}</span>
			{option.supporting != null ? (
				<span className="truncate font-normal text-tertiary">{option.supporting}</span>
			) : null}
		</>
	);
}

export interface OptionSelectProps {
	options: SelectOption[];
	value?: string;
	defaultValue?: string;
	onChange?: (value: string) => void;
	name?: string;
	form?: string;
	autoComplete?: string;
	disabled?: boolean;
	required?: boolean;
	invalid?: boolean;
	/** Lo que dice el campo sin nada elegido. Sin él, parte con la primera opción elegida. */
	placeholder?: string;
	id?: string;
	"aria-label"?: string;
	"aria-labelledby"?: string;
	"aria-describedby"?: string;
	/** Abierto de inicio: para vistas previas. */
	defaultOpen?: boolean;
	size: FieldSize;
	/** `field`: el campo entero (marco, icono y chevron de 20px). `addon`: tramo dentro de otro campo, sin marco. */
	variant: "field" | "addon";
	/** Con `addon`, a qué lado del valor va. */
	position?: "leading" | "trailing";
	/** Icono inicial del campo, 20px en `fg-quaternary`. */
	icon?: IconName | ReactNode;
	className?: string;
}

/**
 * La lista desplegable de `Select` y de los desplegables de `Input`: el `Select` de React Aria con el menú del Figma
 * (opciones con apoyo, icono, avatar o punto, y un check de marca en la elegida). Va en un `<select>` oculto con `name`,
 * así que el formulario envía el valor.
 */
export function OptionSelect({
	options,
	value,
	defaultValue,
	onChange,
	name,
	form,
	autoComplete,
	disabled,
	required,
	invalid,
	placeholder,
	id,
	"aria-label": ariaLabel,
	"aria-labelledby": labelledBy,
	"aria-describedby": describedBy,
	defaultOpen,
	size,
	variant,
	position = "trailing",
	icon,
	className,
}: OptionSelectProps) {
	const items = options.map(toOption);
	const field = variant === "field";
	const text = size === "sm" ? "text-sm" : "text-md";
	// Sin marcador, un <select> nativo parte con la primera opción; aquí se conserva.
	const initial = defaultValue ?? (value === undefined && !placeholder ? items[0]?.value : undefined);

	return (
		<AriaSelect
			{...(value !== undefined ? { selectedKey: value } : { defaultSelectedKey: initial })}
			onSelectionChange={(key) => {
				if (key != null) onChange?.(String(key));
			}}
			name={name}
			form={form}
			autoComplete={autoComplete}
			isDisabled={disabled}
			isRequired={required}
			isInvalid={invalid}
			defaultOpen={defaultOpen}
			aria-label={ariaLabel}
			aria-labelledby={labelledBy}
			aria-describedby={describedBy}
			className={cx("group relative flex min-w-0", field ? "w-full" : "flex-none self-stretch")}
		>
			<AriaButton
				id={id}
				className={
					field
						? cx(
								controlClasses(size, invalid, disabled),
								"w-full cursor-pointer text-left outline-none data-disabled:cursor-not-allowed",
								// Con la lista abierta el foco está en ella: el campo conserva el borde de 2px.
								invalid
									? "group-data-open:shadow-[var(--shadow-xs),inset_0_0_0_2px_var(--border-error)]"
									: "group-data-open:shadow-[var(--shadow-xs),inset_0_0_0_2px_var(--border-brand)]",
							)
						: cx(
								addonClasses(size),
								// Sin hueco de 8px: el chevron va a 2px del texto, como en el Figma.
								"cursor-pointer gap-0.5 border-0 bg-transparent outline-none data-disabled:cursor-not-allowed",
								position === "leading" ? "pr-0" : size === "lg" ? "pr-3.5" : "pr-3",
								className,
							)
				}
			>
				{field && icon ? (
					<span className="inline-flex flex-none text-fg-quaternary">{iconSlot(icon, 20)}</span>
				) : null}
				<SelectValue
					className={cx(
						"flex min-w-0 items-center gap-2 text-left data-placeholder:text-placeholder",
						field ? ["flex-1 font-body text-primary", text] : "text-tertiary",
					)}
				>
					{({ selectedItem, isPlaceholder }) =>
						isPlaceholder || !selectedItem ? (
							<span className="truncate text-placeholder">{placeholder ?? " "}</span>
						) : field ? (
							<OptionBody option={selectedItem as Option} />
						) : (
							<span className="truncate">{(selectedItem as Option).label}</span>
						)
					}
				</SelectValue>
				<span className="inline-flex flex-none text-fg-quaternary">
					<Icon name="chevron-down" size={field ? 20 : 16} />
				</span>
			</AriaButton>
			<Popover
				placement="bottom start"
				offset={4}
				className={cx(
					"z-30 flex max-h-72 flex-col overflow-hidden rounded-lg bg-primary font-body shadow-[var(--shadow-lg),inset_0_0_0_1px_var(--border-secondary_alt)] outline-none",
					field ? "w-[var(--trigger-width)]" : "min-w-[max(var(--trigger-width),10rem)]",
				)}
			>
				<ListBox items={items} className="min-h-0 flex-1 overflow-y-auto py-1 outline-none">
					{(o) => (
						<ListBoxItem
							id={o.value}
							value={o}
							textValue={o.textValue}
							isDisabled={o.disabled}
							className={cx(
								"group mx-1.5 my-px flex cursor-pointer items-center gap-2 rounded-md px-2 py-2.5 outline-none data-disabled:cursor-not-allowed data-disabled:opacity-50 data-focused:bg-primary_hover data-hovered:bg-primary_hover",
								text,
							)}
						>
							{({ isSelected }) => (
								<>
									{/* Etiqueta y descripción en sus huecos de React Aria: así aria-labelledby y aria-describedby de la
									    opción apuntan a algo también en el HTML de servidor. El apoyo va dentro de la etiqueta, para que
									    el nombre accesible sea todo lo que se ve; la descripción queda vacía. */}
									<Text slot="label" className="flex min-w-0 flex-1 items-center gap-2">
										<OptionBody option={o} />
									</Text>
									<Text slot="description" className="hidden" />
									{isSelected ? (
										<span className="inline-flex flex-none text-fg-brand-primary">
											<Icon name="check" size={20} />
										</span>
									) : null}
								</>
							)}
						</ListBoxItem>
					)}
				</ListBox>
			</Popover>
			{/* Los huecos de descripción y de error de React Aria, vacíos: en el HTML de servidor el botón apuntaría con
			    aria-describedby a ids que no existirían. La pista y el error los pinta el marco del campo. */}
			<Text slot="description" className="hidden" />
			<Text slot="errorMessage" className="hidden" />
		</AriaSelect>
	);
}
