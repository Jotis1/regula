"use client";

import { ChevronLeft, ChevronRight } from "@untitledui/icons";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { cx } from "../internal/cx.js";
import { formatMonth } from "../internal/format.js";
import { defaultStrings } from "../internal/strings.js";
import { useControllable } from "../internal/use-controllable.js";
import { Badge, type BadgeColor, COLOR } from "./Badge.js";
import { Dropdown } from "./Dropdown.js";

export interface CalendarEvent {
	/** El día del evento. En las vistas de semana y día, también su hora de inicio. */
	date: Date;
	title: string;
	/** Hora o importe a la derecha del título (vista de mes) o bajo él (semana y día). Por defecto, la hora de inicio. */
	time?: string;
	/** Colores de `Badge`. @default "gray" */
	color?: BadgeColor;
	/**
	 * Minutos que dura, para las vistas de semana y día (el Figma pinta de 30 a 120).
	 * @default 60
	 */
	duration?: number;
}

export type CalendarViewMode = "month" | "week" | "day";

export interface CalendarViewProps {
	events?: CalendarEvent[];
	/** El día que se marca como hoy (por defecto, la fecha del sistema). Su hora fija la línea de la hora actual. */
	today?: Date;
	/** Mes que se ve al principio. Por defecto, el de `today`. */
	month?: Date;
	/**
	 * Eventos por día; el resto se resume como "N más…".
	 * @default 3
	 */
	maxEvents?: number;
	/** Al pulsar un día (con ratón, o con teclado sobre su número). */
	onSelectDate?: (date: Date) => void;
	/** Vista (controlada). Con ella, `defaultView` o `onViewChange` aparece el selector de vista. */
	view?: CalendarViewMode;
	/**
	 * Vista al principio (no controlada).
	 * @default "month"
	 */
	defaultView?: CalendarViewMode;
	onViewChange?: (view: CalendarViewMode) => void;
	/** Al pulsar un evento de las vistas de semana y día: con él, cada evento es un botón. */
	onSelectEvent?: (event: CalendarEvent) => void;
	/**
	 * Hora a la que empieza el desplazamiento de las vistas de semana y día.
	 * @default 8
	 */
	startHour?: number;
	/**
	 * Horas que se pintan en las vistas de semana y día, de la primera a la última (por ejemplo `[8, 18]` para el horario
	 * de oficina). Los eventos fuera de ese tramo no se ven.
	 * @default [0, 24]
	 */
	hours?: [number, number];
	/** Panel a la derecha de la vista de día (el mini calendario o el detalle del evento del Figma). */
	aside?: ReactNode;
	subtitle?: ReactNode;
	/** Acciones a la derecha de la cabecera, como "Nuevo evento". */
	actions?: ReactNode;
	className?: string;
}

const HOUR = 96; // px por hora, como el Figma
const day0 = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const same = (a: Date, b: Date) => a.getTime() === b.getTime();
const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
// La semana empieza en lunes
const weekStart = (d: Date) => addDays(d, -((d.getDay() + 6) % 7));
const minutesOf = (d: Date) => d.getHours() * 60 + d.getMinutes();
const clock = (min: number) =>
	`${String(Math.floor(min / 60) % 24).padStart(2, "0")}:${String(min % 60).padStart(2, "0")}`;
const NAV =
	"inline-flex h-10 cursor-pointer items-center gap-2 border-0 border-l border-primary bg-primary px-3 py-2.5 font-body text-sm font-semibold text-secondary first:border-l-0 hover:bg-primary_hover hover:text-secondary_hover focus-visible:relative focus-visible:z-10 focus-visible:shadow-focus-ring focus-visible:outline-none [&_svg]:text-fg-quaternary";
const longDate = (d: Date) =>
	new Intl.DateTimeFormat("es-ES", { weekday: "long", day: "numeric", month: "long" }).format(d);
const shortDate = (d: Date) =>
	new Intl.DateTimeFormat("es-ES", { day: "numeric", month: "short", year: "numeric" })
		.format(d)
		.replace(/\./g, "");
const weekdayShort = (d: Date) => {
	const s = new Intl.DateTimeFormat("es-ES", { weekday: "short" }).format(d).replace(".", "");
	return s.charAt(0).toUpperCase() + s.slice(1);
};

