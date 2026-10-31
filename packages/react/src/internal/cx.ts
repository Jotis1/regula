import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// tailwind-merge tiene que saber qué nombres propios del tema son tamaños de texto y sombras;
// si no, trataría `text-display-sm` como un color y lo quitaría al juntarlo con `text-primary`.
const twMerge = extendTailwindMerge({
	extend: {
		theme: {
			text: [
				"display-xs",
				"display-sm",
				"display-md",
				"display-lg",
				"display-xl",
				"display-2xl",
				"code-sm",
				"code-xs",
			],
			shadow: ["xs-skeuomorphic", "focus-ring", "focus-ring-error"],
			font: ["body", "display", "mono"],
		},
	},
});

/** Junta clases y resuelve conflictos de Tailwind: la última gana, así el `className` del consumidor manda. */
export function cx(...inputs: ClassValue[]): string {
	return twMerge(clsx(inputs));
}
