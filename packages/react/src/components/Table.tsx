"use client";

import { IconArrowDown, IconArrowUp } from "@jotis-me/icons";
import { type ReactNode, useId, useState } from "react";
import { cx } from "../internal/cx.js";
import { useControllable } from "../internal/use-controllable.js";
import { Avatar, type AvatarProps } from "./Avatar.js";
import { AvatarGroup } from "./AvatarGroup.js";
import { Badge, type BadgeColor, COLOR } from "./Badge.js";
import { Button } from "./Button.js";
import { Checkbox } from "./Checkbox.js";
import { HelpIcon } from "./HelpIcon.js";
import { Icon, type IconName } from "./Icon.js";
import { ProgressBar } from "./ProgressBar.js";
import { Radio } from "./Radio.js";
import { Toggle } from "./Toggle.js";

/**
 * Tipos de celda del Figma (`Table cell`, `1222:107305`). El valor de la columna (`row[key]`) cambia de forma según el
 * tipo; ver cada `TableCell*`. La tendencia positiva y la negativa son un tipo con `direction`.
 */
export type TableCellType =
	| "text"
	| "avatar"
	| "file"
	| "payment"
	| "badge"
	| "badges"
	| "trend"
	| "avatar-group"
	| "select"
	| "progress"
	| "rating"
	| "actions"
	| "action-icons"
	| "menu";

/** `text`: un texto o título y subtítulo. */
export type TableCellText = ReactNode | { title: ReactNode; subtitle?: ReactNode };
/** `avatar`: avatar, nombre y subtítulo (correo, usuario). */
export interface TableCellAvatar {
	name: ReactNode;
	subtitle?: ReactNode;
	avatar?: AvatarProps;
}
/** `file`: icono del tipo (`@jotis-me/icons/files`), nombre y tamaño. */
export interface TableCellFile {
	name: ReactNode;
	size?: ReactNode;
	icon?: ReactNode;
}
/** `payment`: logo de la tarjeta (`@jotis-me/icons/payments`), «Visa terminada en 1234» y caducidad. */
export interface TableCellPayment {
	logo?: ReactNode;
	label: ReactNode;
	detail?: ReactNode;
}
/** `badge`: una insignia. */
export type TableCellBadge =
	| string
	| { label: ReactNode; color?: BadgeColor; dot?: boolean; icon?: IconName | ReactNode };
/** `badges`: varias insignias; con más de `max`, «+N». */
export interface TableCellBadges {
	labels: string[];
	color?: BadgeColor;
	/** @default 3 */
	max?: number;
}
/** `trend`: el valor y su cambio, en verde con flecha arriba o en rojo con flecha abajo. */
export interface TableCellTrend {
	value: ReactNode;
	change: ReactNode;
	direction: "up" | "down";
}
/** `avatar-group`: un texto («10 usuarios») y el grupo; con más de `max`, «+N». */
export interface TableCellAvatarGroup {
	label?: ReactNode;
	avatars: AvatarProps[];
	/** @default 5 */
	max?: number;
}
/** `select`: un desplegable nativo, con el punto de color de la opción elegida. */
export interface TableCellSelect {
	value: string;
	options: { value: string; label: string; dot?: BadgeColor }[];
	onChange?: (value: string) => void;
	/** Nombre accesible del desplegable. */
	label: string;
}
/** `progress`: de 0 a 100, con el porcentaje a la derecha. */
export type TableCellProgress = number;
/** `rating`: de 0 a 5 estrellas. */
export type TableCellRating = number;
/** `actions`: botones de texto («Borrar», «Editar»); el último va en el color de marca. */
export type TableCellActions = { label: string; onClick?: () => void }[];
/** `action-icons`: botones de icono con nombre (copiar, descargar, borrar, editar). */
export type TableCellActionIcons = { icon: IconName | ReactNode; label: string; onClick?: () => void }[];
/** `menu`: el botón de tres puntos; con `node`, lo que pases (un `Dropdown`). */
export type TableCellMenu = { label?: string; onClick?: () => void; node?: ReactNode };

