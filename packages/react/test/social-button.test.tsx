import {
	SocialAppleLogoGray,
	SocialFacebookLogoGray,
	SocialGoogleLogo,
	SocialGoogleLogoGray,
} from "@jotis-me/icons/logos";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SocialButton, SocialButtonGroup } from "../src/index.js";
import { expectAccessibleInThemes } from "./helpers.js";

describe("SocialButton", () => {
	it("Google en gris: botón con el logo y el texto en castellano", async () => {
		const ui = <SocialButton provider="google" theme="gray" logo={<SocialGoogleLogoGray />} />;
		render(ui);
		const button = screen.getByRole("button", { name: "Entrar con Google" });
		expect(button.querySelector("svg")).toBeTruthy();
		expect(button.className).toContain("bg-primary");
		expect(button.querySelector("span[aria-hidden]")?.className).toContain("text-fg-quaternary");
		await expectAccessibleInThemes(ui);
	});

	it("con marca, Facebook lleva su azul y el logo en blanco; Google sigue en blanco", () => {
		render(
			<>
				<SocialButton provider="facebook" logo={<SocialFacebookLogoGray />} size="lg" />
				<SocialButton provider="google" logo={<SocialGoogleLogo />} />
			</>,
		);
		const fb = screen.getByRole("button", { name: "Entrar con Facebook" });
		expect(fb.className).toContain("bg-[#1877F2]");
		expect(fb.className).not.toContain("bg-brand-solid");
		expect(fb.className).toContain("h-11");
		expect(fb.querySelector("span[aria-hidden]")?.className).toContain("text-white");
		const google = screen.getByRole("button", { name: "Entrar con Google" });
		expect(google.className).toContain("bg-primary");
	});

	it("solo logo: el texto queda para lectores; con href es un enlace", () => {
		render(
			<>
				<SocialButton provider="apple" theme="color" iconOnly logo={<SocialAppleLogoGray />} />
				<SocialButton provider="x" href="/auth/x" logo={<SocialAppleLogoGray />}>
					Seguir con X
				</SocialButton>
			</>,
		);
		const apple = screen.getByRole("button", { name: "Entrar con Apple" });
		expect(apple.className).toContain("p-3");
		expect(screen.getByRole("link", { name: "Seguir con X" }).getAttribute("href")).toBe("/auth/x");
	});
});

describe("SocialButtonGroup", () => {
	it("agrupa en columna a todo el ancho o en fila", () => {
		render(
			<>
				<SocialButtonGroup label="Entrar con">
					<SocialButton provider="google" logo={<SocialGoogleLogo />} />
				</SocialButtonGroup>
				<SocialButtonGroup layout="row" size="lg">
					<SocialButton provider="google" iconOnly logo={<SocialGoogleLogo />} />
				</SocialButtonGroup>
			</>,
		);
		const [col, row] = screen.getAllByRole("group");
		expect(col?.getAttribute("aria-label")).toBe("Entrar con");
		expect(col?.className).toContain("flex-col");
		expect(row?.className).toContain("[&>*]:flex-1");
	});
});
