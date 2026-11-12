import { readFileSync } from "node:fs";
import { join } from "node:path";
import { render, screen } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import {
	BackgroundPattern,
	BrowserFrame,
	CreditCard,
	type CreditCardTheme,
	FeaturedIcon,
	type FeaturedIconVariant,
} from "../src/index.js";
import { expectAccessibleInThemes } from "./helpers.js";

const BEFORE: { featured: string; browser: string; pattern: string } = JSON.parse(
	readFileSync(join(import.meta.dirname, "fixtures/frames-before.json"), "utf8"),
);
const CARDS: Record<string, string> = JSON.parse(
	readFileSync(join(import.meta.dirname, "fixtures/credit-card-before.json"), "utf8"),
);
const ids = (h: string) => h.replace(/jm-bgp[a-zA-Z0-9]+/g, "jm-bgp");
const colors = ["brand", "gray", "error", "warning", "success"] as const;

describe("los de siempre", () => {
	it("sin las props nuevas el HTML de FeaturedIcon, BrowserFrame, BackgroundPattern y CreditCard es el de antes", () => {
		expect(
			renderToStaticMarkup(
				(["light", "modern", "outline"] as const).flatMap((v) =>
					colors.map((c) => <FeaturedIcon key={v + c} variant={v} color={c} size="lg" />),
				),
			),
		).toMatchBefore(BEFORE.featured);
		expect(
			renderToStaticMarkup(
				<>
					<BrowserFrame url="pecunia.jotis.me" height={200}>
						<p>a</p>
					</BrowserFrame>
					<BrowserFrame variant="minimal">
						<p>b</p>
					</BrowserFrame>
				</>,
			),
		).toMatchBefore(BEFORE.browser);
		expect(
			ids(
				renderToStaticMarkup(
					(["grid", "grid-dot", "grid-check", "circles", "squares"] as const).map((p) => (
						<BackgroundPattern key={p} pattern={p} width={480} height={320} />
					)),
				),
			),
		).toMatchBefore(BEFORE.pattern);
		for (const [theme, html] of Object.entries(CARDS))
			expect(
				renderToStaticMarkup(
					<CreditCard
						theme={theme as CreditCardTheme}
						company="Pecunia"
						holder="ADMINISTRADOR"
						expiry="06/29"
						last4="4821"
						network="VISA"
					/>,
				),
			).toBe(html);
	});
});

describe("CreditCard: los trece temas", () => {
	const themes: CreditCardTheme[] = [
		"brand-dark",
		"brand-light",
		"gray-dark",
		"gray-light",
		"transparent",
		"transparent-gradient",
		"transparent-strip",
		"gray-strip",
		"gradient-strip",
		"salmon-strip",
		"gray-strip-vertical",
		"gradient-strip-vertical",
		"salmon-strip-vertical",
	];

	it("son trece", () => expect(themes).toHaveLength(13));

	it("gradient-strip-vertical lleva la banda vertical sobre el degradado del Figma", () => {
		const { container } = render(<CreditCard theme="gradient-strip-vertical" />);
		const card = screen.getByRole("img");
		expect(card.className).toContain("#fbc2eb");
		expect(container.querySelector("[data-strip='left']")).toBeTruthy();
	});

	it("los de banda horizontal la ponen abajo, y los demás no llevan banda", () => {
		const { container } = render(
			<>
				<CreditCard theme="salmon-strip" aria-label="a" />
				<CreditCard theme="brand-dark" aria-label="b" />
			</>,
		);
		expect(container.querySelectorAll("[data-strip='bottom']")).toHaveLength(1);
		expect(container.querySelectorAll("[data-strip]")).toHaveLength(1);
	});

	it.each(themes)("%s tiene nombre y no falla en accesibilidad", async (theme) => {
		await expectAccessibleInThemes(<CreditCard theme={theme} last4="4821" />);
	});
});

describe("FeaturedIcon: gradient, dark y modern neue", () => {
	it.each<FeaturedIconVariant>(["gradient", "dark", "modern-neue"])(
		"%s es decorativo y lleva su icono",
		(variant) => {
			const { container } = render(<FeaturedIcon variant={variant} color="success" size="xl" />);
			const root = container.firstElementChild as HTMLElement;
			expect(root.getAttribute("aria-hidden")).toBe("true");
			expect(root.querySelector("svg")).toBeTruthy();
		},
	);

	it("gradient pone el sólido en el centro y dark el cuadrado del color", () => {
		const { container } = render(
			<>
				<FeaturedIcon variant="gradient" color="error" />
				<FeaturedIcon variant="dark" color="warning" />
			</>,
		);
		const [g, d] = [...container.children] as HTMLElement[];
		expect(g?.className).toContain("utility-red-100");
		expect(g?.className).toContain("bg-error-solid");
		expect(d?.className).toContain("bg-warning-solid");
		expect(d?.className).not.toContain("rounded-full");
	});
});

describe("BrowserFrame y BackgroundPattern", () => {
	it("minimal-color pinta el semáforo en color y theme=dark pasa el marco al tema oscuro", () => {
		const { container } = render(
			<BrowserFrame variant="minimal-color" theme="dark" url="regula.jotis.me">
				<p>Hola</p>
			</BrowserFrame>,
		);
		const root = container.firstElementChild as HTMLElement;
		expect(root.className).toContain("dark-mode");
		expect(root.innerHTML).toContain("#ee6a5f");
		expect(screen.getByRole("region", { name: "regula.jotis.me" })).toBeTruthy();
	});

	it("tech-grid pinta la matriz de puntos en tres opacidades, siempre igual con la misma semilla", () => {
		const html = (seed: number) =>
			ids(
				renderToStaticMarkup(
					<BackgroundPattern pattern="tech-grid" width={240} height={160} seed={seed} />,
				),
			);
		const a = html(7);
		expect(a).toBe(html(7));
		expect(a).not.toBe(html(8));
		const { container } = render(<BackgroundPattern pattern="tech-grid" width={240} height={160} />);
		expect(container.querySelectorAll("path")).toHaveLength(3);
		expect((container.firstElementChild as HTMLElement).getAttribute("aria-hidden")).toBe("true");
	});
});
