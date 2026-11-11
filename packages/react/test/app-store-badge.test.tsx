import { StoreAppStoreLogo, StoreGooglePlayOutlineLogo } from "@jotis-me/icons/logos";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AppStoreBadge } from "../src/index.js";
import { expectAccessibleInThemes } from "./helpers.js";

describe("AppStoreBadge", () => {
	it("App Store con href: un enlace con el dibujo cuyo nombre es la tienda", async () => {
		const ui = (
			<AppStoreBadge
				store="app-store"
				href="https://apps.apple.com/app/id1"
				logo={<StoreAppStoreLogo />}
			/>
		);
		render(ui);
		const link = screen.getByRole("link", { name: "App Store" });
		expect(link.getAttribute("href")).toBe("https://apps.apple.com/app/id1");
		const svg = link.querySelector("svg") as SVGSVGElement;
		expect(svg.getAttribute("aria-hidden")).toBe("true");
		expect(link.className).toContain("[&>svg]:h-10");
		await expectAccessibleInThemes(ui);
	});

	it("lg a 44 de alto, contorno con el color del texto y nombre propio", () => {
		render(
			<AppStoreBadge
				store="google-play"
				href="/play"
				size="lg"
				label="Consíguelo en Google Play"
				logo={<StoreGooglePlayOutlineLogo />}
			/>,
		);
		const link = screen.getByRole("link", { name: "Consíguelo en Google Play" });
		expect(link.className).toContain("[&>svg]:h-11");
		expect(link.className).toContain("text-primary");
		expect(link.innerHTML).toContain("currentColor");
	});
});
