import { render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Pager } from "../src/index.js";
import { expectAccessibleInThemes } from "./helpers.js";

describe("Pager", () => {
	it("solo siguiente: una navegación con un solo enlace que dice «Siguiente» y la página", () => {
		render(<Pager next={{ href: "/b/", label: "Button group" }} />);
		const nav = screen.getByRole("navigation", { name: "Anterior y siguiente" });
		const links = nav.querySelectorAll("a");
		expect(links).toHaveLength(1);
		const next = screen.getByRole("link", { name: /Siguiente\s*Button group/ });
		expect(next.getAttribute("href")).toBe("/b/");
		expect(next.getAttribute("rel")).toBe("next");
		expect(screen.queryByText("Anterior")).toBeNull();
	});

	it("los dos: cada uno con su dirección, su rel y su flecha hacia donde lleva", () => {
		render(<Pager prev={{ href: "/a/", label: "Alert" }} next={{ href: "/b/", label: "Badge" }} />);
		const prev = screen.getByRole("link", { name: /Anterior\s*Alert/ });
		const next = screen.getByRole("link", { name: /Siguiente\s*Badge/ });
		expect([prev.getAttribute("rel"), next.getAttribute("rel")]).toEqual(["prev", "next"]);
		// La flecha va antes del texto en «Anterior» y después en «Siguiente»; las dos son decorativas
		expect(prev.querySelector("span")?.firstElementChild?.tagName.toLowerCase()).toBe("svg");
		expect(next.querySelector("span")?.lastElementChild?.tagName.toLowerCase()).toBe("svg");
		expect(prev.querySelectorAll('svg[aria-hidden="true"]')).toHaveLength(1);
		expect(next.querySelectorAll('svg[aria-hidden="true"]')).toHaveLength(1);
		// «Siguiente» alinea a la derecha
		expect(next.className).toContain("text-right");
		expect(prev.className).not.toContain("text-right");
	});

	it("sin ninguno de los dos no pinta nada", () => {
		const { container } = render(<Pager />);
		expect(container.innerHTML).toBe("");
		expect(renderToString(<Pager />)).toBe("");
	});

	it("textos y nombre por props, y el className del consumidor", () => {
		render(
			<Pager
				aria-label="Page navigation"
				labels={{ previous: "Previous", next: "Next" }}
				className="mt-14"
				prev={{ href: "/a/", label: "Alert" }}
				next={{ href: "/b/", label: "Badge" }}
			/>,
		);
		const nav = screen.getByRole("navigation", { name: "Page navigation" });
		expect(nav.className).toContain("mt-14");
		expect(screen.getByRole("link", { name: /Previous\s*Alert/ })).toBeTruthy();
		expect(screen.getByRole("link", { name: /Next\s*Badge/ })).toBeTruthy();
	});

	it("se pinta en el servidor, sin JavaScript", () => {
		const html = renderToString(<Pager next={{ href: "/b/", label: "Badge" }} />);
		expect(html).toContain('<nav aria-label="Anterior y siguiente"');
		expect(html).toContain('href="/b/"');
		expect(html).toContain('rel="next"');
	});

	it("axe en claro y oscuro", async () => {
		await expectAccessibleInThemes(
			<Pager prev={{ href: "/a/", label: "Alert" }} next={{ href: "/b/", label: "Badge" }} />,
		);
	});
});
