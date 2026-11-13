// Los especímenes de una tarjeta de ejemplo de la página de componente, pintados desde los datos del arranque
// (`examples` en src/lib/starts/). Se pinta siempre en el servidor, sin `client:*`: por eso puede importar el paquete
// entero sin que pese en la página. Va `inert`: enseña cómo queda, no hace nada, y así sus botones no suman paradas de
// tabulador ni sus avisos se anuncian.
import * as Regula from "@jotis-me/react";
import { type ComponentType, createElement, type ReactNode } from "react";
import type { ExampleSide, Specimen } from "../lib/playground";
import { resolveIcons } from "../lib/playground-icons";

const COMPONENTS = Regula as unknown as Record<string, ComponentType<Record<string, unknown>>>;

const isSpecimen = (v: unknown): v is Specimen =>
	typeof v === "object" && v !== null && typeof (v as Specimen).component === "string";

/** Una prop tal cual, o el nodo que describe si es un espécimen o una lista de ellos (`actions`). */
function propOf(value: unknown, fallback: string): unknown {
	if (isSpecimen(value)) return nodeOf(value, fallback);
	if (Array.isArray(value) && value.length > 0 && value.every(isSpecimen))
		return value.map((v, i) => nodeOf(v, fallback, i));
	return value;
}

function nodeOf(specimen: Specimen, fallback: string, key?: number): ReactNode {
	const Component = COMPONENTS[specimen.component ?? fallback];
	if (!Component) return null;
	const props = Object.fromEntries(
		Object.entries(resolveIcons(specimen.props ?? {})).map(([k, v]) => [k, propOf(v, fallback)]),
	);
	return createElement(Component, { key, ...props }, specimen.children);
}

interface Props {
	/** El componente de la página: el de los especímenes que no dicen otro. */
	name: string;
	side: ExampleSide;
}

export default function Specimens({ name, side }: Props) {
	const { specimens, width, frame } = side;
	return (
		<div
			inert
			className={
				frame
					? "relative w-full overflow-hidden rounded-lg"
					: "flex w-full flex-wrap items-center justify-center gap-3"
			}
			style={frame ? { height: frame } : undefined}
		>
			{specimens.map((s, i) =>
				width ? (
					// biome-ignore lint/suspicious/noArrayIndexKey: lista fija, sin reordenar
					<div key={i} className="w-full" style={{ maxWidth: width }}>
						{nodeOf(s, name)}
					</div>
				) : (
					nodeOf(s, name, i)
				),
			)}
		</div>
	);
}
