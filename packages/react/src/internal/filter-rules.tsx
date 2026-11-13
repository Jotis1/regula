"use client";

import { ChevronDown, Plus, XClose } from "@untitledui/icons";
// Lo que comparten `FilterMenu` y `FilterPanel` (Figma `Filters dropdown menu` y `Filters slideout menu`): las filas de
// filtros (campo, operador y valor), el estado vacío y los botones del pie.
import { Button } from "../components/Button.js";
import { MultiSelect, type MultiSelectOption } from "../components/MultiSelect.js";
import { cx } from "./cx.js";
import { defaultStrings } from "./strings.js";

export interface FilterField {
	value: string;
	label: string;
	/** Con opciones, el valor se elige en una lista con casillas, búsqueda, «Restablecer» y «Seleccionar todo». */
	options?: MultiSelectOption[];
}

export interface FilterRule {
	/** El `value` del campo; vacío mientras no se elige. */
	field: string;
	operator: string;
	/** Texto, o la lista de opciones elegidas si el campo tiene `options`. */
	value: string | string[];
}

export interface FilterLabels {
	filters: string;
	addFilter: string;
	clearAll: string;
	apply: string;
	emptyTitle: string;
	emptyDescription: string;
	selectField: string;
	enterValue: string;
	field: (n: number) => string;
	operator: (n: number) => string;
	value: (n: number) => string;
	remove: (n: number) => string;
	/** «2 elegidos» en el valor de lista. */
	selected: (n: number) => string;
	/** Lo que sigue al número en el nombre del disparador: «Filtros 3 filtros activos». */
	active: (n: number) => string;
}

export const FILTER_LABELS: FilterLabels = {
	filters: defaultStrings.filters,
	addFilter: "Añadir filtro",
	clearAll: defaultStrings.clearAll,
	apply: "Aplicar filtros",
	emptyTitle: "No hay filtros",
	emptyDescription: "Añade filtros para acotar los resultados.",
	selectField: "Elige un filtro",
	enterValue: "Escribe un valor",
	field: (n) => `Campo del filtro ${n}`,
	operator: (n) => `Operador del filtro ${n}`,
	value: (n) => `Valor del filtro ${n}`,
	remove: (n) => `Quitar el filtro ${n}`,
	selected: (n) => (n === 1 ? "1 elegido" : `${n} elegidos`),
	active: (n) => (n === 1 ? "filtro activo" : "filtros activos"),
};

const NATIVE_SELECT =
	"h-9 w-full cursor-pointer appearance-none rounded-lg border-0 bg-primary pr-8 pl-3 font-body text-sm font-medium text-primary shadow-[var(--shadow-xs),inset_0_0_0_1px_var(--border-primary)] invalid:font-normal invalid:text-placeholder focus-visible:shadow-[var(--shadow-xs),inset_0_0_0_2px_var(--border-brand)] focus-visible:outline-none";
const NATIVE_INPUT =
	"h-9 w-full min-w-0 rounded-lg border-0 bg-primary px-3 font-body text-sm text-primary shadow-[var(--shadow-xs),inset_0_0_0_1px_var(--border-primary)] placeholder:text-placeholder focus-visible:shadow-[var(--shadow-xs),inset_0_0_0_2px_var(--border-brand)] focus-visible:outline-none";

