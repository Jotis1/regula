// Tabla de props de un componente, leída de sus tipos en el build (react-docgen-typescript).
import { join } from "node:path";
import { withCustomConfig } from "react-docgen-typescript";

export interface PropRow {
	name: string;
	type: string;
	required: boolean;
	defaultValue?: string;
	description: string;
}

// Ruta desde la carpeta del build (apps/docs): import.meta.url apunta a dist/ una vez empaquetado
const parser = withCustomConfig(join(process.cwd(), "tsconfig.json"), {
	shouldExtractLiteralValuesFromEnum: true,
	shouldRemoveUndefinedFromOptional: true,
	savePropValueAsString: true,
	// Solo las props propias: las heredadas de HTML/React se documentan aparte
	propFilter: (prop) => !prop.parent || !/node_modules/.test(prop.parent.fileName),
});

/** Props del componente exportado `name` en `file`, en el orden en que se declaran. */
export function propsOf(file: string, name: string): PropRow[] {
	const doc = parser.parse(file).find((d) => d.displayName === name);
	if (!doc) throw new Error(`No encuentro el componente ${name} en ${file}`);
	return Object.values(doc.props).map((p) => {
		const values = p.type.name === "enum" ? (p.type.value as { value: string }[] | undefined) : undefined;
		return {
			name: p.name,
			type: values ? values.map((v) => v.value).join(" · ") : p.type.name,
			required: p.required,
			defaultValue: p.defaultValue?.value === undefined ? undefined : String(p.defaultValue.value),
			description: p.description,
		};
	});
}
