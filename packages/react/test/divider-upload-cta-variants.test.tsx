import { readFileSync } from "node:fs";
import { join } from "node:path";
import { render, screen, within } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import {
	Button,
	ButtonGroup,
	ContentDivider,
	FileUpload,
	InlineCTA,
	type InlineCTAType,
} from "../src/index.js";
import { expectAccessibleInThemes } from "./helpers.js";

const BEFORE: { divider: string; upload: string; cta: string } = JSON.parse(
	readFileSync(join(import.meta.dirname, "fixtures/divider-upload-cta-before.json"), "utf8"),
);

const files = [
	{ name: "informe.pdf", size: 204800, progress: 100, status: "complete" as const },
	{ name: "video.mp4", size: 16_000_000, progress: 40 },
	{ name: "roto.fig", size: 4_200_000, status: "error" as const, error: "Demasiado grande" },
];

describe("los de siempre", () => {
	it("sin las props nuevas el HTML de ContentDivider, FileUpload e InlineCTA es el de antes", () => {
		expect(
			renderToStaticMarkup(
				<>
					<ContentDivider />
					<ContentDivider label="Hoy" heading variant="dual" />
					<ContentDivider variant="fill">
						<button type="button">Cargar más</button>
					</ContentDivider>
				</>,
			),
		).toBe(BEFORE.divider);
		expect(
			renderToStaticMarkup(
				<FileUpload accept=".pdf" hint="PDF (máx. 10 MB)" files={files} id="subida" />,
			),
		).toBe(BEFORE.upload);
		expect(
			renderToStaticMarkup(
				<>
					<InlineCTA
						title="Conecta tu banco"
						description="Importa movimientos"
						actions={<button type="button">Conectar</button>}
						icon="bank"
					/>
					<InlineCTA title="Novedades" image="/foto.jpg" imageAlt="Foto" />
				</>,
			),
		).toBe(BEFORE.cta);
	});
});

describe("ContentDivider: actions", () => {
	it("pinta el botón, el botón solo icono o el grupo en el centro, entre dos líneas", () => {
		const { container } = render(
			<>
				<ContentDivider
					actions={
						<Button hierarchy="secondary" size="sm">
							Añadir
						</Button>
					}
				/>
				<ContentDivider
					actions={
						<Button hierarchy="secondary" size="sm" iconOnly="plus" label="Añadir elemento" />
					}
				/>
				<ContentDivider
					variant="fill"
					actions={
						<ButtonGroup
							aria-label="Filtro"
							items={[
								{ value: "todo", label: "Ver todo" },
								{ value: "activos", label: "Activos" },
							]}
						/>
					}
				/>
			</>,
		);
		expect(screen.getByRole("button", { name: "Añadir" })).toBeTruthy();
		expect(screen.getByRole("button", { name: "Añadir elemento" })).toBeTruthy();
		expect(screen.getByRole("button", { name: "Activos" })).toBeTruthy();
		// Cada uno lleva una línea a cada lado y ninguno es un separador mudo
		const rows = container.children;
		for (const row of rows) expect(row.querySelectorAll(':scope > [aria-hidden="true"]')).toHaveLength(2);
		expect(screen.queryByRole("separator")).toBeNull();
	});

	it("actions gana a children", () => {
		render(<ContentDivider actions={<span>Acción</span>}>Hijo</ContentDivider>);
		expect(screen.getByText("Acción")).toBeTruthy();
		expect(screen.queryByText("Hijo")).toBeNull();
	});
});

describe("FileUpload: progreso de relleno e icono de archivo", () => {
	it("fill pinta el fondo hasta el porcentaje, con una barra de progreso con nombre y el porcentaje junto al tamaño", () => {
		render(<FileUpload files={files} progressStyle="fill" />);
		const bar = screen.getByRole("progressbar", { name: /video\.mp4/ });
		expect(bar.getAttribute("aria-valuenow")).toBe("40");
		expect((bar as HTMLElement).style.width).toBe("calc(40% - 2px)");
		const items = screen.getAllByRole("listitem");
		expect(within(items[1] as HTMLElement).getByText(/40%/)).toBeTruthy();
		// El terminado llega al 100 % y dice «Completado» a los lectores
		expect(screen.getByRole("progressbar", { name: /informe\.pdf/ }).getAttribute("aria-valuenow")).toBe(
			"100",
		);
		expect((items[0] as HTMLElement).textContent).toContain("100%");
		// El fallido no lleva relleno
		expect(screen.queryByRole("progressbar", { name: /roto\.fig/ })).toBeNull();
	});

	it("el icono de cada archivo sale de UploadFile.icon o de fileIcon, salvo con error", () => {
		render(
			<FileUpload
				files={
					[{ ...files[0], icon: <svg data-testid="propio" /> }, files[1], files[2]] as typeof files
				}
				fileIcon={(f) => <svg data-testid={`tipo-${f.name}`} />}
			/>,
		);
		expect(screen.getByTestId("propio")).toBeTruthy();
		expect(screen.getByTestId("tipo-video.mp4")).toBeTruthy();
		expect(screen.queryByTestId("tipo-roto.fig")).toBeNull();
	});

	it("con fill es accesible en claro y oscuro", async () => {
		await expectAccessibleInThemes(<FileUpload files={files} progressStyle="fill" />);
	});
});

