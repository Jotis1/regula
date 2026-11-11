import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Accordion, TeamMemberCard, type TeamMemberCardType } from "../src/index.js";
import { expectAccessibleInThemes } from "./helpers.js";

const items = [
	{ id: "prueba", title: "¿Hay prueba gratis?", content: "Sí, 30 días." },
	{ id: "cambiar", title: "¿Puedo cambiar de plan?", content: "Cuando quieras." },
	{ id: "cancelar", title: "¿Cómo cancelo?", content: "Desde tu cuenta." },
];

describe("Accordion", () => {
	it("cada pregunta es un botón con aria-expanded que abre su región con nombre", async () => {
		render(<Accordion items={items} defaultExpanded={["prueba"]} />);
		const first = screen.getByRole("button", { name: "¿Hay prueba gratis?" });
		expect(first.getAttribute("aria-expanded")).toBe("true");
		expect(screen.getByRole("region", { name: "¿Hay prueba gratis?" }).textContent).toBe("Sí, 30 días.");
		const second = screen.getByRole("button", { name: "¿Puedo cambiar de plan?" });
		expect(screen.queryByRole("region", { name: "¿Puedo cambiar de plan?" })).toBeNull();
		await userEvent.click(second);
		expect(second.getAttribute("aria-expanded")).toBe("true");
		// Sin `single`, la primera sigue abierta
		expect(first.getAttribute("aria-expanded")).toBe("true");
	});

	it("teclado: Enter y Espacio abren y cierran; flechas, Inicio y Fin mueven el foco", async () => {
		render(<Accordion items={items} single />);
		const [a, b, c] = screen.getAllByRole("button");
		a?.focus();
		await userEvent.keyboard("{Enter}");
		expect(a?.getAttribute("aria-expanded")).toBe("true");
		await userEvent.keyboard("{ArrowDown}");
		expect(document.activeElement).toBe(b);
		await userEvent.keyboard(" ");
		// Con `single`, abrir la segunda cierra la primera
		expect(b?.getAttribute("aria-expanded")).toBe("true");
		expect(a?.getAttribute("aria-expanded")).toBe("false");
		await userEvent.keyboard("{End}");
		expect(document.activeElement).toBe(c);
		await userEvent.keyboard("{ArrowDown}");
		expect(document.activeElement).toBe(a);
		await userEvent.keyboard("{ArrowUp}{Home}");
		expect(document.activeElement).toBe(a);
	});

	it("icono a la izquierda y divisor; accesible en los dos temas", async () => {
		const ui = <Accordion items={items} iconPosition="left" divider defaultExpanded={["cambiar"]} />;
		const { container } = render(ui);
		const button = screen.getByRole("button", { name: "¿Hay prueba gratis?" });
		expect(button.firstElementChild?.getAttribute("aria-hidden")).toBe("true");
		expect(container.querySelector(".border-t")).toBeTruthy();
		await expectAccessibleInThemes(ui);
	});
});

describe("TeamMemberCard", () => {
	const person = {
		name: "Ana Martín",
		role: "Fundadora y directora",
		bio: "Diez años ordenando las cuentas de otros.",
		image: <img src="/ana.jpg" alt="Ana Martín" />,
		socials: <a href="https://x.com/ana">X</a>,
		href: "/equipo/ana",
	};

	it("los siete tipos pintan el nombre, el cargo y las redes", async () => {
		const types: TeamMemberCardType[] = [
			"simple-left",
			"simple-left-top",
			"simple-center",
			"image-top",
			"image-left",
			"image-glass-floating",
			"image-glass-full-width",
		];
		for (const type of types) {
			const { unmount } = render(<TeamMemberCard type={type} {...person} />);
			expect(screen.getByRole("heading", { name: "Ana Martín" }), type).toBeTruthy();
			expect(screen.getByText("Fundadora y directora"), type).toBeTruthy();
			expect(screen.getByRole("link", { name: "X" }), type).toBeTruthy();
			if (type.startsWith("image"))
				expect(screen.getByRole("img", { name: "Ana Martín" }), type).toBeTruthy();
			unmount();
		}
		await expectAccessibleInThemes(<TeamMemberCard type="simple-center" {...person} />);
	});
});
