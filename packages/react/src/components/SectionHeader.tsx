import type { ReactNode } from "react";
import { cx } from "../internal/cx.js";
import { Line } from "../internal/line.js";

export interface SectionHeaderProps {
	/** Título de la sección (`<h2>`): `text-lg` semibold, `text-md` en `sm`. */
	title: ReactNode;
	/** Una frase en `text-tertiary` bajo el título. */
	description?: ReactNode;
	/** Botones a la derecha: la acción principal, la última. */
	actions?: ReactNode;
	/**
	 * Tamaño del título.
	 * @default "md"
	 */
	size?: "sm" | "md";
	/**
	 * Línea inferior en `border-secondary`.
	 * @default true
	 */
	divider?: boolean;
	/** Lo que va bajo el título, como unas `Tabs` o una búsqueda. */
	children?: ReactNode;
	/**
	 * Pestañas bajo el título, como unas `Tabs` de tipo `button-border` (las del Figma, `Section header`, `1214:38`). En
	 * pantallas estrechas pasan bajo las acciones.
	 */
	tabs?: ReactNode;
	/** Búsqueda a la derecha, como un `Input` con la lupa y el atajo. En estrecho, a todo el ancho bajo el título. */
	search?: ReactNode;
	/** Grupo de botones a la derecha, como un `ButtonGroup` de periodos. */
	buttonGroup?: ReactNode;
	/** Menú de la sección a la derecha del todo, como un `Button` de tres puntos o un `Dropdown`. */
	menu?: ReactNode;
	className?: string;
}

/** Cabecera de una sección dentro de una página: título, descripción, acciones y línea. */
export function SectionHeader(props: SectionHeaderProps) {
	const { tabs, search, buttonGroup, menu } = props;
	return tabs || search || buttonGroup || menu ? (
		<TypedSectionHeader {...props} />
	) : (
		<ClassicSectionHeader {...props} />
	);
}

/** La de siempre: su HTML no cambia. */
function ClassicSectionHeader({
	title,
	description,
	actions,
	size = "md",
	divider = true,
	children,
	className,
}: SectionHeaderProps) {
	return (
		<div className={cx("flex flex-col gap-5 font-body", className)}>
			<div className="flex flex-wrap items-start gap-4">
				<div className="min-w-0 flex-1">
					<h2
						className={cx(
							"m-0 font-semibold text-primary",
							size === "sm" ? "text-md" : "text-lg",
						)}
					>
						{title}
					</h2>
					{description ? <p className="mt-0.5 mb-0 text-sm text-tertiary">{description}</p> : null}
				</div>
				{actions ? <div className="flex flex-wrap items-center gap-3">{actions}</div> : null}
			</div>
			{children ?? null}
			{divider ? <Line /> : null}
		</div>
	);
}

function TypedSectionHeader({
	title,
	description,
	actions,
	size = "md",
	divider = true,
	children,
	tabs,
	search,
	buttonGroup,
	menu,
	className,
}: SectionHeaderProps) {
	return (
		<div className={cx("@container flex flex-col gap-4 font-body", className)}>
			{/* Rejilla: en ancho, título, controles y menú en una fila; en estrecho, el menú junto al título y los controles debajo */}
			<div
				className={cx(
					"grid grid-cols-[minmax(0,1fr)_auto] items-start gap-x-4 gap-y-4",
					menu && "@md:grid-cols-[minmax(0,1fr)_auto_auto]",
				)}
			>
				<div className="col-start-1 row-start-1 min-w-0">
					<h2
						className={cx(
							"m-0 font-semibold text-primary",
							size === "sm" ? "text-md" : "text-lg",
						)}
					>
						{title}
					</h2>
					{description ? <p className="mt-0.5 mb-0 text-sm text-tertiary">{description}</p> : null}
				</div>
				{search || buttonGroup || actions ? (
					<div className="col-span-2 row-start-2 flex flex-wrap items-center gap-3 @md:col-span-1 @md:col-start-2 @md:row-start-1">
						{search ? <div className="w-80 max-w-full @max-md:w-full">{search}</div> : null}
						{buttonGroup}
						{actions}
					</div>
				) : null}
				{menu ? <div className="col-start-2 row-start-1 flex @md:col-start-3">{menu}</div> : null}
			</div>
			{tabs ? <div className="min-w-0 overflow-x-auto">{tabs}</div> : null}
			{children ?? null}
			{divider ? <Line /> : null}
		</div>
	);
}
