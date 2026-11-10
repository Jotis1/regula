import { IconRocket02 } from "@jotis-me/icons";
import { render } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import {
	Alert,
	Badge,
	Banner,
	Breadcrumbs,
	ButtonGroup,
	ButtonUtility,
	EmptyState,
	FeaturedIcon,
	Icon,
	InlineCTA,
	Input,
	Modal,
	Select,
	TreeView,
} from "../src/index.js";

// Un icono del set completo que no está en el núcleo: se pasa ya pintado, con su propio dibujo
const rocket = <IconRocket02 data-testid="rocket" />;

/** El dibujo del icono de prueba, para comprobar que acaba pintado dentro del componente. */
const rocketPath = () => (renderToStaticMarkup(<IconRocket02 />).match(/ d="([^"]+)"/) ?? [])[1] ?? "";

describe("las props de icono aceptan un nodo", () => {
	const paths = rocketPath();

	it("tiene un dibujo con el que comparar", () => {
		expect(paths.length).toBeGreaterThan(10);
	});

	it.each([
		[
			"Badge",
			<Badge key="b" icon={rocket}>
				Nuevo
			</Badge>,
		],
		["FeaturedIcon", <FeaturedIcon key="f" icon={rocket} />],
		["Alert", <Alert key="a" icon={rocket} title="Aviso" />],
		["Banner", <Banner key="n" icon={rocket} title="Novedad" />],
		["InlineCTA", <InlineCTA key="i" icon={rocket} title="Mejora" />],
		["Modal", <Modal key="m" open contained icon={rocket} title="Hola" />],
		["EmptyState", <EmptyState key="e" icon={rocket} title="Vacío" />],
		["Input", <Input key="in" icon={rocket} aria-label="Campo" />],
		["Input (trailing)", <Input key="it" trailing={rocket} aria-label="Campo" />],
		[
			"Select",
			<Select key="s" icon={rocket} aria-label="Elige" options={[{ value: "a", label: "A" }]} />,
		],
		["ButtonUtility", <ButtonUtility key="u" icon={rocket} label="Lanzar" />],
		["ButtonGroup", <ButtonGroup key="g" items={[{ value: "a", label: "A", icon: rocket }]} />],
		[
			"Breadcrumbs",
			<Breadcrumbs key="c" items={[{ label: "Inicio", href: "/", icon: rocket }, { label: "Aquí" }]} />,
		],
		["TreeView", <TreeView key="t" aria-label="Árbol" items={[{ id: "a", label: "A", icon: rocket }]} />],
	])("%s pinta el icono que se le pasa como nodo", (_name, ui) => {
		const { container } = render(ui);
		expect(container.querySelector(`path[d="${paths}"]`), "no se ve el dibujo del icono").toBeTruthy();
	});

	it("con un nombre del núcleo pinta lo mismo que el nodo equivalente", () => {
		const byName = renderToStaticMarkup(<Badge icon="check">Ok</Badge>);
		const byNode = renderToStaticMarkup(<Badge icon={<Icon name="check" size={12} />}>Ok</Badge>);
		expect(byName).toBe(byNode);
		expect(byName).toContain('width="12"');
	});
});
