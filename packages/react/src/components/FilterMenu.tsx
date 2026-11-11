"use client";

import { useState } from "react";
import { Button as AriaButton, Dialog, DialogTrigger, Popover } from "react-aria-components";
import { cx } from "../internal/cx.js";
import {
	AddButton,
	blankRule,
	FILTER_LABELS,
	FilterActions,
	FilterEmpty,
	type FilterField,
	type FilterLabels,
	FilterRows,
	type FilterRule,
} from "../internal/filter-rules.js";
import { useControllable } from "../internal/use-controllable.js";
import { Icon } from "./Icon.js";

export type { FilterField, FilterLabels, FilterRule } from "../internal/filter-rules.js";

export interface FilterMenuProps {
	/** Los campos por los que se filtra; con `options`, su valor se elige en una lista con casillas. */
	fields: FilterField[];
	/** Los operadores: «Es», «Contiene», «No contiene»… */
	operators: { value: string; label: string }[];
	/** Los filtros aplicados (controlado): su número sale en el disparador. */
	value?: FilterRule[];
	/** @default [] */
	defaultValue?: FilterRule[];
	/** Recibe los filtros al pulsar «Aplicar filtros» (sin las filas a medias) o `[]` al limpiar y aplicar. */
	onApply?: (rules: FilterRule[]) => void;
	/**
	 * Lado del menú respecto del botón: `start` alineado a la izquierda, `end` a la derecha.
	 * @default "start"
	 */
	align?: "start" | "end";
	disabled?: boolean;
	/** Textos sustituibles. */
	labels?: Partial<FilterLabels>;
	className?: string;
}

const SECONDARY =
	"shadow-[var(--shadow-xs-skeuomorphic),inset_0_0_0_1px_var(--border-primary)] hover:bg-primary_hover";

/** Una fila está completa con campo y valor. */
export const isComplete = (r: FilterRule) =>
	r.field !== "" && (Array.isArray(r.value) ? r.value.length > 0 : r.value.trim() !== "");

/**
 * Menú de filtros (Figma `Filters dropdown menu`, `12232:366410`): el botón «Filtros» con el número de filtros activos
 * abre un popover con una fila por filtro (campo, operador y valor), «Añadir filtro», «Limpiar todo» y «Aplicar filtros».
 * Sin filtros, lo dice. Escape cierra sin aplicar.
 */
export function FilterMenu({
	fields,
	operators,
	value,
	defaultValue = [],
	onApply,
	align = "start",
	disabled,
	labels,
	className,
}: FilterMenuProps) {
	const t = { ...FILTER_LABELS, ...labels };
	const [applied, setApplied] = useControllable(value, defaultValue, onApply);
	const [open, setOpen] = useState(false);
	const [draft, setDraft] = useState<FilterRule[]>(applied);
	const count = applied.length;
	const onOpenChange = (o: boolean) => {
		// Cada vez que se abre, el borrador parte de lo aplicado
		if (o) setDraft(applied.length ? applied : []);
		setOpen(o);
	};
	const apply = (rules: FilterRule[]) => {
		setApplied(rules.filter(isComplete));
		setOpen(false);
	};
	return (
		<DialogTrigger isOpen={open} onOpenChange={onOpenChange}>
			<AriaButton
				isDisabled={disabled}
				className={cx(
					"inline-flex h-9 cursor-pointer items-center gap-1 rounded-lg px-3 py-2 font-body text-sm font-semibold text-secondary outline-none focus-visible:shadow-focus-ring disabled:cursor-not-allowed disabled:opacity-50",
					count ? "bg-secondary" : "bg-primary",
					SECONDARY,
					className,
				)}
			>
				<Icon name="filter-lines" size={20} className="text-fg-quaternary" />
				<span className="flex items-center gap-1.5 px-0.5">
					{t.filters}
					{/* Los espacios son para el nombre accesible: «Filtros 3 filtros activos»; en flex no se ven */}
					{count ? " " : null}
					{count ? (
						<span className="rounded-md bg-primary px-1.5 py-0.5 text-xs font-medium text-secondary shadow-[var(--shadow-xs),inset_0_0_0_1px_var(--border-primary)]">
							{count}
						</span>
					) : null}
					{count ? <span className="sr-only">{` ${t.active(count)}`}</span> : null}
				</span>
				<Icon name="chevron-down" size={16} className="text-fg-quaternary" />
			</AriaButton>
			<Popover
				placement={align === "end" ? "bottom end" : "bottom start"}
				offset={8}
				className="z-30 w-[min(624px,calc(100vw-32px))] outline-none"
			>
				<Dialog
					aria-label={t.filters}
					className="flex flex-col rounded-lg bg-primary font-body shadow-[var(--shadow-lg),inset_0_0_0_1px_var(--border-secondary_alt)] outline-none"
				>
					{draft.length ? (
						<>
							<div className="p-4">
								<FilterRows
									rules={draft}
									fields={fields}
									operators={operators}
									layout="row"
									onChange={setDraft}
									t={t}
								/>
							</div>
							<div className="flex flex-wrap items-center justify-between gap-3 border-t border-secondary px-4 py-3">
								<AddButton onAdd={() => setDraft([...draft, blankRule(operators)])} t={t} />
								<FilterActions onClear={() => apply([])} onApply={() => apply(draft)} t={t} />
							</div>
						</>
					) : (
						<div className="p-4">
							<FilterEmpty onAdd={() => setDraft([blankRule(operators)])} t={t} />
						</div>
					)}
				</Dialog>
			</Popover>
		</DialogTrigger>
	);
}
