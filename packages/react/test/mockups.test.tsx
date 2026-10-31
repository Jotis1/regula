import { readFileSync } from "node:fs";
import { join } from "node:path";
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { renderToString } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { BackgroundPattern, BrowserFrame, CreditCard, VideoPlayer } from "../src/index.js";
import { expectAccessibleInThemes } from "./helpers.js";

const isClient = (name: string) =>
	/^\s*["']use client["']/.test(
		readFileSync(join(import.meta.dirname, "../src/components", `${name}.tsx`), "utf8"),
	);

describe("frontera servidor", () => {
	it("BackgroundPattern, BrowserFrame y CreditCard son de servidor; VideoPlayer, de cliente", () => {
		expect(isClient("BackgroundPattern")).toBe(false);
		expect(isClient("BrowserFrame")).toBe(false);
		expect(isClient("CreditCard")).toBe(false);
		expect(isClient("VideoPlayer")).toBe(true);
	});

	it("se pintan en servidor sin avisos", () => {
		const error = vi.spyOn(console, "error").mockImplementation(() => {});
		const html = renderToString(
			<>
				<BackgroundPattern pattern="grid-dot" />
				<BrowserFrame url="pecunia.jotis.me">Hola</BrowserFrame>
				<CreditCard last4="4821" />
				<VideoPlayer duration={252} />
			</>,
		);
		expect(html).toContain("pecunia.jotis.me");
		expect(html).toContain("4821");
		expect(html).toContain("4:12");
		expect(error).not.toHaveBeenCalled();
		error.mockRestore();
	});
});

describe("BackgroundPattern", () => {
	it("decorativo, ocupa el contenedor y lleva máscara radial por defecto", () => {
		const { container } = render(<BackgroundPattern />);
		const root = container.firstElementChild as HTMLElement;
		expect(root.getAttribute("aria-hidden")).toBe("true");
		expect(root.className).toContain("absolute");
		expect(root.className).toContain("inset-0");
		expect(root.style.maskImage).toContain("radial-gradient(closest-side");
		// Rejilla md: celda de 96 → 16×10 celdas sobre 1536×960
		const svg = container.querySelector("svg") as SVGElement;
		expect([svg.getAttribute("width"), svg.getAttribute("height")]).toEqual(["1536", "960"]);
		expect(container.querySelectorAll("path")).toHaveLength(1);
	});

	it("cada máscara y sin máscara", () => {
		const { container, rerender } = render(<BackgroundPattern mask="linear-up" />);
		const root = () => container.firstElementChild as HTMLElement;
		expect(root().style.maskImage).toBe("linear-gradient(transparent, black)");
		rerender(<BackgroundPattern mask="radial-down" />);
		expect(root().style.maskImage).toContain("at 50% 0");
		rerender(<BackgroundPattern mask="none" />);
		expect(root().style.maskImage).toBe("");
	});

	it("concéntricos: siete figuras al lado de su tamaño", () => {
		const { container, rerender } = render(<BackgroundPattern pattern="circles" size="sm" />);
		expect(container.querySelectorAll("circle")).toHaveLength(7);
		expect(container.querySelector("svg")?.getAttribute("width")).toBe("336");
		rerender(<BackgroundPattern pattern="squares" size="lg" />);
		expect(container.querySelectorAll("rect")).toHaveLength(7);
		expect(container.querySelector("svg")?.getAttribute("width")).toBe("768");
	});

	it("puntos cada 32px en utility-neutral-300 con un id propio por instancia", () => {
		const { container } = render(
			<>
				<BackgroundPattern pattern="grid-dot" />
				<BackgroundPattern pattern="grid-dot" />
			</>,
		);
		const patterns = container.querySelectorAll("pattern");
		expect(patterns[0]?.getAttribute("width")).toBe("32");
		expect(patterns[0]?.querySelector("circle")?.getAttribute("fill")).toBe("var(--utility-neutral-300)");
		expect(patterns[0]?.id).not.toBe(patterns[1]?.id);
	});

	it("casillas deterministas según seed, en bg-secondary", () => {
		const cells = (seed?: number) => {
			const { container, unmount } = render(
				<BackgroundPattern pattern="grid-check" size="sm" seed={seed} />,
			);
			const out = [...container.querySelectorAll("rect")].map(
				(r) => `${r.getAttribute("x")},${r.getAttribute("y")}`,
			);
			expect(container.querySelector("rect")?.getAttribute("fill")).toBe("var(--bg-secondary)");
			unmount();
			return out;
		};
		// 20×12 celdas de 80 → 9 % ≈ 22 casillas
		expect(cells()).toHaveLength(22);
		expect(cells(7)).toEqual(cells());
		expect(cells(3)).not.toEqual(cells(7));
	});
});

describe("BrowserFrame", () => {
	it("safari: semáforo, navegación, dirección, acciones y contenido con su alto", () => {
		const { container } = render(
			<BrowserFrame url="pecunia.jotis.me/resumen" height={260}>
				<p>Pantalla</p>
			</BrowserFrame>,
		);
		expect(screen.getByText("pecunia.jotis.me/resumen")).toBeTruthy();
		expect(screen.getByText("Pantalla").parentElement?.style.height).toBe("260px");
		expect(container.querySelectorAll("svg")).toHaveLength(6);
		expect(container.innerHTML).toContain("bg-[#ee6a5f]");
	});

	it("minimal: semáforo gris y solo la dirección; dirección por defecto jotis.me", () => {
		const { container } = render(<BrowserFrame variant="minimal" />);
		expect(screen.getByText("jotis.me")).toBeTruthy();
		expect(container.querySelectorAll("svg")).toHaveLength(1);
		expect(container.innerHTML).not.toContain("#ee6a5f");
		expect(container.innerHTML).toContain("bg-[var(--border-primary)]");
	});

	it("axe en claro y oscuro", async () => {
		await expectAccessibleInThemes(
			<BrowserFrame url="pecunia.jotis.me">
				<p>Pantalla</p>
			</BrowserFrame>,
		);
	});
});

