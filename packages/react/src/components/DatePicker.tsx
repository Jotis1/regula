"use client";

import { CalendarDate, isSameDay } from "@internationalized/date";
import { useEffect, useRef, useState } from "react";
import {
	Button as AriaButton,
	Calendar as AriaCalendar,
	RangeCalendar as AriaRangeCalendar,
	CalendarCell,
	type CalendarCellRenderProps,
	CalendarGrid,
	CalendarGridBody,
	CalendarGridHeader,
	CalendarHeaderCell,
	Dialog,
	I18nProvider,
	Modal,
	ModalOverlay,
	Popover,
} from "react-aria-components";
import { cx } from "../internal/cx.js";
import { formatDate, formatMonth } from "../internal/format.js";
import { OVERLAY, OVERLAY_POSITION } from "../internal/overlay.js";
import { defaultStrings } from "../internal/strings.js";
import { useControllable } from "../internal/use-controllable.js";
import { Button } from "./Button.js";
import { Icon } from "./Icon.js";

export interface DateRange {
	start: Date | null;
	end?: Date | null;
	/** Hora elegida («10:30») con `times`. En `onApply`, `start` ya lleva esa hora. */
	time?: string;
}

export interface DatePickerPreset {
	label: string;
	start: Date;
	/** Sin `end`, el preset es un solo día. */
	end?: Date;
}

export interface DatePickerLabels {
	/** Texto del disparador sin fecha y sin `placeholder`, con una fecha. */
	pickDate: string;
	/** Texto del disparador sin fecha y sin `placeholder`, con rango. */
	pickDates: string;
	/** Nombre accesible del panel. */
	dialog: string;
	/** Nombre accesible de la cuadrícula del mes. */
	calendar: string;
	previousMonth: string;
	nextMonth: string;
	cancel: string;
	apply: string;
	/** Nombre de la lista de horas (`times`). */
	times: string;
}

export interface DatePickerProps {
	/** Elige un rango (inicio y fin) en lugar de una fecha. */
	range?: boolean;
	/** Valor inicial: `{ start, end }`; con una fecha, solo `start`. */
	defaultValue?: DateRange;
	/** Se llama al pulsar Aplicar, no al elegir cada día. */
	onApply?: (value: DateRange) => void;
	/** Atajos a la izquierda del calendario: "Este mes", "Mes pasado". */
	presets?: DatePickerPreset[];
	/** Texto del disparador mientras no hay fecha aplicada. */
	placeholder?: string;
	/** Abre o cierra el panel desde fuera. */
	open?: boolean;
	defaultOpen?: boolean;
	/**
	 * Horas disponibles («09:00», «09:30»…): una lista junto al calendario para elegir la hora del día elegido. Con ella,
	 * Aplicar espera día y hora, y `onApply` recibe `start` con la hora puesta y `time`. No es para rangos.
	 */
	times?: string[];
	/**
	 * Cómo se abre: `dropdown` (ventana flotante junto al botón) o `modal` (centrada sobre la página, con fondo y foco
	 * atrapado).
	 * @default "dropdown"
	 */
	presentation?: "dropdown" | "modal";
	/** Pinta el panel sin botón ni ventana flotante. */
	inline?: boolean;
	/** Día marcado como hoy. Por defecto, la fecha del sistema. */
	today?: Date;
	/** Textos sustituibles. */
	labels?: Partial<DatePickerLabels>;
	className?: string;
}

const DEFAULT_LABELS: DatePickerLabels = {
	pickDate: defaultStrings.pickDate,
	pickDates: defaultStrings.pickDates,
	dialog: defaultStrings.datePicker,
	calendar: defaultStrings.calendar,
	previousMonth: defaultStrings.previousMonth,
	nextMonth: defaultStrings.nextMonth,
	cancel: defaultStrings.cancel,
	apply: defaultStrings.apply,
	times: "Horas disponibles",
};

type Draft = { start: Date | null; end: Date | null; time: string | null };

