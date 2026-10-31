// Extrae del transcript de una sesión de Claude Code (y de sus tool-results) las lecturas completas de
// ficheros del artefacto "Jotis.me" hechas con read_file, las verifica con el sha256 del último list_files
// y las escribe en reference/. Uso: node extract-files.mjs <transcript.jsonl> <tool-results> <reference> [--missing]
import { createHash } from "node:crypto";
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const [transcript, resultsDir, outDir] = process.argv.slice(2);
const SLUG = "bb424412-8082-461e-a84f-b3704de675c1";
const blobs = [];

function collect(content) {
	if (typeof content === "string") blobs.push(content);
	else if (Array.isArray(content))
		blobs.push(content.map((c) => (typeof c === "string" ? c : (c.text ?? ""))).join("\n"));
}

for (const line of readFileSync(transcript, "utf8").split("\n")) {
	if (!line.trim()) continue;
	let entry;
	try {
		entry = JSON.parse(line);
	} catch {
		continue;
	}
	const parts = entry?.message?.content;
	if (!Array.isArray(parts)) continue;
	for (const p of parts) if (p.type === "tool_result") collect(p.content);
}
for (const f of readdirSync(resultsDir)) {
	try {
		collect(JSON.parse(readFileSync(join(resultsDir, f), "utf8")));
	} catch {}
}

// Último listado de ficheros (list_files) del artefacto: hashes esperados
const expected = new Map();
for (const blob of blobs) {
	const i = blob.indexOf('{"note":');
	if (i < 0 || !blob.includes('"files":[')) continue;
	try {
		const listing = JSON.parse(blob.slice(i, blob.lastIndexOf("}") + 1));
		if (listing.slug !== SLUG) continue;
		expected.clear();
		for (const f of listing.files) expected.set(f.path, f.sha256);
	} catch {}
}

const found = new Map();
for (const blob of blobs) {
	const summaryMatch = blob.match(/\{"content_type":[^\n]*?"slug":"[^"]+"[^\n]*?\}/);
	if (!summaryMatch) continue;
	let summary;
	try {
		summary = JSON.parse(summaryMatch[0]);
	} catch {
		continue;
	}
	if (summary.slug !== SLUG || summary.next_offset || (summary.offset && summary.offset !== 1)) continue;
	const doc = blob.match(/<untrusted-document-([0-9a-f]+)>([\s\S]*?)<\/untrusted-document-\1>/);
	if (!doc) continue;
	found.set(summary.path, { text: doc[2], size: summary.size, version: summary.version });
}

let bad = 0;
for (const [path, { text, size }] of [...found].sort()) {
	const rel = path.replace(/^project\//, "");
	const buf = Buffer.from(text, "utf8");
	const sha = createHash("sha256").update(buf).digest("hex");
	if (sha !== expected.get(path) || buf.length !== size) {
		bad++;
		console.log(`MISMATCH ${rel} (${buf.length}/${size})`);
		continue;
	}
	const out = join(outDir, rel);
	mkdirSync(dirname(out), { recursive: true });
	writeFileSync(out, buf);
}
const want = [...expected.keys()].filter(
	(p) => p.startsWith("project/") && !p.includes("/fonts/") && !p.includes("/lib/"),
);
const missing = want.filter((p) => !found.has(p));
console.log(`ok=${found.size - bad} bad=${bad} missing=${missing.length}`);
if (process.argv.includes("--missing")) console.log(missing.join("\n"));
