import { DotsVertical, TrendDown01, TrendUp01 } from "@untitledui/icons";
import { isValidElement, type ReactNode } from "react";
import { cx } from "../internal/cx.js";
import { DynIcon, type IconProp } from "../internal/icon.js";
import { defaultStrings } from "../internal/strings.js";
import { Button } from "./Button.js";
import { FeaturedIcon } from "./FeaturedIcon.js";

/**
 * Estilos de icono del Figma (`Metric item`, `1560:266217`): `featured` (círculo de color encima de la etiqueta),
 * `featured-inline` (círculo de marca junto al título), `modern` (cuadro blanco con filo encima) y `modern-inline`
 * (cuadro junto a la etiqueta y la cifra).
 */
export type MetricCardIconStyle = "featured" | "featured-inline" | "modern" | "modern-inline";

/**
 * Estilos de gráfica: `sparkline` (pequeña a la derecha de la cifra), `area` (área suave a la derecha, con el icono
 * en el título), `line` (línea a todo el ancho bajo la cifra) y `header` (como `line`, con el título en una banda).
 */
export type MetricCardChartStyle = "sparkline" | "area" | "line" | "header";

export interface MetricCardProps {
	label: ReactNode;
	/** La cifra, en Bricolage Grotesque 36/44 semibold. */
	value: ReactNode;
	/** Cambio frente al periodo anterior, como "12%". */
	change?: ReactNode;
	/**
	 * Sube (`text-success-primary`, flecha arriba) o baja (`text-error-primary`, flecha abajo): siempre con flecha,
	 * nunca solo color.
	 * @default "up"
	 */
	trend?: "up" | "down";
	/** Periodo de comparación, como "vs. septiembre". */
	period?: ReactNode;
	/**
	 * Menú de la tarjeta: `true` pinta el botón de tres puntos (con `onMenu`); también admite un nodo, como un
	 * `Dropdown` con `trigger` (ampliación sobre la guía).
	 */
	menu?: boolean | ReactNode;
	/** Al pulsar el botón de tres puntos (ampliación sobre la guía). */
	onMenu?: () => void;
	/** Nombre del botón de tres puntos. @default "Más opciones" */
	menuLabel?: string;
	/** Icono de la métrica, con el estilo de `iconStyle`. */
	icon?: IconProp;
	/** @default "featured" */
	iconStyle?: MetricCardIconStyle;
	/** Valores de la mini gráfica, sin ejes. Va en el color del `trend`. */
	chart?: number[];
	/** @default "sparkline" */
	chartStyle?: MetricCardChartStyle;
	/** El cambio como insignia (`↗ 100%` con borde), como en las tarjetas simples del Figma. */
	changeBadge?: boolean;
	/** Pie bajo una raya: un enlace «Ver informe» o un botón con ajustes. */
	footer?: ReactNode;
	className?: string;
}

/** Puntos de la mini gráfica en una caja de `w`×`h`, con un margen para el trazo. */
function sparkPath(data: number[], w: number, h: number) {
	const min = Math.min(...data);
	const max = Math.max(...data);
	const span = max - min || 1;
	const pts = data.map((v, i) => [
		data.length === 1 ? w / 2 : (i / (data.length - 1)) * w,
		2 + (1 - (v - min) / span) * (h - 4),
	]);
	const line = pts
		.map(([x, y], i) => `${i ? "L" : "M"}${(x as number).toFixed(1)} ${(y as number).toFixed(1)}`)
		.join(" ");
	return { line, area: `${line} L${w} ${h} L0 ${h} Z` };
}

function MiniChart({ data, up, wide }: { data: number[]; up: boolean; wide?: boolean }) {
	const w = wide ? 320 : 112;
	const h = wide ? 64 : 56;
	const { line, area } = sparkPath(data, w, h);
	const color = up ? "var(--fg-success-secondary)" : "var(--fg-error-secondary)";
	return (
		<svg
			viewBox={`0 0 ${w} ${h}`}
			preserveAspectRatio="none"
			aria-hidden="true"
			className={cx("block flex-none overflow-visible", wide ? "h-16 w-full" : "h-14 w-28")}
		>
			<path d={area} fill={color} opacity={0.12} />
			<path
				d={line}
				fill="none"
				stroke={color}
				strokeWidth={2}
				strokeLinejoin="round"
				vectorEffect="non-scaling-stroke"
			/>
		</svg>
	);
}

