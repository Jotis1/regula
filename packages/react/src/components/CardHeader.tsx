import { isValidElement, type ReactNode } from "react";
import { cx } from "../internal/cx.js";
import { Line } from "../internal/line.js";
import { defaultStrings } from "../internal/strings.js";
import { Avatar, type AvatarProps } from "./Avatar.js";
import { Badge, type BadgeColor } from "./Badge.js";
import { Button } from "./Button.js";

export interface CardHeaderProps {
	/** Título de la tarjeta (`<h3>`, `text-lg` semibold). */
	title: ReactNode;
	/** Insignia junto al título, como "12 activas". */
	badge?: ReactNode;
	/**
	 * Color de la insignia.
	 * @default "brand"
	 */
	badgeColor?: BadgeColor;
	/** Una frase en `text-tertiary` bajo el título. */
	description?: ReactNode;
	/** Botones a la derecha: la acción principal, la última. */
	actions?: ReactNode;
	/**
	 * Menú de la tarjeta: `true` pinta el botón de tres puntos (con `onMenu`); también admite un nodo, como un
	 * `Dropdown` con `trigger` (ampliación sobre la guía, como en `MetricCard`).
	 */
	menu?: boolean | ReactNode;
	/** Al pulsar el botón de tres puntos. */
	onMenu?: () => void;
	/** Nombre del botón de tres puntos. @default "Más opciones" */
	menuLabel?: string;
	/** Avatar de 48px a la izquierda, para fichas de persona (props de `Avatar`). */
	avatar?: AvatarProps;
	className?: string;
}

/** Cabecera de una tarjeta: título con insignia opcional, descripción, acciones y menú, con línea inferior. */
export function CardHeader({
	title,
	badge,
	badgeColor = "brand",
	description,
	actions,
	menu,
	onMenu,
	menuLabel,
	avatar,
	className,
}: CardHeaderProps) {
	return (
		<div className={cx("flex flex-col gap-5 bg-primary font-body", className)}>
			<div className="flex items-start gap-4 px-6 pt-5">
				{avatar ? <Avatar size="lg" {...avatar} /> : null}
				<div className="flex min-w-0 flex-1 flex-col gap-0.5">
					<h3 className="m-0 flex items-center gap-2 text-lg font-semibold text-primary">
						{title}
						{badge != null ? (
							<Badge size="sm" color={badgeColor}>
								{badge}
							</Badge>
						) : null}
					</h3>
					{description ? <p className="m-0 text-sm text-tertiary">{description}</p> : null}
				</div>
				{actions ? <div className="flex flex-wrap items-center gap-3">{actions}</div> : null}
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
			<Line />
		</div>
	);
}
