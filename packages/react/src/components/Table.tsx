import { type ReactNode, useId } from "react";
import { cx } from "../internal/cx.js";
import { Badge } from "./Badge.js";

export interface TableColumn<R = Record<string, unknown>> {
	key: string;
	label: ReactNode;
	/** Columna principal (la primera): `text-primary` medium. Solo una. */
	primary?: boolean;
	/** Los números, a la derecha. @default "left" */
	align?: "left" | "right";
	/** Pinta la celda; por defecto, `row[key]`. */
	render?: (row: R) => ReactNode;
}

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
	className?: string;
}

/**
 * Tabla de datos en tarjeta con cabecera, columnas y pie opcional. Mínima: nada que no sea dato.
 * Si no cabe a lo ancho, se desplaza dentro de la tarjeta (también con teclado).
 */
export function Table<R = Record<string, unknown>>({
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
			</div>
			{footer ?? null}
		</div>
	);
}