describe("InlineCTA: los siete tipos", () => {
	it("email avisa con onSubmit y el correo escrito, con el botón o con Enter", async () => {
		const onSubmit = vi.fn();
		render(
			<InlineCTA
				type="email"
				title="Novedades"
				description="Te avisamos de lo nuevo."
				onSubmit={onSubmit}
			/>,
		);
		const field = screen.getByRole("textbox", { name: "Suscríbete a las novedades" });
		await userEvent.type(field, "hola@jotis.me");
		await userEvent.click(screen.getByRole("button", { name: "Suscribirse" }));
		expect(onSubmit).toHaveBeenCalledWith("hola@jotis.me");
		await userEvent.type(field, "{Enter}");
		expect(onSubmit).toHaveBeenCalledTimes(2);
	});

	it("change-plan pinta el plan con su precio y los botones", () => {
		render(
			<InlineCTA
				type="change-plan"
				title="Cambia de plan"
				plan={{
					name: "Plan básico",
					icon: "zap",
					price: "10 €",
					period: "al mes",
					description: "Hasta 10 usuarios.",
				}}
				actions={<Button size="sm">Mejorar plan</Button>}
			/>,
		);
		expect(screen.getByText("Plan básico")).toBeTruthy();
		expect(screen.getByText("10 €")).toBeTruthy();
		expect(screen.getByText("al mes")).toBeTruthy();
		expect(screen.getByRole("button", { name: "Mejorar plan" })).toBeTruthy();
	});

	it("upgrade-plan es una lista con un check por elemento", () => {
		render(
			<InlineCTA
				type="upgrade-plan"
				title="Mejora tu plan"
				features={[{ title: "10 usuarios", description: "Hasta 10 personas." }, { title: "20 GB" }]}
			/>,
		);
		expect(within(screen.getByRole("list")).getAllByRole("listitem")).toHaveLength(2);
	});

	it("payment-method y receipt pintan su tarjeta interior", () => {
		render(
			<>
				<InlineCTA
					type="payment-method"
					title="Método de pago"
					payment={{
						logo: <svg data-testid="visa" />,
						label: "Visa terminada en 1234",
						expiry: "Caduca el 06/2028",
						email: "pagos@jotis.me",
					}}
					actions={
						<Button hierarchy="secondary" size="sm">
							Editar
						</Button>
					}
				/>
				<InlineCTA
					type="receipt"
					title="Tu último recibo"
					file={{ name: "Recibo_enero_2027.pdf", size: "200 KB", icon: <svg data-testid="pdf" /> }}
					actions={<Button size="sm">Ver</Button>}
				/>
			</>,
		);
		expect(screen.getByTestId("visa")).toBeTruthy();
		expect(screen.getByText("pagos@jotis.me")).toBeTruthy();
		expect(screen.getByText("Recibo_enero_2027.pdf")).toBeTruthy();
		expect(screen.getByTestId("pdf")).toBeTruthy();
	});

	it.each<InlineCTAType>([
		"image",
		"actions",
		"email",
		"change-plan",
		"upgrade-plan",
		"payment-method",
		"receipt",
	])("%s es accesible en claro y oscuro", async (type) => {
		await expectAccessibleInThemes(
			<InlineCTA
				type={type}
				title="Novedades"
				description="Te contamos lo nuevo."
				image={<div className="h-20" />}
				plan={{ name: "Plan básico", price: "10 €" }}
				features={[{ title: "10 usuarios" }]}
				payment={{ label: "Visa terminada en 1234" }}
				file={{ name: "Recibo.pdf", size: "200 KB" }}
				actions={<Button size="sm">Ver</Button>}
			/>,
		);
	});
});
