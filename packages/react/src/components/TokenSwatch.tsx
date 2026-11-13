"use client";

import { useCopy } from "../hooks/use-copy.js";
import { cx } from "../internal/cx.js";
import { defaultStrings } from "../internal/strings.js";

export type TokenSwatchLayout = "row" | "card";

export interface TokenSwatchProps {
	/** El nombre del token («text-primary»). */
	name: string;
	/** Valor claro, en hexadecimal de seis cifras con su almohadilla. */
	light: string;
	/** Valor oscuro, en hexadecimal de seis cifras con su almohadilla. */
	dark: string;
	/** Para qué sirve el token. */
	usage?: string;
	/** La utilidad de Tailwind que se copia al pulsarla («text-primary»). Sin ella no hay botón. */
	utility?: string;
	/**
	 * `row` va en una línea, pensada para una celda de `Table`; `card` apila nombre, muestras, utilidad y uso en una tarjeta.
	 * @default "row"
	 */
	layout?: TokenSwatchLayout;
	/** Avisa tras copiar la utilidad, con lo copiado y si el portapapeles lo aceptó. */
	onCopy?: (utility: string, ok: boolean) => void;
	/** Nombres accesibles de las dos muestras. Por defecto, «Tema claro» y «Tema oscuro». */
	labels?: { light?: string; dark?: string };
	className?: string;
}

// Filo de cada muestra: el `border-primary` de SU tema (packages/tokens/src/tokens.json), no el de la página, para que se
// distinga de su propio color y de cualquier fondo. Un test los compara con los tokens.
const EDGE = {
	// color-fijo: el filo es el border-primary claro, valor del token, sea cual sea el tema de la página
	light: "#d4d4d4",
	// color-fijo: el filo es el border-primary oscuro, valor del token, sea cual sea el tema de la página
	dark: "#404040",
} as const;

const SIZE: Record<TokenSwatchLayout, string> = { row: "size-5", card: "size-6" };

/**
 * Un token de color con sus dos valores a la vez, cada uno con su muestra y su hexadecimal, y su utilidad lista para
 * copiar. Las muestras llevan sus colores y su filo en línea: se ven igual en una página clara que en una oscura.
 * Monta un `CopyTooltip` en la página para que la copia avise.
 */
export function TokenSwatch({
	name,
	light,
	dark,
	usage,
	utility,
	layout = "row",
	onCopy,
	labels,
	className,
}: TokenSwatchProps) {
	const copy = useCopy();
	const t = { light: defaultStrings.themeLight, dark: defaultStrings.themeDark, ...labels };
	const card = layout === "card";

	const swatch = (theme: "light" | "dark", value: string, label: string) => (
		<span className="inline-flex items-center gap-2" data-theme-swatch={theme}>
			<span
				aria-hidden="true"
				className={cx("shrink-0 rounded-md", SIZE[layout])}
				style={{ backgroundColor: value, boxShadow: `inset 0 0 0 1px ${EDGE[theme]}` }}
			/>
			<span className="font-mono text-xs text-tertiary">
				<span className="sr-only">{label}: </span>
				{value}
			</span>
		</span>
	);

	return (
		<div
			data-layout={layout}
			className={cx(
				card
					? "flex flex-col items-start gap-3 rounded-xl border border-secondary bg-primary p-4"
					: "flex flex-wrap items-center gap-x-4 gap-y-2",
				className,
			)}
		>
			<span className="text-sm font-semibold text-primary">{name}</span>
			<div className={cx("flex items-center gap-4", card && "flex-wrap")}>
				{swatch("light", light, t.light)}
				{swatch("dark", dark, t.dark)}
			</div>
			{utility ? (
				<button
					type="button"
					onClick={(event) => {
						const target = event.currentTarget;
						void copy(utility, target).then((ok) => onCopy?.(utility, ok));
					}}
					className="rounded-sm bg-secondary px-1.5 py-0.5 font-mono text-xs text-secondary outline-none hover:bg-secondary_hover focus-visible:shadow-focus-ring"
				>
					{utility}
				</button>
			) : null}
			{usage ? <p className="text-sm text-tertiary">{usage}</p> : null}
		</div>
	);
}
