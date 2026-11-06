// Genera la carpeta `project/` del artefacto "Jotis.me" y su `manifest.json` (design D6), sin red: todo sale del repo
// y de los paquetes ya construidos. La publicación la hace Claude con este resultado (D7, scripts/artifact/README.md).
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { buildBundle } from "./bundle";
import {
	ASSET_GROUPS,
	type Asset,
	assets,
	catalog,
	componentPreview,
	componentReadme,
	tokensJson,
} from "./content";
import { buildGuide } from "./guide";
import { NAMESPACE, REPO, TITLE, TOKENS } from "./paths";
import { buildSheet } from "./sheet";
import { buildTypes } from "./types";

/** Límites del tipo Design System (SKILL.md y from-code.md del tipo). */
export const LIMITS = { files: 1008, fileBytes: 15 * 1024 * 1024, bundleBytes: 6_000_000 } as const;

export interface AssetRecord {
	name: string;
	blob: string | null;
	size: number;
	type: string;
}

export interface Options {
	/** Carpeta de salida: se escriben `<out>/project/` y `<out>/manifest.json`. */
	out: string;
	commit: string;
	branch: string;
	/** ISO-8601 de la sincronización. */
	date: string;
	/** Índice publicado (`project/design-system.json` leído justo antes): se conservan sus claves y registros. */
	published?: Record<string, unknown>;
	/** sha256 de cada asset publicado, por id de blob (de `list_assets`). */
	assetShas?: Record<string, string>;
	/** Blobs de los assets recién subidos, por `<Grupo>/<nombre>`. */
	blobs?: Record<string, string>;
}

export interface ManifestEntry {
	path: string;
	sha256: string;
	size: number;
}

export interface Manifest {
	repo: string;
	commit: string;
	ref: string;
	generated: string;
	/** Sin índice publicado: los assets van sin blob y el índice no se puede publicar tal cual. */
	draft: boolean;
	components: string[];
	files: ManifestEntry[];
	assets: (ManifestEntry & { group: string; name: string; blob: string | null })[];
	/** Assets que hay que subir antes de publicar el índice (`<Grupo>/<nombre>`). */
	uploads: string[];
}

const sha256 = (data: Buffer | string) => createHash("sha256").update(data).digest("hex");
const local = createRequire(join(import.meta.dirname, "../package.json"));

