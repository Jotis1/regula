import type { CSSProperties } from "react";
import {
	type AppIconHue,
	type AppIconShape,
	type AppIconVariant,
	type AppName,
	appIcon,
	apps,
} from "../app-icon/index.js";

export type { AppIconHue, AppIconShape, AppIconVariant, AppName };

/** Apps de la suite con su nombre, letras y tono. */
export const appIcons = apps;

export interface AppIconProps {
	/** App de la suite. Para una nueva, `letters` + `hue`. */
	app?: AppName;
	/** Dos letras: mayúscula + minúscula. */
	letters?: string;
	/** Tono de la paleta para una app nueva. Nunca rojo, amarillo ni grises. */
	hue?: AppIconHue;
	/** Por debajo de 20px, si no lo pasas, sale `solid`. */
	variant?: AppIconVariant;
	/** Lado en px. Por defecto, 48. La virgulilla solo se dibuja desde 32px. */
	size?: number;
	/** `square` para el icono maskable de PWA. */
	shape?: AppIconShape;
	/** Fuerza o quita la virgulilla. */
	tilde?: boolean;
	/** Nombre accesible. Por defecto, el de la app. */
	label?: string;
	className?: string;
	style?: CSSProperties;
}

/** Icono de una app de la suite: baldosa con dos letras en curvas y la virgulilla, en el tono de la app. */
export function AppIcon({ size = 48, className, style, ...options }: AppIconProps) {
	const { label, parts } = appIcon({ ...options, size });
	return (
		<svg
			width={size}
			height={size}
			viewBox="0 0 128 128"
			role="img"
			aria-label={label}
			className={className}
			style={style}
		>
			{parts.map((p, i) => (
				<path
					// biome-ignore lint/suspicious/noArrayIndexKey: las piezas tienen un orden fijo
					key={i}
					d={p.d}
					fill={p.fill}
					stroke={p.stroke}
					strokeWidth={p.strokeWidth}
					strokeLinecap={p.strokeLinecap}
					vectorEffect={p.vectorEffect}
				/>
			))}
		</svg>
	);
}
