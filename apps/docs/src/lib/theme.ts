// Tema de la web en tres estados (design §8): `localStorage` guarda "claro", "oscuro" o nada, que es seguir al
// sistema. El script de <head> (ThemeScript.astro) aplica lo mismo antes de pintar; esto es lo del navegador
// después: elegir, avisar a quien lo muestra (evento `regula:theme`) y seguir al sistema mientras no haya elección.

export type ThemeChoice = "sistema" | "claro" | "oscuro";

/** Las tres opciones, con el nombre que se lee: las usan el selector de la cabecera y el del menú móvil. */
export const THEME_OPTIONS: { value: ThemeChoice; label: string }[] = [
	{ value: "sistema", label: "Sistema" },
	{ value: "claro", label: "Claro" },
	{ value: "oscuro", label: "Oscuro" },
];

const KEY = "regula-tema";
const EVENT = "regula:theme";
const darkQuery = () => matchMedia("(prefers-color-scheme: dark)");

/** Lo elegido: "claro", "oscuro" o "sistema" si no hay nada guardado. */
export function themeChoice(): ThemeChoice {
	let stored: string | null = null;
	try {
		stored = localStorage.getItem(KEY);
	} catch {}
	return stored === "claro" || stored === "oscuro" ? stored : "sistema";
}

/** Si la página está ahora en oscuro. */
export const isDark = () => document.documentElement.classList.contains("dark-mode");

function paint(dark: boolean) {
	document.documentElement.classList.toggle("dark-mode", dark);
	window.dispatchEvent(new CustomEvent(EVENT));
}

/** Aplica una elección y la recuerda; "sistema" borra la guardada y sigue a la preferencia del sistema. */
export function setTheme(choice: ThemeChoice) {
	try {
		if (choice === "sistema") localStorage.removeItem(KEY);
		else localStorage.setItem(KEY, choice);
	} catch {}
	// `data-tema` lo lee la CSS del selector de la cabecera (el script de <head> lo pone antes de pintar)
	document.documentElement.dataset.tema = choice;
	paint(choice === "sistema" ? darkQuery().matches : choice === "oscuro");
}

/** Llama a `fn` cada vez que cambia el tema, sea por una elección o por el sistema. Devuelve cómo dejar de oír. */
export function onThemeChange(fn: () => void): () => void {
	window.addEventListener(EVENT, fn);
	return () => window.removeEventListener(EVENT, fn);
}

let watching = false;
/** Mientras la elección sea "sistema", sigue los cambios de preferencia del sistema. Basta con llamarla una vez. */
export function followSystem() {
	if (watching) return;
	watching = true;
	darkQuery().addEventListener("change", (e) => {
		if (themeChoice() === "sistema") paint(e.matches);
	});
}
