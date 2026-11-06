// Excepciones de contraste de la guía («Contraste»), con el contraste de cada tema calculado desde @jotis-me/tokens en
// lugar de copiado: si un valor cambia, la tabla cambia con él. Las pinta ContrastExceptions.astro en la web y las
// escribe en markdown el README del artefacto generado (scripts/artifact).
import { colors } from "@jotis-me/tokens";
import { contrast, ratio } from "./contrast";

type Name = keyof typeof colors;

export interface ContrastException {
	name: Name;
	/** `ground`: el token va sobre bg-primary (texto, icono, borde); `white`: lleva texto blanco encima (relleno). */
	on: "ground" | "white";
	how: string;
}

export const CONTRAST_EXCEPTIONS: readonly ContrastException[] = [
	{ name: "text-warning-primary", on: "ground", how: "Sobre blanco vale para 24px+ o junto a un icono." },
	{ name: "text-success-primary", on: "ground", how: "Sobre blanco vale para 24px+ o junto a un icono." },
	{ name: "fg-quaternary", on: "ground", how: "Es solo decoración." },
	{ name: "bg-success-solid", on: "white", how: "No admite texto blanco normal." },
	{ name: "bg-warning-solid", on: "white", how: "No admite texto blanco normal." },
	{
		name: "border-primary",
		on: "ground",
		how: "Queda por debajo del 3:1 para bordes de control, así que **todo input lleva etiqueta visible**.",
	},
	{ name: "text-placeholder", on: "ground", how: "Baja a 4,2:1 en oscuro." },
];

/** Contraste de una excepción en un tema, como `2,9:1` (o `—` si el valor no es un color que se pueda medir). */
export function exceptionRatio(e: ContrastException, theme: "light" | "dark"): string {
	const r = contrast(colors[e.name][theme], e.on === "white" ? "#ffffff" : colors["bg-primary"][theme]);
	return r === undefined ? "—" : ratio(r);
}
