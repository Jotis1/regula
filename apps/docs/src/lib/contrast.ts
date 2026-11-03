// Contraste WCAG 2.x entre dos colores sRGB, calculado en el build para la tabla de Color (design §6).

/** Luminancia relativa de un color #rrggbb (o #rgb). Los de 8 dígitos (con alfa) no tienen una sola respuesta. */
export function luminance(hex: string): number | undefined {
	let h = hex.replace("#", "");
	if (h.length === 3) h = [...h].map((c) => c + c).join("");
	if (h.length !== 6) return undefined;
	const [r, g, b] = [0, 2, 4].map((i) => {
		const c = Number.parseInt(h.slice(i, i + 2), 16) / 255;
		return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
	}) as [number, number, number];
	return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Relación de contraste entre dos colores, con un decimal (17,9 y no 17,93). */
export function contrast(a: string, b: string): number | undefined {
	const la = luminance(a);
	const lb = luminance(b);
	if (la === undefined || lb === undefined) return undefined;
	const [hi, lo] = la > lb ? [la, lb] : [lb, la];
	return Math.round(((hi + 0.05) / (lo + 0.05)) * 10) / 10;
}

/** `17.9` → `17,9:1`, como escribe la guía. */
export const ratio = (n: number) => `${String(n).replace(".", ",")}:1`;

/** Mínimos de WCAG AA: 4,5:1 para texto y 3:1 para iconos y elementos gráficos. */
export const MIN = { text: 4.5, icon: 3 } as const;