function NativeSelect({
	label,
	value,
	placeholder,
	options,
	onChange,
	className,
}: {
	label: string;
	value: string;
	placeholder?: string;
	options: { value: string; label: string }[];
	onChange: (v: string) => void;
	className?: string;
}) {
	return (
		<span className={cx("relative inline-flex min-w-0 items-center", className)}>
			<select
				aria-label={label}
				value={value}
				required={placeholder !== undefined}
				onChange={(e) => onChange(e.target.value)}
				className={NATIVE_SELECT}
			>
				{placeholder !== undefined ? (
					<option value="" disabled>
						{placeholder}
					</option>
				) : null}
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

const supportingOf = (o: MultiSelectOption) => (typeof o === "string" ? undefined : o.supporting);

/**
 * Las filas de filtros. `row` (menú): campo, operador y valor en una línea y la X; `stacked` (panel): campo y operador
 * en una línea y, debajo, el valor con la X.
 */
export function FilterRows({
	rules,
	fields,
	operators,
	layout,
	onChange,
	t,
}: {
	rules: FilterRule[];
	fields: FilterField[];
	operators: { value: string; label: string }[];
	layout: "row" | "stacked";
	onChange: (rules: FilterRule[]) => void;
	t: FilterLabels;
}) {
	return (
		<ul className={cx("m-0 flex list-none flex-col p-0", layout === "row" ? "gap-3" : "gap-5")}>
			{rules.map((rule, i) => (
				<RuleRow
					// biome-ignore lint/suspicious/noArrayIndexKey: los filtros se editan por posición
					key={i}
					rule={rule}
					n={i + 1}
					fields={fields}
					operators={operators}
					layout={layout}
					t={t}
					onPatch={(patch) => onChange(rules.map((r, k) => (k === i ? { ...r, ...patch } : r)))}
					onRemove={() => onChange(rules.filter((_, k) => k !== i))}
				/>
			))}
		</ul>
	);
}

function RuleRow({
	rule,
	n,
	fields,
	operators,
	layout,
	t,
	onPatch,
	onRemove,
}: {
	rule: FilterRule;
	n: number;
	fields: FilterField[];
	operators: { value: string; label: string }[];
	layout: "row" | "stacked";
	t: FilterLabels;
	onPatch: (patch: Partial<FilterRule>) => void;
	onRemove: () => void;
}) {
	const field = fields.find((f) => f.value === rule.field);
	const width = layout === "row" ? "w-40 shrink" : "flex-1";
	const fieldSelect = (
		<NativeSelect
			label={t.field(n)}
			value={rule.field}
			placeholder={t.selectField}
			options={fields}
			// Al cambiar de campo, el valor se vacía: puede pasar de texto a lista
			onChange={(v) =>
				onPatch({ field: v, value: fields.find((f) => f.value === v)?.options ? [] : "" })
			}
			className={width}
		/>
	);
	const operatorSelect = (
		<NativeSelect
			label={t.operator(n)}
			value={rule.operator}
			options={operators}
			onChange={(v) => onPatch({ operator: v })}
			className={width}
		/>
	);
	const valueField = field?.options ? (
		<MultiSelect
			label={<span className="sr-only">{t.value(n)}</span>}
			size="sm"
			options={field.options}
			value={Array.isArray(rule.value) ? rule.value : []}
			onChange={(v) => onPatch({ value: v })}
			placeholder={t.enterValue}
			summary={(sel) => t.selected(sel.length)}
			summarySupporting={(sel) => {
				const parts = sel.map((o) => supportingOf(o)).filter((s) => typeof s === "string");
				// «16 usuarios»: suma las cifras de los apoyos si todos empiezan por número
				const nums = parts.map((s) => Number.parseInt(String(s), 10));
				if (!parts.length || nums.some(Number.isNaN)) return null;
				const unit = String(parts[0]).replace(/^\d+\s*/, "");
				return `${nums.reduce((x, y) => x + y, 0)} ${unit}`;
			}}
			className="min-w-0 flex-1 gap-0"
		/>
	) : (
		<input
			aria-label={t.value(n)}
			value={typeof rule.value === "string" ? rule.value : ""}
			placeholder={t.enterValue}
			onChange={(e) => onPatch({ value: e.target.value })}
			className={cx(NATIVE_INPUT, "flex-1")}
		/>
	);
	const remove = (
		<Button
			hierarchy="tertiary"
			size="sm"
			iconOnly={<XClose size={20} />}
			label={t.remove(n)}
			onClick={onRemove}
			className="shrink-0"
		/>
	);
	return layout === "row" ? (
		<li className="flex items-center gap-1">
			<div className="flex min-w-0 flex-1 items-center gap-3">
				{fieldSelect}
				{operatorSelect}
				{valueField}
			</div>
			{remove}
		</li>
	) : (
		<li className="flex flex-col gap-3">
			<div className="flex gap-3 pr-10">
				{fieldSelect}
				{operatorSelect}
			</div>
			<div className="flex items-center gap-1">
				{valueField}
				{remove}
			</div>
		</li>
	);
}

/** Sin filtros: título, explicación y «Añadir filtro». */
export function FilterEmpty({ onAdd, t }: { onAdd: () => void; t: FilterLabels }) {
	return (
		<div className="flex flex-col items-start gap-3">
			<div className="flex flex-col">
				<p className="m-0 text-sm font-semibold text-primary">{t.emptyTitle}</p>
				<p className="m-0 text-sm text-tertiary">{t.emptyDescription}</p>
			</div>
			<AddButton onAdd={onAdd} t={t} />
		</div>
	);
}

export function AddButton({ onAdd, t }: { onAdd: () => void; t: FilterLabels }) {
	return (
		<Button hierarchy="secondary" size="sm" iconLeading={<Plus size={16} />} onClick={onAdd}>
			{t.addFilter}
		</Button>
	);
}

/** «Limpiar todo» y «Aplicar filtros». */
export function FilterActions({
	onClear,
	onApply,
	t,
}: {
	onClear: () => void;
	onApply: () => void;
	t: FilterLabels;
}) {
	return (
		<div className="flex items-center gap-3">
			<Button hierarchy="secondary" size="sm" onClick={onClear}>
				{t.clearAll}
			</Button>
			<Button size="sm" onClick={onApply}>
				{t.apply}
			</Button>
		</div>
	);
}

/** Una fila nueva, sin campo elegido y con el primer operador. */
export const blankRule = (operators: { value: string }[]): FilterRule => ({
	field: "",
	operator: operators[0]?.value ?? "",
	value: "",
});
