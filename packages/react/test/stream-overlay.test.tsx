// Stream (13.3): StreamAlert, StreamEvents, StreamStatus y ChatBadge.
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { render, screen, within } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ChatBadge, StreamAlert, type StreamEventItem, StreamEvents, StreamStatus } from "../src/index.js";
import { streamMotion } from "../src/internal/stream.js";
import { expectAccessibleInThemes } from "./helpers.js";

const root = join(import.meta.dirname, "..");
const isClient = (file: string) =>
	/^\s*["']use client["']/.test(readFileSync(join(root, "src/components", file), "utf8"));
const classes = (el: Element | null | undefined) => (el?.getAttribute("class") ?? "").split(/\s+/);

describe("frontera servidor/cliente", () => {
	it("los cuatro son de servidor", () => {
		for (const f of ["StreamAlert.tsx", "StreamEvents.tsx", "StreamStatus.tsx", "ChatBadge.tsx"])
			expect(isClient(f), f).toBe(false);
		const html = renderToString(
			<>
				<StreamAlert type="raid" user="TioBigotes" amount={1284} />
				<StreamEvents items={[{ type: "follow", user: "lucia_pixel", time: "ahora" }]} />
				<StreamStatus viewers={1284} uptime="2:14:05" />
				<ChatBadge kind="mod" />
			</>,
		);
		expect(html).toContain("TioBigotes");
		expect(html).toContain("1.284 espectadores acaban de aterrizar.");
	});
});

describe("StreamAlert", () => {
	it("es una región de estado siempre en oscuro, con etiqueta, usuario y texto por defecto", () => {
		render(<StreamAlert type="sub" user="nachoXL" tier={1} />);
		const alert = screen.getByRole("status");
		expect(alert.getAttribute("aria-live")).toBe("polite");
		expect(classes(alert)).toContain("dark-mode");
		expect(alert.textContent).toContain("Nueva suscripción");
		expect(alert.textContent).toContain("nachoXL");
		expect(alert.textContent).toContain("Suscripción de nivel 1.");
	});

	it("los siete tipos llevan el icono en bg-brand-solid: el tipo lo dice la etiqueta, no el color", () => {
		const types = ["follow", "sub", "resub", "gift", "raid", "bits", "donation"] as const;
		const { container } = render(
			types.map((t) => <StreamAlert key={t} type={t} user="u" amount={5} months={3} />),
		);
		const icons = container.querySelectorAll("[role=status] > span:first-child");
		expect(icons).toHaveLength(7);
		for (const icon of icons) expect(classes(icon)).toContain("bg-brand-solid");
		const labels = [...container.querySelectorAll("[role=status]")].map(
			(a) => a.querySelector(":scope > div > span")?.textContent,
		);
		expect(labels).toEqual([
			"Nuevo seguidor",
			"Nueva suscripción",
			"Suscripción renovada",
			"Suscripciones regaladas",
			"Raid entrante",
			"Bits",
			"Donación",
		]);
		expect(container.textContent).toMatch(/5,00\s€/);
		expect(container.textContent).toContain("Lleva 3 meses por aquí.");
		expect(container.textContent).toContain("5 suscripciones regaladas al chat.");
	});

	it("`detail`, `label` e `icon` sustituyen a los del tipo", () => {
		const { container } = render(
			<StreamAlert
				type="follow"
				user="lucia_pixel"
				detail="Bienvenida."
				label="Seguidora"
				icon="bell-01"
			/>,
		);
		expect(container.textContent).toContain("Seguidora");
		expect(container.textContent).toContain("Bienvenida.");
		expect(container.textContent).not.toContain("Ya no hay vuelta atrás.");
		expect(container.textContent).not.toContain("Nuevo seguidor");
	});

	it("el mensaje del público se pinta como texto plano, nunca como HTML", () => {
		const { container } = render(
			<StreamAlert
				type="donation"
				user="Marta"
				amount={5}
				message="<b>hola</b><img src=x onerror=alert(1)>"
			/>,
		);
		expect(container.querySelector("b")).toBeNull();
		expect(container.querySelector("img")).toBeNull();
		expect(container.textContent).toContain("<b>hola</b><img src=x onerror=alert(1)>");
	});

	it("`state` aplica la entrada o la salida de la base de Stream; sin él no hay movimiento", () => {
		const { rerender } = render(<StreamAlert user="u" state="enter" />);
		const alert = screen.getByRole("status");
		for (const c of (streamMotion("enter") ?? "").split(" ")) expect(classes(alert)).toContain(c);
		rerender(<StreamAlert user="u" state="exit" />);
		for (const c of (streamMotion("exit") ?? "").split(" ")) expect(classes(alert)).toContain(c);
		rerender(<StreamAlert user="u" />);
		expect(classes(alert).some((c) => c.startsWith("starting:") || c.startsWith("transition"))).toBe(
			false,
		);
	});

	it("pasa axe en claro y oscuro", async () => {
		await expectAccessibleInThemes(
			<StreamAlert type="raid" user="TioBigotes" amount={1284} message="Hola" />,
		);
	});
});

const all: StreamEventItem[] = [
	{ type: "follow", user: "lucia_pixel", time: "ahora" },
	{ type: "donation", user: "Marta_en_Directo", amount: 5, time: "2 min" },
	{ type: "raid", user: "TioBigotes", amount: 1284, time: "9 min" },
	{ type: "resub", user: "nachoXL", months: 14, time: "12 min" },
	{ type: "gift", user: "ElSilencioso", amount: 5, time: "20 min" },
	{ type: "bits", user: "Pixel_Panda", amount: 500, time: "31 min" },
	{ type: "sub", user: "cafeconleche", time: "40 min" },
];

describe("StreamEvents", () => {
	it("enseña cinco por defecto, en una lista con el título como nombre", () => {
		render(<StreamEvents items={all} />);
		const list = screen.getByRole("list", { name: "Últimos eventos" });
		expect(within(list).getAllByRole("listitem")).toHaveLength(5);
		expect(classes(list.parentElement)).toContain("dark-mode");
	});

	it("`max`, `title` y `width` cambian filas, título y ancho", () => {
		render(<StreamEvents items={all} max={7} title="Hoy" width={300} />);
		const list = screen.getByRole("list", { name: "Hoy" });
		expect(within(list).getAllByRole("listitem")).toHaveLength(7);
		expect((list.parentElement as HTMLElement).style.width).toBe("300px");
	});

	it("genera el detalle en es-ES, con la hora relativa al lado; `detail` lo sustituye", () => {
		render(
			<StreamEvents
				items={[...all.slice(0, 6), { type: "sub", user: "x", detail: "Nivel 3" }]}
				max={7}
			/>,
		);
		const rows = screen.getAllByRole("listitem").map((li) => li.textContent?.replace(/ /g, " "));
		expect(rows).toEqual([
			"lucia_pixelNuevo seguidorahora",
			"Marta_en_DirectoDonación · 5,00 €2 min",
			"TioBigotesRaid entrante · 1.2849 min",
			"nachoXLSuscripción renovada · 14 meses12 min",
			"ElSilenciosoSuscripciones regaladas · 520 min",
			"Pixel_PandaBits · 50031 min",
			"xNivel 3",
		]);
	});

	it("con `animate` solo entra la primera fila, y al llegar un evento las demás se conservan", () => {
		const enter = streamMotion("enter") ?? "";
		const { rerender } = render(<StreamEvents items={all.slice(1)} animate />);
		const before = screen.getAllByRole("listitem");
		expect(classes(before[0])).toEqual(expect.arrayContaining(enter.split(" ")));
		for (const li of before.slice(1))
			expect(classes(li).some((c) => c.startsWith("starting:"))).toBe(false);

		rerender(<StreamEvents items={all} animate />);
		const after = screen.getAllByRole("listitem");
		expect(after[0]?.textContent).toContain("lucia_pixel");
		// La fila de Marta es el mismo nodo: no se vuelve a montar ni a animar.
		expect(after[1]).toBe(before[0]);
		expect(classes(after[1]).some((c) => c.startsWith("starting:"))).toBe(false);
	});

	it("sin `animate` no hay movimiento", () => {
		render(<StreamEvents items={all} />);
		for (const li of screen.getAllByRole("listitem"))
			expect(classes(li).some((c) => c.startsWith("starting:"))).toBe(false);
	});

	it("pasa axe en claro y oscuro", async () => {
		await expectAccessibleInThemes(<StreamEvents items={all} max={7} />);
	});
});

describe("StreamStatus", () => {
	it("en directo: punto fg-success-secondary junto a la palabra, espectadores y tiempo", () => {
		render(<StreamStatus status="live" viewers={1284} uptime="2:14:05" category="Just Chatting" />);
		const status = screen.getByRole("status");
		expect(classes(status)).toContain("dark-mode");
		const state = status.firstElementChild as HTMLElement;
		expect(state.textContent).toBe("En directo");
		const dot = state.querySelector("[aria-hidden=true]");
		expect(classes(dot)).toContain("bg-fg-success-secondary");
		expect(status.querySelector("[class*=error]")).toBeNull();
		expect(status.textContent).toBe("En directo1.284 espectadores2:14:05 en emisiónJust Chatting");
	});

	it("reemisión y sin directo: su punto y sin espectadores ni tiempo", () => {
		const { container } = render(
			<>
				<StreamStatus status="rerun" viewers={10} uptime="1:00" category="Reemisión del jueves" />
				<StreamStatus status="offline" viewers={10} />
			</>,
		);
		const [rerun, offline] = screen.getAllByRole("status");
		expect(rerun?.textContent).toBe("ReemisiónReemisión del jueves");
		expect(classes(rerun?.querySelector("[aria-hidden=true]") ?? null)).toContain(
			"bg-fg-warning-secondary",
		);
		expect(offline?.textContent).toBe("Sin directo");
		expect(classes(offline?.querySelector("[aria-hidden=true]") ?? null)).toContain("bg-fg-quaternary");
		expect(container.querySelectorAll("svg")).toHaveLength(0);
	});

	it("las cifras son tabulares y los textos se pueden sustituir", () => {
		render(
			<StreamStatus
				viewers={5}
				uptime="0:05"
				labels={{ live: "Live", viewers: "viewers", uptime: "on air" }}
			/>,
		);
		const status = screen.getByRole("status");
		expect(status.textContent).toBe("Live5 viewers0:05 on air");
		expect(classes(status.children[1] ?? null)).toContain("tabular-nums");
	});

	it("pasa axe en claro y oscuro", async () => {
		await expectAccessibleInThemes(
			<StreamStatus viewers={1284} uptime="2:14:05" category="Just Chatting" />,
		);
	});
});

describe("ChatBadge", () => {
	it("cada rol lleva su nombre, su icono y su tono utility, siempre en oscuro", () => {
		const kinds = [
			["broadcaster", "Streamer", "brand"],
			["mod", "Moderador", "emerald"],
			["vip", "VIP", "pink"],
			["sub", "Suscriptor", "sky"],
			["bits", "Bits", "purple"],
		] as const;
		render(kinds.map(([k]) => <ChatBadge key={k} kind={k} />));
		const icons = new Set<string>();
		for (const [, label, tone] of kinds) {
			const badge = screen.getByRole("img", { name: label });
			expect(badge.getAttribute("title")).toBe(label);
			expect(classes(badge)).toEqual(
				expect.arrayContaining([
					"dark-mode",
					`bg-utility-${tone}-50`,
					`text-utility-${tone}-700`,
					`inset-ring-utility-${tone}-200`,
				]),
			);
			icons.add(badge.querySelector("svg")?.innerHTML ?? "");
		}
		expect(icons.size).toBe(5);
	});

	it("20px por defecto con el icono al 65 %; `size` y `title` cambian lado y nombre", () => {
		const { rerender } = render(<ChatBadge />);
		let badge = screen.getByRole("img", { name: "Suscriptor" });
		expect(badge.style.width).toBe("20px");
		expect(badge.style.height).toBe("20px");
		expect(badge.querySelector("svg")?.getAttribute("width")).toBe("13");
		rerender(<ChatBadge kind="mod" size={28} title="Moderadora" />);
		badge = screen.getByRole("img", { name: "Moderadora" });
		expect(badge.style.width).toBe("28px");
		expect(badge.querySelector("svg")?.getAttribute("width")).toBe("18");
	});

	it("pasa axe en claro y oscuro", async () => {
		await expectAccessibleInThemes(
			<p>
				<ChatBadge kind="broadcaster" /> <ChatBadge kind="mod" size={18} /> jotis
			</p>,
		);
	});
});
