// Vista previa de CalendarView: mes, semana y día, y la semana y el día en 375 px. Va en su propio fichero para que las
// páginas que comparten `data.tsx` no carguen el desplegable de vistas.

import { Avatar, Button, type CalendarEvent, CalendarView } from "@jotis-me/react";
import { Plus } from "@untitledui/icons";
import { stack } from "./actions";

const at = (day: number, h: number, m = 0) => new Date(2027, 0, day, h, m);
// Viernes 8 de enero de 2027 a las 14:20, como el Figma
const today = at(8, 14, 20);

const events: CalendarEvent[] = [
	{ date: at(4, 9), title: "Reunión de lunes", duration: 30 },
	{ date: at(4, 11), title: "Planificación", color: "blue", duration: 60 },
	{ date: at(5, 10), title: "Uno a uno con Eva", color: "pink", duration: 60 },
	{ date: at(5, 15, 30), title: "Ponerse al día", color: "purple", duration: 90 },
	{ date: at(6, 9), title: "Trabajo a fondo", color: "blue", duration: 120 },
	{ date: at(6, 10, 30), title: "Revisión de diseño", color: "indigo", duration: 60 },
	{ date: at(6, 13, 30), title: "Plan de SEO", color: "indigo", duration: 60 },
	{ date: at(6, 15), title: "Evento del barrio", color: "warning", duration: 120 },
	{ date: at(7, 12), title: "Comida con Olivia", color: "success", duration: 60 },
	{ date: at(8, 9), title: "Reunión de viernes", duration: 30 },
	{ date: at(8, 10), title: "Olivia x Riley", color: "indigo", duration: 90 },
	{ date: at(8, 13, 30), title: "Demo del producto", color: "indigo", duration: 120 },
	{ date: at(9, 11), title: "Inspección de la casa", color: "orange", duration: 30 },
	{ date: at(10, 13, 30), title: "Fiesta de compromiso", color: "purple", duration: 90 },
];

const add = (
	<Button iconLeading={Plus} size="md">
		Nuevo evento
	</Button>
);

export function CalendarViewExample() {
	return (
		<div className={stack}>
			<CalendarView
				today={new Date(2026, 9, 29)}
				subtitle="Pagos y recordatorios"
				events={[
					{ date: new Date(2026, 9, 1), title: "Alquiler", time: "650 €", color: "brand" },
					{ date: new Date(2026, 9, 5), title: "Electricidad", color: "gray" },
					{ date: new Date(2026, 9, 15), title: "Seguro coche", color: "indigo" },
					{ date: new Date(2026, 9, 15), title: "Gimnasio", color: "success" },
					{ date: new Date(2026, 9, 15), title: "Netflix", color: "purple" },
					{ date: new Date(2026, 9, 15), title: "Spotify", color: "success" },
					{ date: new Date(2026, 9, 29), title: "Revisión semanal", time: "18:00", color: "blue" },
				]}
			/>
			<CalendarView today={today} defaultView="week" hours={[8, 18]} events={events} actions={add} />
			<CalendarView
				today={today}
				defaultView="day"
				hours={[8, 18]}
				events={events}
				actions={add}
				aside={
					<div className="flex flex-col gap-3 p-6 font-body">
						<h4 className="m-0 text-md font-semibold text-primary">Demo del producto</h4>
						<p className="m-0 text-sm text-tertiary">
							Viernes, 8 de enero de 2027 · 13:30 – 15:30
						</p>
						<div className="flex items-center gap-2 text-sm text-tertiary">
							<Avatar initials="OR" size="sm" />
							<span>6 invitados</span>
						</div>
						<p className="m-0 text-sm text-tertiary">
							Presentación del panel nuevo y turno de preguntas.
						</p>
					</div>
				}
			/>
			<div className="flex flex-wrap items-start gap-6">
				<div style={{ width: 375 }}>
					<CalendarView today={today} defaultView="week" hours={[8, 18]} events={events} />
				</div>
				<div style={{ width: 375 }}>
					<CalendarView today={today} defaultView="day" hours={[8, 18]} events={events} />
				</div>
			</div>
		</div>
	);
}
