// La ficha de la guía de cada componente, repartida por etiqueta sin tocar su texto (design §3). Cada párrafo de la
// ficha empieza por **Etiqueta.**: un diccionario decide su sección y lo que no encaja va a «Detalles», con la
// etiqueta como título. El párrafo «Props.» va aparte, junto a la tabla de props. Un test comprueba que, en todas
// las fichas, cada párrafo acaba en una sola sección y sin cambios.

export type CardSectionId = "uso" | "evita" | "accesibilidad" | "amplia" | "detalles";

export interface CardParagraph {
	/** La etiqueta sin la negrita ni el punto final: «Cuándo usarla». */
	label: string;
	/** El resto del párrafo, tras la etiqueta. */
	text: string;
	/** El párrafo entero, tal cual está en la ficha. */
	raw: string;
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
