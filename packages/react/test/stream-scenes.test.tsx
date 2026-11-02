// Stream (13.5): StreamCountdown y StreamScene, con reloj falso.
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { act, render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { StreamCountdown, StreamScene } from "../src/index.js";
import { streamClock } from "../src/internal/stream.js";
import { expectAccessibleInThemes } from "./helpers.js";

const root = join(import.meta.dirname, "..");
const isClient = (file: string) =>
	/^\s*["']use client["']/.test(readFileSync(join(root, "src/components", file), "utf8"));
const classes = (el: Element | null | undefined) => (el?.getAttribute("class") ?? "").split(/\s+/);
const time = () => screen.getByRole("timer").firstElementChild?.textContent;
const tick = (s: number) =>
	act(() => {
		vi.advanceTimersByTime(s * 1000);
	});

beforeEach(() => {
	vi.useFakeTimers();
	vi.setSystemTime(new Date("2026-11-02T20:00:00Z"));
});
afterEach(() => vi.useRealTimers());

describe("frontera servidor/cliente", () => {
	it("la cuenta atrás es de cliente (cuenta el tiempo); la escena, de servidor con lienzo y cuenta de cliente", () => {
		expect(isClient("StreamCountdown.tsx")).toBe(true);
		expect(isClient("StreamScene.tsx")).toBe(false);
		const html = renderToString(<StreamScene variant="brb" seconds={480} scale={0.25} />);
		expect(html).toContain("Vuelvo enseguida");
		expect(html).toContain("08:00");
	});
});

describe("formato del reloj", () => {
	it("mm:ss y h:mm:ss si pasa de una hora", () => {
		expect(streamClock(0)).toBe("00:00");
		expect(streamClock(90)).toBe("01:30");
		expect(streamClock(600)).toBe("10:00");
		expect(streamClock(3725)).toBe("1:02:05");
		expect(streamClock(-5)).toBe("00:00");
	});
});

describe("StreamCountdown", () => {
	it("con seconds={90} muestra 01:30, es un temporizador mudo y en oscuro", () => {
		render(<StreamCountdown seconds={90} />);
		const timer = screen.getByRole("timer");
		expect(timer.getAttribute("aria-live")).toBe("off");
		expect(classes(timer)).toContain("dark-mode");
		expect(time()).toBe("01:30");
		expect(classes(timer.firstElementChild)).toEqual(
			expect.arrayContaining([
				"tabular-nums",
				"font-body",
				"font-semibold",
				"text-[60px]",
				"leading-none",
			]),
		);
	});

	it("baja un segundo por tic, llega a 00:00 y se queda ahí", () => {
		render(<StreamCountdown seconds={3} />);
		tick(1);
		expect(time()).toBe("00:02");
		tick(2);
		expect(time()).toBe("00:00");
		tick(10);
		expect(time()).toBe("00:00");
		expect(vi.getTimerCount()).toBe(0);
	});

	it("`paused` y `now` la congelan; al quitar la pausa sigue", () => {
		const { rerender } = render(<StreamCountdown seconds={10} paused />);
		tick(5);
		expect(time()).toBe("00:10");
		rerender(<StreamCountdown seconds={10} />);
		tick(2);
		expect(time()).toBe("00:08");
		rerender(<StreamCountdown target="2026-11-02T21:00:00Z" now="2026-11-02T20:58:30Z" />);
		expect(time()).toBe("01:30");
		tick(5);
		expect(time()).toBe("01:30");
	});

	it("con `target` cuenta contra el reloj y se reinicia si cambia la duración", () => {
		const { rerender } = render(<StreamCountdown target="2026-11-02T21:02:05Z" />);
		expect(time()).toBe("1:02:05");
		tick(65);
		expect(time()).toBe("1:01:00");
		rerender(<StreamCountdown seconds={125} />);
		expect(time()).toBe("02:05");
	});

	it("tamaños md/lg/xl o px, y etiqueta debajo", () => {
		const { rerender } = render(<StreamCountdown seconds={1} size="md" label="Pausa" />);
		expect(classes(screen.getByRole("timer").firstElementChild)).toEqual(
			expect.arrayContaining(["text-[36px]", "leading-none"]),
		);
		expect(screen.getByRole("timer").textContent).toBe("00:01Pausa");
		rerender(<StreamCountdown seconds={1} size="xl" />);
		expect(classes(screen.getByRole("timer").firstElementChild)).toContain("text-[96px]");
		rerender(<StreamCountdown seconds={1} size={176} />);
		const digits = screen.getByRole("timer").firstElementChild as HTMLElement;
		expect(digits.style.fontSize).toBe("176px");
		expect(classes(digits).some((c) => c.startsWith("text-["))).toBe(false);
	});

	it("pasa axe en claro y oscuro", async () => {
		vi.useRealTimers();
		await expectAccessibleInThemes(<StreamCountdown seconds={600} paused label="Empezamos en" />);
	});
});

describe("StreamScene", () => {
	it("con scale={0.5} ocupa 960×540 y el lienzo interior mide 1920×1080", () => {
		const { container } = render(<StreamScene scale={0.5} />);
		const outer = container.firstElementChild as HTMLElement;
		expect(outer.style.width).toBe("960px");
		expect(outer.style.height).toBe("540px");
		expect(classes(outer)).toContain("dark-mode");
		const stage = outer.firstElementChild as HTMLElement;
		expect(stage.style.width).toBe("1920px");
		expect(stage.style.height).toBe("1080px");
		expect(stage.style.transform).toBe("scale(0.5)");
	});

	it("cuatro variantes con su insignia, titular y subtítulo por defecto", () => {
		const expected = {
			starting: ["Empezamos pronto", "Ya casi"],
			brb: ["Pausa", "Vuelvo enseguida"],
			ending: ["Fin del directo", "Hasta la próxima"],
			offline: ["Sin directo", "Ahora mismo, silencio"],
		} as const;
		for (const [variant, [badge, title]] of Object.entries(expected)) {
			const { unmount } = render(
				<StreamScene variant={variant as keyof typeof expected} scale={0.25} />,
			);
			expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(title);
			expect(screen.getByText(badge)).toBeTruthy();
			expect(document.querySelector("p")?.textContent?.length).toBeGreaterThan(10);
			unmount();
		}
	});

	it("la cuenta atrás solo sale en starting y brb, a 176px y con su etiqueta", () => {
		const { rerender } = render(
			<StreamScene variant="starting" seconds={300} countdownLabel="Para empezar" scale={0.25} />,
		);
		const timer = screen.getByRole("timer");
		expect(timer.textContent).toBe("05:00Para empezar");
		expect((timer.firstElementChild as HTMLElement).style.fontSize).toBe("176px");
		expect(classes(timer)).toEqual(expect.arrayContaining(["mt-4", "gap-2"]));
		expect(classes(timer)).not.toContain("gap-1");
		expect(classes(timer.lastElementChild)).toEqual(expect.arrayContaining(["text-[28px]", "leading-9"]));
		expect(classes(timer.lastElementChild)).not.toContain("text-sm");
		tick(1);
		expect(timer.firstElementChild?.textContent).toBe("04:59");
		rerender(<StreamScene variant="ending" seconds={300} scale={0.25} />);
		expect(screen.queryByRole("timer")).toBeNull();
		rerender(<StreamScene variant="brb" scale={0.25} />);
		expect(screen.queryByRole("timer")).toBeNull();
	});

	it("textos sustituibles, subtítulo oculto con false y pie con canal, próxima fecha y enlace", () => {
		render(
			<StreamScene
				variant="ending"
				title="Gracias"
				subtitle={false}
				badge="Fin"
				channel="jotis"
				next="Próximo directo: jueves, 20:00"
				handle="twitch.tv/jotis"
				scale={0.25}
			/>,
		);
		expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("Gracias");
		expect(document.querySelector("p")).toBeNull();
		expect(screen.getByText("Fin")).toBeTruthy();
		const foot = screen.getByText("jotis").parentElement;
		expect(foot?.textContent).toBe("jotisPróximo directo: jueves, 20:00twitch.tv/jotis");
	});

	it("sin `scale` se ajusta al ancho del contenedor", () => {
		const observers: Array<() => void> = [];
		vi.stubGlobal(
			"ResizeObserver",
			class {
				constructor(cb: () => void) {
					observers.push(cb);
				}
				observe() {}
				disconnect() {}
			},
		);
		const spy = vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockReturnValue(480);
		const { container } = render(<StreamScene />);
		const outer = container.firstElementChild as HTMLElement;
		expect(outer.style.aspectRatio).toBe("1920 / 1080");
		expect((outer.firstElementChild as HTMLElement).style.transform).toBe("scale(0.25)");
		spy.mockRestore();
		vi.unstubAllGlobals();
	});

	it("pasa axe en claro y oscuro", async () => {
		vi.useRealTimers();
		await expectAccessibleInThemes(
			<StreamScene variant="brb" seconds={480} paused countdownLabel="Vuelvo en" scale={0.25} />,
		);
	});
});
