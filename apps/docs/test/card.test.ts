import { readdirSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { sectionOf, splitCard } from "../src/lib/card";

const dir = fileURLToPath(new URL("../src/content/components/", import.meta.url));
/** Cuerpo de cada ficha: lo que va tras el frontmatter. */
const cards = readdirSync(dir)
	.filter((f) => f.endsWith(".md"))
	.map((f) => {
		const text = readFileSync(`${dir}${f}`, "utf8").replace(/\r\n/g, "\n");
		return { file: f, body: text.slice(text.indexOf("\n---", 4) + 4) };
	});
const paragraphsOf = (body: string) =>
	body
		.split(/\n\s*\n/)
		.map((p) => p.trim())
		.filter(Boolean);

describe("fichas repartidas por etiqueta", () => {
	it("son las 74 fichas", () => {
		expect(cards).toHaveLength(74);
	});

	it("en las 74, cada párrafo acaba una sola vez y sin cambios", () => {
		for (const { file, body } of cards) {
			const { sections, props } = splitCard(body);
			const placed = [...sections.flatMap((s) => s.paragraphs), ...(props ? [props] : [])];
			expect(placed.map((p) => p.raw).sort(), file).toEqual(paragraphsOf(body).sort());
			// Etiqueta y resto vuelven a dar el párrafo, letra a letra
			for (const p of placed) expect(`**${p.label}.** ${p.text}`, file).toBe(p.raw);
		}
	});

	it("cada ficha tiene su párrafo de props", () => {
		for (const { file, body } of cards) expect(splitCard(body).props?.label, file).toBe("Props");
	});

	it("usa el diccionario del diseño (design §3)", () => {
		for (const l of [
			"Cuándo usarla",
			"Cuándo",
			"Uso",
			"Reglas",
			"Regla",
			"Reglas del archivo",
			"Cuál",
			"Destructivas",
		])
			expect(sectionOf(l), l).toBe("uso");
		for (const l of ["Toggle o Checkbox", "Spinner o Skeleton", "Slideout o Modal"])
			expect(sectionOf(l), l).toBe("uso");
		for (const l of ["Evita", "No", "Límites"]) expect(sectionOf(l), l).toBe("evita");
		for (const l of ["Accesibilidad", "Teclado", "Foco"]) expect(sectionOf(l), l).toBe("accesibilidad");
		for (const l of [
			"Ampliaciones sobre la guía",
			"Ampliación sobre la guía",
			"Diferencias con la guía",
			"Diferencia con la vista previa de la guía",
			"Panel (ampliación sobre la guía)",
		])
			expect(sectionOf(l), l).toBe("amplia");
		for (const l of ["Detalles", "Visual", "Colores", "Tercera serie en oscuro", "Sin `onClose`"])
			expect(sectionOf(l), l).toBe("detalles");
	});

	it("ordena las secciones como el diseño y no deja ninguna vacía", () => {
		const { sections } = splitCard(
			"**Detalles.** d\n\n**Evita.** e\n\n**Cuándo usarla.** c\n\n**Props.** p\n\n**Accesibilidad.** a",
		);
		expect(sections.map((s) => s.id)).toEqual(["uso", "evita", "accesibilidad", "detalles"]);
		expect(sections.every((s) => s.paragraphs.length > 0)).toBe(true);
	});
});