/** Número de semana ISO. */
function isoWeek(d: Date): number {
	const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
	t.setUTCDate(t.getUTCDate() + 4 - (t.getUTCDay() || 7));
	const jan1 = new Date(Date.UTC(t.getUTCFullYear(), 0, 1));
	return Math.ceil(((t.getTime() - jan1.getTime()) / 86400000 + 1) / 7);
}

interface Placed {
	event: CalendarEvent;
	start: number;
	end: number;
	lane: number;
	lanes: number;
}

/** Eventos de un día con su hueco: los que se pisan se reparten el ancho de la columna. */
function layoutDay(events: CalendarEvent[]): Placed[] {
	const items = events
		.map((event) => {
			const start = minutesOf(event.date);
			return { event, start, end: Math.min(24 * 60, start + Math.max(15, event.duration ?? 60)) };
		})
		.sort((a, b) => a.start - b.start || b.end - a.end);
	const out: Placed[] = [];
	let cluster: Placed[] = [];
	let laneEnds: number[] = [];
	let clusterEnd = -1;
	const flush = () => {
		for (const p of cluster) p.lanes = laneEnds.length;
		out.push(...cluster);
		cluster = [];
		laneEnds = [];
	};
	for (const it of items) {
		if (it.start >= clusterEnd && cluster.length) flush();
		let lane = laneEnds.findIndex((end) => end <= it.start);
		if (lane === -1) lane = laneEnds.length;
		laneEnds[lane] = it.end;
		clusterEnd = Math.max(clusterEnd, it.end);
		cluster.push({ ...it, lane, lanes: 1 });
	}
	flush();
	return out;
}

const GRID_LINES = {
	backgroundImage:
		"repeating-linear-gradient(to bottom, transparent 0, transparent 47px, var(--border-secondary) 47px, var(--border-secondary) 48px)",
};

function EventBlock({
	placed,
	origin,
	onSelect,
}: {
	placed: Placed;
	origin: number;
	onSelect?: (e: CalendarEvent) => void;
}) {
	const { event, start, end, lane, lanes } = placed;
	const label = `${event.title}, ${clock(start)}–${clock(end)}`;
	const height = ((end - start) / 60) * HOUR - 4;
	const body = (
		<>
			<span className="max-w-full truncate" aria-hidden="true">
				{event.title}
			</span>
			{end - start >= 45 ? (
				<span className="font-normal" aria-hidden="true">
					{event.time ?? clock(start)}
				</span>
			) : null}
		</>
	);
	return (
		<li
			aria-label={onSelect ? undefined : label}
			title={event.title}
			style={{
				top: ((start - origin) / 60) * HOUR + 2,
				height,
				left: `calc(${(lane / lanes) * 100}% + 2px)`,
				width: `calc(${100 / lanes}% - 4px)`,
			}}
			className={cx(
				"absolute m-0 min-w-0 list-none overflow-hidden rounded-lg font-body text-xs font-semibold inset-ring",
				COLOR[event.color ?? "gray"].badge,
			)}
		>
			{onSelect ? (
				<button
					type="button"
					aria-label={label}
					onClick={() => onSelect(event)}
					className="flex size-full min-w-0 cursor-pointer flex-col items-start gap-0.5 border-0 bg-transparent px-2 py-1 text-left font-[inherit] text-[inherit] focus-visible:shadow-focus-ring focus-visible:outline-none"
				>
					{body}
				</button>
			) : (
				<div className="flex size-full min-w-0 flex-col items-start gap-0.5 px-2 py-1">{body}</div>
			)}
		</li>
	);
}