export interface TableColumn<R = Record<string, unknown>> {
	key: string;
	label: ReactNode;
	/** Columna principal (la primera): `text-primary` medium. Solo una. */
	primary?: boolean;
	/** Los números, a la derecha. @default "left" */
	align?: "left" | "right";
	/** Pinta la celda; por defecto, `row[key]` (o la plantilla de `type`). */
	render?: (row: R) => ReactNode;
	/** Plantilla de celda del Figma: el valor de `row[key]` toma la forma del tipo. */
	type?: TableCellType;
	/** La cabecera es un botón que ordena por esta columna (`aria-sort`). */
	sortable?: boolean;
	/** Valor por el que se ordena. Por defecto, `row[key]` (texto o número). */
	sortValue?: (row: R) => string | number;
	/** Ayuda junto al título de la columna, en un `HelpIcon`. */
	help?: ReactNode;
}

export type TableSortDirection = "ascending" | "descending";
export interface TableSort {
	key: string;
	direction: TableSortDirection;
}

export interface TableLabels {
	/** Nombre de la casilla de cabecera. */
	selectAll: string;
	/** Nombre de la casilla de cada fila. */
	selectRow: (index: number) => string;
	/** Nombre del botón de ordenar. */
	sortBy: (column: string) => string;
	rating: (value: number) => string;
	menu: string;
}

const LABELS: TableLabels = {
	selectAll: "Seleccionar todas las filas",
	selectRow: (i) => `Seleccionar la fila ${i + 1}`,
	sortBy: (c) => `Ordenar por ${c}`,
	rating: (v) => `${String(v).replace(".", ",")} de 5`,
	menu: "Más opciones",
};

export interface TableProps<R = Record<string, unknown>> {
	columns: TableColumn<R>[];
	/** Filas. Si tienen `id`, se usa como clave. */
	rows: R[];
	/** Título de la tarjeta; también da nombre a la tabla. */
	title?: ReactNode;
	/** Total junto al título, en un `Badge` de marca. */
	count?: ReactNode;
	description?: ReactNode;
	/** Acciones de la cabecera (buscar, exportar): a la vista, sin esconderlas. */
	actions?: ReactNode;
	/** Pie, por ejemplo una `Pagination`. */
	footer?: ReactNode;
	/**
	 * Alto de fila: `md` 72px · `sm` 56px.
	 * @default "md"
	 */
	size?: "sm" | "md";
	/** Orden (controlado). La tabla ordena las filas por esa columna; quien la usa solo guarda el orden. */
	sort?: TableSort | null;
	/** Orden al principio (no controlado). */
	defaultSort?: TableSort | null;
	/** Avisa con la columna y el sentido al pulsar una cabecera ordenable. */
	onSortChange?: (sort: TableSort) => void;
	/** Primera columna para elegir filas: casilla (con la de cabecera), radio (una sola) o interruptor. */
	selection?: "checkbox" | "radio" | "toggle";
	/** Claves elegidas (controlado): el `id` de cada fila o su índice como texto. */
	selectedKeys?: string[];
	defaultSelectedKeys?: string[];
	onSelectionChange?: (keys: string[]) => void;
	/** Filas alternas en `bg-secondary`. */
	striped?: boolean;
	labels?: Partial<TableLabels>;
	className?: string;
}

/**
 * Tabla de datos en tarjeta con cabecera, columnas y pie opcional. Mínima: nada que no sea dato.
 * Si no cabe a lo ancho, se desplaza dentro de la tarjeta (también con teclado).
 */
export function Table<R = Record<string, unknown>>(props: TableProps<R>) {
	const { columns, sort, defaultSort, onSortChange, selection, striped } = props;
	const typed =
		!!selection ||
		!!striped ||
		sort !== undefined ||
		defaultSort !== undefined ||
		!!onSortChange ||
		columns.some((c) => c.type || c.sortable || c.help);
	return typed ? <TypedTable {...props} /> : <ClassicTable {...props} />;
}