const day = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const toCalendar = (d: Date) => new CalendarDate(d.getFullYear(), d.getMonth() + 1, d.getDate());
const toDate = (c: CalendarDate) => new Date(c.year, c.month - 1, c.day);
const sameDay = (a: Date | null, b: Date | null) => !!a && !!b && a.getTime() === b.getTime();
// "lun" → "Lu", "sáb" → "Sá": las iniciales de dos letras de la guía
const weekday = (d: string) => d.charAt(0).toUpperCase() + d.slice(1, 2);

const NAV =
	"inline-flex cursor-pointer rounded-lg border-0 bg-transparent p-2 text-fg-quaternary outline-none transition-colors duration-100 data-hovered:bg-primary_hover data-hovered:text-fg-quaternary_hover data-focus-visible:shadow-focus-ring";
const TODAY_DOT =
	"after:absolute after:bottom-[5px] after:left-1/2 after:-ml-[2.5px] after:size-[5px] after:rounded-full after:content-['']";
// Extremos del rango: círculo de marca sobre media celda del tono del tramo, hacia dentro
const RANGE_START =
	"rounded-none bg-transparent bg-[radial-gradient(circle,var(--bg-brand-solid)_19.5px,transparent_20px),linear-gradient(to_right,transparent_50%,var(--bg-secondary_hover)_50%)]";
const RANGE_END =
	"rounded-none bg-transparent bg-[radial-gradient(circle,var(--bg-brand-solid)_19.5px,transparent_20px),linear-gradient(to_left,transparent_50%,var(--bg-secondary_hover)_50%)]";

function cellClass(range: boolean, today: CalendarDate) {
	return ({
		date,
		isSelected,
		isSelectionStart,
		isSelectionEnd,
		isOutsideMonth,
	}: CalendarCellRenderProps) => {
		const start = range && isSelectionStart;
		const end = range && isSelectionEnd;
		const selected = range ? start || end : isSelected;
		const between = range && isSelected && !start && !end;
		const isToday = isSameDay(date, today);
		return cx(
			"relative flex size-10 cursor-pointer items-center justify-center rounded-full text-sm text-secondary outline-none transition-colors duration-100 data-focus-visible:shadow-focus-ring",
			!selected && !between && "data-hovered:bg-primary_hover",
			isToday && `bg-tertiary font-medium ${TODAY_DOT} after:bg-fg-brand-primary`,
			between && "rounded-none bg-secondary_hover",
			selected && "font-medium text-white after:bg-fg-white",
			selected && start === end && "bg-brand-solid",
			start && !end && RANGE_START,
			end && !start && RANGE_END,
			isOutsideMonth && "hidden",
		);
	};
}

