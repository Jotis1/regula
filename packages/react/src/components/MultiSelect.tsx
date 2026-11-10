"use client";

import { type ReactNode, useId, useState } from "react";
import {
	Button as AriaButton,
	Input as AriaInput,
	Autocomplete,
	Dialog,
	DialogTrigger,
	ListBox,
	ListBoxItem,
	Popover,
	SearchField,
	Text,
	useFilter,
} from "react-aria-components";
import { choiceBox } from "../internal/choice.js";
import { cx } from "../internal/cx.js";
import {
	controlClasses,
	type FieldProps,
	FieldShell,
	type FieldSize,
	nativeClasses,
} from "../internal/field.js";
import { defaultStrings } from "../internal/strings.js";
import { useControllable } from "../internal/use-controllable.js";
import { Button } from "./Button.js";
import { Icon } from "./Icon.js";
import { Tag } from "./Tag.js";

export type MultiSelectOption = string | { value: string; label: string; supporting?: ReactNode };
interface Option {
	value: string;
	label: string;
	supporting?: ReactNode;
}

export interface MultiSelectProps extends FieldProps {
	options: MultiSelectOption[];
	value?: string[];
	defaultValue?: string[];
	onChange?: (values: string[]) => void;
	/** Lo que dice el campo sin nada elegido. */
	placeholder?: string;
	/**
	 * `summary` (por defecto): el campo resume lo elegido. `tags`: cada elegida es una etiqueta dentro del campo, que
	 * crece en alto si no caben en una línea (así se pinta `Select type="tags"`). Las etiquetas no llevan X: se quitan
	 * desmarcando la opción en la lista.
	 * @default "summary"
	 */
	display?: "summary" | "tags";
	/** Resumen de lo elegido. Por defecto, "1 elegido" o "n elegidos". */
	summary?: (selected: Option[]) => ReactNode;
	/** Apoyo tras el resumen, en `text-tertiary` (p. ej. "16 usuarios"). */
	summarySupporting?: (selected: Option[]) => ReactNode;
	/**
	 * Alto del campo: `sm` 36 · `md` 40 · `lg` 44.
	 * @default "md"
	 */
	size?: FieldSize;
	disabled?: boolean;
	/** Nombre del campo al enviar el formulario: los valores van separados por comas. */
	name?: string;
	/** Abierto de inicio, en línea y sin tomar el foco: para vistas previas. */
	defaultOpen?: boolean;
	/** Textos: buscador, sin resultados, borrar búsqueda y los dos botones del pie. */
	searchLabel?: string;
	emptyTitle?: string;
	emptyDescription?: string;
	clearSearchLabel?: string;
	resetLabel?: string;
	selectAllLabel?: string;
	id?: string;
	className?: string;
}

const PANEL =
	"flex max-h-[408px] min-w-60 flex-col overflow-hidden rounded-lg bg-primary font-body shadow-[var(--shadow-lg),inset_0_0_0_1px_var(--border-secondary_alt)] outline-none";

// El buscador no tiene descripción ni error. Sin un valor propio, en el HTML de servidor React Aria apuntaría
// aria-describedby a los suyos, que no existen; vacío, no apunta a nada.
const NO_DESCRIPTION = "";

const toOption = (o: MultiSelectOption): Option => (typeof o === "string" ? { value: o, label: o } : o);

