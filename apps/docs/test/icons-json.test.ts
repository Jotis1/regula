// `/icons.json` (spec mcp-server): every gallery with how each entry is imported.
import { describe, expect, it } from "vitest";
import { galleryEntries } from "../src/lib/gallery-entries";
import { GALLERIES, iconsJson } from "../src/lib/icons-json";

const galleries = Object.fromEntries(GALLERIES.map((kind) => [kind, galleryEntries(kind)])) as Parameters<
	typeof iconsJson
>[0];
const json = iconsJson(galleries, "1.2.3", "https://regula.jotis.me/");
const find = (gallery: string, name: string) =>
	json.entries.find((e) => e.gallery === gallery && e.name === name);

describe("iconsJson", () => {
	it("trae la versión y las cinco galerías", () => {
		expect(json.version).toBe("1.2.3");
		for (const kind of GALLERIES)
			expect(
				json.entries.some((e) => e.gallery === kind),
				kind,
			).toBe(true);
	});

	it("SearchLg trae su import de @untitledui/icons y su página", () => {
		expect(find("icons", "SearchLg")).toMatchObject({
			import: 'import { SearchLg } from "@untitledui/icons";',
			url: "https://regula.jotis.me/icons/?icon=SearchLg",
		});
	});

	it("la bandera es tiene el título de España", () => {
		expect(find("flags", "es")).toMatchObject({
			title: "España",
			import: 'import { FlagEs } from "@untitledui/country-flags";',
		});
	});

	it("los tipos de archivo se pintan con FileIcon y sus variantes", () => {
		const pdf = find("files", "pdf");
		expect(pdf?.import).toBe('import { FileIcon } from "@untitledui/file-icons";');
		expect(pdf?.variants.map((v) => v.usage)).toContain('<FileIcon type="pdf" variant="gray" />');
	});

	it("pagos y cursores salen de @jotis-me/assets", () => {
		expect(json.entries.find((e) => e.gallery === "payments")?.import).toContain(
			'from "@jotis-me/assets/payments"',
		);
		expect(json.entries.find((e) => e.gallery === "cursors")?.import).toContain(
			'from "@jotis-me/assets/cursors"',
		);
	});
});
