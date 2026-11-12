"use client";

import { type ReactNode, useContext } from "react";
import {
	Button as AriaButton,
	ComboBox,
	ComboBoxStateContext,
	Input,
	ListBox,
	ListBoxItem,
	Popover,
	Text,
	useFilter,
} from "react-aria-components";
import { Icon, type IconName, iconSlot } from "../components/Icon.js";
import { cx } from "./cx.js";
import { controlClasses, type FieldSize, nativeClasses } from "./field.js";
import { type Option, OptionBody, type SelectOption, toOption } from "./option-select.js";
import { defaultStrings } from "./strings.js";

export interface OptionComboboxProps {
	options: SelectOption[];
	value?: string;
	defaultValue?: string;
	onChange?: (value: string) => void;
	name?: string;
	form?: string;
	disabled?: boolean;
	required?: boolean;
	invalid?: boolean;
	/** Lo que dice el campo mientras no hay nada escrito ni elegido. Por defecto, «Buscar». */
	placeholder?: string;
	/** Texto de la lista cuando la búsqueda no encuentra nada. Por defecto, «Sin resultados». */
	emptyLabel?: string;
	id?: string;
	"aria-label"?: string;
	"aria-labelledby"?: string;
	"aria-describedby"?: string;
	size: FieldSize;
	/** Icono inicial. Por defecto, la lupa. */
	icon?: IconName | React.ReactNode;
}

/**
 * El marco del campo. Con la lista abierta y algo escrito, Enter elige la primera opción que queda si ninguna está
 * marcada con las flechas: sin esto, React Aria lo trataría como texto libre y volvería al valor anterior.
 */
function Frame({ className, children }: { className: string; children: ReactNode }) {
	const state = useContext(ComboBoxStateContext);
	return (
		<div
			className={className}
			onKeyDownCapture={(e) => {
				if (e.key !== "Enter" || !state?.isOpen || !state.inputValue) return;
				if (state.selectionManager.focusedKey != null) return;
				const first = state.collection.getFirstKey();
				if (first == null) return;
				e.preventDefault();
				e.stopPropagation();
				state.setSelectedKey(first);
				state.close();
			}}
		>
			{children}
		</div>
	);
}

/**
 * `Select` con búsqueda: el campo es el cuadro de texto de un combobox de React Aria. Al escribir, la lista solo
 * enseña las opciones cuyo texto contiene lo escrito, y la primera queda marcada: Enter la elige. Escape cierra la lista
 * y, al salir del campo, vuelve el texto de la opción elegida.
 */
export function OptionCombobox({
	options,
	value,
	defaultValue,
	onChange,
	name,
	form,
	disabled,
	required,
	invalid,
	placeholder = defaultStrings.search,
	emptyLabel = defaultStrings.noResults,
	id,
	"aria-label": ariaLabel,
	"aria-labelledby": labelledBy,
	"aria-describedby": describedBy,
	size,
	icon,
}: OptionComboboxProps) {
	const items = options.map(toOption);
	const { contains } = useFilter({ sensitivity: "base" });
	const text = size === "sm" ? "text-sm" : "text-md";

	return (
		<ComboBox
			{...(value !== undefined ? { selectedKey: value } : { defaultSelectedKey: defaultValue })}
			onSelectionChange={(key) => {
				if (key != null) onChange?.(String(key));
			}}
			defaultItems={items}
			defaultFilter={contains}
			menuTrigger="focus"
			allowsEmptyCollection
			name={name}
			form={form}
			isDisabled={disabled}
			isRequired={required}
			isInvalid={invalid}
			aria-label={ariaLabel}
			aria-labelledby={labelledBy}
			aria-describedby={describedBy}
			className="group relative flex w-full min-w-0"
		>
			<Frame
				className={cx(
					controlClasses(size, invalid, disabled),
					"w-full",
					// Con la lista abierta el foco está en ella: el campo conserva el borde de 2px.
					invalid
						? "group-data-open:shadow-[var(--shadow-xs),inset_0_0_0_2px_var(--border-error)]"
						: "group-data-open:shadow-[var(--shadow-xs),inset_0_0_0_2px_var(--border-brand)]",
				)}
			>
				<span className="inline-flex flex-none text-fg-quaternary">
					{iconSlot(icon ?? "search-lg", 20)}
				</span>
				<Input id={id} placeholder={placeholder} className={nativeClasses(size)} />
				<AriaButton
					// El chevron abre y cierra la lista con el ratón; el teclado ya la maneja el campo
					excludeFromTabOrder
					className="inline-flex flex-none cursor-pointer rounded-sm border-0 bg-transparent p-0 text-fg-quaternary outline-none data-disabled:cursor-not-allowed"
				>
					<Icon name="chevron-down" size={20} />
				</AriaButton>
			</Frame>
			<Popover
				placement="bottom start"
				offset={4}
				className="z-30 flex max-h-72 w-[var(--trigger-width)] flex-col overflow-hidden rounded-lg bg-primary font-body shadow-[var(--shadow-lg),inset_0_0_0_1px_var(--border-secondary_alt)] outline-none"
			>
				<ListBox<Option>
					renderEmptyState={() => (
						<div className={cx("px-3.5 py-3 text-tertiary", text)}>{emptyLabel}</div>
					)}
					className="min-h-0 flex-1 overflow-y-auto py-1 outline-none"
				>
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
			<Text slot="description" className="hidden" />
			<Text slot="errorMessage" className="hidden" />
		</ComboBox>
	);
}
