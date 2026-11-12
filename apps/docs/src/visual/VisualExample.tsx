// Isla del ejemplo de un componente (página del componente, /visual/ y vistas previas). Carga solo el fichero de
// src/visual/examples/ que lo exporta, no el registro entero: cada fichero es su propio trozo de JS (design D11).
// El servidor espera al `lazy` y pinta el mismo HTML que antes.
import { type ComponentType, type LazyExoticComponent, lazy, Suspense } from "react";
import { EXAMPLE_FILES } from "./example-files";

const files = import.meta.glob<Record<string, ComponentType>>("./examples/*.tsx");

// Un `lazy` por nombre, creado una vez: si se crease en cada render, React volvería a suspender sin fin
const cache = new Map<string, LazyExoticComponent<ComponentType>>();

function exampleOf(name: string) {
	const file = EXAMPLE_FILES[name];
	const load = file ? files[`./examples/${file}.tsx`] : undefined;
	if (!load) return undefined;
	let Example = cache.get(name);
	if (!Example) {
		Example = lazy(async () => {
			const mod = await load();
			const component = mod[`${name}Example`];
			if (!component) throw new Error(`${file}.tsx no exporta ${name}Example`);
			return { default: component };
		});
		cache.set(name, Example);
	}
	return Example;
}

export default function VisualExample({ name }: { name: string }) {
	const Example = exampleOf(name);
	return Example ? (
		<Suspense fallback={null}>
			<Example />
		</Suspense>
	) : null;
}
