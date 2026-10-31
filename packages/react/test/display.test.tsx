import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { Avatar, AvatarGroup, AvatarLabel, Badge, type BadgeColor, Tag } from "../src/index.js";
import { expectAccessibleInThemes } from "./helpers.js";

const COLORS: [BadgeColor, string][] = [
	["gray", "neutral"],
	["brand", "brand"],
	["success", "green"],
	["warning", "yellow"],
	["error", "red"],
	["slate", "slate"],
	["sky", "sky"],
	["blue", "blue"],
	["indigo", "indigo"],
	["purple", "purple"],
	["pink", "pink"],
	["orange", "orange"],
];

describe("Badge", () => {
	it("es pill, gris y md por defecto", () => {
		render(<Badge>Borrador</Badge>);
		const badge = screen.getByText("Borrador");
		expect(badge.className).toContain("rounded-full");
		expect(badge.className).toContain("bg-utility-neutral-50");
		expect(badge.className).toContain("px-2.5");
		expect(badge.className).toContain("text-sm");
	});

	it.each(COLORS)(
		"%s usa la escala utility-%s: fondo 50, texto 700, borde 200, punto 500",
		(color, scale) => {
			render(
				<Badge color={color} dot>
					Estado
				</Badge>,
			);
			const badge = screen.getByText("Estado");
			for (const c of [
				`bg-utility-${scale}-50`,
				`text-utility-${scale}-700`,
				`inset-ring-utility-${scale}-200`,
			])
				expect(badge.className).toContain(c);
			expect(badge.querySelector("[aria-hidden]")?.className).toContain(`bg-utility-${scale}-500`);
		},
	);

	it("type badge y modern llevan radio md; modern es blanca con sombra y conserva el punto", () => {
		render(
			<>
				<Badge type="badge">A</Badge>
				<Badge type="modern" color="success" dot>
					B
				</Badge>
			</>,
		);
		expect(screen.getByText("A").className).toContain("rounded-md");
		const modern = screen.getByText("B");
		expect(modern.className).toContain("bg-primary");
		expect(modern.className).toContain("shadow-xs");
		expect(modern.className).not.toContain("bg-utility-green-50");
		expect(modern.querySelector("[aria-hidden]")?.className).toContain("bg-utility-green-500");
	});

	it("tamaños sm y lg", () => {
		render(
			<>
				<Badge size="sm">S</Badge>
				<Badge size="lg" type="badge">
					L
				</Badge>
			</>,
		);
		expect(screen.getByText("S").className).toContain("text-xs");
		expect(screen.getByText("L").className).toContain("rounded-lg");
	});

	it("con icono pinta un svg de 12", () => {
		render(<Badge icon="check">Hecho</Badge>);
		expect(screen.getByText("Hecho").querySelector("svg")?.getAttribute("width")).toBe("12");
	});

	it("onRemove: botón Quitar que llama al pulsar, con texto sustituible", async () => {
		const onRemove = vi.fn();
		render(
			<>
				<Badge onRemove={onRemove}>Filtro</Badge>
				<Badge onRemove={() => {}} removeLabel="Quitar filtro">
					Otro
				</Badge>
			</>,
		);
		await userEvent.click(screen.getByRole("button", { name: "Quitar" }));
		expect(onRemove).toHaveBeenCalledOnce();
		expect(screen.getByRole("button", { name: "Quitar filtro" })).toBeTruthy();
	});

	it("se renderiza en servidor", () => {
		expect(renderToStaticMarkup(<Badge color="success">Pagado</Badge>)).toContain("Pagado");
	});

	it("sin infracciones de axe", async () => {
		await expectAccessibleInThemes(
			<div>
				<Badge color="success">Pagado</Badge>
				<Badge type="modern" dot color="success">
					En línea
				</Badge>
				<Badge onRemove={() => {}}>Filtro</Badge>
			</div>,
		);
	});
});

describe("Tag", () => {
	it("sm por defecto, neutro con borde", () => {
		render(<Tag>Diseño</Tag>);
		const tag = screen.getByText("Diseño");
		expect(tag.className).toContain("bg-primary");
		expect(tag.className).toContain("inset-ring-primary");
		expect(tag.className).toContain("text-xs");
	});

	it("muestra el contador y el punto", () => {
		render(
			<Tag size="md" count={5} dot>
				Facturas
			</Tag>,
		);
		const tag = screen.getByText("Facturas");
		expect(tag.className).toContain("text-sm");
		expect(screen.getByText("5").className).toContain("bg-tertiary");
		expect(tag.querySelector("[aria-hidden]")?.className).toContain("bg-fg-success-secondary");
	});

	it("la X se llama «Quitar <texto>» y su icono mide 12 en sm y 14 en el resto", async () => {
		const onRemove = vi.fn();
		render(
			<>
				<Tag onRemove={onRemove}>León</Tag>
				<Tag size="md" onRemove={() => {}} removeLabel="Quitar ciudad">
					Madrid
				</Tag>
			</>,
		);
		const x = screen.getByRole("button", { name: "Quitar León" });
		expect(x.querySelector("svg")?.getAttribute("width")).toBe("12");
		expect(
			screen.getByRole("button", { name: "Quitar ciudad" }).querySelector("svg")?.getAttribute("width"),
		).toBe("14");
		x.focus();
		await userEvent.keyboard("{Enter}");
		expect(onRemove).toHaveBeenCalledOnce();
	});

	it("sin infracciones de axe", async () => {
		await expectAccessibleInThemes(
			<div>
				<Tag count={5}>Facturas</Tag>
				<Tag onRemove={() => {}}>León</Tag>
			</div>,
		);
	});
});

