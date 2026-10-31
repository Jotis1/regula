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
	className?: string;
}

/** Barra encima de una tabla o lista: vista rápida, búsqueda, botón de filtros y filtros activos. */
export function FilterBar({
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
								icon="search-lg"
								placeholder={searchPlaceholder ?? t.search}
								aria-label={t.search}
								onChange={onSearch ? (e) => onSearch(e.target.value) : undefined}
							/>
						</div>
					) : null}
					{extra}
					<Button
						hierarchy="secondary"
						size="sm"
						iconLeading="filter-lines"
						onClick={onOpenFilters}
					>
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
