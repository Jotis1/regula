// Control de tamaño por componente (design, riesgos: React Aria añade peso). Mide lo que paga una app que importa
// solo ese componente desde el paquete: `import { X } from "@jotis-me/react"` empaquetado con tree shaking,
// minificado y en gzip, sin React (es peer). Compara con `size-budget.json` y falla si alguno lo supera o falta.
// Uso: bun run check:size [--update]  (con --update reescribe los límites: tamaño actual + 10 %, redondeado).
import { mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { gzipSync } from "node:zlib";

// El paquete no carga los tipos de Bun (solo `node`): basta con la parte de `Bun.build` que se usa aquí.
declare const Bun: {
	build(options: {
		entrypoints: string[];
		minify: boolean;
		external: string[];
		target: "browser";
	}): Promise<{ success: boolean; logs: unknown[]; outputs: { text(): Promise<string> }[] }>;
};

const root = join(import.meta.dirname, "..");
const budgetFile = join(root, "size-budget.json");
const update = process.argv.includes("--update");
const external = ["react", "react-dom", "react/jsx-runtime", "react-dom/client", "react-dom/server"];

const names = readdirSync(join(root, "dist/components"))
	.filter((f) => f.endsWith(".js"))
	.map((f) => f.replace(/\.js$/, ""))
	.sort();

const tmp = mkdtempSync(join(tmpdir(), "regula-size-"));
const sizes: Record<string, number> = {};
try {
	for (const name of names) {
		const entry = join(tmp, `${name}.js`);
		const index = join(root, "dist/index.js").replaceAll("\\", "/");
		writeFileSync(entry, `export { ${name} } from "${index}";\n`);
		const out = await Bun.build({ entrypoints: [entry], minify: true, external, target: "browser" });
		if (!out.success) throw new Error(`${name}: ${out.logs.join("\n")}`);
		const code = await out.outputs[0]?.text();
		sizes[name] = gzipSync(code ?? "").length;
	}
} finally {
	rmSync(tmp, { recursive: true, force: true });
}

const kb = (b: number) => `${(b / 1024).toFixed(1)} kB`;

if (update) {
	const budget = Object.fromEntries(
		Object.entries(sizes).map(([n, b]) => [n, Math.ceil((b * 1.1) / 512) * 512]),
	);
	writeFileSync(budgetFile, `${JSON.stringify(budget, null, "\t")}\n`);
	console.log(`Límites reescritos para ${names.length} componentes.`);
	process.exit(0);
}

const budget = JSON.parse(readFileSync(budgetFile, "utf8")) as Record<string, number>;
const errors: string[] = [];
for (const [name, size] of Object.entries(sizes)) {
	const limit = budget[name];
	if (limit == null) errors.push(`${name}: sin límite en size-budget.json (${kb(size)})`);
	else if (size > limit) errors.push(`${name}: ${kb(size)} supera su límite de ${kb(limit)}`);
}
for (const name of Object.keys(budget))
	if (!(name in sizes)) errors.push(`${name}: límite de un componente que ya no existe`);

const rows = Object.entries(sizes).sort((a, b) => b[1] - a[1]);
console.log(rows.map(([n, b]) => `${n.padEnd(18)} ${kb(b).padStart(8)} / ${kb(budget[n] ?? 0)}`).join("\n"));
if (errors.length) {
	console.error(`\n${errors.join("\n")}\nSi el aumento es intencionado: bun run check:size --update`);
	process.exit(1);
}
console.log(`\n${names.length} componentes dentro de su límite.`);