describe("Avatar", () => {
	it("con iniciales y alt es una imagen con nombre y las iniciales quedan ocultas", () => {
		render(<Avatar initials="AD" alt="Administrador" />);
		const avatar = screen.getByRole("img", { name: "Administrador" });
		expect(avatar.className).toContain("size-10");
		expect(avatar.className).toContain("bg-avatar-styles-bg-neutral");
		expect(screen.getByText("AD").getAttribute("aria-hidden")).toBe("true");
	});

	it("con foto usa el alt de la imagen", () => {
		render(<Avatar src="/foto.jpg" alt="Lucía Pérez" size="lg" />);
		const img = screen.getByRole("img", { name: "Lucía Pérez" });
		expect(img.tagName).toBe("IMG");
		expect(img.parentElement?.className).toContain("size-12");
	});

	it("sin foto ni iniciales muestra el icono de usuario a su tamaño", () => {
		const { container } = render(<Avatar size="xs" />);
		expect(container.querySelector("svg")?.getAttribute("width")).toBe("16");
		expect(container.firstElementChild?.className).toContain("size-6");
	});

	it.each([
		["xs", "size-6"],
		["sm", "size-8"],
		["md", "size-10"],
		["lg", "size-12"],
		["xl", "size-14"],
		["2xl", "size-16"],
	] as const)("tamaño %s → %s", (size, cls) => {
		const { container } = render(<Avatar size={size} initials="AD" />);
		expect(container.firstElementChild?.className).toContain(cls);
	});

	it("el estado se anuncia: en el nombre si es imagen, como texto oculto si no", () => {
		render(
			<>
				<Avatar initials="AD" alt="Administrador" status="online" />
				<Avatar status="offline" />
				<Avatar status="online" statusLabel="Disponible" />
			</>,
		);
		expect(screen.getByRole("img", { name: "Administrador, En línea" })).toBeTruthy();
		expect(screen.getByText("Desconectado").className).toContain("sr-only");
		expect(screen.getByText("Disponible")).toBeTruthy();
	});

	it("ring añade el anillo bg-primary", () => {
		const { container } = render(<Avatar ring initials="AB" />);
		expect(container.firstElementChild?.className).toContain("var(--bg-primary)");
	});

	it("sin infracciones de axe", async () => {
		await expectAccessibleInThemes(
			<div>
				<Avatar initials="AD" alt="Administrador" status="online" />
				<Avatar src="/foto.jpg" alt="Lucía Pérez" status="offline" />
				<Avatar size="md" status="online" />
			</div>,
		);
	});
});

describe("AvatarGroup", () => {
	it("solapa los avatares, todos con anillo y tamaño sm por defecto", () => {
		const { container } = render(
			<AvatarGroup items={[{ initials: "AB" }, { initials: "CD" }, { initials: "+3" }]} />,
		);
		const group = container.firstElementChild as HTMLElement;
		expect(group.className).toContain("[&>*+*]:-ml-2");
		const avatars = [...group.children];
		expect(avatars).toHaveLength(3);
		for (const a of avatars) {
			expect(a.className).toContain("size-8");
			expect(a.className).toContain("var(--bg-primary)");
		}
		expect(avatars[2]?.textContent).toBe("+3");
	});

	it("size se aplica a todos y cada item puede sobrescribirlo", () => {
		const { container } = render(
			<AvatarGroup size="md" items={[{ initials: "AB" }, { initials: "CD", size: "lg" }]} />,
		);
		const [a, b] = [...(container.firstElementChild as HTMLElement).children];
		expect(a?.className).toContain("size-10");
		expect(b?.className).toContain("size-12");
	});

	it("sin infracciones de axe", async () => {
		await expectAccessibleInThemes(
			<AvatarGroup items={[{ initials: "AB", alt: "Ana Benítez" }, { initials: "+3" }]} />,
		);
	});
});

describe("AvatarLabel", () => {
	it("pinta avatar, nombre y apoyo con sus estilos", () => {
		render(
			<AvatarLabel
				initials="AD"
				name="Responsable de seguridad"
				supporting="admin@jotis.me"
				status="online"
			/>,
		);
		const name = screen.getByText("Responsable de seguridad");
		expect(name.className).toContain("font-semibold");
		expect(name.className).toContain("text-primary");
		expect(screen.getByText("admin@jotis.me").className).toContain("text-tertiary");
		expect(screen.getByText("En línea").className).toContain("sr-only");
	});

	it("sin apoyo no pinta la segunda línea", () => {
		render(<AvatarLabel initials="AD" name="Ana" />);
		expect(screen.getByText("Ana").parentElement?.children).toHaveLength(1);
	});

	it("se renderiza en servidor y sin infracciones de axe", async () => {
		expect(renderToStaticMarkup(<AvatarLabel name="Ana" supporting="ana@jotis.me" />)).toContain(
			"ana@jotis.me",
		);
		await expectAccessibleInThemes(<AvatarLabel initials="AD" name="Ana" supporting="ana@jotis.me" />);
	});
});
