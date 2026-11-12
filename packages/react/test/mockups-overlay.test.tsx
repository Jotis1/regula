import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BackgroundOverlay, LaptopMockup, PhoneMockup, ScreenMockup } from "../src/index.js";
import { expectAccessibleInThemes } from "./helpers.js";

describe("mockups", () => {
	it("con imagen, la imagen es lo único que se anuncia: el marco es decorativo", async () => {
		const ui = (
			<>
				<LaptopMockup src="/panel.png" alt="Panel de ventas" />
				<PhoneMockup src="/movil.png" alt="Panel en el móvil" />
				<ScreenMockup src="/escritorio.png" alt="Panel en escritorio" size="lg" />
				<ScreenMockup variant="modern" src="/moderno.png" alt="Panel moderno" />
			</>
		);
		const { container } = render(ui);
		expect(screen.getAllByRole("img").map((i) => i.getAttribute("alt"))).toEqual([
			"Panel de ventas",
			"Panel en el móvil",
			"Panel en escritorio",
			"Panel moderno",
		]);
		for (const svg of container.querySelectorAll("svg:not(svg svg)"))
			expect(svg.getAttribute("aria-hidden")).toBe("true");
		await expectAccessibleInThemes(ui);
	});

	it("la imagen ocupa la pantalla del portátil", () => {
		const { container } = render(<LaptopMockup src="/panel.png" alt="Panel" />);
		const screenBox = container.querySelector("img")?.parentElement as HTMLElement;
		expect(screenBox.style.left).toBe("9.95%");
		expect(screenBox.style.width).toBe("80.92%");
		expect(container.querySelector("img")?.className).toContain("object-cover");
	});

	it("con contenido, lo pinta en la pantalla; tamaños y variantes", () => {
		const { container } = render(
			<>
				<ScreenMockup size="xs" shadow={false}>
					<p>Hola</p>
				</ScreenMockup>
				<ScreenMockup variant="modern" breakpoint="mobile">
					<p>Móvil</p>
				</ScreenMockup>
			</>,
		);
		expect(screen.getByText("Hola")).toBeTruthy();
		const [three, modern] = [...container.children] as HTMLElement[];
		expect(three?.className).toContain("max-w-[342px]");
		expect(three?.querySelector("span[aria-hidden].shadow-\\[var\\(--shadow-2xl\\)\\]")).toBeNull();
		expect(modern?.className).toContain("max-w-[375px]");
		expect(modern?.querySelector(".aspect-\\[355\\/773\\]")).toBeTruthy();
	});

	it("dos portátiles no repiten ids", () => {
		const { container } = render(
			<>
				<LaptopMockup />
				<LaptopMockup />
			</>,
		);
		const ids = [...container.querySelectorAll("[id]")].map((e) => e.id);
		expect(new Set(ids).size).toBe(ids.length);
	});
});

describe("BackgroundOverlay", () => {
	it("decorativo: velo, degradado o transparente, con o sin desenfoque", () => {
		const { container } = render(
			<>
				<BackgroundOverlay />
				<BackgroundOverlay type="gradient" blur={false} />
				<BackgroundOverlay type="transparent" />
			</>,
		);
		const [a, b, c] = [...container.children] as HTMLElement[];
		for (const el of [a, b, c]) expect(el?.getAttribute("aria-hidden")).toBe("true");
		expect(a?.className).toContain("bg-overlay/70");
		expect(a?.className).toContain("backdrop-blur-[8px]");
		expect(b?.className).toContain("from-overlay/35");
		expect(b?.className).not.toContain("backdrop-blur");
		expect(c?.className).not.toContain("bg-overlay");
	});
});
