import { colors } from "@jotis-me/tokens";
import { describe, expect, it } from "vitest";
import { contrast, luminance, ratio } from "../src/lib/contrast";

const bg = colors["bg-primary"];

describe("contraste WCAG", () => {
	it("text-primary da 17,9:1 sobre bg-primary en claro", () => {
		expect(contrast(colors["text-primary"].light, bg.light)).toBe(17.9);
		expect(ratio(contrast(colors["text-primary"].light, bg.light) as number)).toBe("17,9:1");
	});

	it("reproduce las excepciones que cita la guía", () => {
		// GUIA.md, «Contraste»: warning 2,9:1 y success 3,2:1 sobre blanco; fg-quaternary 2,6:1 y 2,5:1;
		// border-primary 1,5:1; text-placeholder 4,2:1 en oscuro
		expect(contrast(colors["text-warning-primary"].light, bg.light)).toBe(2.9);
		expect(contrast(colors["text-success-primary"].light, bg.light)).toBe(3.2);
		expect(contrast(colors["fg-quaternary"].light, bg.light)).toBe(2.6);
		expect(contrast(colors["fg-quaternary"].dark, bg.dark)).toBe(2.5);
		expect(contrast(colors["border-primary"].light, bg.light)).toBe(1.5);
		expect(contrast(colors["text-placeholder"].dark, bg.dark)).toBe(4.2);
	});

	it("es simétrico y va de 1 a 21", () => {
		expect(contrast("#000000", "#ffffff")).toBe(21);
		expect(contrast("#ffffff", "#000000")).toBe(21);
		expect(contrast("#777", "#777777")).toBe(1);
	});

	it("no responde con colores con alfa", () => {
		expect(luminance("#0c0e121a")).toBeUndefined();
		expect(contrast("#0c0e121a", "#ffffff")).toBeUndefined();
	});
});
