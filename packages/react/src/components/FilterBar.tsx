import { ChevronDown, FilterLines, SearchLg, XClose } from "@untitledui/icons";
import type { ReactNode } from "react";
import { cx } from "../internal/cx.js";
import { defaultStrings } from "../internal/strings.js";
import { Button } from "./Button.js";
import { ButtonGroup, type ButtonGroupItem } from "./ButtonGroup.js";
import { Input } from "./Input.js";
import { Tag } from "./Tag.js";

export interface FilterBarLabels {
	/** Nombre del grupo de vistas rápidas. @default "Vista" */
	segments: string;
	/** Nombre del buscador (el placeholder es `searchPlaceholder`). @default "Buscar" */
	search: string;
	/** @default "Filtros" */
	filters: string;
	/** @default "Limpiar todo" */
	clear: string;
}

export interface FilterBarProps {
	/** Vistas rápidas, en un `ButtonGroup`. */
	segments?: ButtonGroupItem[];
	/** Vista elegida (controlado). */
	segmentValue?: string;
	/** Vista elegida al principio (no controlado). */
	defaultSegment?: string;
	onSegment?: (value: string) => void;
	/** Muestra el buscador (también aparece si pasas `onSearch`). */
	search?: boolean;
	/** Recibe el texto del buscador en cada cambio. */
	onSearch?: (query: string) => void;
	/**
	 * Placeholder del buscador.
	 * @default "Buscar"
	 */
	searchPlaceholder?: string;
	/** Abre los filtros avanzados, en un `Slideout` (no en un modal). */
	onOpenFilters?: () => void;
	/** Filtros aplicados: se ven siempre, como `Tag` con su X. El botón Filtros muestra cuántos hay. */
	activeFilters?: ({ label: string } | string)[];
	onRemoveFilter?: (index: number) => void;
	/** "Limpiar todo", junto a los filtros aplicados. */
	onClear?: () => void;
	/** Controles extra antes del botón Filtros, como un `DatePicker`. */
	extra?: ReactNode;
	/** Textos que trae el componente, para sustituirlos. */
	labels?: Partial<FilterBarLabels>;
	/**
	 * Los ocho del Figma (`Filters bar`, `12232:376165`), como plantillas sobre estas props. Sin él, la barra de
	 * siempre. `simple`: búsqueda a la izquierda, `dates` y Filtros a la derecha. `tabs-search`: vistas, búsqueda y
	 * Filtros. `tabs-date`: vistas, `dates` y Filtros. `date`: `extra` (atajos de fecha) y `dates` a la izquierda,
	 * búsqueda y Filtros a la derecha. `dropdowns`: `fields` con su etiqueta y «Limpiar todo». `dropdowns-date`: además
	 * `dates`, «Más filtros» y la lupa. `advanced`: el constructor de `conditions` (inactivo sin condiciones, activo
	 * con ellas). En estrecho, Filtros queda en icono y la búsqueda ocupa el ancho.
	 */
	type?: FilterBarType;
	/** Selector de fechas, como un `DatePicker` de rango. */
	dates?: ReactNode;
	/** Campos con etiqueta de `dropdowns` y `dropdowns-date` (un `Select`, un `Input`…). */
	fields?: { label: string; control: ReactNode }[];
	/** Condiciones de `advanced`: campo, operador y valor. */
	conditions?: FilterCondition[];
	/** Campos que ofrecen las condiciones. */
	conditionFields?: { value: string; label: string }[];
	/** Operadores que ofrecen las condiciones. */
	conditionOperators?: { value: string; label: string }[];
	onConditionsChange?: (conditions: FilterCondition[]) => void;
	/** En `dropdowns-date`, la lupa que abre la búsqueda. */
	onOpenSearch?: () => void;
	className?: string;
}

export type FilterBarType =
	| "simple"
	| "tabs-search"
	| "tabs-date"
	| "date"
	| "dropdowns"
	| "dropdowns-date"
	| "advanced";