/** Selector de varias opciones con buscador y casillas; el campo resume lo elegido. */
export function MultiSelect({
	label,
	required,
	hint,
	error,
	options,
	value,
	defaultValue = [],
	onChange,
	placeholder,
	display = "summary",
	summary = (selected) => defaultStrings.selectedCount(selected.length),
	summarySupporting,
	size = "md",
	disabled,
	name,
	defaultOpen = false,
	searchLabel = defaultStrings.search,
	emptyTitle = defaultStrings.noResults,
	emptyDescription = defaultStrings.tryAnother,
	clearSearchLabel = defaultStrings.clearSearch,
	resetLabel = defaultStrings.reset,
	selectAllLabel = defaultStrings.selectAll,
	id: givenId,
	className,
}: MultiSelectProps) {
	const autoId = useId();
	const id = givenId ?? autoId;
	const [selected, setSelected] = useControllable(value, defaultValue, onChange);
	const [search, setSearch] = useState("");
	const [open, setOpen] = useState(defaultOpen);
	// Abierto por el usuario: popover con el foco dentro. Abierto de inicio: en línea, sin tomar el foco.
	const [byUser, setByUser] = useState(false);
	const { contains } = useFilter({ sensitivity: "base" });
	const all = options.map(toOption);
	const chosen = all.filter((o) => selected.includes(o.value));
	const message = typeof error === "string" && error ? error : hint;
	const listLabel = typeof label === "string" ? label : searchLabel;

	const panel = (
		<>
			<Autocomplete filter={contains} inputValue={search} onInputChange={setSearch}>
				<SearchField
					aria-label={searchLabel}
					autoFocus={byUser}
					// El buscador se quedaría Escape para vaciarse: aquí siempre cierra la lista, sin tocar la selección.
					onKeyDown={(e) => {
						if (e.key === "Escape") {
							setOpen(false);
							setByUser(false);
						}
					}}
					className="flex items-center gap-2 px-3.5 py-2.5 text-fg-quaternary shadow-[inset_0_-1px_0_var(--border-secondary)]"
				>
					<Icon name="search-lg" size={20} />
					<AriaInput
						placeholder={searchLabel}
						aria-describedby={NO_DESCRIPTION}
						className={cx(nativeClasses(size), "[&::-webkit-search-cancel-button]:hidden")}
					/>
				</SearchField>
				<ListBox
					aria-label={listLabel}
					selectionMode="multiple"
					// Por defecto, Escape vaciaría la selección: aquí solo cierra la lista.
					escapeKeyBehavior="none"
					selectedKeys={new Set(selected)}
					onSelectionChange={(keys) =>
						setSelected(
							keys === "all"
								? all.map((o) => o.value)
								: all.map((o) => o.value).filter((v) => keys.has(v)),
						)
					}
					renderEmptyState={() => (
						<div className="flex flex-col items-center gap-1 px-4 py-6 text-center">
							<p className="m-0 text-sm font-semibold text-primary">{emptyTitle}</p>
							<p className="m-0 text-sm text-tertiary">{emptyDescription}</p>
							<span className="mt-3">
								<Button hierarchy="secondary" size="sm" onClick={() => setSearch("")}>
									{clearSearchLabel}
								</Button>
							</span>
						</div>
					)}
					className="min-h-0 flex-1 overflow-y-auto py-1 outline-none"
				>
					{all.map((o) => (
						<ListBoxItem
							key={o.value}
							id={o.value}
							textValue={o.label}
							className="group mx-1.5 my-px flex cursor-pointer items-center gap-2 rounded-md p-2 outline-none data-focused:bg-primary_hover data-hovered:bg-primary_hover"
						>
							<span
								aria-hidden="true"
								className={cx(
									choiceBox("sm", false),
									"mt-0 group-data-selected:bg-brand-solid group-data-selected:shadow-none",
								)}
							>
								<span className="hidden group-data-selected:inline-flex">
									<Icon name="check" size={12} strokeWidth={1.67} />
								</span>
							</span>
							<span
								className={cx("flex min-w-0 gap-1.5", size === "sm" ? "text-sm" : "text-md")}
							>
								{/* Etiqueta y descripción con sus huecos de React Aria: así aria-labelledby y aria-describedby de la
								    opción apuntan a algo también en el HTML de servidor. El apoyo va dentro de la etiqueta para que el
								    nombre accesible sea todo lo que se ve; la descripción queda vacía. */}
								<Text slot="label" className="flex min-w-0 gap-1.5">
									<span className="truncate font-medium text-primary">{o.label}</span>
									{o.supporting != null ? (
										<span className="truncate font-normal text-tertiary">
											{o.supporting}
										</span>
									) : null}
								</Text>
								<Text slot="description" className="hidden" />
							</span>
						</ListBoxItem>
					))}
				</ListBox>
			</Autocomplete>
			<div className="flex gap-3 p-3 shadow-[inset_0_1px_0_var(--border-secondary_alt)]">
				<Button hierarchy="secondary" size="sm" onClick={() => setSelected([])}>
					{resetLabel}
				</Button>
				<Button hierarchy="secondary" size="sm" onClick={() => setSelected(all.map((o) => o.value))}>
					{selectAllLabel}
				</Button>
			</div>
		</>
	);

	return (
		<FieldShell
			id={id}
			label={label}
			required={required}
			hint={hint}
			error={error}
			size={size}
			className={className}
		>
			<div className="relative">
				<DialogTrigger
					// Abierta de inicio, la lista va en línea: para React Aria está cerrada (si no, el campo apuntaría con
					// aria-controls a un popover que no existe). Al pulsar el campo se abre el popover de verdad.
					isOpen={open && byUser}
					onOpenChange={(next) => {
						setByUser(next);
						setOpen(next);
					}}
				>
					<AriaButton
						id={id}
						isDisabled={disabled}
						aria-describedby={message ? `${id}-hint` : undefined}
						className={cx(
							controlClasses(size, error, disabled),
							"w-full cursor-pointer text-left data-disabled:cursor-not-allowed",
							open && "shadow-[var(--shadow-xs),inset_0_0_0_2px_var(--border-brand)]",
						)}
					>
						<span
							className={cx(
								"flex min-w-0 flex-1 gap-1.5",
								size === "sm" ? "text-sm" : "text-md",
								display === "tags" && "flex-wrap",
							)}
						>
							{chosen.length && display === "tags" ? (
								chosen.map((o) => (
									<Tag key={o.value} size="md">
										{o.label}
									</Tag>
								))
							) : chosen.length ? (
								<>
									<span className="truncate font-medium text-primary">
										{summary(chosen)}
									</span>
									{summarySupporting ? (
										<span className="truncate text-tertiary">
											{summarySupporting(chosen)}
										</span>
									) : null}
								</>
							) : (
								<span className="truncate text-placeholder">{placeholder}</span>
							)}
						</span>
						<Icon name="chevron-down" size={16} />
					</AriaButton>
					{open && !byUser ? null : (
						<Popover
							placement="bottom start"
							offset={4}
							className={cx("z-30 w-[var(--trigger-width)]", PANEL)}
						>
							<Dialog aria-label={listLabel} className="flex min-h-0 flex-col outline-none">
								{panel}
							</Dialog>
						</Popover>
					)}
				</DialogTrigger>
				{open && !byUser ? (
					// Vista previa abierta: el panel va en línea bajo el campo, sin capa modal ni foco.
					<div className={cx("absolute top-[calc(100%+4px)] right-0 left-0 z-30", PANEL)}>
						{panel}
					</div>
				) : null}
			</div>
			{name ? <input type="hidden" name={name} value={selected.join(",")} /> : null}
		</FieldShell>
	);
}
