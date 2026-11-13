import { readdirSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { sectionOf, splitCard, usageOf, usageToc } from "../src/lib/card";
import { catalogComponents, slugOf } from "../src/lib/catalog";
import { STARTS } from "../src/lib/playground";

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
	it("hay una ficha por componente del catálogo", () => {
		expect(cards).toHaveLength(catalogComponents().length);
	});

	it("en todas, cada párrafo acaba una sola vez y sin cambios", () => {
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

describe("pares de ejemplo: la ficha da el texto y el arranque los especímenes", () => {
	const bodyOf = (name: string) => cards.find((c) => c.file === `${slugOf(name)}.md`)?.body ?? "";
	const withExamples = Object.entries(STARTS).filter(([, s]) => s.examples?.length);

	it("Button, Input, Badge, Modal y EmptyState traen pares", () => {
		const names = withExamples.map(([n]) => n);
		for (const n of ["Button", "Input", "Badge", "Modal", "EmptyState"]) expect(names).toContain(n);
	});

	it("cada pie es una frase entera de la ficha, letra a letra, y todos los pares se pintan", () => {
		for (const [name, start] of withExamples) {
			const card = splitCard(bodyOf(name));
			const texts = card.sections.flatMap((s) => s.paragraphs.map((p) => p.text));
			for (const pair of start.examples ?? [])
				for (const side of [pair.do, pair.dont]) {
					const text = texts.find((t) => t.includes(side.caption));
					expect(text, `${name}: «${side.caption}»`).toBeDefined();
					// Empieza donde empieza una frase y acaba donde acaba
					const at = (text as string).indexOf(side.caption);
					expect(
						at === 0 || /[.)] $/.test((text as string).slice(0, at)),
						`${name}: ${side.caption}`,
					).toBe(true);
					expect(side.caption, name).toMatch(/[.)]$/);
					expect(side.specimens.length, name).toBeGreaterThan(0);
				}
			const usage = usageOf(card, start.examples);
			expect(usage.pairs.uso.length + usage.pairs.evita.length, name).toBe(start.examples?.length);
		}
	});

	it("Button: un primario y un secundario «Esto sí», dos primarios «Esto no»", () => {
		const [pair] = STARTS.Button?.examples ?? [];
		const primary = (s: { props?: Record<string, unknown> }) =>
			(s.props?.hierarchy ?? "primary") === "primary";
		expect(pair?.do.specimens.map(primary).sort()).toEqual([false, true]);
		expect(pair?.dont.specimens.map(primary)).toEqual([true, true]);
	});

	it("las frases que son pie salen de su párrafo y lo demás se queda como estaba", () => {
		const card = splitCard(bodyOf("Button"));
		const usage = usageOf(card, STARTS.Button?.examples);
		expect(usage.paired).toBe(true);
		expect(usage.pairs.uso).toHaveLength(1);
		expect(usage.pairs.evita).toHaveLength(1);
		const text = (label: string) =>
			usage.card.sections.flatMap((s) => s.paragraphs).find((p) => p.label === label);
		expect(text("No")?.text).toBe("No cambies la forma: un botón tiene que parecer un botón.");
		expect(text("No")?.trimmed).toBe(true);
		expect(text("Cuándo")?.text).toMatch(/^El resto, `secondary`;/);
		// Lo que no se cita no cambia
		const untouched = card.sections
			.flatMap((s) => s.paragraphs)
			.find((p) => p.label === "Detalles que ya hace");
		expect(text("Detalles que ya hace")).toBe(untouched);
		expect(usageToc(usage).map((t) => t.slug)).toEqual(["uso", "evita"]);
	});

	it("un párrafo que es entero pie de tarjetas no se pinta (EmptyState, «Texto»)", () => {
		const usage = usageOf(splitCard(bodyOf("EmptyState")), STARTS.EmptyState?.examples);
		expect(usage.card.sections.flatMap((s) => s.paragraphs).map((p) => p.label)).not.toContain("Texto");
		expect(usageToc(usage).map((t) => t.slug)).toEqual(["uso"]);
	});

	it("sin pares, o con pies que no están en la ficha, la ficha queda tal cual y «Evita» no es sección aparte", () => {
		const card = splitCard("**Cuándo usarlo.** Para probar.\n\n**Evita.** Usarlo en producción.");
		expect(usageOf(card).card).toBe(card);
		const other = usageOf(card, STARTS.Button?.examples);
		expect(other.paired).toBe(false);
		expect(other.card).toBe(card);
		expect(usageToc(other)).toEqual([{ slug: "uso", text: "Cuándo usarlo" }]);
	});
});
