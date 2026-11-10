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

// HTML de `Avatar`, `AvatarGroup` y `AvatarLabel` antes de añadir `badge`, `onAdd` y `size` (0.6.0)
const BEFORE = {
	avatar: '<span role="img" aria-label="Administrador, En línea" class="relative inline-flex shrink-0 items-center justify-center rounded-full bg-avatar-styles-bg-neutral font-semibold text-(color:--bg-secondary-solid) size-12 text-lg leading-[normal] shadow-[inset_0_0_0_0.5px_#00000029]"><span aria-hidden="true">AD</span><span aria-hidden="true" class="absolute right-0 bottom-0 size-[30%] min-h-1.5 min-w-1.5 rounded-full shadow-[0_0_0_1.5px_var(--bg-primary)] bg-fg-success-secondary"></span></span>',
	avatarIcon:
		'<span class="relative inline-flex shrink-0 items-center justify-center rounded-full bg-avatar-styles-bg-neutral font-semibold text-(color:--bg-secondary-solid) size-10 text-md leading-[normal] shadow-[inset_0_0_0_0.5px_#00000029]"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M20 21C20 19.6044 20 18.9067 19.8278 18.3389C19.44 17.0605 18.4395 16.06 17.1611 15.6722C16.5933 15.5 15.8956 15.5 14.5 15.5H9.5C8.10444 15.5 7.40665 15.5 6.83886 15.6722C5.56045 16.06 4.56004 17.0605 4.17224 18.3389C4 18.9067 4 19.6044 4 21M16.5 7.5C16.5 9.98528 14.4853 12 12 12C9.51472 12 7.5 9.98528 7.5 7.5C7.5 5.01472 9.51472 3 12 3C14.4853 3 16.5 5.01472 16.5 7.5Z"></path></svg><span aria-hidden="true" class="absolute right-0 bottom-0 size-[30%] min-h-1.5 min-w-1.5 rounded-full shadow-[0_0_0_1.5px_var(--bg-primary)] bg-fg-quaternary"></span><span class="sr-only">Desconectado</span></span>',
	group: '<span class="inline-flex [&amp;&gt;*+*]:-ml-2 x"><span class="relative inline-flex shrink-0 items-center justify-center rounded-full bg-avatar-styles-bg-neutral font-semibold text-(color:--bg-secondary-solid) size-8 text-sm leading-[normal] shadow-[0_0_0_1.5px_var(--bg-primary),inset_0_0_0_0.5px_#00000029]"><span>AB</span></span><span class="relative inline-flex shrink-0 items-center justify-center rounded-full bg-avatar-styles-bg-neutral font-semibold text-(color:--bg-secondary-solid) size-8 text-sm leading-[normal] shadow-[0_0_0_1.5px_var(--bg-primary),inset_0_0_0_0.5px_#00000029]"><span>+3</span></span></span>',
	label: '<span class="inline-flex items-center gap-2 font-body"><span class="relative inline-flex shrink-0 items-center justify-center rounded-full bg-avatar-styles-bg-neutral font-semibold text-(color:--bg-secondary-solid) size-10 text-md leading-[normal] shadow-[inset_0_0_0_0.5px_#00000029]"><span>AD</span><span aria-hidden="true" class="absolute right-0 bottom-0 size-[30%] min-h-1.5 min-w-1.5 rounded-full shadow-[0_0_0_1.5px_var(--bg-primary)] bg-fg-success-secondary"></span><span class="sr-only">En línea</span></span><span><span class="block text-sm font-semibold text-primary">Ana</span><span class="block text-sm text-tertiary">ana@jotis.me</span></span></span>',
};

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

	it("sin badge, el HTML es el de antes", () => {
		expect(
			renderToStaticMarkup(<Avatar initials="AD" alt="Administrador" status="online" size="lg" />),
		).toBe(BEFORE.avatar);
		expect(renderToStaticMarkup(<Avatar status="offline" />)).toBe(BEFORE.avatarIcon);
	});

	it.each([
		["xs", "size-2.5"],
		["sm", "size-3"],
		["md", "size-3.5"],
		["lg", "size-4"],
		["xl", "size-4.5"],
		["2xl", "size-5"],
	] as const)("la insignia en %s mide %s y sobresale 2px de la esquina", (size, cls) => {
		const { container } = render(<Avatar size={size} badge="verified" />);
		const badge = container.querySelector("svg[viewBox='0 0 16 16']")?.parentElement as HTMLElement;
		expect(badge.className).toContain(cls);
		expect(badge.className).toContain("-right-0.5");
		expect(badge.className).toContain("-bottom-0.5");
		expect(badge.getAttribute("aria-hidden")).toBe("true");
	});

	it("verified pinta el sello azul con tick y lo dice a los lectores", () => {
		const { container } = render(<Avatar badge="verified" />);
		const [seal, tick] = [...container.querySelectorAll("path")].slice(-2);
		expect(seal?.getAttribute("class")).toBe("fill-utility-blue-500");
		expect(tick?.getAttribute("class")).toBe("fill-fg-white");
		expect(screen.getByText("Verificado").className).toContain("sr-only");
	});

	it("count escribe el número, pasa a «99+» desde 100 y se anuncia", () => {
		render(
			<>
				<Avatar initials="AD" badge="count" count={8} />
				<Avatar initials="AD" badge="count" count={1} />
				<Avatar initials="AD" badge="count" count={120} />
			</>,
		);
		const eight = screen.getByText("8");
		expect(eight.className).toContain("bg-fg-error-secondary");
		expect(eight.className).toContain("text-fg-white");
		expect(screen.getByText("8 notificaciones").className).toContain("sr-only");
		expect(screen.getByText("1 notificación")).toBeTruthy();
		expect(screen.getByText("99+")).toBeTruthy();
	});

	it("company pinta el logo; es decorativo salvo que badgeLabel lo nombre", () => {
		const { container } = render(
			<>
				<Avatar initials="AD" badge="company" company="/empresa.png" />
				<Avatar initials="LP" badge="company" company="/empresa.png" badgeLabel="Empresa: Pecunia" />
			</>,
		);
		const logos = container.querySelectorAll("img[src='/empresa.png']");
		expect(logos).toHaveLength(2);
		expect(logos[0]?.getAttribute("alt")).toBe("");
		expect(screen.getByText("Empresa: Pecunia").className).toContain("sr-only");
	});

	it("company acepta un nodo, como un logo de @jotis-me/icons, y lo estira al círculo", () => {
		const { container } = render(
			<Avatar initials="AD" badge="company" company={<svg data-testid="logo" viewBox="0 0 24 24" />} />,
		);
		const logo = container.querySelector("[data-testid='logo']");
		expect(logo?.parentElement?.className).toContain("[&>*]:size-full");
		expect(logo?.parentElement?.className).toContain("rounded-full");
	});

	it("con alt e iniciales, la insignia entra en el nombre y sustituye al punto de estado", () => {
		const { container } = render(
			<Avatar initials="AD" alt="Administrador" status="online" badge="verified" />,
		);
		expect(screen.getByRole("img", { name: "Administrador, Verificado" })).toBeTruthy();
		expect(container.querySelector(".bg-fg-success-secondary")).toBeNull();
		expect(container.querySelector(".sr-only")).toBeNull();
	});

	it("sin infracciones de axe", async () => {
		await expectAccessibleInThemes(
			<div>
				<Avatar initials="AD" alt="Administrador" status="online" />
				<Avatar src="/foto.jpg" alt="Lucía Pérez" status="offline" />
				<Avatar size="md" status="online" />
				<Avatar initials="AD" alt="Administrador" badge="verified" />
				<Avatar size="lg" badge="count" count={3} />
				<Avatar src="/foto.jpg" alt="Lucía Pérez" badge="company" company="/empresa.png" />
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

	it("sin onAdd, el HTML es el de antes", () => {
		expect(
			renderToStaticMarkup(
				<AvatarGroup items={[{ initials: "AB" }, { initials: "+3" }]} className="x" />,
			),
		).toBe(BEFORE.group);
	});

	it("onAdd añade al final un botón con su nombre que avisa al pulsarlo", async () => {
		const onAdd = vi.fn();
		const { container } = render(
			<AvatarGroup
				items={[{ initials: "AB" }, { initials: "CD" }]}
				onAdd={onAdd}
				addLabel="Invitar"
				className="x"
			/>,
		);
		const wrapper = container.firstElementChild as HTMLElement;
		expect(wrapper.className).toContain("gap-2");
		expect(wrapper.className).toContain("x");
		// Los avatares siguen solapados en su propio grupo; el botón va aparte, a 8px
		expect(wrapper.children[0]?.className).toContain("[&>*+*]:-ml-2");
		const button = screen.getByRole("button", { name: "Invitar" });
		expect(button.className).toContain("border-dashed");
		expect(button.className).toContain("size-8");
		expect(button.querySelector("svg")?.getAttribute("width")).toBe("16");
		await userEvent.click(button);
		expect(onAdd).toHaveBeenCalledOnce();
	});

	it("el botón de añadir toma el tamaño del grupo y por defecto se llama «Añadir persona»", () => {
		render(<AvatarGroup size="md" items={[{ initials: "AB" }]} onAdd={() => {}} />);
		const button = screen.getByRole("button", { name: "Añadir persona" });
		expect(button.className).toContain("size-10");
		expect(button.querySelector("svg")?.getAttribute("width")).toBe("20");
	});

	it("el tooltip del botón dice lo mismo que su nombre", async () => {
		render(<AvatarGroup items={[{ initials: "AB" }]} onAdd={() => {}} addLabel="Invitar" />);
		await userEvent.tab();
		expect((await screen.findByRole("tooltip")).textContent).toBe("Invitar");
	});

	it("sin infracciones de axe", async () => {
		await expectAccessibleInThemes(
			<AvatarGroup items={[{ initials: "AB", alt: "Ana Benítez" }, { initials: "+3" }]} />,
		);
		await expectAccessibleInThemes(
			<AvatarGroup
				items={[{ initials: "AB", alt: "Ana Benítez" }]}
				onAdd={() => {}}
				addLabel="Invitar"
			/>,
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

	it("sin size, el HTML es el de antes", () => {
		expect(
			renderToStaticMarkup(
				<AvatarLabel initials="AD" name="Ana" supporting="ana@jotis.me" status="online" />,
			),
		).toBe(BEFORE.label);
	});

	it.each([
		["sm", "size-8", "text-sm", "text-xs"],
		["md", "size-10", "text-sm", "text-sm"],
		["lg", "size-12", "text-md", "text-md"],
	] as const)("size %s: avatar %s, nombre %s y apoyo %s", (size, avatar, name, supporting) => {
		const { container } = render(
			<AvatarLabel size={size} initials="AD" name="Ana" supporting="ana@jotis.me" />,
		);
		expect(container.querySelector(".rounded-full")?.className).toContain(avatar);
		expect(screen.getByText("Ana").className).toContain(name);
		expect(screen.getByText("ana@jotis.me").className).toContain(supporting);
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
