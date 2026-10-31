// Isla de la página de comparación: recibe el nombre y pinta su ejemplo (Astro necesita un import estático).
import { visualExamples } from "./registry";

export default function VisualExample({ name }: { name: string }) {
	const Example = visualExamples[name];
	return Example ? <Example /> : null;
}
