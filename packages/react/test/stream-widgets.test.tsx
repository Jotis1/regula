// Stream (13.4): ChatBox, CamFrame, StreamGoal y NowPlaying.
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { compile } from "@tailwindcss/node";
import { render, screen, within } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { CamFrame, ChatBox, type ChatMessage, NowPlaying, StreamGoal } from "../src/index.js";
import { streamMotion } from "../src/internal/stream.js";
import { expectAccessibleInThemes } from "./helpers.js";

const root = join(import.meta.dirname, "..");
const isClient = (file: string) =>
	/^\s*["']use client["']/.test(readFileSync(join(root, "src/components", file), "utf8"));
const classes = (el: Element | null | undefined) => (el?.getAttribute("class") ?? "").split(/\s+/);
const entering = (el: Element | null | undefined) => classes(el).some((c) => c.startsWith("starting:"));

async function css(list: string[]) {
	const compiler = await compile('@import "tailwindcss";\n@import "../styles.css";', {
		base: join(root, "test"),
		onDependency: () => {},
	});
	return compiler.build(list);
}

const msgs: ChatMessage[] = [
	{ user: "TioBigotes", tone: "sky", badges: ["mod"], text: "Bienvenidos todos." },
	{ user: "lucia_pixel", tone: "pink", badges: ["sub", "vip"], text: "Esa jugada la he visto yo." },
	{ user: "ElSilencioso", text: "Llego tarde pero llego." },
];

describe("frontera servidor/cliente", () => {
	it("los cuatro son de servidor", () => {
		for (const f of ["ChatBox.tsx", "CamFrame.tsx", "StreamGoal.tsx", "NowPlaying.tsx"])
			expect(isClient(f), f).toBe(false);
		const html = renderToString(
			<>
				<ChatBox messages={msgs} />
				<CamFrame live name="Tu canal" />
				<StreamGoal label="Meta" current={1} goal={2} />
				<NowPlaying title="Canción" progress={0.5} />
			</>,
		);
		expect(html).toContain("Bienvenidos todos.");
	});
});

describe("ChatBox", () => {
	it("es un registro con nombre, siempre en oscuro, 420×520 por defecto", () => {
		render(<ChatBox messages={msgs} />);
		const log = screen.getByRole("log", { name: "Chat del directo" });
		expect(log.getAttribute("aria-live")).toBe("polite");
		expect(classes(log)).toEqual(
			expect.arrayContaining(["dark-mode", "w-[420px]", "h-[520px]", "bg-primary_alt"]),
		);
	});

	it("nombre en semibold con el tono utility-700 y dos puntos; neutral por defecto; insignias delante", () => {
		render(<ChatBox messages={msgs} />);
		const log = screen.getByRole("log");
		const rows = log.firstElementChild?.children ?? [];
		expect(rows).toHaveLength(3);
		const user = (row: Element | undefined) => row?.querySelector(".font-semibold");
		expect(classes(user(rows[0]))).toContain("text-utility-sky-700");
		expect(classes(user(rows[2]))).toContain("text-utility-neutral-700");
		expect(user(rows[0])?.textContent).toBe("TioBigotes:");
		expect(
			within(rows[1] as HTMLElement)
				.getAllByRole("img")
				.map((b) => b.getAttribute("aria-label")),
		).toEqual(["Suscriptor", "VIP"]);
		expect(rows[2]?.querySelector("[role=img]")).toBeNull();
	});

	it("un mensaje con HTML se ve literal, sin negrita", () => {
		const { container } = render(<ChatBox messages={[{ user: "x", text: "<b>hola</b>" }]} />);
		expect(container.querySelector("b")).toBeNull();
		expect(container.textContent).toContain("<b>hola</b>");
	});

	it("desvanecido arriba por defecto; `fade={false}` lo quita", () => {
		const { container, rerender } = render(<ChatBox messages={msgs} />);
		const list = () => container.querySelector("[role=log] > div") as HTMLElement;
		expect(list().style.maskImage).toContain("transparent 0, black 30%");
		rerender(<ChatBox messages={msgs} fade={false} />);
		expect(list().style.maskImage).toBe("");
	});

	it("translúcido: mezcla con color-mix y desenfoque de 16px, con fondo sólido de reserva", async () => {
		render(<ChatBox messages={msgs} translucent width={400} height={400} />);
		const log = screen.getByRole("log");
		expect(log.style.width).toBe("400px");
		const out = await css(classes(log));
		const rule = out.slice(out.indexOf(".bg-primary_alt\\/72"));
		expect(rule).toMatch(/^\.bg-primary_alt\\\/72\s*\{\s*background-color: var\(--bg-primary_alt\);/);
		expect(rule).toMatch(
			/@supports \(color: color-mix\(in lab, red, red\)\)\s*\{\s*background-color: color-mix\(in oklab, var\(--bg-primary_alt\) 72%, transparent\)/,
		);
		expect(out).toContain("--tw-backdrop-blur: blur(16px)");
	});

	it("con `animate` solo entra el último mensaje; al llegar otro, los demás no se vuelven a montar", () => {
		const enter = (streamMotion("enter") ?? "").split(" ");
		const { container, rerender } = render(<ChatBox messages={msgs} animate />);
		const rows = () => [...(container.querySelector("[role=log] > div")?.children ?? [])];
		const before = rows();
		expect(classes(before[2])).toEqual(expect.arrayContaining(enter));
		expect(before.slice(0, 2).some(entering)).toBe(false);

		// Ventana deslizante: entra uno y sale el más antiguo, con la misma longitud.
		rerender(
			<ChatBox messages={[...msgs.slice(1), { user: "nachoXL", text: "Primer susto." }]} animate />,
		);
		const after = rows();
		expect(after[1]).toBe(before[2]);
		expect(entering(after[1])).toBe(false);
		expect(entering(after[2])).toBe(true);
		expect(after[2]).not.toBe(before[2]);
	});

	it("sin `animate` nada se mueve", () => {
		const { container } = render(<ChatBox messages={msgs} />);
		expect([...(container.querySelector("[role=log] > div")?.children ?? [])].some(entering)).toBe(false);
	});

	it("pasa axe en claro y oscuro", async () => {
		await expectAccessibleInThemes(<ChatBox messages={msgs} translucent />);
	});
});

describe("CamFrame", () => {
	it("marco sin fondo con la proporción pedida y borde de 2px border-primary en radius-2xl", () => {
		const { container } = render(<CamFrame ratio="4:3" width={280} name="Invitada" />);
		const frame = container.firstElementChild as HTMLElement;
		expect(frame.style.aspectRatio).toBe("4 / 3");
		expect(frame.style.width).toBe("280px");
		expect(classes(frame)).toEqual(
			expect.arrayContaining(["dark-mode", "rounded-2xl", "after:border-2", "after:border-primary"]),
		);
		expect(classes(frame).some((c) => c.startsWith("bg-"))).toBe(false);
		expect(frame.textContent).toBe("Invitada");
	});

	it("`live` pone el punto verde y la palabra; sin nombre ni `live` no hay etiqueta", () => {
		const { container, rerender } = render(<CamFrame live name="Tu canal" role="ella/él" />);
		const frame = container.firstElementChild as HTMLElement;
		expect(frame.textContent).toBe("En directoTu canalella/él");
		expect(classes(frame.querySelector("[aria-hidden=true]"))).toContain("bg-fg-success-secondary");
		rerender(<CamFrame live liveLabel="Live" />);
		expect(frame.textContent).toBe("Live");
		rerender(<CamFrame />);
		expect(frame.childElementCount).toBe(0);
		expect(frame.style.aspectRatio).toBe("16 / 9");
	});

	it("pasa axe en claro y oscuro", async () => {
		await expectAccessibleInThemes(<CamFrame live name="Tu canal" role="ella/él" />);
	});
});

describe("StreamGoal", () => {
	it("barra de progreso con nombre, valor acotado a la meta, cifras es-ES y lo que falta", () => {
		render(<StreamGoal label="Meta de seguidores" current={1284} goal={2000} />);
		const bar = screen.getByRole("progressbar", { name: "Meta de seguidores" });
		expect(bar.getAttribute("aria-valuemin")).toBe("0");
		expect(bar.getAttribute("aria-valuemax")).toBe("2000");
		expect(bar.getAttribute("aria-valuenow")).toBe("1284");
		expect((bar.firstElementChild as HTMLElement).style.width).toBe("64.2%");
		const card = bar.parentElement as HTMLElement;
		expect(classes(card)).toContain("dark-mode");
		expect(card.textContent?.replace(/ /g, " ")).toBe(
			"Meta de seguidores1.284 / 2.000Faltan 716 para la meta.64 %",
		);
	});

	it("meta conseguida: pie propio, barra llena y valor acotado", () => {
		render(<StreamGoal label="Subs" current={60} goal={50} unit="subs" />);
		const bar = screen.getByRole("progressbar");
		expect(bar.getAttribute("aria-valuenow")).toBe("50");
		expect((bar.firstElementChild as HTMLElement).style.width).toBe("100%");
		expect(bar.parentElement?.textContent).toContain("Meta conseguida. Toca poner otra.");
		expect(bar.parentElement?.textContent).toContain("60 / 50 subs");
	});

	it("la unidad va tras las cifras, el relleno en bg-brand-solid crece en 300 ms y los textos se sustituyen", () => {
		render(
			<StreamGoal
				label="Café"
				current={0}
				goal={40}
				unit="€"
				labels={{ remaining: (n) => `Quedan ${n}.` }}
			/>,
		);
		const bar = screen.getByRole("progressbar");
		const fill = bar.firstElementChild;
		expect(classes(fill)).toEqual(
			expect.arrayContaining(["bg-brand-solid", "duration-300", "motion-reduce:transition-none"]),
		);
		expect(classes(bar)).toEqual(expect.arrayContaining(["h-3.5", "bg-quaternary"]));
		expect(bar.parentElement?.textContent?.replace(/ /g, " ")).toBe("Café0 / 40 €Quedan 40 €.0 %");
	});

	it("pasa axe en claro y oscuro", async () => {
		await expectAccessibleInThemes(<StreamGoal label="Meta de seguidores" current={1284} goal={2000} />);
	});
});

describe("NowPlaying", () => {
	it("suena ahora, título, artista y barra de 3px con su nombre", () => {
		const { container } = render(
			<NowPlaying title="Cuatro paredes" artist="Los Vecinos" progress={0.42} />,
		);
		const card = container.firstElementChild as HTMLElement;
		expect(classes(card)).toContain("dark-mode");
		expect(card.textContent).toBe("Suena ahoraCuatro paredesLos Vecinos");
		const bar = screen.getByRole("progressbar", { name: "Progreso de la canción" });
		expect(bar.getAttribute("aria-valuenow")).toBe("42");
		expect(classes(bar)).toContain("h-[3px]");
		expect((bar.firstElementChild as HTMLElement).style.width).toBe("42%");
		// Sin carátula, icono de volumen; título y artista en una línea con puntos suspensivos.
		expect(card.querySelector("svg")).not.toBeNull();
		expect(card.querySelectorAll(".truncate")).toHaveLength(2);
	});

	it("en pausa, con carátula decorativa y sin barra si no hay progreso", () => {
		const { container } = render(<NowPlaying title="Silencio" cover="/c.jpg" paused />);
		expect(container.textContent).toBe("En pausaSilencio");
		expect(container.querySelector("img")?.getAttribute("alt")).toBe("");
		expect(screen.queryByRole("progressbar")).toBeNull();
	});

	it("los textos se sustituyen", () => {
		render(
			<NowPlaying title="t" progress={1.5} labels={{ playing: "Now playing", progress: "Progress" }} />,
		);
		const bar = screen.getByRole("progressbar", { name: "Progress" });
		expect(bar.getAttribute("aria-valuenow")).toBe("100");
		expect(screen.getByText("Now playing")).toBeTruthy();
	});

	it("pasa axe en claro y oscuro", async () => {
		await expectAccessibleInThemes(
			<NowPlaying title="Cuatro paredes" artist="Los Vecinos" progress={0.42} />,
		);
	});
});
