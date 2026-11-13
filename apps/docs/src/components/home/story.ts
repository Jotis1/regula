// La historia de las cinco reglas de la portada (design D4 de redesign-docs-site-v2): seis pasos, el primero la
// pantalla tal como llega y luego una regla por paso. Los textos de las reglas son los de la guía (Principios, Color y
// Contenido y tono); el de «qué cambia» es lo que se ve en la pantalla de ejemplo.

export interface StoryStep {
	title: string;
	/** La regla, con el texto de la guía. */
	text: string;
	/** Lo que cambia en la pantalla al aplicarla. */
	fix: string;
}

export const STORY: readonly StoryStep[] = [
	{
		title: "Así llega",
		text: "Una pantalla de Pecunia hecha con prisa. Funciona. También funciona un semáforo con todas las luces encendidas.",
		fix: "Nada todavía.",
	},
	{
		title: "Neutro primero, marca con intención",
		text: "Casi todo es gris: texto, bordes, fondos. Si una pantalla tiene más de dos o tres manchas de marca, sobra alguna.",
		fix: "Las etiquetas pasan a gris. El índigo se queda con lo actual.",
	},
	{
		title: "Una acción principal",
		text: "Cada vista y cada modal tiene como mucho un Button primary. El resto, secondary o tertiary.",
		fix: "De tres botones primarios queda uno: guardar.",
	},
	{
		title: "Todo input lleva etiqueta visible",
		text: "El borde del campo queda por debajo del 3:1, así que la etiqueta es lo que lo identifica.",
		fix: "El placeholder deja de hacer de etiqueta y vuelve a ser un ejemplo.",
	},
	{
		title: "Un estado nunca va solo con color",
		text: "Un estado siempre lleva palabra o icono además del color.",
		fix: "El punto verde aprende a decir «Pagado».",
	},
	{
		title: "Cifras con formato español",
		text: "Importes y fechas como se escriben aquí.",
		fix: "1284.5 EUR pasa a 1.284,50 € y la fecha deja de venir en otro orden.",
	},
];

/** Cuántas reglas hay: los pasos menos el de partida. */
export const RULES = STORY.length - 1;

/** «Antes» en el paso de partida y «Regla 2 de 5» en los demás. */
export const stepLabel = (step: number) => (step === 0 ? "Antes" : `Regla ${step} de ${RULES}`);

/** Lo que dice el pie de la pantalla de ejemplo en cada paso. */
export const stageNote = (step: number) =>
	step === 0
		? "La pantalla tal como llega. Las reglas aplicadas se quedan puestas."
		: `Regla ${step} de ${RULES} aplicada. El marco índigo señala lo que acaba de cambiar.`;

/** Un entero con el punto de los millares, como pide la guía: 1181 es «1.181». */
export const thousands = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
