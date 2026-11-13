// Escribe los recursos de los iconos de app y copia los SVG de los assets en dist/.
// Uso: bun run scripts/assets.ts (después de tsc)
import { mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { type AppIconOptions, type AppName, appIconSvg, apps } from "@jotis-me/react/app-icon";
import { Resvg } from "@resvg/resvg-js";

const dist = join(import.meta.dirname, "../dist");

// Iconos de app: SVG por variante, favicon y PNG para el manifest y apple-touch-icon
const out = join(dist, "app-icons");
rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });
const png = (svg: string, px: number) =>
	new Resvg(svg, { fitTo: { mode: "width", value: px } }).render().asPng();
const variants: [string, AppIconOptions][] = [
	["default", {}],
	["solid", { variant: "solid" }],
	["light", { variant: "light" }],
	["mono", { variant: "mono" }],
	["maskable", { shape: "square" }],
];
for (const app of Object.keys(apps) as AppName[]) {
	for (const [file, opts] of variants)
		writeFileSync(join(out, `${app}-${file}.svg`), appIconSvg({ app, size: 128, ...opts }));
	const solid = appIconSvg({ app, variant: "solid", size: 32 }, 32);
	writeFileSync(join(out, `${app}-favicon.svg`), solid);
	writeFileSync(join(out, `${app}-favicon-32.png`), png(solid, 32));
	const any = appIconSvg({ app, size: 128 });
	const maskable = appIconSvg({ app, size: 128, shape: "square" });
	for (const px of [192, 512]) {
		writeFileSync(join(out, `${app}-any-${px}.png`), png(any, px));
		writeFileSync(join(out, `${app}-maskable-${px}.png`), png(maskable, px));
	}
	writeFileSync(join(out, `${app}-apple-touch-icon.png`), png(maskable, 180));
}
console.log(`${Object.keys(apps).length} apps → dist/`);

// Trazos a mano y patrones (de la guía, grupos Hand-drawn y Patterns): la fuente vive en assets/ con la tinta ya en
// currentColor para que sigan el tema (con `text-primary`: #171717 en claro, #FAFAFA en oscuro). Los rellenos
// blancos son de clipPath y se quedan. Se copian tal cual.
const sources = join(import.meta.dirname, "../assets");
for (const [group, folder] of [
	["Hand-drawn", "hand-drawn"],
	["Patterns", "patterns"],
] as const) {
	const target = join(dist, folder);
	rmSync(target, { recursive: true, force: true });
	mkdirSync(target, { recursive: true });
	const files = readdirSync(join(sources, folder)).filter((f) => f.endsWith(".svg"));
	for (const f of files) writeFileSync(join(target, f), readFileSync(join(sources, folder, f)));
	console.log(`${files.length} SVG de ${group} → dist/${folder}/`);
}

// Logos de terceros, por set: @jotis-me/assets/logos/<set>/<nombre>.svg
const logos = join(dist, "logos");
rmSync(logos, { recursive: true, force: true });
let logoCount = 0;
for (const set of ["app", "integration", "social", "store"]) {
	mkdirSync(join(logos, set), { recursive: true });
	for (const f of readdirSync(join(sources, "logos", set)).filter((f) => f.endsWith(".svg"))) {
		writeFileSync(join(logos, set, f), readFileSync(join(sources, "logos", set, f)));
		logoCount++;
	}
}
console.log(`${logoCount} SVG de logos → dist/logos/`);

// Recursos en color de carpeta plana, uno por entrada: @jotis-me/assets/<entrada>/<nombre>.svg
for (const [folder, what] of [
	["payments", "iconos de pago"],
	["cursors", "cursores"],
] as const) {
	const target = join(dist, folder);
	rmSync(target, { recursive: true, force: true });
	mkdirSync(target, { recursive: true });
	const files = readdirSync(join(sources, folder)).filter((f) => f.endsWith(".svg"));
	for (const f of files) writeFileSync(join(target, f), readFileSync(join(sources, folder, f)));
	console.log(`${files.length} SVG de ${what} → dist/${folder}/`);
}
