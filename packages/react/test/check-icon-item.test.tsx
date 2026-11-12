import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CheckIcon, CheckItem } from "../src/index.js";
import { expectAccessibleInThemes } from "./helpers.js";

describe("CheckIcon", () => {
	it("es decorativo y pinta los tres tipos en los tres colores", () => {
		const { container } = render(
			<>
				<CheckIcon type="default" color="success" />
				<CheckIcon type="line" color="gray" />
				<CheckIcon type="filled" color="brand" size="xl" />
			</>,
		);
		const [d, l, f] = [...container.children] as HTMLElement[];
		for (const el of [d, l, f]) expect(el?.getAttribute("aria-hidden")).toBe("true");
		expect(d?.className).toContain("bg-utility-green-100");
		expect(l?.className).toContain("text-fg-quaternary");
		expect(f?.className).toContain("bg-brand-solid");
		expect(f?.className).toContain("size-8");
	});
});

describe("CheckItem", () => {
	it("es un elemento de lista con su texto, que es lo que se lee", () => {
		render(
			<ul>
				<CheckItem>Todas las funciones</CheckItem>
				<CheckItem type="filled" color="success" size="lg">
					Soporte prioritario
				</CheckItem>
			</ul>,
		);
		const items = screen.getAllByRole("listitem");
		expect(items).toHaveLength(2);
		expect(items[1]?.textContent).toBe("Soporte prioritario");
		expect(items[1]?.className).toContain("text-lg");
	});

	it("con as=div va suelto", () => {
		const { container } = render(<CheckItem as="div">Suelto</CheckItem>);
		expect(container.firstElementChild?.tagName).toBe("DIV");
	});

	it("es accesible en claro y oscuro", async () => {
		await expectAccessibleInThemes(
			<ul>
				{(["default", "line", "filled"] as const).map((type) => (
					<CheckItem key={type} type={type} color="success">
						{type}
					</CheckItem>
				))}
			</ul>,
		);
	});
});