describe("CreditCard", () => {
	it("imagen con una etiqueta que resume los datos y solo los cuatro últimos dígitos", () => {
		render(
			<CreditCard company="Pecunia" holder="Administrador" expiry="06/29" last4="4111111111114821" />,
		);
		const card = screen.getByRole("img", {
			name: "Tarjeta Pecunia terminada en 4821, titular Administrador, caduca 06/29",
		});
		expect(card.textContent).toContain("•••• •••• •••• 4821");
		expect(card.textContent).not.toContain("4111");
	});

	it("valores por defecto, red de pago y etiqueta propia", () => {
		const { rerender } = render(<CreditCard />);
		expect(screen.getByRole("img").getAttribute("aria-label")).toBe(
			"Tarjeta jotis.me terminada en 1234, titular ADMINISTRADOR",
		);
		expect(screen.getByRole("img").textContent).not.toContain("VISA");
		rerender(<CreditCard network="VISA" aria-label="Tarjeta de empresa" />);
		expect(screen.getByRole("img", { name: "Tarjeta de empresa" }).textContent).toContain("VISA");
	});

	it("cada acabado con sus colores fijos", () => {
		const { container, rerender } = render(<CreditCard theme="gray-light" />);
		const card = () => container.firstElementChild as HTMLElement;
		expect(card().className).toContain("bg-[#f5f5f5]");
		expect(card().querySelector("span[aria-hidden]")).toBeNull();
		rerender(<CreditCard theme="transparent" />);
		expect(card().className).toContain("backdrop-blur-lg");
		expect(card().querySelector("span[aria-hidden]")).not.toBeNull();
	});

	it("axe en claro y oscuro", async () => {
		await expectAccessibleInThemes(
			<CreditCard company="Pecunia" holder="Ana" expiry="06/29" last4="4821" />,
		);
	});
});

describe("VideoPlayer", () => {
	it("maqueta: reproducir y pausar con el botón de la barra; el central no se anuncia", async () => {
		const { container } = render(<VideoPlayer duration={252} />);
		const big = container.querySelector('button[aria-hidden="true"]') as HTMLButtonElement;
		expect(big.tabIndex).toBe(-1);
		expect(screen.getByText("0:00 / 4:12")).toBeTruthy();
		await userEvent.click(screen.getByRole("button", { name: "Reproducir" }));
		expect(screen.getByRole("button", { name: "Pausa" })).toBeTruthy();
		expect(container.querySelector('button[aria-hidden="true"]')).toBeNull();
		await userEvent.click(screen.getByRole("button", { name: "Pausa" }));
		expect(screen.getByRole("button", { name: "Reproducir" })).toBeTruthy();
		await userEvent.click(container.querySelector('button[aria-hidden="true"]') as HTMLButtonElement);
		expect(screen.getByRole("button", { name: "Pausa" })).toBeTruthy();
	});

	it("posición con nombre y texto legible, sonido y pantalla completa", async () => {
		const { container } = render(<VideoPlayer duration={252} />);
		const seek = screen.getByRole("slider", { name: "Posición" });
		expect(seek.getAttribute("aria-valuetext")).toBe("0:00 de 4:12");
		await userEvent.click(screen.getByRole("button", { name: "Silenciar" }));
		expect(screen.getByRole("button", { name: "Activar sonido" })).toBeTruthy();
		const full = vi.fn(() => Promise.resolve());
		(container.firstElementChild as HTMLElement).requestFullscreen = full;
		await userEvent.click(screen.getByRole("button", { name: "Pantalla completa" }));
		expect(full).toHaveBeenCalledOnce();
	});

	it("con teclado: Tab llega a los controles en orden", async () => {
		render(<VideoPlayer duration={60} />);
		await userEvent.tab();
		expect(document.activeElement?.getAttribute("aria-label")).toBe("Reproducir");
		await userEvent.keyboard("{Enter}");
		expect(document.activeElement?.getAttribute("aria-label")).toBe("Pausa");
		await userEvent.tab();
		expect(document.activeElement?.getAttribute("aria-label")).toBe("Posición");
	});

	it("con src pinta el vídeo y el póster", () => {
		const { container } = render(<VideoPlayer src="/demo.mp4" poster="/poster.jpg" />);
		const video = container.querySelector("video") as HTMLVideoElement;
		expect(video.getAttribute("src")).toBe("/demo.mp4");
		expect(video.getAttribute("poster")).toBe("/poster.jpg");
	});

	it("textos sustituibles", () => {
		render(<VideoPlayer labels={{ play: "Play", seek: "Seek", position: (c, t) => `${c} of ${t}` }} />);
		expect(screen.getByRole("button", { name: "Play" })).toBeTruthy();
		expect(screen.getByRole("slider", { name: "Seek" }).getAttribute("aria-valuetext")).toBe(
			"0:00 of 0:00",
		);
	});

	it("axe en claro y oscuro", async () => {
		await expectAccessibleInThemes(<VideoPlayer duration={252} />);
	});
});