/** Tarjeta con una cifra clave, su tendencia y el periodo de comparación. */
export function MetricCard(props: MetricCardProps) {
	const { icon, chart, changeBadge, footer } = props;
	return icon || chart?.length || changeBadge || footer ? (
		<TypedMetricCard {...props} />
	) : (
		<ClassicMetricCard {...props} />
	);
}

function MenuButton({ menu, onMenu, menuLabel }: Pick<MetricCardProps, "menu" | "onMenu" | "menuLabel">) {
	return menu === true ? (
		<Button
			hierarchy="tertiary"
			size="sm"
			iconOnly={DotsVertical}
			label={menuLabel ?? defaultStrings.moreOptions}
			onClick={onMenu}
		/>
	) : isValidElement(menu) ? (
		menu
	) : null;
}

/** La de siempre: su HTML no cambia. */
function ClassicMetricCard({
	label,
	value,
	change,
	trend = "up",
	period,
	menu,
	onMenu,
	menuLabel,
	className,
}: MetricCardProps) {
	const up = trend !== "down";
	return (
		<div
			className={cx(
				"flex flex-col gap-5 rounded-xl bg-primary px-6 py-5 font-body shadow-[var(--shadow-xs),inset_0_0_0_1px_var(--border-secondary)]",
				className,
			)}
		>
			<div className="flex items-center justify-between text-md font-semibold text-primary">
				{label}
				<MenuButton menu={menu} onMenu={onMenu} menuLabel={menuLabel} />
			</div>
			<div>
				<div className="font-display text-display-md font-semibold text-primary">{value}</div>
				{change ? (
					<div className="flex items-center gap-2 text-sm font-medium text-tertiary">
						<span
							className={cx(
								"inline-flex items-center gap-1 font-medium",
								up ? "text-success-primary" : "text-error-primary",
							)}
						>
							<DynIcon icon={up ? TrendUp01 : TrendDown01} size={20} />
							<span className="sr-only">
								{up ? defaultStrings.rising : defaultStrings.falling}{" "}
							</span>
							{change}
						</span>
						{period ?? null}
					</div>
				) : null}
			</div>
		</div>
	);
}

function Change({
	change,
	up,
	period,
	badge,
}: {
	change: ReactNode;
	up: boolean;
	period?: ReactNode;
	badge?: boolean;
}) {
	return (
		<span className="inline-flex flex-wrap items-center gap-2 text-sm font-medium text-tertiary">
			<span
				className={cx(
					"inline-flex items-center gap-1 font-medium",
					up ? "text-success-primary" : "text-error-primary",
					badge &&
						"rounded-md bg-primary px-1.5 py-0.5 text-xs text-secondary shadow-[inset_0_0_0_1px_var(--border-primary)]",
				)}
			>
				<span
					className={cx(
						"inline-flex",
						badge && (up ? "text-fg-success-secondary" : "text-fg-error-secondary"),
					)}
				>
					<DynIcon icon={up ? TrendUp01 : TrendDown01} size={badge ? 12 : 16} />
				</span>
				<span className="sr-only">{up ? defaultStrings.rising : defaultStrings.falling} </span>
				{change}
			</span>
			{period ?? null}
		</span>
	);
}

