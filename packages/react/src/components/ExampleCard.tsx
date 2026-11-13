import { Check, XClose } from "@untitledui/icons";
import type { ReactNode } from "react";
import { cx } from "../internal/cx.js";
import { defaultStrings } from "../internal/strings.js";
import { Badge } from "./Badge.js";
import { TransparencyGrid, type TransparencyGridSize } from "./TransparencyGrid.js";

export type ExampleCardVerdict = "do" | "dont" | "instead" | "better";

export interface ExampleCardProps {
	/** El veredicto, como palabra e icono: «Esto sí», «Esto no», «En lugar de» o «Mejor». */
	verdict: ExampleCardVerdict;
	/** El texto que explica el ejemplo, junto al veredicto. */
	caption: ReactNode;
	/** El espécimen: lo que se enseña sobre el damero. Es interactivo salvo que le pongas `inert`. */
	children?: ReactNode;
	/**
	 * Alto mínimo del espécimen, en px.
	 * @default 168
	 */
	minHeight?: number;
	/**
	 * Tamaño del damero (`sm` o `md`), o `false` para un fondo liso.
	 * @default "sm"
	 */
	grid?: TransparencyGridSize | false;
	className?: string;
}

const GOOD = new Set<ExampleCardVerdict>(["do", "better"]);

const WORD: Record<ExampleCardVerdict, string> = {
	do: defaultStrings.exampleDo,
	dont: defaultStrings.exampleDont,
	instead: defaultStrings.exampleInstead,
	better: defaultStrings.exampleBetter,
};

const SPECIMEN = "flex flex-1 items-center justify-center p-6";

/**
 * Tarjeta de ejemplo para enseñar un uso bueno o malo: el espécimen sobre el damero de transparencia y, debajo, un
 * veredicto con palabra e icono (nunca solo el color) y su texto. Es una `<figure>` con su `<figcaption>` y se pinta
 * en el servidor.
 */
export function ExampleCard({
	verdict,
	caption,
	children,
	minHeight = 168,
	grid = "sm",
	className,
}: ExampleCardProps) {
	const good = GOOD.has(verdict);
	return (
		<figure
			className={cx(
				"m-0 flex flex-col overflow-hidden rounded-xl border border-secondary bg-primary font-body",
				className,
			)}
		>
			{grid ? (
				<TransparencyGrid size={grid} className={SPECIMEN} style={{ minHeight }}>
					{children}
				</TransparencyGrid>
			) : (
				<div className={cx(SPECIMEN, "bg-primary")} style={{ minHeight }}>
					{children}
				</div>
			)}
			<figcaption className="flex items-start gap-3 border-t border-secondary px-4 py-3 text-sm text-tertiary">
				<Badge color={good ? "success" : "error"} icon={good ? Check : XClose} className="shrink-0">
					{WORD[verdict]}
				</Badge>
				<span className="min-w-0">{caption}</span>
			</figcaption>
		</figure>
	);
}