/** Selector de una fecha o de un rango, con presets y botones de aplicar y cancelar. */
export function DatePicker({
	range = false,
	defaultValue,
	onApply,
	presets,
	times,
	presentation = "dropdown",
	placeholder,
	open: openProp,
	defaultOpen = false,
	inline,
	today: todayProp,
	labels,
	className,
}: DatePickerProps) {
	const t = { ...DEFAULT_LABELS, ...labels };
	const initial: Draft = {
		start: defaultValue?.start ? day(defaultValue.start) : null,
		end: range && defaultValue?.end ? day(defaultValue.end) : null,
		time: times ? (defaultValue?.time ?? null) : null,
	};
	const [draft, setDraft] = useState<Draft>(initial);
	const [applied, setApplied] = useState<Draft>(initial);
	const [open, setOpen] = useControllable(openProp, defaultOpen);
	const today = toCalendar(todayProp ?? new Date());
	const [focused, setFocused] = useState(() => (initial.start ? toCalendar(initial.start) : today));
	const triggerRef = useRef<HTMLDivElement>(null);

	const complete = !!draft.start && (!range || !!draft.end) && (!times || !!draft.time);
	const close = () => setOpen(false);
	// Al cerrar, el foco vuelve al disparador; antes no se puede, el resto de la página está inerte mientras el panel está abierto
	const wasOpen = useRef(open);
	useEffect(() => {
		if (wasOpen.current && !open && !inline) triggerRef.current?.querySelector("button")?.focus();
		wasOpen.current = open;
	}, [open, inline]);
	const cancel = () => {
		setDraft(applied);
		setFocused(applied.start ? toCalendar(applied.start) : today);
		close();
	};
	const apply = () => {
		setApplied(draft);
		close();
		if (times && draft.start && draft.time) {
			const [h = 0, m = 0] = draft.time.split(":").map(Number);
			const start = new Date(
				draft.start.getFullYear(),
				draft.start.getMonth(),
				draft.start.getDate(),
				h,
				m,
			);
			onApply?.({ start, time: draft.time });
			return;
		}
		onApply?.(range ? { start: draft.start, end: draft.end } : { start: draft.start });
	};
	const choosePreset = (p: DatePickerPreset) => {
		const start = day(p.start);
		setDraft({ start, end: range ? day(p.end ?? p.start) : null, time: draft.time });
		setFocused(toCalendar(start));
	};

	const calendarBody = (
		<>
			<div className="mb-3 flex items-center justify-between">
				<AriaButton slot="previous" aria-label={t.previousMonth} className={NAV}>
					<Icon name="chevron-left" size={20} />
				</AriaButton>
				<span className="text-md font-semibold text-secondary">{formatMonth(toDate(focused))}</span>
				<AriaButton slot="next" aria-label={t.nextMonth} className={NAV}>
					<Icon name="chevron-right" size={20} />
				</AriaButton>
			</div>
			{/* Separación vertical de 4px entre filas, como la rejilla de la guía; el margen negativo quita la de los bordes */}
			<CalendarGrid
				weekdayStyle="short"
				className="-my-1 border-separate border-spacing-x-0 border-spacing-y-1"
			>
				<CalendarGridHeader>
					{(d) => (
						<CalendarHeaderCell className="size-10 p-0 text-sm font-medium text-secondary">
							{weekday(d)}
						</CalendarHeaderCell>
					)}
				</CalendarGridHeader>
				<CalendarGridBody>
					{(date) => <CalendarCell date={date} className={cellClass(range, today)} />}
				</CalendarGridBody>
			</CalendarGrid>
		</>
	);

	const calendarProps = {
		"aria-label": t.calendar,
		firstDayOfWeek: "mon" as const,
		focusedValue: focused,
		onFocusChange: setFocused,
		autoFocus: !inline,
		className: "px-6 py-5",
	};

	const dateBox = (d: Date | null, time?: string | null) => (
		<span className="min-w-26 rounded-lg px-3 py-2 text-sm text-primary shadow-[var(--shadow-xs),inset_0_0_0_1px_var(--border-primary)]">
			{d ? (time ? `${formatDate(d)}, ${time}` : formatDate(d)) : "—"}
		</span>
	);

	const panel = (
		<div
			className={cx(
				"overflow-hidden rounded-2xl bg-primary font-body shadow-[var(--shadow-xl),inset_0_0_0_1px_var(--border-secondary_alt)]",
				inline ? "inline-flex" : "flex",
			)}
		>
			{presets?.length ? (
				<div className="flex w-38 flex-none flex-col gap-0.5 p-3 shadow-[inset_-1px_0_0_var(--border-secondary)]">
					{presets.map((p) => {
						const on =
							sameDay(draft.start, day(p.start)) &&
							(!range || sameDay(draft.end, day(p.end ?? p.start)));
						return (
							<button
								key={p.label}
								type="button"
								aria-pressed={on}
								onClick={() => choosePreset(p)}
								className={cx(
									"cursor-pointer rounded-md border-0 bg-transparent px-3 py-2 text-left text-sm font-medium text-secondary transition-colors duration-100 hover:bg-primary_hover hover:text-secondary_hover focus-visible:shadow-focus-ring focus-visible:outline-none",
									on && "bg-primary_hover text-secondary_hover",
								)}
							>
								{p.label}
							</button>
						);
					})}
				</div>
			) : null}
			<div className="flex flex-col">
				<div className="flex">
					<I18nProvider locale="es-ES">
						{range ? (
							<AriaRangeCalendar
								{...calendarProps}
								value={
									draft.start && draft.end
										? { start: toCalendar(draft.start), end: toCalendar(draft.end) }
										: null
								}
								onChange={(v) =>
									v && setDraft({ start: toDate(v.start), end: toDate(v.end), time: null })
								}
							>
								{calendarBody}
							</AriaRangeCalendar>
						) : (
							<AriaCalendar
								{...calendarProps}
								value={draft.start ? toCalendar(draft.start) : null}
								onChange={(v) => setDraft({ start: toDate(v), end: null, time: draft.time })}
							>
								{calendarBody}
							</AriaCalendar>
						)}
					</I18nProvider>
					{times?.length && !range ? (
						<div className="relative w-32 flex-none shadow-[inset_1px_0_0_var(--border-secondary)]">
							<fieldset
								aria-label={t.times}
								className="absolute inset-0 m-0 flex min-w-0 flex-col gap-0.5 overflow-y-auto border-0 p-3"
							>
								{times.map((time) => {
									const on = draft.time === time;
									return (
										<button
											key={time}
											type="button"
											aria-pressed={on}
											onClick={() => setDraft({ ...draft, time })}
											className={cx(
												"cursor-pointer rounded-md border-0 bg-transparent px-3 py-2 text-center text-sm font-medium text-secondary transition-colors duration-100 hover:bg-primary_hover hover:text-secondary_hover focus-visible:shadow-focus-ring focus-visible:outline-none",
												on &&
													"bg-brand-solid text-white hover:bg-brand-solid_hover hover:text-white",
											)}
										>
											{time}
										</button>
									);
								})}
							</fieldset>
						</div>
					) : null}
				</div>
				<div className="flex items-center justify-between gap-3 p-4 shadow-[inset_0_1px_0_var(--border-secondary)]">
					<div className="flex items-center gap-2">
						{dateBox(draft.start, draft.time)}
						{range ? (
							<>
								<span className="text-quaternary">–</span>
								{dateBox(draft.end)}
							</>
						) : null}
					</div>
					<div className="flex gap-3">
						<Button hierarchy="secondary" size="sm" onClick={cancel}>
							{t.cancel}
						</Button>
						<Button size="sm" disabled={!complete} onClick={apply}>
							{t.apply}
						</Button>
					</div>
				</div>
			</div>
		</div>
	);

	if (inline)
		return (
			<fieldset aria-label={t.dialog} className={cx("m-0 inline-flex min-w-0 border-0 p-0", className)}>
				{panel}
			</fieldset>
		);

	const label = applied.start
		? range && applied.end
			? `${formatDate(applied.start)} – ${formatDate(applied.end)}`
			: applied.time
				? `${formatDate(applied.start)}, ${applied.time}`
				: formatDate(applied.start)
		: placeholder || (range ? t.pickDates : t.pickDate);

	return (
		<div ref={triggerRef} className={cx("inline-flex", className)}>
			<Button
				hierarchy="secondary"
				size="sm"
				iconLeading="calendar"
				aria-haspopup="dialog"
				aria-expanded={open}
				onClick={() => setOpen(!open)}
				// `text-tertiary` y no `text-placeholder`: en un botón el texto tiene que llegar a 4,5:1 (en oscuro el de placeholder no llega)
				className={applied.start ? undefined : "text-tertiary"}
			>
				{label}
			</Button>
			{presentation === "modal" ? (
				<ModalOverlay
					isOpen={open}
					isDismissable
					onOpenChange={(next) => (next ? setOpen(true) : cancel())}
					className={cx(OVERLAY, OVERLAY_POSITION(false), "items-center justify-center")}
				>
					<Modal className="max-w-full outline-none">
						<Dialog aria-label={t.dialog} className="outline-none">
							{panel}
						</Dialog>
					</Modal>
				</ModalOverlay>
			) : (
				<Popover
					triggerRef={triggerRef}
					isOpen={open}
					onOpenChange={(next) => (next ? setOpen(true) : cancel())}
					placement="bottom start"
					offset={8}
				>
					<Dialog aria-label={t.dialog} className="outline-none">
						{panel}
					</Dialog>
				</Popover>
			)}
		</div>
	);
}
