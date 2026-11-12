import { HomeLine, Stars02, User01, Users01 } from "@untitledui/icons";
import type { ProgressStep, ProgressStepsProps } from "../../src/index.js";

export const STEPS: ProgressStep[] = [
	{ title: "Tus datos", description: "Nombre y correo", icon: User01 },
	{ title: "Tu empresa", description: "Web y ubicación", icon: HomeLine },
	{ title: "Tu equipo", description: "Empieza a colaborar", icon: Users01 },
	{ title: "Tus redes", description: "Publicación automática", icon: Stars02 },
];

/** Combinaciones cuyo HTML se guardó antes de añadir `onChange` y `children` (progress-steps-before.json). */
export const CASES = {
	iconsCentered: { steps: STEPS, current: 1, "aria-label": "Alta" },
	iconsCenteredVertical: {
		steps: STEPS,
		current: 1,
		orientation: "vertical",
		marker: "number",
		size: "sm",
	},
	iconsCenteredFeatured: { steps: STEPS, current: 2, marker: "featured" },
	iconsText: { steps: STEPS, current: 1, type: "icons-text" },
	textLine: { steps: STEPS, current: 1, type: "text-line" },
	textLineVertical: { steps: STEPS, current: 1, type: "text-line", orientation: "vertical" },
	minimal: { steps: STEPS, current: 2, type: "minimal", "aria-label": "Alta" },
	minimalConnected: { steps: STEPS, current: 1, type: "minimal-connected", marker: "number" },
	allComplete: { steps: STEPS, current: 9 },
} as const satisfies Record<string, Partial<ProgressStepsProps>>;
