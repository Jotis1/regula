// Tabla de props de un componente, leída de sus tipos en el build (react-docgen-typescript).
import { join } from "node:path";
import { type ComponentDoc, type PropItem, withCustomConfig } from "react-docgen-typescript";

export interface PropRow {
	name: string;
	type: string;
	required: boolean;
	defaultValue?: string;
	description: string;
}

// Ruta desde la carpeta del build (apps/docs): import.meta.url apunta a dist/ una vez empaquetado.
// Sin `propFilter`: `propsOf` se queda con las props propias y `nativeOf` con las heredadas de HTML/React.
const parser = withCustomConfig(join(process.cwd(), "tsconfig.json"), {
	shouldExtractLiteralValuesFromEnum: true,
	shouldRemoveUndefinedFromOptional: true,
	savePropValueAsString: true,
});

// Analizar un archivo cuesta ~0,3 s: la ficha y el JSON piden props y atributos del mismo componente
const parsed = new Map<string, ComponentDoc[]>();
function docsOf(file: string): ComponentDoc[] {
	let docs = parsed.get(file);
	if (!docs) {
		docs = parser.parse(file);
		parsed.set(file, docs);
	}
	return docs;
}

const inheritedFrom = (p: PropItem) => !!p.parent && /node_modules/.test(p.parent.fileName);

export interface NativeTarget {
	/** Elemento HTML al que se reenvían los atributos; `null` si el tipo solo hereda los globales. */
	element: string | null;
	/** Atributos propios de ese elemento que acepta el tipo, por orden alfabético. */
	attributes: string[];
}

// Interfaces de React con los atributos propios de un elemento, en el orden en que se enseñan
const ELEMENT_OF: Record<string, string> = {
	ButtonHTMLAttributes: "button",
	AnchorHTMLAttributes: "a",
	InputHTMLAttributes: "input",
	TextareaHTMLAttributes: "textarea",
	SelectHTMLAttributes: "select",
	FormHTMLAttributes: "form",
	ImgHTMLAttributes: "img",
};
const ELEMENTS = Object.values(ELEMENT_OF);
// Globales (se nombran en bloque) y ref/key (no son atributos)
const GLOBAL = new Set(["HTMLAttributes", "AriaAttributes", "DOMAttributes"]);
const IGNORED = new Set(["RefAttributes", "Attributes"]);

/** Atributos nativos que el componente `name` de `file` reenvía, uno por elemento; `[]` si no hereda nada. */
export function nativeOf(file: string, name: string): NativeTarget[] {
	const doc = docsOf(file).find((d) => d.displayName === name);
	if (!doc) throw new Error(`No encuentro el componente ${name} en ${file}`);
	const byElement = new Map<string, Set<string>>();
	let inherits = false;
	for (const p of Object.values(doc.props)) {
		if (!inheritedFrom(p)) continue;
		const parent = (p.parent as { name: string }).name;
		if (IGNORED.has(parent)) continue;
		inherits = true;
		if (GLOBAL.has(parent)) continue;
		const element = ELEMENT_OF[parent];
		if (!element) {
			throw new Error(
				`${name} hereda de ${parent}: añádela a ELEMENT_OF en apps/docs/src/lib/props.ts`,
			);
		}
		byElement.set(element, (byElement.get(element) ?? new Set()).add(p.name));
	}
	if (!inherits) return [];
	if (byElement.size === 0) return [{ element: null, attributes: [] }];
	return ELEMENTS.filter((el) => byElement.has(el)).map((element) => ({
		element,
		attributes: [...(byElement.get(element) as Set<string>)].sort(),
	}));
}

/** Props del componente exportado `name` en `file`, en el orden en que se declaran. */
export function propsOf(file: string, name: string): PropRow[] {
	const doc = docsOf(file).find((d) => d.displayName === name);
	if (!doc) throw new Error(`No encuentro el componente ${name} en ${file}`);
	// Solo las props propias: las heredadas de HTML/React las cuenta `nativeOf`
	return Object.values(doc.props)
		.filter((p) => !inheritedFrom(p))
		.map((p) => {
			const values =
				p.type.name === "enum" ? (p.type.value as { value: string }[] | undefined) : undefined;
			return {
				name: p.name,
				type: values ? values.map((v) => v.value).join(" · ") : p.type.name,
				required: p.required,
				defaultValue: p.defaultValue?.value === undefined ? undefined : String(p.defaultValue.value),
				description: p.description,
			};
		});
}
