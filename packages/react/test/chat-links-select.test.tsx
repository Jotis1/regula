// ChatBox: enlaces, insignias junto al nombre y mensajes seleccionables (add-live-interaction-pieces, D6–D8).
import { fireEvent, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { renderToString } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { ChatBox, type ChatMessage } from "../src/index.js";
import { splitLinks } from "../src/internal/links.js";
import { expectAccessibleInThemes } from "./helpers.js";

const classes = (el: Element | null | undefined) => (el?.getAttribute("class") ?? "").split(/\s+/);
const links = (text: string) =>
	splitLinks(text)
		.filter((p) => p.link)
		.map((p) => p.text);

describe("splitLinks", () => {
	it("Mensaje con enlace: sin el punto final", () => {
		expect(splitLinks("mira https://jotis.me.")).toEqual([
			{ text: "mira ", link: false },
			{ text: "https://jotis.me", link: true },
			{ text: ".", link: false },
		]);
	});

	it("Con www", () => {
		expect(links("www.jotis.me/videos")).toEqual(["www.jotis.me/videos"]);
	});

	it("Sin protocolo no marca nada", () => {
		expect(links("voy por la v1.2, ok.vale y jotis.me")).toEqual([]);
	});

	it("recorta signos y paréntesis que no son suyos, y respeta los que sí", () => {
		expect(links("(ver https://jotis.me)")).toEqual(["https://jotis.me"]);
		expect(links("¿esto? https://jotis.me/a?b=1!!")).toEqual(["https://jotis.me/a?b=1"]);
		expect(links("https://es.wikipedia.org/wiki/Sol_(estrella).")).toEqual([
			"https://es.wikipedia.org/wiki/Sol_(estrella)",
		]);
	});

	it("varios enlaces, en mayúsculas y un prefijo solo", () => {
		expect(links("HTTPS://A.es y http://b.com, luego https:// y www.")).toEqual([
			"HTTPS://A.es",
			"http://b.com",
		]);
	});

	it("un texto sin enlaces es un solo trozo, también el vacío", () => {
		expect(splitLinks("hola")).toEqual([{ text: "hola", link: false }]);
		expect(splitLinks("")).toEqual([{ text: "", link: false }]);
	});

	it("los trozos juntos dan el texto de partida", () => {
		for (const t of ["mira https://jotis.me.", "a www.b.c d https://e.f/(g) h", "nada"])
			expect(
				splitLinks(t)
					.map((p) => p.text)
					.join(""),
			).toBe(t);
	});
});

describe("Enlaces en el chat", () => {
	it("se ven subrayados y en el color de marca, sin <a>", () => {
		const { container } = render(<ChatBox messages={[{ user: "u", text: "mira https://jotis.me." }]} />);
		const link = [...container.querySelectorAll("span")].find(
			(s) => s.textContent === "https://jotis.me",
		);
		expect(classes(link)).toEqual(expect.arrayContaining(["text-brand-secondary", "underline"]));
		expect(container.querySelector("a")).toBeNull();
		expect(container.textContent).toContain("mira https://jotis.me.");
	});

	it("Enlace con HTML: se ve literal", () => {
		const { container } = render(
			<ChatBox messages={[{ user: "u", text: "https://x.com/<b>hola</b>" }]} />,
		);
		expect(container.querySelector("b")).toBeNull();
		expect(container.textContent).toContain("https://x.com/<b>hola</b>");
	});
});

describe("Insignias junto al nombre", () => {
	it("las insignias, el nombre y los dos puntos van en un grupo que no se parte", () => {
		render(
			<ChatBox
				messages={[{ user: "TioBigotes", badges: ["mod", "sub", "vip"], text: "x".repeat(300) }]}
			/>,
		);
		const row = screen.getByRole("log").firstElementChild?.firstElementChild;
		const group = row?.firstElementChild;
		expect(classes(group)).toContain("whitespace-nowrap");
		expect(group?.querySelectorAll("[role=img]")).toHaveLength(3);
		expect(group?.textContent).toBe("TioBigotes:");
	});

	it("las insignias van en una caja de una línea de alto, centradas", () => {
		render(<ChatBox messages={[{ user: "u", badges: ["mod"], text: "hola" }]} />);
		const box = screen.getByRole("img").parentElement;
		expect(classes(box)).toEqual(expect.arrayContaining(["h-[1lh]", "items-center", "align-top"]));
	});
});

const chat: ChatMessage[] = [
	{ id: "a", user: "TioBigotes", badges: ["mod"], text: "Bienvenidos todos." },
	{ id: "b", user: "lucia_88", text: "¿Has mirado detrás del cuadro?" },
	{ id: "c", user: "Nightbot", text: "Sigue el canal.", selectable: false },
	{ user: "sin_id", text: "No tengo id." },
];

describe("Chat seleccionable", () => {
	it("Elegir un mensaje: llama a onSelect con él", () => {
		const onSelect = vi.fn();
		render(<ChatBox messages={chat} onSelect={onSelect} />);
		fireEvent.click(screen.getByRole("button", { name: /lucia_88/ }));
		expect(onSelect).toHaveBeenCalledWith(chat[1]);
	});

	it("Elegido a la vista: aria-pressed, fondo activo y borde índigo", () => {
		render(<ChatBox messages={chat} onSelect={() => {}} selectedId="b" />);
		const [a, b] = screen.getAllByRole("button");
		expect(b?.getAttribute("aria-pressed")).toBe("true");
		expect(classes(b)).toEqual(expect.arrayContaining(["bg-active", "border-brand"]));
		expect(a?.getAttribute("aria-pressed")).toBe("false");
		expect(classes(a)).not.toContain("bg-active");
	});

	it("Mensaje no seleccionable: ni con selectable false ni sin id", () => {
		render(<ChatBox messages={chat} onSelect={() => {}} />);
		expect(screen.getAllByRole("button")).toHaveLength(2);
		expect(screen.queryByRole("button", { name: /Nightbot/ })).toBeNull();
		expect(screen.queryByRole("button", { name: /sin_id/ })).toBeNull();
	});

	it("Con teclado: Tab y Enter", async () => {
		const user = userEvent.setup();
		const onSelect = vi.fn();
		render(<ChatBox messages={chat} onSelect={onSelect} />);
		await user.tab();
		expect(document.activeElement?.textContent).toContain("TioBigotes");
		expect(classes(document.activeElement)).toContain("focus-visible:shadow-focus-ring");
		await user.keyboard("{Enter}");
		expect(onSelect).toHaveBeenCalledWith(chat[0]);
	});

	it("Sin onSelect: ningún botón", () => {
		const html = renderToString(<ChatBox messages={chat} selectedId="b" />);
		expect(html).not.toContain("<button");
		expect(html).not.toContain("aria-pressed");
	});

	it("es accesible en los dos temas con onSelect", async () => {
		await expectAccessibleInThemes(<ChatBox messages={chat} onSelect={() => {}} selectedId="a" />);
	});
});
