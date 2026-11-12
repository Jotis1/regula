// Menú móvil a pantalla completa (reference/docs-design/MobileMenu.dc.html) sobre el Slideout de @jotis-me/react,
// que trae el foco atrapado, Escape y el foco de vuelta al botón (design §7). Dentro: la búsqueda, la misma
// navegación lateral (llega como hijos desde Astro, ya pintada) y el tema en tres estados (design §8).
import { AppIcon, Button, ButtonGroup, Icon, Slideout } from "@jotis-me/react";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { initDocNav } from "../lib/docnav";
import { onThemeChange, setTheme, THEME_OPTIONS, type ThemeChoice, themeChoice } from "../lib/theme";

export default function MobileMenu({ children }: { children?: ReactNode }) {
	const [open, setOpen] = useState(false);
	const [theme, setChoice] = useState<ThemeChoice>("sistema");
	const body = useRef<HTMLDivElement>(null);

	useEffect(() => {
		setChoice(themeChoice());
		return onThemeChange(() => setChoice(themeChoice()));
	}, []);

	// La navegación del menú solo existe con el menú abierto: su filtro se activa entonces
	useEffect(() => {
		if (!open) return;
		const nav = body.current?.querySelector<HTMLElement>("[data-docnav]");
		if (nav) initDocNav(nav);
	}, [open]);

	const search = () => {
		setOpen(false);
		// El Slideout devuelve el foco al cerrarse; la búsqueda se abre después
		requestAnimationFrame(() => window.dispatchEvent(new CustomEvent("regula:search")));
	};

	return (
		<>
			<Button
				hierarchy="tertiary"
				size="lg"
				iconOnly="menu-01"
				label="Abrir menú"
				aria-haspopup="dialog"
				aria-expanded={open}
				onClick={() => setOpen(true)}
			/>
			<Slideout
				open={open}
				onClose={() => setOpen(false)}
				width="100%"
				title={
					<span className="flex items-center gap-2">
						<span aria-hidden="true" className="flex dark:hidden">
							<AppIcon app="regula" variant="light" size={24} tilde />
						</span>
						<span aria-hidden="true" className="hidden dark:flex">
							<AppIcon app="regula" size={24} tilde />
						</span>
						<span className="font-display text-lg font-bold tracking-[-0.02em]">Regula</span>
					</span>
				}
				actions={
					<div className="flex w-full items-center gap-3">
						<span className="grow text-sm font-medium text-secondary">Tema</span>
						<ButtonGroup
							aria-label="Tema"
							items={THEME_OPTIONS}
							value={theme}
							onChange={(v) => setTheme(v as ThemeChoice)}
						/>
					</div>
				}
			>
				<div ref={body} className="-mx-6 flex flex-col">
					<div className="px-4 pt-1">
						<button
							type="button"
							onClick={search}
							className="flex h-11 w-full items-center gap-2 rounded-lg border border-primary bg-primary pr-2 pl-3 text-left text-sm text-quaternary shadow-xs transition-colors duration-100 hover:bg-primary_hover focus-visible:shadow-focus-ring focus-visible:outline-none"
						>
							<Icon name="search-lg" size={20} className="shrink-0 text-fg-quaternary" />
							<span className="grow">Buscar en Regula</span>
						</button>
					</div>
					{children}
				</div>
			</Slideout>
		</>
	);
}
