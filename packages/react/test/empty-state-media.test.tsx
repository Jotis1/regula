// Cabeceras de EmptyState (component-library, «Cabeceras del estado vacío» y «Avatares y logos del estado vacío»).
import { render, screen } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Avatar, EmptyState } from "../src/index.js";
import { expectAccessibleInThemes } from "./helpers.js";

// HTML de EmptyState antes de añadir las cabeceras: `sm` con icono no cambia
const BEFORE =
	'<div class="flex flex-col items-center gap-4 px-4 py-8 text-center font-body"><span aria-hidden="true" class="inline-flex shrink-0 items-center justify-center size-12 bg-primary text-fg-secondary shadow-[var(--shadow-xs-skeuomorphic),inset_0_0_0_1px_var(--border-primary)] rounded-lg"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M13 7L11.8845 4.76892C11.5634 4.1268 11.4029 3.80573 11.1634 3.57116C10.9516 3.36373 10.6963 3.20597 10.4161 3.10931C10.0992 3 9.74021 3 9.02229 3H5.2C4.0799 3 3.51984 3 3.09202 3.21799C2.71569 3.40973 2.40973 3.71569 2.21799 4.09202C2 4.51984 2 5.0799 2 6.2V7M2 7H17.2C18.8802 7 19.7202 7 20.362 7.32698C20.9265 7.6146 21.3854 8.07354 21.673 8.63803C22 9.27976 22 10.1198 22 11.8V16.2C22 17.8802 22 18.7202 21.673 19.362C21.3854 19.9265 20.9265 20.3854 20.362 20.673C19.7202 21 18.8802 21 17.2 21H6.8C5.11984 21 4.27976 21 3.63803 20.673C3.07354 20.3854 2.6146 19.9265 2.32698 19.362C2 18.7202 2 17.8802 2 16.2V7Z"></path></svg></span><div><h3 class="m-0 text-md font-semibold text-primary">Sin resultados</h3><p class="mt-1 mb-0 max-w-[352px] text-sm text-tertiary">Prueba con otra palabra.</p></div><div class="mt-2 flex flex-wrap items-center justify-center gap-3"><span>acción</span></div></div>';

const avatars = ["AB", "CD", "EF", "GH", "IJ", "KL", "MN", "OP"].map((i) => (
	<Avatar key={i} initials={i} size="md" />
));

describe("EmptyState con cabeceras", () => {
	it("sin las props nuevas, el HTML es el de antes", () => {
		const html = renderToStaticMarkup(
			<EmptyState
				icon="folder"
				title="Sin resultados"
				description="Prueba con otra palabra."
				actions={<span>acción</span>}
			/>,
		);
		expect(html).toBe(BEFORE);
	});

	it("las cuatro ilustraciones, el archivo y las carpetas son dibujos decorativos con colores del tema", () => {
		for (const props of [
			{ media: "illustration", illustration: "cloud" },
			{ media: "illustration", illustration: "box" },
			{ media: "illustration", illustration: "documents" },
			{ media: "illustration", illustration: "credit-card" },
			{ media: "file" },
			{ media: "folder" },
			{ media: "folder-glass" },
		] as const) {
			const { container, unmount } = render(<EmptyState title="Vacío" {...props} />);
			const media = container.firstElementChild?.firstElementChild as HTMLElement;
			expect(media.getAttribute("aria-hidden"), JSON.stringify(props)).toBe("true");
			const svg = media.querySelector("svg") as SVGElement;
			// La carpeta translúcida es blanco y negro con transparencia: se ve igual en los dos temas
			if (props.media !== "folder-glass")
				expect(svg.innerHTML, JSON.stringify(props)).toMatch(/var\(--/);
			expect(svg.innerHTML).not.toMatch(/foreignObject|<image/);
			unmount();
		}
	});

	it("la ilustración lleva su icono en el círculo de cristal", () => {
		const { container } = render(<EmptyState title="Vacío" media="illustration" illustration="box" />);
		const glass = container.querySelector(".backdrop-blur-sm") as HTMLElement;
		expect(glass.className).toContain("bg-alpha-black-20");
		expect(glass.querySelector("svg")).toBeTruthy();
	});

	it("md y lg suben el título y la escala de la cabecera", () => {
		const html = (size: "sm" | "md" | "lg") =>
			renderToStaticMarkup(<EmptyState title="Vacío" media="illustration" size={size} />);
		expect(html("md")).toContain("text-lg");
		expect(html("lg")).toContain("text-xl");
		const width = (size: "sm" | "md" | "lg") => Number(html(size).match(/<svg width="([\d.]+)"/)?.[1]);
		expect(width("sm")).toBeLessThan(width("md"));
		expect(width("md")).toBeLessThan(width("lg"));
	});

	it("usuarios en círculos: los avatares alrededor del icono central, sobre los círculos", () => {
		const { container } = render(
			<EmptyState title="Sin usuarios" media="users-radius" items={avatars} />,
		);
		const media = container.firstElementChild?.firstElementChild as HTMLElement;
		expect(media.querySelectorAll("[data-avatar], .rounded-full").length).toBeGreaterThan(0);
		expect(screen.getByText("AB")).toBeTruthy();
		// El fondo de círculos va por detrás del texto
		expect(container.firstElementChild?.className).toContain("isolate");
		expect(media.querySelector(".-z-10")).toBeTruthy();
	});

	it("usuarios en fila e integraciones: los items se desvanecen hacia los lados", () => {
		for (const media of ["users-row", "integrations"] as const) {
			const { container, unmount } = render(
				<EmptyState title="Vacío" media={media} icon="user-plus-01" items={avatars} />,
			);
			const header = container.firstElementChild?.firstElementChild as HTMLElement;
			expect(header.style.maskImage, media).toContain("linear-gradient");
			expect(header.textContent).toContain("AB");
			expect(header.textContent).toContain("OP");
			unmount();
		}
	});

	it("sin items, solo el fondo y el icono central", () => {
		const { container } = render(<EmptyState title="Sin usuarios" media="users-radius" />);
		const media = container.firstElementChild?.firstElementChild as HTMLElement;
		expect(media.querySelectorAll("svg").length).toBeGreaterThan(0);
		expect(media.textContent).toBe("");
	});

	it("axe en claro y oscuro, con ilustración y con avatares", async () => {
		await expectAccessibleInThemes(
			<>
				<EmptyState
					title="Sin proyectos"
					description="Crea el primero."
					media="illustration"
					size="md"
				/>
				<EmptyState title="Sin usuarios" media="users-row" icon="user-plus-01" items={avatars} />
			</>,
		);
	});
});