function TimeGrid({
	days,
	events,
	now,
	today,
	startHour,
	hours,
	onSelectEvent,
	selected,
	hideOthersOnMobile,
}: {
	days: Date[];
	events: CalendarEvent[];
	now: Date;
	today: Date;
	startHour: number;
	hours: [number, number];
	onSelectEvent?: (e: CalendarEvent) => void;
	selected: Date;
	hideOthersOnMobile: boolean;
}) {
	const scroller = useRef<HTMLElement>(null);
	useEffect(() => {
		if (scroller.current) scroller.current.scrollTop = Math.max(0, (startHour - hours[0] - 0.5) * HOUR);
	}, [startHour, hours]);
	const [from, to] = hours;
	const origin = from * 60;
	const nowMin = minutesOf(now);
	const todayShown = days.some((d) => same(d, today));
	return (
		<section
			ref={scroller}
			// biome-ignore lint/a11y/noNoninteractiveTabindex: zona que se desplaza; con el teclado tiene que poder enfocarse para moverla
			tabIndex={0}
			aria-label={defaultStrings.schedule}
			className="max-h-[640px] overflow-y-auto focus-visible:shadow-focus-ring focus-visible:outline-none"
		>
			<div className="relative flex overflow-hidden" style={{ height: (to - from) * HOUR }}>
				<div className="relative w-12 flex-none bg-secondary @xl:w-16" aria-hidden="true">
					{Array.from({ length: Math.max(0, to - from - 1) }, (_, i) => (
						<span
							// biome-ignore lint/suspicious/noArrayIndexKey: las horas son posiciones fijas
							key={i}
							style={{ top: (i + 1) * HOUR }}
							className="absolute right-2 -translate-y-1/2 text-xs font-medium text-quaternary"
						>
							{clock((from + i + 1) * 60)}
						</span>
					))}
				</div>
				<div className="flex min-w-0 flex-1">
					{days.map((d) => {
						const placed = layoutDay(events.filter((e) => same(day0(e.date), d)));
						return (
							<ul
								key={d.getTime()}
								aria-label={longDate(d)}
								style={GRID_LINES}
								className={cx(
									"relative m-0 min-w-0 flex-1 list-none border-0 border-l border-solid border-secondary p-0",
									hideOthersOnMobile && !same(d, selected) && "@max-xl:hidden",
								)}
							>
								{placed.map((p, k) => (
									// biome-ignore lint/suspicious/noArrayIndexKey: varios eventos pueden compartir título
									<EventBlock key={k} placed={p} origin={origin} onSelect={onSelectEvent} />
								))}
							</ul>
						);
					})}
				</div>
				{todayShown && nowMin >= origin && nowMin <= to * 60 ? (
					// biome-ignore lint/a11y/useSemanticElements: la línea lleva dentro la hora y el punto, un <hr> no puede
					<div
						role="separator"
						aria-orientation="horizontal"
						aria-label={defaultStrings.currentTime(clock(nowMin))}
						data-now-line=""
						style={{ top: ((nowMin - origin) / 60) * HOUR }}
						className="pointer-events-none absolute inset-x-0 z-10 flex items-center"
					>
						<span className="w-12 flex-none bg-secondary pr-2 text-right text-xs font-medium text-brand-secondary @xl:w-16">
							{clock(nowMin)}
						</span>
						<span className="-ml-1 size-2 flex-none rounded-full bg-brand-solid" />
						<span className="h-px flex-1 bg-brand-solid" />
					</div>
				) : null}
			</div>
		</section>
	);
}

