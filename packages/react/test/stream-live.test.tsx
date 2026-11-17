// Stream: StreamPoll, StreamCounter, StreamPinnedMessage y StreamMeter (add-live-interaction-pieces, D1-D4).
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { render, screen, within } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import {
	StreamCounter,
	StreamMeter,
	StreamPinnedMessage,
	StreamPoll,
	type StreamPollOption,
} from "../src/index.js";
import { streamMotion } from "../src/internal/stream.js";
import { expectAccessibleInThemes } from "./helpers.js";

const root = join(import.meta.dirname, "..");
const isClient = (file: string) =>
	/^\s*["']use client["']/.test(readFileSync(join(root, "src/components", file), "utf8"));
const classes = (el: Element | null | undefined) => (el?.getAttribute("class") ?? "").split(/\s+/);
const text = (el: Element | null | undefined) => (el?.textContent ?? "").replace(/ /g, " ");

const poll: StreamPollOption[] = [
	{ id: "si", label: "Sí", votes: 12 },
	{ id: "no", label: "Ni loco", votes: 30 },
];

describe("frontera servidor/cliente", () => {
	it("las cuatro son de servidor y se pintan sin reloj", () => {
		for (const f of ["StreamPoll.tsx", "StreamCounter.tsx", "StreamPinnedMessage.tsx", "StreamMeter.tsx"])
			expect(isClient(f), f).toBe(false);
		const html = renderToString(
			<>
				<StreamPoll title="¿Abro la puerta?" options={poll} seconds={42} />
				<StreamCounter items={[{ label: "Muertes", value: 37 }]} />
				<StreamPinnedMessage message={{ user: "lucia_88", text: "hola" }} />
				<StreamMeter label="Nivel de miedo" value={50} />
			</>,
		);
		expect(html).toContain("Quedan 0:42");
		expect(html).toContain("dark-mode");
	});
});

describe("StreamPoll", () => {
	it("Encuesta en marcha: etiqueta, tiempo y porcentajes", () => {
		const { container } = render(<StreamPoll title="¿Abro la puerta?" options={poll} seconds={42} />);
		expect(text(container)).toContain("Encuesta");
		expect(text(container)).toContain("¿Abro la puerta?");
		const timer = screen.getByRole("timer");
		expect(timer.textContent).toBe("Quedan 0:42");
		expect(timer.getAttribute("aria-live")).toBe("off");
		const [si, no] = screen.getAllByRole("listitem");
		expect(text(si)).toContain("Sí");
		expect(text(si)).toContain("29 % - 12 votos");
		expect(text(no)).toContain("71 % - 30 votos");
	});

	it("el tiempo va en m:ss y no baja de 0; sin seconds, no se ve", () => {
		const { rerender } = render(<StreamPoll title="t" options={poll} seconds={125} />);
		expect(screen.getByRole("timer").textContent).toBe("Quedan 2:05");
		rerender(<StreamPoll title="t" options={poll} seconds={-3} />);
		expect(screen.getByRole("timer").textContent).toBe("Quedan 0:00");
		rerender(<StreamPoll title="t" options={poll} />);
		expect(screen.queryByRole("timer")).toBeNull();
	});

	it("Predicción bloqueada: «Votación cerrada», puntos y personas", () => {
		const { container } = render(
			<StreamPoll
				variant="prediction"
				state="locked"
				seconds={30}
				title="¿Muere antes del jefe?"
				options={[
					{ id: "a", label: "Sí", votes: 1500, users: 38 },
					{ id: "b", label: "No", votes: 1, users: 1 },
				]}
			/>,
		);
		expect(text(container)).toContain("Predicción");
		expect(text(container)).toContain("Votación cerrada");
		expect(screen.queryByRole("timer")).toBeNull();
		const [a, b] = screen.getAllByRole("listitem");
		expect(text(a)).toContain("1.500 puntos");
		expect(text(a)).toContain("38 personas");
		expect(text(b)).toContain("1 punto");
		expect(text(b)).toContain("1 persona");
	});

	it("Resultado: marca la ganadora, apaga las demás y dice quién ha ganado", () => {
		const { container } = render(<StreamPoll title="t" options={poll} state="ended" winnerId="no" />);
		const [si, no] = screen.getAllByRole("listitem");
		expect(text(no)).toContain("(ganadora)");
		expect(text(si)).not.toContain("ganadora");
		const fill = (li: Element | undefined) => li?.querySelector("[aria-hidden=true] > div");
		expect(classes(fill(no))).toContain("bg-brand-solid");
		expect(classes(fill(no))).not.toContain("opacity-40");
		expect(classes(fill(si))).toContain("opacity-40");
		expect(text(container)).toContain("Ha ganado Ni loco");
	});

	it("terminada sin ganadora dice «Votación terminada»", () => {
		const { container } = render(<StreamPoll title="t" options={poll} state="ended" />);
		expect(text(container)).toContain("Votación terminada");
	});

	it("Sin votos: 0 % y ninguna barra con relleno", () => {
		render(
			<StreamPoll
				title="t"
				options={[
					{ id: 1, label: "A", votes: 0 },
					{ id: 2, label: "B", votes: Number.NaN },
				]}
			/>,
		);
		for (const li of screen.getAllByRole("listitem")) {
			expect(text(li)).toContain("0 %");
			expect((li.querySelector("[aria-hidden=true] > div") as HTMLElement).style.width).toBe("0%");
		}
	});

	it("pinta como mucho 10 opciones", () => {
		const many = Array.from({ length: 12 }, (_, i) => ({ id: i, label: `O${i}`, votes: 1 }));
		render(<StreamPoll variant="prediction" title="t" options={many} />);
		expect(screen.getAllByRole("listitem")).toHaveLength(10);
	});

	it("la entrada y la salida van en motion", () => {
		const { container, rerender } = render(<StreamPoll title="t" options={poll} motion="enter" />);
		const card = () => container.firstElementChild;
		for (const c of (streamMotion("enter") ?? "").split(" ")) expect(classes(card())).toContain(c);
		rerender(<StreamPoll title="t" options={poll} motion="exit" />);
		for (const c of (streamMotion("exit") ?? "").split(" ")) expect(classes(card())).toContain(c);
	});

	it("los textos se sustituyen con labels", () => {
		const { container } = render(
			<StreamPoll
				title="t"
				options={poll}
				seconds={5}
				labels={{ poll: "Votación", remaining: (c) => `${c} restantes` }}
			/>,
		);
		expect(text(container)).toContain("Votación");
		expect(screen.getByRole("timer").textContent).toBe("0:05 restantes");
	});

	it("es accesible en los dos temas", async () => {
		await expectAccessibleInThemes(<StreamPoll title="t" options={poll} state="ended" winnerId="si" />);
	});
});

describe("StreamCounter", () => {
	it("Dos contadores: en fila, con texto y cifra tabular", () => {
		const { container } = render(
			<StreamCounter
				items={[
					{ label: "Muertes", value: 37 },
					{ label: "Sustos", value: 12 },
				]}
			/>,
		);
		const dl = container.querySelector("dl");
		expect(classes(dl)).toEqual(expect.arrayContaining(["inline-flex", "dark-mode"]));
		expect([...container.querySelectorAll("dt")].map((d) => d.textContent)).toEqual([
			"Muertes",
			"Sustos",
		]);
		const dd = container.querySelectorAll("dd");
		expect([...dd].map((d) => d.textContent)).toEqual(["37", "12"]);
		expect(classes(dd[0])).toContain("tabular-nums");
	});

	it("Cambio de cifra: entra con fundido y sin desplazamiento", () => {
		const { container, rerender } = render(<StreamCounter items={[{ label: "Muertes", value: 37 }]} />);
		const before = container.querySelector("dd > span");
		rerender(<StreamCounter items={[{ label: "Muertes", value: 38 }]} />);
		const after = container.querySelector("dd > span");
		expect(after).not.toBe(before);
		expect(after?.textContent).toBe("38");
		expect(classes(after)).toEqual(expect.arrayContaining(["transition-opacity", "starting:opacity-0"]));
		expect(classes(after).some((c) => c.includes("translate"))).toBe(false);
	});

	it("a partir del tercero no se pintan, y lo que no es un entero de 0 o más es 0", () => {
		const { container } = render(
			<StreamCounter
				items={[
					{ label: "A", value: Number.NaN },
					{ label: "B", value: -1 },
					{ label: "C", value: 3 },
				]}
			/>,
		);
		expect(container.querySelectorAll("dt")).toHaveLength(2);
		expect([...container.querySelectorAll("dd")].map((d) => d.textContent)).toEqual(["0", "0"]);
		const { container: c2 } = render(<StreamCounter items={[{ label: "D", value: 2.5 }]} />);
		expect(c2.querySelector("dd")?.textContent).toBe("0");
	});

	it("cifras grandes con formato español", () => {
		const { container } = render(<StreamCounter items={[{ label: "Muertes", value: 1284 }]} />);
		expect(container.querySelector("dd")?.textContent).toBe("1.284");
	});

	it("es accesible en los dos temas", async () => {
		await expectAccessibleInThemes(
			<StreamCounter
				items={[
					{ label: "Muertes", value: 37 },
					{ label: "Sustos", value: 12 },
				]}
			/>,
		);
	});
});

describe("StreamPinnedMessage", () => {
	it("rótulo, insignias, nombre en su tono y texto", () => {
		const { container } = render(
			<StreamPinnedMessage
				message={{
					user: "lucia_88",
					tone: "pink",
					badges: ["sub"],
					text: "¿Has mirado detrás del cuadro?",
				}}
			/>,
		);
		expect(container.textContent).toContain("Mensaje destacado");
		expect(
			within(container as HTMLElement)
				.getByRole("img")
				.getAttribute("aria-label"),
		).toBe("Suscriptor");
		const name = [...container.querySelectorAll(".font-semibold")].find(
			(e) => e.textContent === "lucia_88:",
		);
		expect(classes(name)).toContain("text-utility-pink-700");
		expect(container.textContent).toContain("¿Has mirado detrás del cuadro?");
	});

	it("Mensaje con HTML: literal", () => {
		const { container } = render(<StreamPinnedMessage message={{ user: "u", text: "<b>hola</b>" }} />);
		expect(container.querySelector("b")).toBeNull();
		expect(container.textContent).toContain("<b>hola</b>");
	});

	it("corta a cuatro líneas y marca los enlaces, como ChatBox", () => {
		const { container } = render(
			<StreamPinnedMessage message={{ user: "u", text: `${"palabra ".repeat(60)}https://jotis.me` }} />,
		);
		expect(classes(container.querySelector("p"))).toContain("line-clamp-4");
		const link = [...container.querySelectorAll("span")].find(
			(s) => s.textContent === "https://jotis.me",
		);
		expect(classes(link)).toContain("underline");
	});

	it("el rótulo se sustituye con labels", () => {
		const { container } = render(
			<StreamPinnedMessage message={{ user: "u", text: "x" }} labels={{ pinned: "Fijado" }} />,
		);
		expect(container.textContent).toContain("Fijado");
	});

	it("es accesible en los dos temas", async () => {
		await expectAccessibleInThemes(
			<StreamPinnedMessage
				message={{ user: "lucia_88", tone: "pink", badges: ["mod"], text: "hola" }}
			/>,
		);
	});
});

describe("StreamMeter", () => {
	it("Nivel: barra al 64 %, sin cifras, con role meter y nombre", () => {
		const { container } = render(<StreamMeter label="Nivel de miedo" value={64} />);
		const meter = screen.getByRole("meter", { name: "Nivel de miedo" });
		expect(meter.getAttribute("aria-valuenow")).toBe("64");
		expect(meter.getAttribute("aria-valuemin")).toBe("0");
		expect(meter.getAttribute("aria-valuemax")).toBe("100");
		expect((meter.firstElementChild as HTMLElement).style.width).toBe("64%");
		expect(container.textContent).toBe("Nivel de miedo");
	});

	it("Valor fuera de rango: 140 → 100 %, −5 y NaN → 0 %", () => {
		const width = (v: number) => {
			const { unmount } = render(<StreamMeter label="m" value={v} />);
			const w = (screen.getByRole("meter").firstElementChild as HTMLElement).style.width;
			unmount();
			return w;
		};
		expect([width(140), width(-5), width(Number.NaN)]).toEqual(["100%", "0%", "0%"]);
	});

	it("Lleno: un anillo que solo cambia de opacidad (también con movimiento reducido)", () => {
		const { container, rerender } = render(<StreamMeter label="m" value={100} />);
		const ring = () => container.querySelector("span[aria-hidden=true]");
		expect(classes(ring())).toContain("opacity-0");
		rerender(<StreamMeter label="m" value={100} full />);
		expect(classes(ring())).toEqual(
			expect.arrayContaining(["opacity-100", "transition-opacity", "ring-brand", "border-brand"]),
		);
		expect(classes(ring()).some((c) => /translate|scale/.test(c))).toBe(false);
	});

	it("es accesible en los dos temas", async () => {
		await expectAccessibleInThemes(<StreamMeter label="Nivel de miedo" value={64} full />);
	});
});
