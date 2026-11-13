// Selector de tema de la cabecera (design D2): el `Dropdown` del paquete, con su botón de siempre más un icono, que abre un menú con
// Sistema, Claro y Oscuro y la opción actual marcada. El botón lleva las tres opciones (icono y nombre) y
// la CSS deja ver la de lo elegido según `data-tema` de <html>, que ya pone el script de <head> antes de pintar: el
// botón dice lo bueno desde la primera pintura, antes de que esta isla se hidrate y aunque el servidor no lo sepa.
import { Button, Dropdown } from "@jotis-me/react";
import { ChevronDown, Monitor01, Moon01, Sun } from "@untitledui/icons";
import { useEffect, useState } from "react";
import {
	followSystem,
	onThemeChange,
	setTheme,
	THEME_OPTIONS,
	type ThemeChoice,
	themeChoice,
} from "../lib/theme";

const ICONS = { sistema: Monitor01, claro: Sun, oscuro: Moon01 } as const;

const ITEMS = THEME_OPTIONS.map((o) => ({ icon: ICONS[o.value], label: o.label, value: o.value }));

// Una por opción; solo se ve la de `data-tema`. Las clases van escritas enteras para que Tailwind las encuentre
const ICON_SHOWN: Record<ThemeChoice, string> = {
	sistema: "hidden in-data-[tema=sistema]:block",
	claro: "hidden in-data-[tema=claro]:block",
	oscuro: "hidden in-data-[tema=oscuro]:block",
};
const TEXT_SHOWN: Record<ThemeChoice, string> = {
	sistema: "hidden in-data-[tema=sistema]:inline",
	claro: "hidden in-data-[tema=claro]:inline",
	oscuro: "hidden in-data-[tema=oscuro]:inline",
};

// El botón es el que pinta el Dropdown por defecto (Button secundario con flecha) más el icono de lo elegido en su
// hueco de icono, `iconLeading`: así icono y texto quedan alineados como en cualquier otro botón del sistema
const TRIGGER = (
	<Button
		hierarchy="secondary"
		iconTrailing={ChevronDown}
		iconLeading={
			<>
				{THEME_OPTIONS.map((o) => {
					const Icon = ICONS[o.value];
					return <Icon key={o.value} size={20} className={ICON_SHOWN[o.value]} />;
				})}
			</>
		}
	>
		{/* El nombre accesible es «Tema: Claro»: los textos ocultos (display: none) no cuentan */}
		<span className="sr-only">Tema: </span>
		{THEME_OPTIONS.map((o) => (
			<span key={o.value} className={TEXT_SHOWN[o.value]}>
				{o.label}
			</span>
		))}
	</Button>
);

export default function ThemeMenu() {
	// Hasta hidratar no se sabe lo elegido (lo dice la CSS); el menú solo se abre ya hidratado
	const [choice, setChoice] = useState<ThemeChoice>("sistema");

	useEffect(() => {
		followSystem();
		setChoice(themeChoice());
		return onThemeChange(() => setChoice(themeChoice()));
	}, []);

	return (
		<Dropdown
			trigger={TRIGGER}
			aria-label="Tema"
			selectedValue={choice}
			onSelectionChange={(value) => setTheme(value as ThemeChoice)}
			items={ITEMS}
		/>
	);
}
