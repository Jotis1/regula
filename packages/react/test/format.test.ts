import { describe, expect, it } from "vitest";
import { cx } from "../src/internal/cx.js";
import {
	formatBytes,
	formatCurrency,
	formatDate,
	formatMonth,
	formatNumber,
	formatPercent,
} from "../src/internal/format.js";
import { defaultStrings } from "../src/internal/strings.js";

const NBSP = " ";

describe("formatos es-ES", () => {
	// Intl separa la unidad con un espacio de no separación (U+00A0): así € y % no quedan solos en otra línea
	it("cifras como la guía", () => {
		expect(formatCurrency(1284.5)).toBe(`1.284,50${NBSP}€`);
		expect(formatCurrency(42.5)).toBe(`42,50${NBSP}€`);
		// PRUEBA DE CI (14.3): expectativa falsa a propósito para ver que CI sale en rojo. No fusionar.
		expect(formatNumber(1284)).toBe("1284");
		expect(formatNumber(1.23456, 2)).toBe("1,23");
		expect(formatPercent(0.08)).toBe(`8${NBSP}%`);
	});
	it("fechas como la guía", () => {
		expect(formatDate(new Date(2026, 9, 29))).toBe("29 oct 2026");
		expect(formatMonth(new Date(2026, 9, 1))).toBe("Octubre 2026");
	});
	it("tamaños de archivo", () => {
		expect(formatBytes(204800)).toBe("200 KB");
		expect(formatBytes(3355443)).toBe("3,2 MB");
	});
});

describe("textos por defecto", () => {
	it("en castellano y con plurales", () => {
		expect(defaultStrings.close).toBe("Cerrar");
		expect(defaultStrings.showMore(3)).toBe("3 más…");
		expect(defaultStrings.charactersLeft(1)).toBe("1 carácter restante");
		expect(defaultStrings.charactersLeft(20)).toBe("20 caracteres restantes");
	});
});

describe("cx", () => {
	it("la última clase gana en conflictos", () => {
		expect(cx("bg-primary", "bg-secondary")).toBe("bg-secondary");
		expect(cx("text-sm", "text-md")).toBe("text-md");
		expect(cx("text-tertiary", "text-fg-quaternary")).toBe("text-fg-quaternary");
		expect(cx("shadow-xs", "shadow-xs-skeuomorphic")).toBe("shadow-xs-skeuomorphic");
		expect(cx("rounded-md", "rounded-lg")).toBe("rounded-lg");
	});
	it("distingue tamaños de texto propios de colores", () => {
		expect(cx("text-display-sm", "text-primary")).toBe("text-display-sm text-primary");
		expect(cx("text-display-sm", "text-display-md")).toBe("text-display-md");
		expect(cx("text-md", "text-brand-secondary")).toBe("text-md text-brand-secondary");
	});
	it("acepta condiciones como clsx", () => {
		expect(cx("a", false && "b", { c: true, d: false }, undefined)).toBe("a c");
	});
});
