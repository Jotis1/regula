// Enlaces dentro de un mensaje del chat (design D7 de add-live-interaction-pieces). Solo se marcan: el texto sigue
// siendo texto plano y nada se pinta como HTML ni se puede pulsar.

export interface TextPart {
	text: string;
	link: boolean;
}

// `http://`, `https://` o `www.`, seguido de algo que no sea espacio; el resto se recorta después.
const CANDIDATE = /(?:https?:\/\/|www\.)\S+/gi;
// Puntuación que cierra la frase y no la dirección: «mira https://jotis.me.»
const TRAILING = /[.,;:!?¡¿"'»…]+$/;
// Lo mínimo para que sea una dirección: algo de nombre tras el prefijo.
const HAS_HOST = /^(?:https?:\/\/|www\.)[\p{L}\p{N}]/iu;

const count = (s: string, c: string) => s.split(c).length - 1;

/** Recorta la puntuación del final; un `)` solo se queda si cierra un `(` de la propia dirección. */
function trimEnd(url: string): string {
	let u = url;
	for (;;) {
		const before = u;
		u = u.replace(TRAILING, "");
		if (u.endsWith(")") && count(u, ")") > count(u, "(")) u = u.slice(0, -1);
		if (u === before) return u;
	}
}

/** Parte el texto en trozos de texto y de enlace, en orden. Sin enlaces, un solo trozo. */
export function splitLinks(text: string): TextPart[] {
	const parts: TextPart[] = [];
	let last = 0;
	for (const m of text.matchAll(CANDIDATE)) {
		const start = m.index ?? 0;
		const url = trimEnd(m[0]);
		if (!HAS_HOST.test(url)) continue;
		if (start > last) parts.push({ text: text.slice(last, start), link: false });
		parts.push({ text: url, link: true });
		last = start + url.length;
	}
	if (last < text.length || parts.length === 0) parts.push({ text: text.slice(last), link: false });
	return parts;
}
