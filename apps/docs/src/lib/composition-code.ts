// Código copiable de una composición (design D7): la función de su ejemplo sacada del fichero de composiciones, con
// los ayudantes del fichero que usa y solo los imports que necesita. Fuera queda lo que es de la web: el lienzo
// (`Lienzo`) y `contained`, que pinta el modal dentro de su caja; en una app el modal se abre sobre la página.

interface Decl {
	name: string;
	text: string;
}

const DECL = /^(?:export )?(?:function|const) (\w+)/;

/** Imports con nombre del fichero: identificador → módulo, en el orden en que aparecen. */
function importsOf(source: string) {
	const out: { name: string; from: string }[] = [];
	for (const m of source.matchAll(/^import (type )?\{([^}]*)\} from "([^"]+)";/gm)) {
		if (m[1]) continue;
		for (const raw of (m[2] as string).split(",")) {
			const name = raw.trim();
			if (name) out.push({ name, from: m[3] as string });
		}
	}
	return out;
}

/** Declaraciones de primer nivel (funciones y constantes), cada una con su texto sin los comentarios de detrás. */
function declsOf(source: string): Decl[] {
	const lines = source.split("\n");
	const starts: number[] = [];
	lines.forEach((l, i) => {
		if (DECL.test(l)) starts.push(i);
	});
	return starts.map((start, k) => {
		let end = (starts[k + 1] ?? lines.length) - 1;
		// Lo de detrás que no es código: líneas en blanco y comentarios del siguiente bloque
		while (end > start && /^(\s*$|\/\*|\/\/| \*)/.test(lines[end] as string)) end--;
		return {
			name: (lines[start] as string).match(DECL)?.[1] as string,
			text: lines.slice(start, end + 1).join("\n"),
		};
	});
}

// Uso como código (`{x}`, `<X`, `x(`, `...x`), no dentro de un texto («Color de la marca»)
const uses = (text: string, name: string) =>
	new RegExp(`(?:(?<=[{(<=,:]\\s*)|(?<=\\.\\.\\.))${name}\\b`).test(text);

/** Quita el lienzo de la web (y su sangría) y `contained`. */
function unwrap(text: string) {
	const out: string[] = [];
	let inside = false;
	for (const line of text.split("\n")) {
		if (/^\s*<Lienzo\b/.test(line)) {
			inside = true;
			continue;
		}
		if (/^\s*<\/Lienzo>/.test(line)) {
			inside = false;
			continue;
		}
		if (/^\s*contained$/.test(line)) continue;
		// En la misma línea que la etiqueta: `<Slideout contained title="…">`
		const own = line.replace(/^(\s*<[A-Z]\w*\b.*?) contained\b/, "$1");
		out.push(inside ? own.replace(/^\t/, "") : own);
	}
	return out.join("\n");
}

export function compositionCode(source: string, name: string): string {
	const decls = declsOf(source);
	const main = decls.find((d) => d.name === `${name}Example`);
	if (!main) throw new Error(`No hay ${name}Example en el fichero de composiciones`);
	const helpers = decls.filter((d) => !d.name.endsWith("Example") && d.name !== "Lienzo");

	// Los ayudantes que usa, y los que usan esos
	const picked = new Set<string>();
	const pending = [main.text];
	while (pending.length) {
		const text = pending.pop() as string;
		for (const h of helpers)
			if (!picked.has(h.name) && uses(text, h.name)) {
				picked.add(h.name);
				pending.push(h.text);
			}
	}
	const body = [...helpers.filter((h) => picked.has(h.name)), main]
		.map((d) => unwrap(d.text))
		.join("\n\n")
		.replace(`function ${name}Example(`, `function ${name}(`);

	const byModule = new Map<string, string[]>();
	for (const { name: id, from } of importsOf(source))
		if (uses(body, id)) byModule.set(from, [...(byModule.get(from) ?? []), id]);
	const imports = [...byModule].map(([from, ids]) => `import { ${ids.join(", ")} } from "${from}";`);
	return `${imports.join("\n")}\n\n${body}\n`;
}
