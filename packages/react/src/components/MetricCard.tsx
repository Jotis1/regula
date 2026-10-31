import { isValidElement, type ReactNode } from "react";
import { cx } from "../internal/cx.js";
import { defaultStrings } from "../internal/strings.js";
import { Button } from "./Button.js";
import { Icon } from "./Icon.js";

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
	className?: string;
}

/** Tarjeta con una cifra clave, su tendencia y el periodo de comparación. */
export function MetricCard({
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
				{menu === true ? (
					<Button
						hierarchy="tertiary"
						size="sm"
						iconOnly="dots-vertical"
						label={menuLabel ?? defaultStrings.moreOptions}
						onClick={onMenu}
					/>
				) : isValidElement(menu) ? (
					menu
				) : null}
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
							<Icon name={up ? "trend-up-01" : "trend-down-01"} size={20} />
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