export async function generate(opts: Options): Promise<Manifest> {
	const project = join(opts.out, "project");
	rmSync(opts.out, { recursive: true, force: true });
	const short = opts.commit.slice(0, 7);
	const ref = `${opts.branch}@${short}`;
	const files = new Map<string, Buffer>();
	const put = (path: string, data: Buffer | string) =>
		files.set(path, Buffer.isBuffer(data) ? data : Buffer.from(data));

	const components = catalog();
	for (const name of components) {
		put(`components/${name}/README.md`, componentReadme(name));
		put(`components/${name}/preview.html`, componentPreview(name));
	}
	put("components/Cover/preview.html", readFileSync(join(import.meta.dirname, "../static/cover.html")));
	put("components/bundle.js", await buildBundle(components));
	const sheet = await buildSheet();
	put("components/bundle.css", sheet);
	// Las fuentes que enlaza la hoja (también las que el paquete parte por alfabeto, como Bricolage latin-ext)
	for (const [, font] of sheet.matchAll(/url\(["']?\.\.\/fonts\/([^"')]+)["']?\)/g))
		put(`fonts/${font}`, readFileSync(join(TOKENS, "dist/fonts", font as string)));
	put("components/index.d.ts", buildTypes());
	// React 18 del artefacto, desde el paquete npm (los dos o ninguno: SKILL.md del tipo)
	for (const [lib, pkg] of [
		["react", "react-18"],
		["react-dom", "react-dom-18"],
	] as const)
		put(
			`components/lib/${lib}.production.min.js`,
			readFileSync(join(dirname(local.resolve(`${pkg}/package.json`)), `umd/${lib}.production.min.js`)),
		);

	const tokens = tokensJson(ref, opts.date);
	put("tokens.json", tokens.json);
	for (const font of tokens.fonts) put(font.path, readFileSync(font.source));
	put("README.md", buildGuide(intro(short)) + usage());

	for (const [group] of ASSET_GROUPS)
		put(
			`assets/${group}/README.md`,
			readFileSync(join(import.meta.dirname, `../static/assets/${group}.md`)),
		);

	const generated = assets();
	const { index, records, uploads } = buildIndex(opts, generated, short);
	put("design-system.json", `${JSON.stringify(index, null, 2)}\n`);

	for (const [path, data] of files) {
		if (data.length > LIMITS.fileBytes) throw new Error(`${path} pasa de 15 MiB`);
		mkdirSync(dirname(join(project, path)), { recursive: true });
		writeFileSync(join(project, path), data);
	}
	for (const a of generated) {
		mkdirSync(join(project, "assets", a.group), { recursive: true });
		writeFileSync(join(project, "assets", a.group, a.name), a.data);
	}
	const bundle = files.get("components/bundle.js") as Buffer;
	if (bundle.length > LIMITS.bundleBytes)
		throw new Error(`El bundle pasa de 6 MB (${bundle.length} bytes)`);
	if (files.size + generated.length >= LIMITS.files)
		throw new Error(
			`El artefacto tendría ${files.size + generated.length} ficheros (máximo ${LIMITS.files - 1})`,
		);

	const manifest: Manifest = {
		repo: REPO,
		commit: opts.commit,
		ref,
		generated: opts.date,
		draft: !opts.published,
		components,
		files: [...files]
			.map(([path, data]) => ({ path: `project/${path}`, sha256: sha256(data), size: data.length }))
			.sort((a, b) => a.path.localeCompare(b.path)),
		assets: generated.map((a) => ({
			path: `project/assets/${a.group}/${a.name}`,
			group: a.group,
			name: a.name,
			sha256: sha256(a.data),
			size: a.data.length,
			blob: records.get(`${a.group}/${a.name}`)?.blob ?? null,
		})),
		uploads,
	};
	writeFileSync(join(opts.out, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);
	return manifest;
}

/**
 * Índice: sin publicado, uno nuevo (borrador, assets sin blob). Con el publicado, se conservan sus claves, sus grupos
 * que no salen del repo (Logos) y su orden; cada asset generado reutiliza el blob publicado solo si su sha256 coincide
 * (`assetShas`) o toma el recién subido (`blobs`). Si falta alguno, no hay índice publicable: error con la lista.
 */
function buildIndex(opts: Options, generated: Asset[], short: string) {
	const published = opts.published
		? (structuredClone(opts.published) as Record<string, unknown>)
		: undefined;
	const index: Record<string, unknown> = published ?? {
		v: 3,
		layout: "files",
		createdOnFiles: { v: 1, at: opts.date },
		sections: {},
		blobs: {},
		docs: { readme: "project/README.md", sections: [] },
	};
	index.title = TITLE;
	index.namespace = NAMESPACE;
	index.libraries = [
		{ name: "react", version: "18.3.1", global: "React", file: "components/lib/react.production.min.js" },
		{
			name: "react-dom",
			version: "18.3.1",
			global: "ReactDOM",
			file: "components/lib/react-dom.production.min.js",
		},
	];
	const groups = (published?.groups as string[] | undefined) ?? [];
	index.groups = [...groups, ...ASSET_GROUPS.map(([g]) => g).filter((g) => !groups.includes(g))];
	const assetGroups = (index.assetGroups ?? {}) as Record<
		string,
		{ name: string; tile: string; order: string[]; files: Record<string, AssetRecord> }
	>;
	const records = new Map<string, AssetRecord>();
	const uploads: string[] = [];
	for (const [group, tile] of ASSET_GROUPS) {
		const mine = generated.filter((a) => a.group === group);
		if (!mine.length) continue; // Logos: se queda el publicado
		const before = assetGroups[group];
		const files: Record<string, AssetRecord> = {};
		for (const a of mine) {
			const key = `${group}/${a.name}`;
			const old = before?.files[a.name]?.blob ?? null;
			const reuse = old && opts.assetShas?.[old] === sha256(a.data) ? old : null;
			const blob = opts.blobs?.[key] ?? reuse;
			if (!blob) uploads.push(key);
			const record = { name: a.name, blob, size: a.data.length, type: a.type };
			files[a.name] = record;
			records.set(key, record);
		}
		const names = mine.map((a) => a.name);
		const order = [
			...(before?.order ?? []).filter((n) => names.includes(n)),
			...names.filter((n) => !before?.order.includes(n)),
		];
		assetGroups[group] = { name: group, tile: before?.tile ?? tile, order, files };
	}
	if (!assetGroups.Logos && !published)
		assetGroups.Logos = { name: "Logos", tile: "l", order: [], files: {} };
	index.assetGroups = assetGroups;
	index.editing = "code";
	index.lastChange = {
		by: "Jotis",
		at: opts.date,
		via: `GitHub · ${REPO}@${short}`,
		note: `Generado desde el repo (${REPO}@${short}) con bun run artifact:build.`,
	};
	if (published && uploads.length)
		throw new Error(`Faltan blobs para publicar el índice; sube antes:\n${uploads.join("\n")}`);
	return { index, records, uploads };
}

function intro(short: string): string {
	return `El sistema de diseño de la suite jotis.me, **generado desde el repo** [${REPO}](https://github.com/${REPO}) (commit \`${short}\`): tokens, iconos, componentes, fichas y esta guía salen de allí y aquí son de solo lectura. Para cambiar algo, cámbialo en el repo; la documentación completa está en [regula.jotis.me](https://regula.jotis.me).`;
}

function usage(): string {
	return `
## Uso en este artefacto

Los componentes son los de \`@jotis-me/react\`, compilados para React 18: están en \`window.Jotis\` (\`Jotis.Button\`, \`Jotis.Input\`, \`Jotis.Table\`…) con los mismos nombres y props que en las apps, junto a \`Jotis.iconNames\`. Cada vista previa monta su ejemplo de \`Jotis.previews\`, el mismo que la web compara con su captura aprobada. Para el tema oscuro, pon \`data-theme="dark"\` en \`<html>\` (en las apps, la clase \`dark-mode\`).
`;
}