export interface FilterCondition {
	field: string;
	operator: string;
	value: string;
}

/** Barra encima de una tabla o lista: vista rápida, búsqueda, botón de filtros y filtros activos. */
export function FilterBar(props: FilterBarProps) {
	return props.type === undefined ? <ClassicFilterBar {...props} /> : <TypedFilterBar {...props} />;
}

/** La de siempre: su HTML no cambia. */
function ClassicFilterBar({
	segments,
	segmentValue,
	defaultSegment,
	onSegment,
	search,
	onSearch,
	searchPlaceholder,
	onOpenFilters,
	activeFilters = [],
	onRemoveFilter,
	onClear,
	extra,
	labels,
	className,
}: FilterBarProps) {
	const t = {
		segments: defaultStrings.view,
		search: defaultStrings.search,
		filters: defaultStrings.filters,
		clear: defaultStrings.clearAll,
		...labels,
	};
	const count = activeFilters.length;
	return (
		<div className={cx("flex flex-col gap-3 font-body", className)}>
			<div className="flex flex-wrap items-center justify-between gap-3">
				{segments ? (
					<ButtonGroup
						items={segments}
						value={segmentValue}
						defaultValue={defaultSegment}
						onChange={onSegment}
						aria-label={t.segments}
					/>
				) : null}
				<div className="ml-auto flex flex-wrap items-center gap-3">
					{search || onSearch ? (
						<div className="w-[296px] max-w-full">
							<Input
								size="sm"
								icon={SearchLg}
								placeholder={searchPlaceholder ?? t.search}
								aria-label={t.search}
								onChange={onSearch ? (e) => onSearch(e.target.value) : undefined}
							/>
						</div>
					) : null}
					{extra}
					<Button hierarchy="secondary" size="sm" iconLeading={FilterLines} onClick={onOpenFilters}>
						{t.filters}
						{count ? " " : null}
						{count ? (
							<span className="inline-flex min-w-5 justify-center rounded-full bg-utility-brand-50 px-1.5 text-xs font-medium text-utility-brand-700 inset-ring inset-ring-utility-brand-200">
								{count}
							</span>
						) : null}
					</Button>
				</div>
			</div>
			{count ? (
				<div className="flex flex-wrap items-center gap-2">
					{activeFilters.map((f, i) => {
						const text = typeof f === "string" ? f : f.label;
						return (
							<Tag
								// biome-ignore lint/suspicious/noArrayIndexKey: el índice es lo que recibe onRemoveFilter
								key={i}
								size="md"
								onRemove={onRemoveFilter ? () => onRemoveFilter(i) : undefined}
							>
								{text}
							</Tag>
						);
					})}
					<Button hierarchy="link-gray" size="sm" onClick={onClear}>
						{t.clear}
					</Button>
				</div>
			) : null}
		</div>
	);
}

const NATIVE_SELECT =
	"h-9 w-full cursor-pointer appearance-none rounded-lg border-0 bg-primary pr-8 pl-3 font-body text-sm font-medium text-primary shadow-[var(--shadow-xs),inset_0_0_0_1px_var(--border-primary)] focus-visible:shadow-[var(--shadow-xs),inset_0_0_0_2px_var(--border-brand)] focus-visible:outline-none";
const NATIVE_INPUT =
	"h-9 w-full rounded-lg border-0 bg-primary px-3 font-body text-sm text-primary shadow-[var(--shadow-xs),inset_0_0_0_1px_var(--border-primary)] placeholder:text-placeholder focus-visible:shadow-[var(--shadow-xs),inset_0_0_0_2px_var(--border-brand)] focus-visible:outline-none";