/** Calendario con vistas de mes, semana y día, cabecera con la fecha de hoy y navegación. */
export function CalendarView({
	events = [],
	today: todayProp,
	month,
	maxEvents = 3,
	onSelectDate,
	view: viewProp,
	defaultView = "month",
	onViewChange,
	onSelectEvent,
	startHour = 8,
	hours = [0, 24],
	aside,
	subtitle,
	actions,
	className,
}: CalendarViewProps) {
	const now = todayProp ?? new Date();
	const today = day0(now);
	const startMonth = month ?? today;
	const [view, setView] = useControllable(viewProp, defaultView, onViewChange);
	const hasSelector = viewProp !== undefined || onViewChange !== undefined || defaultView !== "month";
	const [shown, setShown] = useState(() =>
		month ? new Date(startMonth.getFullYear(), startMonth.getMonth(), 1) : today,
	);
	const y = shown.getFullYear();
	const mo = shown.getMonth();
	// La semana empieza en lunes
	const lead = (new Date(y, mo, 1).getDay() + 6) % 7;
	const weeks = Math.ceil((lead + new Date(y, mo + 1, 0).getDate()) / 7);
	const cells = Array.from({ length: weeks * 7 }, (_, i) => new Date(y, mo, 1 - lead + i));
	const shortMonth = new Intl.DateTimeFormat("es-ES", { month: "short" })
		.format(today)
		.replace(".", "")
		.toUpperCase();
	const step = (dir: 1 | -1) =>
		setShown(
			view === "month" ? new Date(y, mo + dir, 1) : addDays(shown, (view === "week" ? 7 : 1) * dir),
		);
	const prevLabel =
		view === "week"
			? defaultStrings.previousWeek
			: view === "day"
				? defaultStrings.previousDay
				: defaultStrings.previousMonth;
	const nextLabel =
		view === "week"
			? defaultStrings.nextWeek
			: view === "day"
				? defaultStrings.nextDay
				: defaultStrings.nextMonth;
	const days =
		view === "week" ? Array.from({ length: 7 }, (_, i) => addDays(weekStart(shown), i)) : [day0(shown)];
	const title =
		view === "day"
			? new Intl.DateTimeFormat("es-ES", { day: "numeric", month: "long", year: "numeric" }).format(
					shown,
				)
			: formatMonth(shown);
	const auto =
		view === "week"
			? `${shortDate(days[0] as Date)} – ${shortDate(days[6] as Date)}`
			: view === "day"
				? new Intl.DateTimeFormat("es-ES", { weekday: "long" })
						.format(shown)
						.replace(/^./, (c) => c.toUpperCase())
				: undefined;
	const sub = subtitle ?? auto;
	const viewLabels: Record<CalendarViewMode, string> = {
		month: defaultStrings.viewMonth,
		week: defaultStrings.viewWeek,
		day: defaultStrings.viewDay,
	};

	return (
		<div
			className={cx(
				"overflow-hidden rounded-xl border border-secondary bg-primary font-body shadow-xs",
				// Las vistas de semana y día se adaptan al ancho del propio calendario, no al de la ventana
				(hasSelector || view !== "month") && "@container",
				className,
			)}
		>
			<div className="flex flex-wrap items-center gap-4 px-6 py-5 shadow-[inset_0_-1px_0_var(--border-secondary)]">
				<div
					aria-hidden="true"
					className="flex w-16 flex-col overflow-hidden rounded-lg border border-secondary text-center"
				>
					<span className="bg-secondary py-1 text-xs font-semibold text-quaternary">
						{shortMonth}
					</span>
					<strong className="pt-0.5 pb-1 text-lg font-bold text-brand-secondary">
						{today.getDate()}
					</strong>
				</div>
				<div className="flex-1">
					{view === "month" ? (
						<h3 className="m-0 text-lg font-semibold text-primary" aria-live="polite">
							{title}
						</h3>
					) : (
						<div className="flex items-center gap-2">
							<h3
								className="m-0 whitespace-nowrap text-lg font-semibold text-primary"
								aria-live="polite"
							>
								{title}
							</h3>
							<Badge size="sm" type="badge" color="gray">
								{defaultStrings.weekNumber(isoWeek(shown))}
							</Badge>
						</div>
					)}
					{sub ? <p className="m-0 text-sm text-tertiary">{sub}</p> : null}
				</div>
				<div className="inline-flex overflow-hidden rounded-lg shadow-[var(--shadow-xs-skeuomorphic),inset_0_0_0_1px_var(--border-primary)]">
					<button type="button" aria-label={prevLabel} className={NAV} onClick={() => step(-1)}>
						<ChevronLeft size={20} />
					</button>
					<button type="button" className={NAV} onClick={() => setShown(today)}>
						{defaultStrings.today}
					</button>
					<button type="button" aria-label={nextLabel} className={NAV} onClick={() => step(1)}>
						<ChevronRight size={20} />
					</button>
				</div>
				{hasSelector ? (
					<Dropdown
						label={viewLabels[view]}
						aria-label={defaultStrings.view}
						items={(["month", "week", "day"] as const).map((v) => ({
							label: viewLabels[v],
							value: v,
						}))}
						selectedValue={view}
						onSelectionChange={(v) => setView(v as CalendarViewMode)}
					/>
				) : null}
				{actions ?? null}
			</div>
			{view === "month" ? (
				<table className="w-full table-fixed border-collapse">
					<thead>
						<tr>
							{defaultStrings.weekdaysMin.map((d) => (
								<th
									key={d}
									scope="col"
									className="bg-secondary p-2 text-center text-xs font-semibold text-tertiary shadow-[inset_0_-1px_0_var(--border-secondary)]"
								>
									{d}
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{Array.from({ length: weeks }, (_, w) => (
							// biome-ignore lint/suspicious/noArrayIndexKey: las semanas del mes son posiciones fijas
							<tr key={w}>
								{cells.slice(w * 7, w * 7 + 7).map((c) => {
									const list = events.filter((e) => same(day0(e.date), c));
									const out = c.getMonth() !== mo;
									const isToday = same(c, today);
									const label = `${longDate(c)}${isToday ? `, ${defaultStrings.today.toLowerCase()}` : ""}`;
									const number = cx(
										"inline-flex size-6 items-center justify-center rounded-full text-xs",
										isToday
											? "bg-brand-solid font-semibold text-white"
											: out
												? "font-medium text-quaternary"
												: "font-semibold text-secondary",
									);
									return (
										// biome-ignore lint/a11y/useKeyWithClickEvents: con teclado se elige con el botón del número
										<td
											key={c.getTime()}
											onClick={onSelectDate ? () => onSelectDate(c) : undefined}
											className={cx(
												"h-28 min-w-0 p-2 align-top shadow-[inset_-1px_-1px_0_var(--border-secondary)]",
												out ? "bg-secondary" : "bg-primary",
												onSelectDate && "cursor-pointer",
											)}
										>
											<div className="flex min-w-0 flex-col gap-1">
												{onSelectDate ? (
													<button
														type="button"
														aria-label={label}
														onClick={(e) => {
															e.stopPropagation();
															onSelectDate(c);
														}}
														className={cx(
															number,
															"cursor-pointer border-0 p-0 focus-visible:shadow-focus-ring focus-visible:outline-none",
															!isToday && "bg-transparent",
														)}
													>
														{c.getDate()}
													</button>
												) : (
													<span className={number}>
														<span aria-hidden="true">{c.getDate()}</span>
														<span className="sr-only">{label}</span>
													</span>
												)}
												{list.slice(0, maxEvents).map((e, k) => (
													<div
														// biome-ignore lint/suspicious/noArrayIndexKey: varios eventos pueden compartir título
														key={k}
														title={e.title}
														className={cx(
															"flex min-w-0 justify-between gap-1 rounded-md px-2 py-1 text-xs font-semibold inset-ring",
															COLOR[e.color ?? "gray"].badge,
														)}
													>
														<span className="truncate">{e.title}</span>
														{e.time ? (
															<span className="flex-none font-normal">
																{e.time}
															</span>
														) : null}
													</div>
												))}
												{list.length > maxEvents ? (
													<div className="px-2 text-xs font-semibold text-quaternary">
														{defaultStrings.showMore(list.length - maxEvents)}
													</div>
												) : null}
											</div>
										</td>
									);
								})}
							</tr>
						))}
					</tbody>
				</table>
			) : (
				<div className={cx(view === "day" && aside ? "flex flex-col lg:flex-row" : undefined)}>
					<div className="min-w-0 flex-1">
						{view === "week" ? (
							<div className="grid grid-cols-7 shadow-[inset_0_-1px_0_var(--border-secondary)] @xl:grid-cols-[4rem_repeat(7,minmax(0,1fr))]">
								<div className="@max-xl:hidden" />
								{days.map((d) => {
									const isToday = same(d, today);
									const label = `${longDate(d)}${isToday ? `, ${defaultStrings.today.toLowerCase()}` : ""}`;
									const isShown = same(d, day0(shown));
									const num = cx(
										"inline-flex size-6 items-center justify-center rounded-full text-xs font-semibold",
										isToday ? "bg-brand-solid text-white" : "text-secondary",
									);
									return (
										<div
											key={d.getTime()}
											className="flex flex-col items-center gap-1 border-0 border-l border-solid border-secondary py-2 text-xs font-medium text-tertiary first:border-l-0 @xl:flex-row @xl:justify-center @xl:gap-1.5"
										>
											<span aria-hidden="true">{weekdayShort(d)}</span>
											<button
												type="button"
												aria-label={label}
												aria-pressed={isShown}
												onClick={() => {
													setShown(d);
													onSelectDate?.(d);
												}}
												className={cx(
													num,
													"cursor-pointer border-0 bg-transparent p-0 focus-visible:shadow-focus-ring focus-visible:outline-none",
													isToday && "bg-brand-solid",
												)}
											>
												{d.getDate()}
											</button>
										</div>
									);
								})}
							</div>
						) : null}
						<TimeGrid
							days={days}
							events={events}
							now={now}
							today={today}
							startHour={startHour}
							hours={hours}
							onSelectEvent={onSelectEvent}
							selected={day0(shown)}
							hideOthersOnMobile={view === "week"}
						/>
					</div>
					{view === "day" && aside ? (
						<aside className="w-full flex-none border-0 border-t border-solid border-secondary lg:w-80 lg:border-t-0 lg:border-l">
							{aside}
						</aside>
					) : null}
				</div>
			)}
		</div>
	);
}
