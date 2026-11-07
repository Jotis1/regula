"use client";

import { type ReactNode, useState } from "react";
import { cx } from "../internal/cx.js";
import { formatMonth } from "../internal/format.js";
import { defaultStrings } from "../internal/strings.js";
import { type BadgeColor, COLOR } from "./Badge.js";
import { Icon } from "./Icon.js";

export interface CalendarEvent {
	date: Date;
	title: string;
	/** Hora o importe a la derecha del título. */
	time?: string;
	/** Colores de `Badge`. @default "gray" */
	color?: BadgeColor;
}

export interface CalendarViewProps {
	events?: CalendarEvent[];
	/** El día que se marca como hoy (por defecto, la fecha del sistema). */
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
	subtitle?: ReactNode;
	/** Acciones a la derecha de la cabecera, como "Nuevo evento". */
	actions?: ReactNode;
	className?: string;
}

const day0 = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const same = (a: Date, b: Date) => a.getTime() === b.getTime();
const NAV =
	"inline-flex h-10 cursor-pointer items-center gap-2 border-0 border-l border-primary bg-primary px-3 py-2.5 font-body text-sm font-semibold text-secondary first:border-l-0 hover:bg-primary_hover hover:text-secondary_hover focus-visible:relative focus-visible:z-10 focus-visible:shadow-focus-ring focus-visible:outline-none [&_svg]:text-fg-quaternary";
const longDate = (d: Date) =>
	new Intl.DateTimeFormat("es-ES", { weekday: "long", day: "numeric", month: "long" }).format(d);

/** Calendario mensual con eventos en cada día, cabecera con la fecha de hoy y navegación. Solo vista de mes. */
export function CalendarView({
	events = [],
	today: todayProp,
	month,
	maxEvents = 3,
	onSelectDate,
	subtitle,
	actions,
	className,
}: CalendarViewProps) {
	const today = day0(todayProp ?? new Date());
	const startMonth = month ?? today;
	const [shown, setShown] = useState(() => new Date(startMonth.getFullYear(), startMonth.getMonth(), 1));
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

	return (
		<div
			className={cx(
				"overflow-hidden rounded-xl border border-secondary bg-primary font-body shadow-xs",
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
					<h3 className="m-0 text-lg font-semibold text-primary" aria-live="polite">
						{formatMonth(shown)}
					</h3>
					{subtitle ? <p className="m-0 text-sm text-tertiary">{subtitle}</p> : null}
				</div>
				<div className="inline-flex overflow-hidden rounded-lg shadow-[var(--shadow-xs-skeuomorphic),inset_0_0_0_1px_var(--border-primary)]">
					<button
						type="button"
						aria-label={defaultStrings.previousMonth}
						className={NAV}
						onClick={() => setShown(new Date(y, mo - 1, 1))}
					>
						<Icon name="chevron-left" size={20} />
					</button>
					<button
						type="button"
						className={NAV}
						onClick={() => setShown(new Date(today.getFullYear(), today.getMonth(), 1))}
					>
						{defaultStrings.today}
					</button>
					<button
						type="button"
						aria-label={defaultStrings.nextMonth}
						className={NAV}
						onClick={() => setShown(new Date(y, mo + 1, 1))}
					>
						<Icon name="chevron-right" size={20} />
					</button>
				</div>
				{actions ?? null}
			</div>
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
		</div>
	);
}
