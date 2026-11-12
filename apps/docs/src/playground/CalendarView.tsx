// CalendarView en el ejemplo interactivo (un fichero por componente: design D4): las fechas son objetos `Date`, que no
// viajan como JSON; el módulo fija el día de hoy y el mes, y ofrece los eventos como contenido preparado.
import { CalendarView } from "@jotis-me/react";
import type { ComponentProps } from "react";
import type { Tweak } from "../lib/playground";

const HOY = new Date(2026, 9, 29);
const MES = new Date(2026, 9, 1);

export default function CalendarViewOctubre(props: ComponentProps<typeof CalendarView>) {
	return <CalendarView today={HOY} month={MES} {...props} />;
}

const EVENTOS = [
	{ date: new Date(2026, 9, 5), title: "Reunión de equipo", time: "10:00", color: "brand" },
	{ date: new Date(2026, 9, 15), title: "Seguro del coche", time: "09:30", color: "warning" },
	{ date: new Date(2026, 9, 29), title: "Cierre del mes", time: "17:00", color: "success", duration: 1.5 },
] as const;

export const tweaks: Record<string, Tweak> = {
	events: {
		kind: "content",
		options: [
			{
				label: "Octubre",
				value: EVENTOS,
				code: [
					"[",
					'\t{ date: new Date(2026, 9, 5), title: "Reunión de equipo", time: "10:00", color: "brand" },',
					'\t{ date: new Date(2026, 9, 15), title: "Seguro del coche", time: "09:30", color: "warning" },',
					'\t{ date: new Date(2026, 9, 29), title: "Cierre del mes", time: "17:00", color: "success", duration: 1.5 },',
					"]",
				].join("\n"),
			},
		],
	},
};
