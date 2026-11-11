"use client";

import { useState } from "react";
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
import { isComplete } from "./FilterMenu.js";

export interface FilterPanelProps {
	/** Los campos por los que se filtra; con `options`, su valor se elige en una lista con casillas. */
	fields: FilterField[];
	operators: { value: string; label: string }[];
	/** Los filtros de partida (los aplicados). @default [] */
	defaultValue?: FilterRule[];
	/** Recibe los filtros completos al pulsar «Aplicar filtros», o `[]` con «Limpiar todo». */
	onApply?: (rules: FilterRule[]) => void;
	labels?: Partial<FilterLabels>;
	className?: string;
}

/**
 * Contenido del panel de filtros (Figma `Filters slideout menu`, `12232:375462`), para ponerlo dentro de un `Slideout`
 * con el título «Filtros»: una fila por filtro (campo y operador arriba, valor debajo), «Añadir filtro» y, al pie,
 * «Limpiar todo» y «Aplicar filtros». Sin filtros, lo dice.
 */
export function FilterPanel({
	fields,
	operators,
	defaultValue = [],
	onApply,
	labels,
	className,
}: FilterPanelProps) {
	const t = { ...FILTER_LABELS, ...labels };
	const [draft, setDraft] = useState<FilterRule[]>(defaultValue);
	const apply = (rules: FilterRule[]) => {
		if (!rules.length) setDraft([]);
		onApply?.(rules.filter(isComplete));
	};
	return (
		<div className={cx("flex flex-1 flex-col gap-6 font-body", className)}>
			{draft.length ? (
				<div className="flex flex-col items-start gap-6">
					<div className="w-full">
						<FilterRows
							rules={draft}
							fields={fields}
							operators={operators}
							layout="stacked"
							onChange={setDraft}
							t={t}
						/>
					</div>
					<AddButton onAdd={() => setDraft([...draft, blankRule(operators)])} t={t} />
				</div>
			) : (
				<FilterEmpty onAdd={() => setDraft([blankRule(operators)])} t={t} />
			)}
			{/* El pie se queda abajo en el Slideout: empuja con mt-auto y se pega al borde al desplazar */}
			<div className="sticky bottom-0 -mx-6 -mb-6 mt-auto flex justify-end bg-primary_alt px-6 py-4 shadow-[inset_0_1px_0_var(--border-secondary)]">
				<FilterActions onClear={() => apply([])} onApply={() => apply(draft)} t={t} />
			</div>
		</div>
	);
}