function Card({
	title,
	count,
	description,
	actions,
	titleId,
	className,
	children,
	footer,
}: {
	title?: ReactNode;
	count?: ReactNode;
	description?: ReactNode;
	actions?: ReactNode;
	titleId?: string;
	className?: string;
	children: ReactNode;
	footer?: ReactNode;
}) {
	return (
		<div
			className={cx(
				"overflow-hidden rounded-xl bg-primary font-body shadow-[var(--shadow-xs),inset_0_0_0_1px_var(--border-secondary)]",
				className,
			)}
		>
			{title ? (
				<div className="flex items-center gap-4 px-6 py-5">
					<div className="flex-1">
						<h3
							id={titleId}
							className="m-0 flex items-center gap-2 text-lg font-semibold text-primary"
						>
							{title}
							{count != null ? (
								<Badge color="brand" size="sm">
									{count}
								</Badge>
							) : null}
						</h3>
						{description ? (
							<p className="mt-1 mb-0 text-sm text-tertiary">{description}</p>
						) : null}
					</div>
					{actions ?? null}
				</div>
			) : null}
			{/* Desplazamiento horizontal enfocable: con teclado también se puede recorrer una tabla ancha */}
			<div
				{...(titleId ? { role: "region", "aria-labelledby": titleId } : {})}
				// biome-ignore lint/a11y/noNoninteractiveTabindex: región desplazable; sin foco no se podría recorrer con teclado
				tabIndex={0}
				className="overflow-x-auto focus-visible:shadow-[inset_0_0_0_2px_var(--focus-ring)] focus-visible:outline-none"
			>
				{children}
			</div>
			{footer ?? null}
		</div>
	);
}

