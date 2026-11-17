import type { ReactNode } from "react";
import { cx } from "../internal/cx.js";
import { formatNumber } from "../internal/format.js";
import { STREAM_ROOT, type StreamMotion, streamMotion, TABULAR } from "../internal/stream.js";
import { defaultStrings } from "../internal/strings.js";
import { CheckIcon } from "./CheckIcon.js";

export type StreamPollVariant = "poll" | "prediction";
export type StreamPollState = "active" | "locked" | "ended";

export interface StreamPollOption {
	/** Identifies the option. */
	id: string | number;
	/** Texto de la opción. Texto plano: lo escribe el canal en Twitch. */
	label: string;
	/** Votos de una encuesta o puntos apostados en una predicción. */
	votes: number;
	/** Personas que han apostado por la opción (solo en una predicción). */
	users?: number;
}

export interface StreamPollLabels {
	/** @default "Encuesta" */
	poll: string;
	/** @default "Predicción" */
	prediction: string;
	/** Recibe el tiempo en m:ss. @default "Quedan 0:42" */
	remaining: (clock: string) => string;
	/** @default "Votación cerrada" */
	locked: string;
	/** Recibe el texto de la ganadora. @default "Ha ganado Ni loco" */
	winner: (option: string) => string;
	/** Terminada sin ganadora. @default "Votación terminada" */
	ended: string;
	/** Texto accesible de la marca de la ganadora. @default "ganadora" */
	winnerMark: string;
	/** Recibe la cifra ya formateada. */
	votes: (n: string) => string;
	/** Text of a count of points: `n` is the count, already formatted. */
	points: (n: string) => string;
	/** Text of a count of people: `n` is the count, already formatted. */
	people: (n: string) => string;
}

export interface StreamPollProps {
	/** @default "poll" */
	variant?: StreamPollVariant;
	/** The question. */
	title: ReactNode;
	/** De 2 a 10; las que pasen de 10 no se pintan. */
	options: StreamPollOption[];
	/**
	 * Segundos que quedan; quien usa la pieza pasa la cifra al día (no lleva reloj). Sin ella no se ve el tiempo.
	 */
	seconds?: number;
	/**
	 * Estado de la votación: en marcha, cerrada (predicción bloqueada) o terminada.
	 * @default "active"
	 */
	state?: StreamPollState;
	/** Opción ganadora, con `state="ended"`. */
	winnerId?: string | number;
	/** Texts of the poll, to translate. */
	labels?: Partial<StreamPollLabels>;
	/** @default 420 */
	width?: number | string;
	/**
	 * Entrada y salida (`enter` / `exit`), como `state` en el resto de la familia: aquí `state` es el de la votación.
	 */
	motion?: StreamMotion;
	/** Extra classes, merged with the component's own. */
	className?: string;
}

const MAX_OPTIONS = 10;

/** `42` → `0:42`; `125` → `2:05`. */
const clock = (s: number) => {
	const t = Math.max(0, Math.floor(s));
	return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, "0")}`;
};

const count = (n: number | undefined) =>
	Number.isFinite(n) && (n as number) > 0 ? Math.floor(n as number) : 0;

/** Encuesta o predicción del directo con el avance de cada opción, el tiempo y el resultado, siempre en oscuro. */
export function StreamPoll({
	variant = "poll",
	title,
	options,
	seconds,
	state = "active",
	winnerId,
	labels,
	width,
	motion,
	className,
}: StreamPollProps) {
	const t: StreamPollLabels = {
		poll: defaultStrings.poll,
		prediction: defaultStrings.prediction,
		remaining: defaultStrings.pollRemaining,
		locked: defaultStrings.pollLocked,
		winner: defaultStrings.pollWinner,
		ended: defaultStrings.pollEnded,
		winnerMark: defaultStrings.pollWinnerMark,
		votes: defaultStrings.pollVotes,
		points: defaultStrings.pollPoints,
		people: defaultStrings.pollPeople,
		...labels,
	};
	const shown = options.slice(0, MAX_OPTIONS);
	const total = shown.reduce((sum, o) => sum + count(o.votes), 0);
	const ended = state === "ended";
	const winner = ended ? shown.find((o) => o.id === winnerId) : undefined;
	const prediction = variant === "prediction";
	return (
		<div
			className={cx(
				STREAM_ROOT,
				"max-w-full rounded-xl border border-secondary bg-primary_alt px-5 py-4",
				width == null && "w-[420px]",
				streamMotion(motion),
				className,
			)}
			style={width == null ? undefined : { width }}
		>
			<div className="flex items-baseline justify-between gap-4 text-sm">
				<span className="font-medium text-tertiary">{prediction ? t.prediction : t.poll}</span>
				{state === "locked" ? (
					<span className="font-medium text-secondary">{t.locked}</span>
				) : state === "active" && seconds != null ? (
					// `aria-live="off"`, como StreamCountdown: no se lee cada segundo.
					<span role="timer" aria-live="off" className={cx(TABULAR, "text-tertiary")}>
						{t.remaining(clock(seconds))}
					</span>
				) : null}
			</div>
			<p className="mt-1 text-lg font-semibold wrap-anywhere text-primary">{title}</p>
			<ul className="m-0 mt-4 flex list-none flex-col gap-3 p-0">
				{shown.map((o) => {
					const votes = count(o.votes);
					const pct = total > 0 ? Math.round((votes / total) * 100) : 0;
					const won = winner?.id === o.id;
					const cifra = formatNumber(votes);
					return (
						<li key={o.id}>
							<div className="flex items-baseline justify-between gap-4">
								<span className="flex min-w-0 items-center gap-1.5 text-md font-medium text-primary">
									{won ? <CheckIcon size="sm" className="flex-none self-center" /> : null}
									<span className="truncate">{o.label}</span>
									{won ? <span className="sr-only">{` (${t.winnerMark})`}</span> : null}
								</span>
								<span className={cx(TABULAR, "flex-none text-sm text-tertiary")}>
									<b className="font-semibold text-primary">{`${pct} %`}</b>
									{` · ${prediction ? t.points(cifra) : t.votes(cifra)}`}
								</span>
							</div>
							<div
								aria-hidden="true"
								className="mt-1.5 h-2 overflow-hidden rounded-full bg-quaternary"
							>
								<div
									className={cx(
										"h-full rounded-full bg-brand-solid transition-[width] duration-300 motion-reduce:transition-none",
										ended && !won && "opacity-40",
									)}
									style={{ width: `${pct}%` }}
								/>
							</div>
							{prediction ? (
								<span className={cx(TABULAR, "mt-1 block text-xs text-tertiary")}>
									{t.people(formatNumber(count(o.users)))}
								</span>
							) : null}
						</li>
					);
				})}
			</ul>
			{ended ? (
				<p className="mt-4 text-sm font-medium text-secondary">
					{winner ? t.winner(winner.label) : t.ended}
				</p>
			) : null}
		</div>
	);
}
