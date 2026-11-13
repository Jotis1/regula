// Isla de la página de prueba de ProgressSteps navegable (`/visual/progress-steps-nav/`): los cinco tipos en las dos
// orientaciones con `onChange` y pasos con descripción, para pasar axe con `label-content-name-mismatch` (WCAG 2.5.3).
import { ProgressSteps, type ProgressStepsOrientation, type ProgressStepsType } from "@jotis-me/react";
import { useState } from "react";

const STEPS = [
	{ title: "Tus datos", description: "Nombre y correo" },
	{ title: "Tu empresa", description: "Web y ubicación" },
	{ title: "Tu equipo", description: "Empieza a colaborar" },
	{ title: "Tus redes", description: "Publicación automática" },
];
const TYPES: ProgressStepsType[] = [
	"icons-centered",
	"icons-text",
	"text-line",
	"minimal",
	"minimal-connected",
];
const ORIENTATIONS: ProgressStepsOrientation[] = ["horizontal", "vertical"];

export default function ProgressStepsNavTest() {
	const [current, setCurrent] = useState(1);
	return (
		<div className="flex flex-col gap-10">
			{TYPES.flatMap((type) =>
				ORIENTATIONS.map((orientation) => (
					<ProgressSteps
						key={`${type}-${orientation}`}
						aria-label={`${type} ${orientation}`}
						steps={STEPS}
						current={current}
						type={type}
						orientation={orientation}
						onChange={setCurrent}
					/>
				)),
			)}
		</div>
	);
}
