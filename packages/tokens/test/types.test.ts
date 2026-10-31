import { describe, expect, expectTypeOf, it } from "vitest";
import { type ColorName, colors, seriesColors, type ThemedToken, tokens } from "../dist/index.js";

describe("módulo de tokens tipado", () => {
	it("devuelve claro y oscuro de un token", () => {
		expect(tokens["text-primary"]).toMatchObject({ light: "#171717", dark: "#fafafa" });
		expectTypeOf(tokens["text-primary"]).toEqualTypeOf<ThemedToken>();
		expectTypeOf(tokens["text-primary"].light).toBeString();
	});

	it("rechaza nombres que no existen", () => {
		// @ts-expect-error: no hay ningún token con ese nombre
		const missing = colors["text-inexistente"];
		expect(missing).toBeUndefined();
		expectTypeOf<"bg-brand-solid">().toExtend<ColorName>();
		expectTypeOf<"bg-indigo-600">().not.toExtend<ColorName>();
	});

	it("trae la paleta de series de las gráficas en orden", () => {
		expect(seriesColors).toEqual([
			"utility-brand-600",
			"utility-brand-400",
			"utility-brand-200",
			"utility-sky-500",
			"utility-pink-500",
			"utility-neutral-400",
		]);
	});
});