function NativeSelect({
	label,
	value,
	options,
	onChange,
}: {
	label: string;
	value: string;
	options: { value: string; label: string }[];
	onChange: (v: string) => void;
}) {
	return (
		<span className="relative inline-flex min-w-28 items-center">
			<select
				aria-label={label}
				value={value}
				onChange={(e) => onChange(e.target.value)}
				className={NATIVE_SELECT}
			>
				{options.map((o) => (
					<option key={o.value} value={o.value}>
						{o.label}
					</option>
				))}
			</select>
			<span className="pointer-events-none absolute right-2.5 flex text-fg-quaternary">
				<ChevronDown size={16} />
			</span>
		</span>
	);
}

function TypedFilterBar({
	type,
	segments,
	segmentValue,
	defaultSegment,
	onSegment,
	onSearch,
	searchPlaceholder,
	onOpenFilters,
	activeFilters = [],
	onRemoveFilter,
	onClear,
	extra,
	labels,
	dates,
	fields = [],
	conditions = [],
	conditionFields = [],
	conditionOperators = [],
	onConditionsChange,
	onOpenSearch,
	className,
}: FilterBarProps) {
	const t = {
		segments: defaultStrings.view,
		search: defaultStrings.search,
		filters: defaultStrings.filters,
		clear: defaultStrings.clearAll,
		...labels,
	};
	const moreFilters = "Más filtros";
	const count = activeFilters.length;
	const segmentsNode = segments ? (
		<ButtonGroup
			items={segments}
			value={segmentValue}
			defaultValue={defaultSegment}
			onChange={onSegment}
			aria-label={t.segments}
		/>
	) : null;
	const search = (
		<div className="w-[296px] max-w-full @max-md:w-auto @max-md:flex-1">
			<Input
				size="sm"
				icon={SearchLg}
				placeholder={searchPlaceholder ?? t.search}
				aria-label={t.search}
				onChange={onSearch ? (e) => onSearch(e.target.value) : undefined}
			/>
		</div>
	);
	const filtersButton = (label: string) => (
		<Button
			hierarchy="secondary"
			size="sm"
			iconLeading={FilterLines}
			onClick={onOpenFilters}
			className="@max-md:px-2!"
		>
			<span className="@max-md:sr-only">{label}</span>
			{count ? " " : null}
			{count ? (
				<span className="inline-flex min-w-5 justify-center rounded-full bg-utility-brand-50 px-1.5 text-xs font-medium text-utility-brand-700 inset-ring inset-ring-utility-brand-200">
					{count}
				</span>
			) : null}
		</Button>
	);
	const clearButton = onClear ? (
		<Button hierarchy="secondary" size="sm" onClick={onClear}>
			{t.clear}
		</Button>
	) : null;
	const fieldsNode = fields.length
		? fields.map((f) => (
				<div key={f.label} className="flex min-w-36 flex-col gap-1.5 @max-md:flex-1">
					<span className="text-sm font-medium text-secondary @max-md:sr-only">{f.label}</span>
					{f.control}
				</div>
			))
		: null;
	const set = (i: number, patch: Partial<FilterCondition>) =>
		onConditionsChange?.(conditions.map((c, k) => (k === i ? { ...c, ...patch } : c)));

	let left: ReactNode = null;
	let right: ReactNode = null;
	if (type === "simple") {
		left = search;
		right = (
			<>
				{dates}
				{filtersButton(t.filters)}
			</>
		);
	} else if (type === "tabs-search") {
		left = segmentsNode;
		right = (
			<>
				{search}
				{filtersButton(t.filters)}
			</>
		);
	} else if (type === "tabs-date") {
		left = segmentsNode;
		right = (
			<>
				{dates}
				{filtersButton(t.filters)}
			</>
		);
	} else if (type === "date") {
		left = (
			<>
				{extra}
				{dates}
			</>
		);
		right = (
			<>
				{search}
				{filtersButton(t.filters)}
			</>
		);
	} else if (type === "dropdowns") {
		left = fieldsNode;
		right = clearButton;
	} else if (type === "dropdowns-date") {
		left = (
			<>
				{fieldsNode}
				{clearButton}
			</>
		);
		right = (
			<>
				{dates}
				{filtersButton(moreFilters)}
				<Button
					hierarchy="secondary"
					size="sm"
					iconOnly={<SearchLg size={20} />}
					label={t.search}
					onClick={onOpenSearch}
				/>
			</>
		);
	} else {
		// advanced: una fila por condición; sin condiciones, solo el botón de añadir
		const add = () =>
			onConditionsChange?.([
				...conditions,
				{
					field: conditionFields[0]?.value ?? "",
					operator: conditionOperators[0]?.value ?? "",
					value: "",
				},
			]);
		left = (
			<div className="flex flex-col gap-3">
				<div className="flex flex-col gap-3 @max-md:hidden">
					{(conditions.length ? conditions : [null]).map((c, i) => (
						<div
							// biome-ignore lint/suspicious/noArrayIndexKey: las condiciones se editan por posición
							key={i}
							className="flex flex-wrap items-center gap-2"
						>
							{i === 0 ? (
								<Button
									hierarchy="secondary"
									size="sm"
									iconOnly={FilterLines}
									label="Añadir un filtro"
									onClick={add}
								/>
							) : (
								<span className="w-9" />
							)}
							{c ? (
								<>
									<NativeSelect
										label={`Campo del filtro ${i + 1}`}
										value={c.field}
										options={conditionFields}
										onChange={(v) => set(i, { field: v })}
									/>
									<NativeSelect
										label={`Operador del filtro ${i + 1}`}
										value={c.operator}
										options={conditionOperators}
										onChange={(v) => set(i, { operator: v })}
									/>
									<input
										aria-label={`Valor del filtro ${i + 1}`}
										value={c.value}
										placeholder="Escribe un valor"
										onChange={(e) => set(i, { value: e.target.value })}
										className={cx(NATIVE_INPUT, "w-44")}
									/>
									<Button
										hierarchy="tertiary"
										size="sm"
										iconOnly={<XClose size={20} />}
										label={`Quitar el filtro ${i + 1}`}
										onClick={() =>
											onConditionsChange?.(conditions.filter((_, k) => k !== i))
										}
									/>
								</>
							) : null}
						</div>
					))}
				</div>
				<div className="hidden @max-md:flex">
					<Button
						hierarchy="secondary"
						size="sm"
						iconLeading={FilterLines}
						onClick={onOpenFilters}
						className="w-full"
					>
						{conditions.length ? `${t.filters} (${conditions.length})` : t.filters}
					</Button>
				</div>
			</div>
		);
		right = conditions.length ? <div className="@max-md:hidden">{clearButton}</div> : null;
	}

	return (
		<div className={cx("@container flex flex-col gap-3 font-body", className)}>
			<div className="flex flex-wrap items-start justify-between gap-3">
				{left ? (
					<div className="flex min-w-0 flex-wrap items-end gap-3 @max-md:w-full">{left}</div>
				) : null}
				{right ? (
					<div className="ml-auto flex flex-wrap items-center gap-3 self-end @max-md:ml-0 @max-md:w-full">
						{right}
					</div>
				) : null}
			</div>
			{count && type !== "advanced" ? (
				<div className="flex flex-wrap items-center gap-2">
					{activeFilters.map((f, i) => {
						const text = typeof f === "string" ? f : f.label;
						return (
							<Tag
								// biome-ignore lint/suspicious/noArrayIndexKey: el índice es lo que recibe onRemoveFilter
								key={i}
								size="md"
								onRemove={onRemoveFilter ? () => onRemoveFilter(i) : undefined}
							>
								{text}
							</Tag>
						);
					})}
					{onClear ? (
						<Button hierarchy="link-gray" size="sm" onClick={onClear}>
							{t.clear}
						</Button>
					) : null}
				</div>
			) : null}
		</div>
	);
}
