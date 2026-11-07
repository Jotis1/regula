// Selector de tema de la cabecera (design D2): un botón de icono que abre un menú con Sistema, Claro y Oscuro, con la
// opción actual marcada. El botón pinta los tres iconos y la CSS deja ver el de lo elegido según `data-tema` de
// <html>, que ya pone el script de <head> antes de pintar: el icono es el bueno desde la primera pintura, antes de que
// esta isla se hidrate. El nombre del botón dice lo elegido en cuanto se hidrata.
import { Dropdown, Icon } from "@jotis-me/react";
import { useEffect, useState } from "react";
import {
	followSystem,
	onThemeChange,
	setTheme,
	THEME_OPTIONS,
	type ThemeChoice,
	themeChoice,
} from "../lib/theme";

const ITEMS = THEME_OPTIONS.map((o) => ({
	icon:
		o.value === "sistema"
			? ("monitor-01" as const)
			: o.value === "claro"
				? ("sun" as const)
				: ("moon-01" as const),
	label: o.label,
	value: o.value,
}));

export default function ThemeMenu() {
	// Hasta hidratar no se sabe lo elegido (el servidor no lo sabe): el nombre del botón dice solo «Tema»
	const [choice, setChoice] = useState<ThemeChoice | null>(null);

	useEffect(() => {
		followSystem();
		setChoice(themeChoice());
		return onThemeChange(() => setChoice(themeChoice()));
	}, []);

	const name = choice ? `Tema: ${THEME_OPTIONS.find((o) => o.value === choice)?.label}` : "Tema";

	return (
		<Dropdown
			aria-label="Tema"
			selectedValue={choice ?? "sistema"}
			onSelectionChange={(value) => setTheme(value as ThemeChoice)}
			items={ITEMS}
			trigger={
				<button
					type="button"
					aria-label={name}
					className="flex size-11 items-center justify-center rounded-lg text-fg-quaternary transition-colors duration-100 hover:bg-primary_hover hover:text-fg-quaternary_hover focus-visible:shadow-focus-ring focus-visible:outline-none aria-expanded:bg-primary_hover aria-expanded:text-fg-quaternary_hover lg:size-10"
				>
					<Icon name="monitor-01" size={20} className="hidden in-data-[tema=sistema]:block" />
					<Icon name="sun" size={20} className="hidden in-data-[tema=claro]:block" />
					<Icon name="moon-01" size={20} className="hidden in-data-[tema=oscuro]:block" />
				</button>
			}
		/>
	);
}
