// Base común de Stream (design §12): raíz oscura, movimiento, cifras tabulares, tipos de evento y lienzo.
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { iconNames } from "@jotis-me/icons";
import { compile } from "@tailwindcss/node";
import { act, render } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
	STREAM_EVENTS,
	STREAM_ROOT,
	type StreamEventType,
	streamDetail,
	streamMotion,
	streamShort,
	TABULAR,
} from "../src/internal/stream.js";
import { StreamStage } from "../src/internal/stream-stage.js";

const root = join(import.meta.dirname, "..");
const isClient = (file: string) =>
	/^\s*["']use client["']/.test(readFileSync(join(root, "src", file), "utf8"));

async function css(classes: string[]) {
	const compiler = await compile('@import "tailwindcss";\n@import "../styles.css";', {
		base: join(root, "test"),
		onDependency: () => {},
	});
	return compiler.build(classes);
}

describe("frontera servidor/cliente", () => {
	it("las constantes son de servidor y solo el lienzo, que mide, es de cliente", () => {
		expect(isClient("internal/stream.ts")).toBe(false);
		expect(isClient("internal/stream-stage.tsx")).toBe(true);
	});
});

describe("raíz y cifras", () => {
	it("la raíz lleva `dark-mode`, que redefine los tokens en oscuro dentro de una página clara", async () => {
		expect(STREAM_ROOT.split(" ")).toContain("dark-mode");
		const out = await css(STREAM_ROOT.split(" "));
		expect(out).toMatch(/\.dark-mode\s*\{[^}]*--bg-primary:\s*#0a0a0a/i);
	});

	it("las cifras de reloj van en Geist con números tabulares", async () => {
		const out = await css(TABULAR.split(" "));
		expect(out).toContain(
			"font-variant-numeric: var(--tw-ordinal,) var(--tw-slashed-zero,) var(--tw-numeric-figure,) var(--tw-numeric-spacing,) var(--tw-numeric-fraction,)",
		);
		expect(out).toContain("--tw-numeric-spacing: tabular-nums");
	});
});

describe("movimiento", () => {
	it("sin estado no hay animación", () => {
		expect(streamMotion(undefined)).toBeUndefined();
	});

	it("la entrada parte de @starting-style: fundido y 8px de subida en 250 ms; con menos movimiento, solo fundido", async () => {
		const out = await css((streamMotion("enter") ?? "").split(" "));
		expect(out).toContain("@starting-style");
		expect(out).toContain("transition-duration: 250ms");
		expect(out).toContain("cubic-bezier(.2,.7,.2,1)");
		expect(out).toMatch(
			/@starting-style\s*\{\s*\.starting\\:translate-y-2\s*\{\s*--tw-translate-y: calc\(var\(--spacing\) \* 2\)/,
		);
		expect(out).toMatch(
			/prefers-reduced-motion: reduce\)\s*\{\s*@starting-style\s*\{\s*\.motion-reduce\\:starting\\:translate-y-0\s*\{\s*--tw-translate-y: 0px/,
		);
		// Con menos movimiento solo se anima la opacidad (si no, `translate` de 0 a none abre una transición).
		expect(out).toMatch(
			/prefers-reduced-motion: reduce\)\s*\{\s*\.motion-reduce\\:transition-opacity\s*\{\s*transition-property: opacity/,
		);
	});

	it("la salida sube 8px y funde en 200 ms; con menos movimiento, solo funde", async () => {
		const exit = streamMotion("exit") ?? "";
		expect(exit.split(" ")).toEqual(
			expect.arrayContaining([
				"-translate-y-2",
				"opacity-0",
				"duration-200",
				"ease-in",
				"motion-reduce:transition-opacity",
			]),
		);
		const out = await css(exit.split(" "));
		expect(out).toContain("transition-duration: 200ms");
		expect(out).toMatch(
			/prefers-reduced-motion: reduce\)\s*\{\s*\.motion-reduce\\:translate-y-0\s*\{\s*--tw-translate-y: 0px/,
		);
	});
});

describe("tipos de evento", () => {
	const types = Object.keys(STREAM_EVENTS) as StreamEventType[];

	it("los siete tipos, cada uno con un icono del set y su etiqueta", () => {
		expect(types).toEqual(["follow", "sub", "resub", "gift", "raid", "bits", "donation"]);
		for (const t of types) expect(iconNames).toContain(STREAM_EVENTS[t].icon);
		expect(STREAM_EVENTS.raid.label).toBe("Raid entrante");
	});

	it("textos por defecto de las alertas, con cifras en es-ES", () => {
		expect(streamDetail("follow", {})).toBe("Ya no hay vuelta atrás.");
		expect(streamDetail("sub", { tier: 1 })).toBe("Suscripción de nivel 1.");
		expect(streamDetail("resub", { months: 14 })).toBe("Lleva 14 meses por aquí.");
		expect(streamDetail("gift", { amount: 1 })).toBe("1 suscripción regalada al chat.");
		expect(streamDetail("gift", { amount: 5 })).toBe("5 suscripciones regaladas al chat.");
		expect(streamDetail("raid", { amount: 1284 })).toBe("1.284 espectadores acaban de aterrizar.");
		expect(streamDetail("bits", { amount: 500 })).toBe("500 bits.");
		// Espacio duro antes de €, como el resto del paquete (formatCurrency); el bundle usa uno normal.
		expect(streamDetail("donation", { amount: 5 })).toBe("5,00 €");
	});

	it("línea corta de la lista de eventos", () => {
		expect(streamShort("donation", { amount: 5 })).toBe("Donación · 5,00 €");
		expect(streamShort("raid", { amount: 1284 })).toBe("Raid entrante · 1.284");
		expect(streamShort("resub", { months: 14 })).toBe("Suscripción renovada · 14 meses");
		expect(streamShort("follow", {})).toBe("Nuevo seguidor");
	});
});

describe("lienzo de tamaño fijo", () => {
	afterEach(() => vi.unstubAllGlobals());

	it("con `scale` mide su tamaño real por la escala, sin medir nada, también en servidor", () => {
		const html = renderToString(
			<StreamStage width={1920} height={1080} scale={0.5}>
				x
			</StreamStage>,
		);
		expect(html).toContain("width:960px;height:540px");
		expect(html).toContain("transform:scale(0.5)");
		expect(html).toContain("dark-mode");
	});

	it("sin `scale` reserva el hueco con aspect-ratio y escala al ancho del contenedor al medirlo", () => {
		let notify = () => {};
		vi.stubGlobal(
			"ResizeObserver",
			class {
				constructor(cb: () => void) {
					notify = cb;
				}
				observe() {}
				disconnect() {}
			},
		);
		const width = vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockReturnValue(960);
		const { container } = render(
			<StreamStage width={1920} height={1080}>
				x
			</StreamStage>,
		);
		const outer = container.firstElementChild as HTMLElement;
		const stage = outer.firstElementChild as HTMLElement;
		expect(outer.style.aspectRatio).toBe("1920 / 1080");
		expect(stage.style.width).toBe("1920px");
		expect(stage.style.transform).toBe("scale(0.5)");
		width.mockReturnValue(480);
		act(() => notify());
		expect(stage.style.transform).toBe("scale(0.25)");
		width.mockRestore();
	});

	it("antes de medir, el contenido está oculto para no verse a tamaño real", () => {
		const html = renderToString(
			<StreamStage width={1200} height={480}>
				x
			</StreamStage>,
		);
		expect(html).toContain("invisible");
		expect(html).toContain("aspect-ratio:1200 / 480");
	});
});
