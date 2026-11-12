import { readFileSync } from "node:fs";
import { join } from "node:path";
import { render, screen, within } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ActivityFeed, type ActivityItem, Notification, VideoPlayer } from "../src/index.js";
import { expectAccessibleInThemes } from "./helpers.js";

const BEFORE: Record<string, string> = JSON.parse(
	readFileSync(join(import.meta.dirname, "fixtures/media-feed-before.json"), "utf8"),
);

const items: ActivityItem[] = [
	{
		author: "Pecunia",
		avatar: { initials: "Pe" },
		time: "Hace 2 min",
		text: "Importado",
		content: <span>adj</span>,
		unread: true,
	},
	{ author: "Vinculum", time: "Ayer", text: "3 contactos fusionados.", online: true },
];

describe("VideoPlayer, ActivityFeed y Notification: sin las props nuevas", () => {
	it("el HTML es el de antes", () => {
		expect(renderToStaticMarkup(<ActivityFeed items={items} />)).toMatchBefore(BEFORE.feed);
		expect(
			renderToStaticMarkup(<ActivityFeed connector items={items} size="sm" className="x" />),
		).toMatchBefore(BEFORE.feedConn);
		expect(
			renderToStaticMarkup(
				<Notification title="Hecho" description="Guardado" color="success" actions={<b>a</b>} />,
			),
		).toMatchBefore(BEFORE.note);
		expect(
			renderToStaticMarkup(<Notification title="Hecho" onClose={() => {}} className="y" />),
		).toMatchBefore(BEFORE.noteClose);
		expect(renderToStaticMarkup(<VideoPlayer duration={252} poster="/p.jpg" />)).toMatchBefore(
			BEFORE.video,
		);
	});

	it('divider="connector" pinta lo mismo que el alias connector', () => {
		expect(renderToStaticMarkup(<ActivityFeed divider="connector" items={items} />)).toMatchBefore(
			renderToStaticMarkup(<ActivityFeed connector items={items} />),
		);
	});
});

describe("VideoPlayer: tamaños", () => {
	it("sm: reproducir, volumen y pantalla completa, sin barra de progreso", () => {
		const { container } = render(<VideoPlayer size="sm" duration={504} />);
		expect((container.firstElementChild as HTMLElement).className).toContain("rounded-lg");
		expect(screen.getByRole("button", { name: "Reproducir" })).toBeTruthy();
		expect(screen.getByRole("button", { name: "Silenciar" })).toBeTruthy();
		expect(screen.getByRole("button", { name: "Pantalla completa" })).toBeTruthy();
		expect(screen.queryByRole("slider")).toBeNull();
		expect(screen.getByRole("button", { name: "Reproducir" }).className).toContain("p-2");
	});

	it("md: tiempo transcurrido, posición y tiempo que queda", () => {
		render(<VideoPlayer size="md" duration={504} />);
		expect(screen.getByText("00:00")).toBeTruthy();
		expect(screen.getByText("-08:24")).toBeTruthy();
		expect(screen.getByRole("slider", { name: "Posición" }).getAttribute("aria-valuetext")).toMatchBefore(
			"0:00 de 8:24",
		);
		expect(screen.queryByRole("slider", { name: "Volumen" })).toBeNull();
	});

	it("lg: volumen deslizante y velocidad que cambia al pulsar", async () => {
		const { container } = render(<VideoPlayer size="lg" duration={504} />);
		expect((container.firstElementChild as HTMLElement).className).toContain("rounded-xl");
		const volume = screen.getByRole("slider", { name: "Volumen" });
		expect((volume as HTMLInputElement).value).toBe("1");
		await userEvent.click(screen.getByRole("button", { name: "Velocidad: 1x" }));
		expect(screen.getByRole("button", { name: "Velocidad: 1.25x" })).toBeTruthy();
		await userEvent.click(screen.getByRole("button", { name: "Silenciar" }));
		expect((volume as HTMLInputElement).value).toBe("0");
	});

	it.each(["sm", "md", "lg"] as const)("axe en claro y oscuro (%s)", async (size) => {
		await expectAccessibleInThemes(<VideoPlayer size={size} duration={504} />);
	});
});