function TypedMetricCard({
	label,
	value,
	change,
	trend = "up",
	period,
	menu,
	onMenu,
	menuLabel,
	icon,
	iconStyle = "featured",
	chart,
	chartStyle = "sparkline",
	changeBadge,
	footer,
	className,
}: MetricCardProps) {
	const up = trend !== "down";
	const hasChart = !!chart?.length;
	const inline = iconStyle === "featured-inline";
	const modernInline = iconStyle === "modern-inline";
	const header = hasChart && chartStyle === "header";
	const iconNode = icon ? (
		<FeaturedIcon
			icon={icon}
			size="md"
			variant={iconStyle === "modern" || modernInline ? "modern" : "light"}
			color={inline ? "brand" : iconStyle === "featured" ? (up ? "success" : "error") : "gray"}
		/>
	) : null;
	const changeNode = change ? <Change change={change} up={up} period={period} badge={changeBadge} /> : null;
	const titleStrong = inline || (hasChart && chartStyle !== "line");
	const labelNode = (
		<span
			className={cx(
				"min-w-0",
				titleStrong ? "text-md font-semibold text-primary" : "text-sm font-medium text-tertiary",
			)}
		>
			{label}
		</span>
	);
	const valueNode = (
		<span className="font-display text-display-sm font-semibold text-primary">{value}</span>
	);

	let top: ReactNode;
	let middle: ReactNode;
	if (hasChart && (chartStyle === "line" || chartStyle === "header")) {
		top = header ? null : (
			<div className="flex items-start justify-between gap-2">
				{labelNode}
				<MenuButton menu={menu} onMenu={onMenu} menuLabel={menuLabel} />
			</div>
		);
		middle = (
			<div className="flex flex-col gap-3">
				<div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
					{valueNode}
					{changeNode}
				</div>
				<MiniChart data={chart} up={up} wide />
			</div>
		);
	} else if (hasChart) {
		top = (
			<div className="flex items-center justify-between gap-2">
				<span className="flex min-w-0 items-center gap-3">
					{chartStyle === "area" ? iconNode : null}
					{labelNode}
				</span>
				<MenuButton menu={menu} onMenu={onMenu} menuLabel={menuLabel} />
			</div>
		);
		middle = (
			<div className="flex items-end justify-between gap-4">
				<div
					className={cx(
						"flex min-w-0",
						chartStyle === "area" ? "flex-wrap items-baseline gap-x-2" : "flex-col gap-2",
					)}
				>
					{valueNode}
					{changeNode}
				</div>
				<MiniChart data={chart} up={up} />
			</div>
		);
	} else if (inline) {
		top = (
			<div className="flex items-center justify-between gap-2">
				<span className="flex min-w-0 items-center gap-3">
					{iconNode}
					{labelNode}
				</span>
				<MenuButton menu={menu} onMenu={onMenu} menuLabel={menuLabel} />
			</div>
		);
		middle = (
			<div className="flex flex-col gap-2">
				{valueNode}
				{changeNode}
			</div>
		);
	} else if (modernInline) {
		top = null;
		middle = (
			<div className="flex items-start gap-3">
				{iconNode}
				<div className="flex min-w-0 flex-1 flex-col">
					<span className="flex items-start justify-between gap-2">
						{labelNode}
						<MenuButton menu={menu} onMenu={onMenu} menuLabel={menuLabel} />
					</span>
					<span className="flex flex-wrap items-center justify-between gap-2">
						{valueNode}
						{changeNode}
					</span>
				</div>
			</div>
		);
	} else {
		top = icon ? (
			<div className="flex items-start justify-between gap-2">
				{iconNode}
				<MenuButton menu={menu} onMenu={onMenu} menuLabel={menuLabel} />
			</div>
		) : null;
		middle = (
			<div className="flex flex-col gap-1">
				<span className="flex items-start justify-between gap-2">
					{labelNode}
					{icon ? null : <MenuButton menu={menu} onMenu={onMenu} menuLabel={menuLabel} />}
				</span>
				<span className="flex flex-wrap items-center justify-between gap-2">
					{valueNode}
					{changeNode}
				</span>
			</div>
		);
	}

	return (
		<div
			className={cx(
				// Borde de verdad y no sombra interior: los hijos con fondo taparían la sombra
				"flex flex-col overflow-hidden rounded-xl border border-solid border-secondary bg-primary font-body shadow-xs",
				header && "bg-secondary",
				className,
			)}
		>
			{header ? (
				<div className="flex items-center justify-between gap-2 px-5 py-2.5">
					{labelNode}
					<MenuButton menu={menu} onMenu={onMenu} menuLabel={menuLabel} />
				</div>
			) : null}
			<div
				className={cx(
					"flex flex-1 flex-col gap-4 px-5 py-5",
					header && "-mx-px -mb-px rounded-xl border border-solid border-secondary bg-primary",
				)}
			>
				{top}
				{middle}
			</div>
			{footer ? (
				<div className="flex items-center justify-between gap-3 px-5 py-3 shadow-[inset_0_1px_0_var(--border-secondary)]">
					{footer}
				</div>
			) : null}
		</div>
	);
}
