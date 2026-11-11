import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { BlogPostCard, type BlogPostCardType, SubscribeCard } from "../src/index.js";
import { expectAccessibleInThemes } from "./helpers.js";

const post = {
	href: "/blog/50-30-20",
	title: "La regla del 50/30/20",
	description: "Reparte tu sueldo en tres partes.",
	image: <div />,
	category: "Ahorro",
	readTime: "8 min de lectura",
	author: { name: "Ana Martín", date: "20 ene 2027" },
	tags: [{ label: "Ahorro" }, { label: "Sueldo", color: "pink" as const }],
};

describe("BlogPostCard", () => {
	it("el título es el enlace y cada tipo pone su cabecera", () => {
		const types: BlogPostCardType[] = [
			"simple-01",
			"simple-02",
			"simple-03",
			"simple-04",
			"card-01",
			"card-02",
			"card-03",
			"card-04",
		];
		for (const type of types) {
			const { unmount, container } = render(<BlogPostCard type={type} {...post} />);
			expect(
				screen.getByRole("link", { name: "La regla del 50/30/20" }).getAttribute("href"),
				type,
			).toBe("/blog/50-30-20");
			if (type.endsWith("01")) expect(screen.getByText("Ahorro"), type).toBeTruthy();
			if (type.endsWith("02")) expect(screen.getByText("8 min de lectura"), type).toBeTruthy();
			if (type.endsWith("03")) expect(screen.getByText("Sueldo"), type).toBeTruthy();
			if (type.endsWith("04")) expect(screen.getByText("Leer la entrada"), type).toBeTruthy();
			expect((container.firstChild as HTMLElement).className.includes("rounded-2xl"), type).toBe(
				type.startsWith("card"),
			);
			unmount();
		}
	});

	it("horizontal pasa a fila solo en un contenedor ancho", async () => {
		const ui = <BlogPostCard {...post} orientation="horizontal" />;
		const { container } = render(ui);
		expect(container.querySelector(".\\@xl\\:flex-row")).toBeTruthy();
		await expectAccessibleInThemes(ui);
	});
});

describe("SubscribeCard", () => {
	it("es un formulario: envía el correo", async () => {
		const onSubscribe = vi.fn();
		render(
			<SubscribeCard
				description="Una vez a la semana."
				privacy="Sin spam."
				onSubscribe={onSubscribe}
			/>,
		);
		expect(screen.getByRole("region", { name: "Boletín semanal" })).toBeTruthy();
		await userEvent.type(screen.getByRole("textbox", { name: "Tu correo" }), "ana@regula.app");
		await userEvent.click(screen.getByRole("button", { name: "Suscribirme" }));
		expect(onSubscribe).toHaveBeenCalledWith("ana@regula.app");
	});

	it("line lleva la raya de marca; los dos son accesibles", async () => {
		const ui = <SubscribeCard type="line" privacy="Sin spam." />;
		const { container } = render(ui);
		expect((container.firstChild as HTMLElement).className).toContain("inset_0_4px_0");
		await expectAccessibleInThemes(ui);
	});
});
