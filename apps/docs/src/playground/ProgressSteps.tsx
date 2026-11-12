// ProgressSteps en el ejemplo interactivo: un fichero por componente para que cada página cargue solo el suyo (design D4).
// `onChange` y `children` son funciones y no cruzan de Astro: aquí se eligen como valores preparados («Navegable»,
// «Contenido del paso») y este envoltorio los convierte en un asistente que guarda el paso actual, como haría una app.
import { ProgressSteps, type ProgressStepsProps } from "@jotis-me/react";
import { useState } from "react";
import type { Tweak } from "../lib/playground";

export default function ProgressStepsPlayground({
	onChange,
	children,
	current,
	...rest
}: Omit<ProgressStepsProps, "onChange" | "children"> & { onChange?: unknown; children?: unknown }) {
	const [picked, setPicked] = useState<{ from: number; to: number }>();
	// Mover el control `current` manda sobre lo pulsado
	const shown = picked?.from === current ? picked.to : current;
	const navigable = onChange != null;
	return (
		<ProgressSteps
			{...rest}
			current={navigable ? shown : current}
			onChange={navigable ? (to) => setPicked({ from: current, to }) : undefined}
		>
			{children != null
				? (i) => <p className="m-0 mt-1 text-sm text-tertiary">Contenido del paso {i + 1}</p>
				: undefined}
		</ProgressSteps>
	);
}

export const tweaks: Record<string, Tweak> = {
	onChange: {
		kind: "content",
		options: [
			{
				label: "Navegable",
				value: true,
				code: "(index) => setCurrent(index)",
			},
		],
	},
	children: {
		kind: "content",
		options: [
			{
				label: "Contenido del paso",
				value: true,
				code: "{(index) => <p>Contenido del paso {index + 1}</p>}",
			},
		],
	},
};
