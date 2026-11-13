// La ficha de la guía de cada componente, repartida por etiqueta sin tocar su texto (design §3). Cada párrafo de la
// ficha empieza por **Etiqueta.**: un diccionario decide su sección y lo que no encaja va a «Detalles», con la
// etiqueta como título. El párrafo «Props.» va aparte, junto a la tabla de props. Un test comprueba que, en todas
// las fichas, cada párrafo acaba en una sola sección y sin cambios.

import type { ExamplePair, ExampleSide } from "./playground";

export type CardSectionId = "uso" | "evita" | "accesibilidad" | "amplia" | "detalles";

export interface CardParagraph {
	/** La etiqueta sin la negrita ni el punto final: «Cuándo usarla». */
	label: string;
	/** El resto del párrafo, tras la etiqueta. */
	text: string;
	/** El párrafo entero, tal cual está en la ficha. */
	raw: string;
	/** Le faltan las frases que ya son pie de una tarjeta de ejemplo (`usageOf`). */
	trimmed?: boolean;
}

export interface CardSection {
	id: CardSectionId;
	title: string;
	paragraphs: CardParagraph[];
}

export interface SplitCard {
	sections: CardSection[];
	/** El párrafo «Props.», que va junto a la tabla de props. */
	props?: CardParagraph;
}

export const SECTION_TITLES: Record<CardSectionId, string> = {
	uso: "Úsalo así",
	evita: "Evita",
	accesibilidad: "Accesibilidad",
	amplia: "Amplía o difiere de la guía",
	detalles: "Detalles",
};

/** La sección de una etiqueta. El orden importa: «Panel (ampliación sobre la guía)» es ampliación, no detalle. */
export function sectionOf(label: string): CardSectionId | "props" {
	const l = label.toLowerCase();
	if (/ampliaci|diferencia/.test(l)) return "amplia";
	if (l === "props") return "props";
	if (/^(evita|no|límites)$/.test(l)) return "evita";
	if (/^(accesibilidad|teclado|foco)$/.test(l)) return "accesibilidad";
	// «Cuándo…», «Uso», «Regla(s)», «Reglas del archivo», «Cuál», «Destructivas», «Una acción principal…» y las
	// elecciones entre dos componentes («Toggle o Checkbox»)
	if (/^(cuándo|uso$|reglas?( del archivo)?$|cuál$|destructivas$|una acción principal)/.test(l))
		return "uso";
	if (/^[A-Z][A-Za-z]* o [A-Z][A-Za-z]*$/.test(label)) return "uso";
	return "detalles";
}

const LABEL = /^\*\*(.+?)\.\*\*\s+([\s\S]*)$/;

/** Reparte el cuerpo de una ficha (Markdown, un párrafo por etiqueta) en sus secciones, en el orden del diseño. */
export function splitCard(body: string): SplitCard {
	const groups = new Map<CardSectionId, CardParagraph[]>();
	let props: CardParagraph | undefined;
	for (const raw of body
		.split(/\n\s*\n/)
		.map((p) => p.trim())
		.filter(Boolean)) {
		const m = raw.match(LABEL);
		// Un párrafo sin etiqueta sería un detalle sin título; hoy no hay ninguno, pero no se pierde
		const paragraph = m
			? { label: m[1] as string, text: m[2] as string, raw }
			: { label: "", text: raw, raw };
		const section = sectionOf(paragraph.label);
		if (section === "props") props = paragraph;
		else groups.set(section, [...(groups.get(section) ?? []), paragraph]);
	}
	const order: CardSectionId[] = ["uso", "evita", "accesibilidad", "amplia", "detalles"];
	return {
		sections: order
			.filter((id) => groups.has(id))
			.map((id) => ({ id, title: SECTION_TITLES[id], paragraphs: groups.get(id) as CardParagraph[] })),
		props,
	};
}

/** Un lado de un par ya resuelto contra la ficha: lo que pinta el arranque y el pie, que es una frase de la ficha. */
export interface UsagePair {
	do: ExampleSide;
	dont: ExampleSide;
}

/** «Cuándo usarlo» y «Evita» de una página de componente: los pares de cada sección y la ficha sin sus frases. */
export interface Usage {
	pairs: Record<"uso" | "evita", UsagePair[]>;
	/** La ficha sin las frases que ya son pie de una tarjeta. Sin pares, la ficha tal cual. */
	card: SplitCard;
	/** Hay algún par: las secciones se pintan con tarjetas de ejemplo y el resto del texto debajo. */
	paired: boolean;
}

const squash = (s: string) => s.replace(/\s{2,}/g, " ").trim();

/**
 * Junta la ficha (el texto) con los pares del arranque (los especímenes). El pie de cada tarjeta es una frase de la
 * ficha, letra a letra: un par cuyas dos frases no estén en ella no se pinta, y sin pares la ficha queda como estaba.
 * Las frases que pasan a ser pie salen de su párrafo, para no leerse dos veces; un párrafo que se queda vacío no se pinta.
 */
export function usageOf(card: SplitCard, examples: ExamplePair[] = []): Usage {
	const texts = card.sections.flatMap((s) => s.paragraphs.map((p) => p.text));
	const found = (side: ExampleSide) => texts.some((t) => t.includes(side.caption));
	const valid = examples.filter((e) => found(e.do) && found(e.dont));
	const pairs: Usage["pairs"] = { uso: [], evita: [] };
	for (const e of valid) pairs[e.section ?? "uso"].push({ do: e.do, dont: e.dont });
	if (valid.length === 0) return { pairs, card, paired: false };

	const captions = valid.flatMap((e) => [e.do.caption, e.dont.caption]);
	const trim = (p: CardParagraph): CardParagraph | undefined => {
		const text = squash(captions.reduce((t, c) => t.replace(c, ""), p.text));
		if (text === p.text) return p;
		if (!text) return undefined;
		return { label: p.label, text, raw: p.label ? `**${p.label}.** ${text}` : text, trimmed: true };
	};
	const sections = card.sections
		.map((s) => ({ ...s, paragraphs: s.paragraphs.map(trim).filter((p) => p !== undefined) }))
		.filter((s) => s.paragraphs.length > 0);
	return { pairs, card: { ...card, sections }, paired: true };
}

/** Las secciones de uso que la página pinta, para «En esta página»: con pares, «Evita» es una sección aparte. */
export function usageToc(usage: Usage): { slug: string; text: string }[] {
	const has = (id: "uso" | "evita") =>
		usage.pairs[id].length > 0 || usage.card.sections.some((s) => s.id === id);
	if (!usage.paired) return has("uso") || has("evita") ? [{ slug: "uso", text: "Cuándo usarlo" }] : [];
	return [
		...(has("uso") ? [{ slug: "uso", text: "Cuándo usarlo" }] : []),
		...(has("evita") ? [{ slug: "evita", text: "Evita" }] : []),
	];
}
