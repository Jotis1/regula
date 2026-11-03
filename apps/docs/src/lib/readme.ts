// Fragmentos de instalación de la portada, sacados del README de @jotis-me/react (design §11): de cada sección
// (Next.js y Astro), el bloque `sh` con la instalación y el bloque `css` con la hoja, con su ruta, que el README
// escribe entre comillas invertidas justo antes del bloque. Si el README cambia, la portada cambia con él.

export interface InstallTab {
	label: string;
	code: string;
}

const SECTIONS = [
	{ heading: /^## Next\.js/m, label: "Next.js" },
	{ heading: /^## Astro/m, label: "Astro" },
];

/** El texto de una sección `## …` del README, hasta la siguiente. */
function section(readme: string, heading: RegExp): string {
	const start = readme.search(heading);
	if (start < 0) return "";
	const next = readme.slice(start + 3).search(/^## /m);
	return next < 0 ? readme.slice(start) : readme.slice(start, start + 3 + next);
}

/** Las pestañas de instalación: comandos, la ruta de la hoja y su contenido. */
export function installTabs(readme: string): InstallTab[] {
	return SECTIONS.map(({ heading, label }) => {
		const text = section(readme, heading);
		const sh = text.match(/```sh\n([\s\S]*?)```/)?.[1]?.trim();
		const css = text.match(/`([^`\n]+\.css)`[^\n]*\n+```css\n([\s\S]*?)```/);
		if (!sh || !css) throw new Error(`El README de @jotis-me/react no trae la instalación de ${label}`);
		return { label, code: `${sh}\n\n/* ${css[1]} */\n${(css[2] as string).trim()}` };
	});
}
