// Extrae del transcript las lecturas de assets (read_asset) y las escribe en reference/assets/<Grupo>/<nombre>.
// Uso: node extract-assets.mjs <transcript.jsonl> <tool-results dir> <reference dir> [--missing]
import { createHash } from "node:crypto";
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const [transcript, resultsDir, refDir] = process.argv.slice(2);
const ds = JSON.parse(readFileSync(join(refDir, "design-system.json"), "utf8"));
const byId = new Map();
for (const [group, g] of Object.entries(ds.assetGroups))
	for (const f of Object.values(g.files)) byId.set(f.blob, { group, name: f.name });

const blobs = [];
const collect = (c) => {
	if (typeof c === "string") blobs.push(c);
	else if (Array.isArray(c))
		blobs.push(c.map((x) => (typeof x === "string" ? x : (x.text ?? ""))).join("\n"));
};
for (const line of readFileSync(transcript, "utf8").split("\n")) {
	try {
		const parts = JSON.parse(line)?.message?.content;
		if (Array.isArray(parts)) for (const p of parts) if (p.type === "tool_result") collect(p.content);
	} catch {}
}
for (const f of readdirSync(resultsDir)) {
	try {
		collect(JSON.parse(readFileSync(join(resultsDir, f), "utf8")));
	} catch {}
}

const found = new Map();
let bad = 0;
for (const blob of blobs) {
	const m = blob.match(/"opaque_id":"([0-9a-f]+)","sha256":"([0-9a-f]+)","size_bytes":(\d+)\}/);
	if (!m) continue;
	const doc = blob.match(/<untrusted-document-([0-9a-f]+)>([\s\S]*?)<\/untrusted-document-\1>/);
	if (!doc) continue;
	const buf = Buffer.from(doc[2], "utf8");
	const sha = createHash("sha256").update(buf).digest("hex");
	const info = byId.get(m[1]);
	if (!info) continue;
	if (sha !== m[2] || buf.length !== Number(m[3])) {
		bad++;
		console.log(`MISMATCH ${info.group}/${info.name}`);
		continue;
	}
	mkdirSync(join(refDir, "assets", info.group), { recursive: true });
	writeFileSync(join(refDir, "assets", info.group, info.name), buf);
	found.set(m[1], info);
}
const want = ["App icons", "Hand-drawn", "Patterns", "Logos", "Icons"];
const missing = [...byId].filter(([id, i]) => want.includes(i.group) && !found.has(id));
console.log(`ok=${found.size} bad=${bad} missing=${missing.length}`);
if (process.argv.includes("--missing"))
	for (const [id, i] of missing) console.log(`${id} ${i.group}/${i.name}`);