describe("ActivityFeed: divisores, mensajes y elementos de apoyo", () => {
	it("none no separa los elementos; line sí", () => {
		const { rerender } = render(<ActivityFeed divider="none" items={items} />);
		expect(screen.getByRole("list").className).not.toContain("border-t");
		rerender(<ActivityFeed divider="line" items={items} />);
		expect(screen.getByRole("list").className).toContain("[&>li+li]:border-t");
	});

	it("messages: usuario bajo el autor y el texto en una burbuja", () => {
		render(
			<ActivityFeed
				type="messages"
				divider="divider"
				items={[{ author: "Lana Steiner", handle: "@lana", time: "Hace 2 min", text: "¡Perfecto!" }]}
			/>,
		);
		expect(screen.getByText("@lana")).toBeTruthy();
		expect(screen.getByText("¡Perfecto!").className).toContain("rounded-b-lg");
	});

	it("supporting: etiquetas, archivo con nombre y tamaño, y texto", () => {
		render(
			<ActivityFeed
				items={[
					{
						author: "Ana",
						text: "Añadió etiquetas",
						supporting: { type: "tags", tags: ["Diseño", "Web"] },
					},
					{
						author: "Luis",
						text: "Subió un archivo",
						supporting: { type: "file", name: "informe.pdf", size: "720 KB" },
					},
					{ author: "Eva", text: "Comentó", supporting: { type: "text", text: "Lo miro mañana." } },
				]}
			/>,
		);
		const [tags, file, text] = screen
			.getAllByRole("listitem")
			.filter((li) => li.parentElement?.tagName === "OL");
		expect(within(tags as HTMLElement).getAllByRole("listitem")).toHaveLength(2);
		expect(within(file as HTMLElement).getByText("informe.pdf")).toBeTruthy();
		expect(within(file as HTMLElement).getByText("720 KB")).toBeTruthy();
		expect(within(text as HTMLElement).getByText("Lo miro mañana.")).toBeTruthy();
	});

	it("axe en claro y oscuro", async () => {
		await expectAccessibleInThemes(
			<ActivityFeed
				type="messages"
				items={[
					{ author: "Lana", handle: "@lana", text: "Hola", online: true },
					{
						author: "Eva",
						handle: "@eva",
						text: "",
						supporting: { type: "file", name: "a.pdf", size: "1 KB" },
					},
				]}
			/>,
		);
	});
});

describe("Notification: imagen, avatar y progreso", () => {
	it("progress: barra al 40 % anunciada como tal bajo el texto", () => {
		render(<Notification title="Subiendo «web.fig»" description="Espera un momento." progress={40} />);
		const bar = screen.getByRole("progressbar", { name: "Subiendo «web.fig»" });
		expect(bar.getAttribute("aria-valuenow")).toBe("40");
		expect(screen.getByText("40%")).toBeTruthy();
	});

	it("avatar: avatar en el sitio del icono y hora junto al título", () => {
		const { container } = render(
			<Notification
				title="Katherine Moss"
				time="Hace 2 min"
				description="He terminado mis notas."
				avatar={{ initials: "KM", status: "online" }}
			/>,
		);
		expect(screen.getByText("KM")).toBeTruthy();
		expect(screen.getByText("Hace 2 min")).toBeTruthy();
		expect((container.firstElementChild as HTMLElement).className).toContain("max-w-[var(--width-md)]");
	});

	it("image: imagen decorativa a la izquierda en contenedor ancho y arriba en estrecho", () => {
		const { container } = render(
			<Notification title="Nueva versión" image="/foto.jpg" onClose={() => {}} />,
		);
		const img = container.querySelector("img") as HTMLImageElement;
		expect(img.getAttribute("alt")).toBe("");
		expect(img.parentElement?.getAttribute("aria-hidden")).toBe("true");
		expect(img.parentElement?.parentElement?.className).toContain("@md:flex-row");
		expect(screen.getByRole("button", { name: "Descartar" })).toBeTruthy();
	});

	it("axe en claro y oscuro", async () => {
		await expectAccessibleInThemes(
			<div>
				<Notification title="Subiendo" progress={60} />
				<Notification title="Ana" time="Ahora" avatar={{ initials: "AN" }} />
				<Notification title="Nueva versión" image="/foto.jpg" />
			</div>,
		);
	});
});
