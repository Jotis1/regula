// Pasa el código de `@jotis-me/icons` (iconos por nombre) a los componentes de `@untitledui/icons` (change
// adopt-untitled-ui-icons). Sirve también a las apps de la suite:
//   bun run scripts/migrate-icons.ts <ruta…> [--internal <ruta de internal/icon.js>]
// Cambia `icon="search-lg"` por `icon={SearchLg}`, `<Icon name="plus" />` por `<Plus />` y `IconRocket02` por `Rocket02`,
// y añade la importación. No toca lo que no reconoce: revisa el diff y deja que `tsc` marque lo que falte.
import { readFileSync, writeFileSync } from "node:fs";

export const pascal = (kebab: string) =>
	kebab
		.split("-")
		.map((p) => p.charAt(0).toUpperCase() + p.slice(1))
		.join("");

const PROPS = "icon|iconLeading|iconTrailing|iconOnly|trailing";

/** Reescribe un fichero; devuelve el texto nuevo o `undefined` si no hay nada que cambiar. */
export function migrate(source: string, opts: { slotImport?: string } = {}): string | undefined {
	let text = source;
	const used = new Map<string, string>(); // kebab → identificador local
	const taken = new Set<string>();
	for (const m of text.matchAll(/\b(?:function|const|let|class|interface|type|enum)\s+([A-Z]\w*)/g))
		taken.add(m[1] as string);
	for (const m of text.matchAll(/import\s+(?:type\s+)?\{([^}]*)\}/g))
		for (const part of (m[1] as string).split(",")) {
			const name = part
				.trim()
				.replace(/^type\s+/, "")
				.split(/\s+as\s+/)
				.pop();
			if (name) taken.add(name);
		}
	const id = (kebab: string) => {
		let local = used.get(kebab);
		if (!local) {
			const base = pascal(kebab);
			local = taken.has(base) ? `${base}Icon` : base;
			used.set(kebab, local);
		}
		return local;
	};
	const extra = new Set<string>(); // importaciones del módulo interno
	const aliases: [string, string][] = []; // IconXxx → Xxx

	// 1. Los componentes sueltos de @jotis-me/icons: `import { IconRocket02 } from "@jotis-me/icons"`
	text = text.replace(/import\s*\{([^}]*)\}\s*from\s*"@jotis-me\/icons";?\n?/g, (_all, list: string) => {
		for (const part of list
			.split(",")
			.map((s) => s.trim())
			.filter(Boolean)) {
			const m = part.match(/^Icon([A-Z]\w*)$/);
			if (m) aliases.push([part, m[1] as string]);
		}
		return "";
	});
	for (const [from, to] of aliases) {
		const local = taken.has(to) ? `${to}Icon` : to;
		used.set(`@${to}`, local);
		text = text.replace(new RegExp(String.raw`\b${from}\b`, "g"), local);
	}

	// 2. <Icon name="k" … /> y <Icon name={expr} … />
	text = text.replace(/<Icon\s+name="([a-z0-9-]+)"/g, (_m, k: string) => `<${id(k)}`);
	text = text.replace(/<Icon\s+name=\{((?:[^{}]|\{[^{}]*\})*)\}/g, (_m, expr: string) => {
		extra.add("DynIcon");
		// Solo los textos que son resultado de una rama (`? "a" : "b"`), no los de una comparación (`=== "up"`)
		const converted = expr.replace(
			/([?:]\s*)"([a-z][a-z0-9-]*)"/g,
			(_s, pre: string, k: string) => pre + id(k),
		);
		return `<DynIcon icon={${converted}}`;
	});

	// 3. Props y propiedades con un nombre: icon="k", icon={"k"}, icon: "k" (con `as const`)
	text = text.replace(
		new RegExp(String.raw`\b(${PROPS})="([a-z][a-z0-9-]*)"`, "g"),
		(_m, p: string, k: string) => `${p}={${id(k)}}`,
	);
	text = text.replace(
		new RegExp(String.raw`\b(${PROPS}): "([a-z][a-z0-9-]*)"( as const)?`, "g"),
		(_m, p: string, k: string) => `${p}: ${id(k)}`,
	);

	// 4. Tipos
	text = text.replace(/IconName \| NonNullable<ReactNode>/g, () => {
		extra.add("type IconProp");
		return "NonNullable<IconProp>";
	});
	text = text.replace(/IconName \| ReactNode/g, () => {
		extra.add("type IconProp");
		return "IconProp";
	});
	text = text.replace(/(?<![\w"])IconName(?![\w"])(?!\s*,\s*type IconProps)/g, (_m) => {
		extra.add("type IconComponent");
		return "IconComponent";
	});

	// 5. La importación del módulo interno: fuera `Icon`, `IconName` e `IconProps` de "./Icon.js"
	let hadSlot = false;
	text = text.replace(
		/import\s*(?:type\s*)?\{([^}]*)\}\s*from\s*"\.\/Icon\.js";?\n?/g,
		(_a, list: string) => {
			if (/\biconSlot\b/.test(list)) hadSlot = true;
			return "";
		},
	);
	if (hadSlot) extra.add("iconSlot");

	if (text === source) return undefined;
	const lines: string[] = [];
	const names = [...used.entries()]
		.map(([k, local]) => (k.startsWith("@") ? `${k.slice(1)} as ${local}` : `${pascal(k)} as ${local}`))
		.map((s) => s.replace(/^(\w+) as \1$/, "$1"))
		.sort();
	if (names.length) lines.push(`import { ${[...new Set(names)].join(", ")} } from "@untitledui/icons";`);
	if (extra.size && opts.slotImport)
		lines.push(`import { ${[...extra].sort().join(", ")} } from "${opts.slotImport}";`);
	// Tras el último import de la cabecera (o al principio)
	const imports = [...text.matchAll(/^import[\s\S]*?;\n/gm)];
	const last = imports.at(-1);
	const at = last ? (last.index as number) + last[0].length : 0;
	return `${text.slice(0, at)}${lines.join("\n")}${lines.length ? "\n" : ""}${text.slice(at)}`;
}

if (import.meta.main) {
	const args = process.argv.slice(2);
	const at = args.indexOf("--internal");
	const files = args.filter((a, i) => !a.startsWith("--") && (at < 0 || i !== at + 1));
	let changed = 0;
	for (const f of files) {
		const out = migrate(readFileSync(f, "utf8"), {
			slotImport: process.argv.includes("--internal")
				? process.argv[process.argv.indexOf("--internal") + 1]
				: undefined,
		});
		if (out !== undefined) {
			writeFileSync(f, out);
			changed++;
		}
	}
	console.log(`${changed} de ${files.length} ficheros cambiados`);
}