/** La de siempre: su HTML no cambia. */
function ClassicTable<R>({
	columns,
	rows,
	title,
	count,
	description,
	actions,
	footer,
	size = "md",
	className,
}: TableProps<R>) {
	const id = useId();
	const titleId = title ? `${id}-title` : undefined;
	return (
		<Card
			title={title}
			count={count}
			description={description}
			actions={actions}
			titleId={titleId}
			className={className}
			footer={footer}
		>
			<table aria-labelledby={titleId} className="w-full border-collapse">
				<thead>
					<tr>
						{columns.map((c) => (
							<th
								key={c.key}
								scope="col"
								className={cx(
									"h-11 border-y border-secondary bg-secondary px-6 py-3 text-xs font-semibold whitespace-nowrap text-quaternary",
									c.align === "right" ? "text-right" : "text-left",
								)}
							>
								{c.label}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{rows.map((row, i) => (
						<tr
							key={String((row as { id?: unknown }).id ?? i)}
							className="hover:bg-primary_hover [&:last-child>td]:border-b-0"
						>
							{columns.map((c) => (
								<td
									key={c.key}
									className={cx(
										"border-b border-secondary px-6 text-sm",
										size === "sm" ? "h-14 py-3" : "h-18 py-4",
										c.primary ? "font-medium text-primary" : "text-tertiary",
										c.align === "right" && "text-right",
									)}
								>
									{c.render ? c.render(row) : (row as Record<string, ReactNode>)[c.key]}
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		</Card>
	);
}

/* ——— Celdas ——— */

function Stars({ value, label }: { value: number; label: string }) {
	return (
		<span role="img" aria-label={label} className="inline-flex gap-0.5">
			{[0, 1, 2, 3, 4].map((i) => {
				const fill = Math.max(0, Math.min(1, value - i));
				return (
					<svg
						key={i}
						width="20"
						height="20"
						viewBox="0 0 24 24"
						aria-hidden="true"
						className="flex-none"
					>
						<path
							d="M12 2.5l2.94 5.96 6.56.95-4.75 4.63 1.12 6.53L12 17.5l-5.87 3.07 1.12-6.53L2.5 9.41l6.56-.95L12 2.5z"
							fill="var(--bg-quaternary)"
						/>
						{fill > 0 ? (
							<path
								d="M12 2.5l2.94 5.96 6.56.95-4.75 4.63 1.12 6.53L12 17.5l-5.87 3.07 1.12-6.53L2.5 9.41l6.56-.95L12 2.5z"
								fill="var(--fg-warning-secondary)"
								style={
									fill < 1 ? { clipPath: `inset(0 ${100 - fill * 100}% 0 0)` } : undefined
								}
							/>
						) : null}
					</svg>
				);
			})}
		</span>
	);
}

function CellSelect({ cell }: { cell: TableCellSelect }) {
	const [value, setValue] = useState(cell.value);
	const current = cell.options.find((o) => o.value === value);
	return (
		<span className="relative inline-flex w-full max-w-60 items-center">
			{current?.dot ? (
				<span
					aria-hidden="true"
					className={cx(
						"pointer-events-none absolute left-3 size-2 rounded-full",
						COLOR[current.dot].dot,
					)}
				/>
			) : null}
			<select
				aria-label={cell.label}
				value={value}
				onChange={(e) => {
					setValue(e.target.value);
					cell.onChange?.(e.target.value);
				}}
				className={cx(
					"h-9 w-full cursor-pointer appearance-none rounded-lg border-0 bg-primary pr-8 font-body text-sm font-medium text-primary shadow-[var(--shadow-xs),inset_0_0_0_1px_var(--border-primary)] focus-visible:shadow-[var(--shadow-xs),inset_0_0_0_2px_var(--border-brand)] focus-visible:outline-none",
					current?.dot ? "pl-7" : "pl-3",
				)}
			>
				{cell.options.map((o) => (
					<option key={o.value} value={o.value}>
						{o.label}
					</option>
				))}
			</select>
			<span className="pointer-events-none absolute right-2.5 flex text-fg-quaternary">
				<Icon name="chevron-down" size={16} />
			</span>
		</span>
	);
}

function renderCell(type: TableCellType, value: unknown, t: TableLabels, name: string): ReactNode {
	switch (type) {
		case "text": {
			if (value && typeof value === "object" && "title" in value) {
				const v = value as { title: ReactNode; subtitle?: ReactNode };
				return (
					<span className="flex flex-col">
						<span className="font-medium text-primary">{v.title}</span>
						{v.subtitle ? <span className="text-tertiary">{v.subtitle}</span> : null}
					</span>
				);
			}
			return value as ReactNode;
		}
		case "avatar": {
			const v = value as TableCellAvatar;
			return (
				<span className="flex items-center gap-3">
					<Avatar
						size="md"
						{...(v.avatar ?? { initials: typeof v.name === "string" ? v.name.slice(0, 2) : "?" })}
					/>
					<span className="flex min-w-0 flex-col">
						<span className="font-medium whitespace-nowrap text-primary">{v.name}</span>
						{v.subtitle ? (
							<span className="whitespace-nowrap text-tertiary">{v.subtitle}</span>
						) : null}
					</span>
				</span>
			);
		}
		case "file": {
			const v = value as TableCellFile;
			return (
				<span className="flex items-center gap-3">
					<span className="flex size-10 flex-none items-center justify-center [&_svg]:size-10">
						{v.icon ?? <Icon name="file-04" size={32} />}
					</span>
					<span className="flex min-w-0 flex-col">
						<span className="font-medium whitespace-nowrap text-primary">{v.name}</span>
						{v.size ? <span className="text-tertiary">{v.size}</span> : null}
					</span>
				</span>
			);
		}
		case "payment": {
			const v = value as TableCellPayment;
			return (
				<span className="flex items-center gap-3">
					{v.logo ? (
						<span className="flex flex-none [&_svg]:h-8 [&_svg]:w-auto">{v.logo}</span>
					) : null}
					<span className="flex min-w-0 flex-col">
						<span className="font-medium whitespace-nowrap text-primary">{v.label}</span>
						{v.detail ? (
							<span className="whitespace-nowrap text-tertiary">{v.detail}</span>
						) : null}
					</span>
				</span>
			);
		}
		case "badge": {
			const v =
				typeof value === "string" ? { label: value } : (value as Exclude<TableCellBadge, string>);
			return (
				<Badge size="sm" color={v.color ?? "gray"} dot={v.dot} icon={v.icon}>
					{v.label}
				</Badge>
			);
		}
		case "badges": {
			const v = value as TableCellBadges;
			const max = v.max ?? 3;
			const rest = v.labels.length - max;
			return (
				<span className="flex gap-1">
					{v.labels.slice(0, max).map((l) => (
						<Badge key={l} size="sm" color={v.color ?? "brand"}>
							{l}
						</Badge>
					))}
					{rest > 0 ? (
						<Badge size="sm" color="gray">
							+{rest}
						</Badge>
					) : null}
				</span>
			);
		}
		case "trend": {
			const v = value as TableCellTrend;
			const up = v.direction === "up";
			return (
				<span className="flex items-center gap-2 whitespace-nowrap">
					<span className="text-primary">{v.value}</span>
					<Badge
						size="sm"
						color={up ? "success" : "error"}
						icon={up ? <IconArrowUp size={12} /> : <IconArrowDown size={12} />}
					>
						<span className="sr-only">{up ? "Sube " : "Baja "}</span>
						{v.change}
					</Badge>
				</span>
			);
		}
		case "avatar-group": {
			const v = value as TableCellAvatarGroup;
			const max = v.max ?? 5;
			const rest = v.avatars.length - max;
			return (
				<span className="flex items-center gap-3 whitespace-nowrap">
					{v.label ? <span>{v.label}</span> : null}
					<AvatarGroup
						size="xs"
						items={rest > 0 ? [...v.avatars.slice(0, max), { initials: `+${rest}` }] : v.avatars}
					/>
				</span>
			);
		}
		case "select":
			return <CellSelect cell={value as TableCellSelect} />;
		case "progress": {
			const v = Math.round(Number(value));
			return <ProgressBar value={v} label="right" aria-label={name} className="min-w-40" />;
		}
		case "rating": {
			const v = Number(value);
			return <Stars value={v} label={t.rating(v)} />;
		}
		case "actions": {
			const v = value as TableCellActions;
			return (
				<span className="flex items-center gap-3 whitespace-nowrap">
					{v.map((a, i) => (
						<Button
							key={a.label}
							hierarchy={i === v.length - 1 ? "link-color" : "link-gray"}
							size="sm"
							onClick={a.onClick}
						>
							{a.label}
						</Button>
					))}
				</span>
			);
		}
		case "action-icons": {
			const v = value as TableCellActionIcons;
			return (
				<span className="flex items-center gap-0.5">
					{v.map((a) => (
						<Button
							key={a.label}
							hierarchy="tertiary"
							size="xs"
							iconOnly={a.icon}
							label={a.label}
							onClick={a.onClick}
						/>
					))}
				</span>
			);
		}
		case "menu": {
			const v = (value ?? {}) as TableCellMenu;
			return (
				v.node ?? (
					<Button
						hierarchy="tertiary"
						size="xs"
						iconOnly="dots-vertical"
						label={v.label ?? t.menu}
						onClick={v.onClick}
					/>
				)
			);
		}
		default:
			return value as ReactNode;
	}
}

const compare = (a: unknown, b: unknown) =>
	typeof a === "number" && typeof b === "number"
		? a - b
		: String(a ?? "").localeCompare(String(b ?? ""), "es", { numeric: true, sensitivity: "base" });

function TypedTable<R>({
	columns,
	rows,
	title,
	count,
	description,
	actions,
	footer,
	size = "md",
	sort: sortProp,
	defaultSort = null,
	onSortChange,
	selection,
	selectedKeys,
	defaultSelectedKeys = [],
	onSelectionChange,
	striped,
	labels,
	className,
}: TableProps<R>) {
	const id = useId();
	const titleId = title ? `${id}-title` : undefined;
	const t = { ...LABELS, ...labels };
	const [sort, setSort] = useControllable<TableSort | null>(sortProp, defaultSort);
	const [selected, setSelected] = useControllable<string[]>(
		selectedKeys,
		defaultSelectedKeys,
		onSelectionChange,
	);
	const keyOf = (row: R, i: number) => String((row as { id?: unknown }).id ?? i);
	const keyed = rows.map((row, i) => ({ row, key: keyOf(row, i) }));
	const sortCol = sort ? columns.find((c) => c.key === sort.key) : undefined;
	const shown =
		sort && sortCol
			? [...keyed].sort((a, b) => {
					const va = sortCol.sortValue
						? sortCol.sortValue(a.row)
						: (a.row as Record<string, unknown>)[sortCol.key];
					const vb = sortCol.sortValue
						? sortCol.sortValue(b.row)
						: (b.row as Record<string, unknown>)[sortCol.key];
					return sort.direction === "ascending" ? compare(va, vb) : compare(vb, va);
				})
			: keyed;
	const toggleSort = (key: string) => {
		const next: TableSort = {
			key,
			direction: sort?.key === key && sort.direction === "ascending" ? "descending" : "ascending",
		};
		setSort(next);
		onSortChange?.(next);
	};
	const allKeys = shown.map((r) => r.key);
	const allOn = allKeys.length > 0 && allKeys.every((k) => selected.includes(k));
	const someOn = !allOn && allKeys.some((k) => selected.includes(k));
	const pad = size === "sm" ? "h-14 py-3" : "h-18 py-4";
	const groupName = `${id}-seleccion`;

	return (
		<Card
			title={title}
			count={count}
			description={description}
			actions={actions}
			titleId={titleId}
			className={className}
			footer={footer}
		>
			<table aria-labelledby={titleId} className="w-full border-collapse">
				<thead>
					<tr>
						{selection ? (
							<th
								scope="col"
								className="relative h-11 w-12 border-y border-secondary bg-secondary py-3 pr-0 pl-6 text-left"
							>
								{selection === "checkbox" ? (
									<Checkbox
										aria-label={t.selectAll}
										checked={allOn}
										indeterminate={someOn}
										onChange={() =>
											setSelected(
												allOn
													? selected.filter((k) => !allKeys.includes(k))
													: [...new Set([...selected, ...allKeys])],
											)
										}
									/>
								) : (
									<span className="sr-only">{t.selectAll}</span>
								)}
							</th>
						) : null}
						{columns.map((c) => {
							const sorted = sort?.key === c.key ? sort.direction : undefined;
							return (
								<th
									key={c.key}
									scope="col"
									aria-sort={c.sortable ? (sorted ?? "none") : undefined}
									className={cx(
										"h-11 border-y border-secondary bg-secondary px-6 py-3 text-xs font-semibold whitespace-nowrap text-quaternary",
										c.align === "right" ? "text-right" : "text-left",
									)}
								>
									<span
										className={cx(
											"inline-flex items-center gap-1",
											c.align === "right" && "flex-row-reverse",
										)}
									>
										{c.sortable ? (
											<button
												type="button"
												onClick={() => toggleSort(c.key)}
												className="-mx-1 inline-flex cursor-pointer items-center gap-1 rounded-sm border-0 bg-transparent px-1 font-body text-xs font-semibold text-quaternary hover:text-tertiary focus-visible:shadow-focus-ring focus-visible:outline-none"
											>
												{c.label}
												<span
													className={cx(
														"inline-flex",
														sorted
															? "text-fg-secondary"
															: "text-fg-quaternary opacity-60",
													)}
												>
													{sorted === "descending" ? (
														<IconArrowUp size={12} />
													) : (
														<IconArrowDown size={12} />
													)}
												</span>
											</button>
										) : (
											c.label
										)}
										{c.help ? <HelpIcon title={c.help} placement="top" /> : null}
									</span>
								</th>
							);
						})}
					</tr>
				</thead>
				<tbody>
					{shown.map(({ row, key }, i) => {
						const on = selected.includes(key);
						return (
							<tr
								key={key}
								className={cx(
									"hover:bg-primary_hover [&:last-child>td]:border-b-0",
									striped && i % 2 === 1 && "bg-secondary",
									on && "bg-primary_hover",
								)}
							>
								{/* `relative` en la celda: las casillas nativas van ocultas en posición absoluta y, sin él, se salen de la región que se desplaza y ensanchan la página */}
								{selection ? (
									<td
										className={cx(
											"relative w-12 border-b border-secondary py-0 pr-0 pl-6",
											pad,
										)}
									>
										{selection === "checkbox" ? (
											<Checkbox
												aria-label={t.selectRow(i)}
												checked={on}
												onChange={() =>
													setSelected(
														on
															? selected.filter((k) => k !== key)
															: [...selected, key],
													)
												}
											/>
										) : selection === "radio" ? (
											<Radio
												name={groupName}
												aria-label={t.selectRow(i)}
												checked={on}
												onChange={() => setSelected([key])}
											/>
										) : (
											<Toggle
												label={<span className="sr-only">{t.selectRow(i)}</span>}
												checked={on}
												onChange={(v) =>
													setSelected(
														v
															? [...selected, key]
															: selected.filter((k) => k !== key),
													)
												}
											/>
										)}
									</td>
								) : null}
								{columns.map((c) => {
									const raw = (row as Record<string, unknown>)[c.key];
									return (
										<td
											key={c.key}
											className={cx(
												"border-b border-secondary px-6 text-sm whitespace-nowrap",
												pad,
												c.primary ? "font-medium text-primary" : "text-tertiary",
												c.align === "right" && "text-right",
											)}
										>
											{c.render
												? c.render(row)
												: c.type
													? renderCell(
															c.type,
															raw,
															t,
															typeof c.label === "string" ? c.label : c.key,
														)
													: (raw as ReactNode)}
										</td>
									);
								})}
							</tr>
						);
					})}
				</tbody>
			</table>
		</Card>
	);
}
