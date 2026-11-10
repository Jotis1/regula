import type { ReactNode } from "react";
import { cx } from "../internal/cx.js";
import { defaultStrings } from "../internal/strings.js";
import { FeaturedIcon } from "./FeaturedIcon.js";
import { Icon, type IconName } from "./Icon.js";

export type ProgressStepsType =
	| "icons-centered"
	| "icons-text"
	| "text-line"
	| "minimal"
	| "minimal-connected";
export type ProgressStepsMarker = "check" | "number" | "featured";
export type ProgressStepsSize = "sm" | "md";
export type ProgressStepsOrientation = "horizontal" | "vertical";

export interface ProgressStep {
	title: ReactNode;
	/** Texto de apoyo bajo el título. */
	description?: ReactNode;
	/** Icono del marcador `featured`. Sin él, ese paso enseña su número. */
	icon?: IconName | ReactNode;
}

export interface ProgressStepsLabels {
	complete: string;
	current: string;
	pending: string;
	/** «Paso 3 de 4», en los tipos mínimos. */
	stepOf: (n: number, total: number) => string;
}

export interface ProgressStepsProps {
	steps: ProgressStep[];
	/** Índice del paso actual, desde 0. Los anteriores están completos y los siguientes pendientes. */
	current: number;
	/**
	 * Tipo: `icons-centered` (marcadores unidos con el texto debajo, centrado) · `icons-text` (marcador a la izquierda y
	 * texto a la derecha, siempre en columna) · `text-line` (una raya sobre cada texto) · `minimal` (solo los marcadores,
	 * con «Paso 3 de 4») · `minimal-connected` (solo los marcadores, unidos por líneas).
	 * @default "icons-centered"
	 */
	type?: ProgressStepsType;
	/**
	 * Marcador: `check` (punto, anillo y check de marca) · `number` (su número; los completos, un check verde) ·
	 * `featured` (el `icon` de cada paso en un cuadrado).
	 * @default "check"
	 */
	marker?: ProgressStepsMarker;
	/**
	 * Tamaño: `sm` (marcador de 24px) o `md` (32px).
	 * @default "md"
	 */
	size?: ProgressStepsSize;
	/**
	 * En vertical, el texto de cada paso va a la derecha de su marcador y la línea que los une es vertical.
	 * @default "horizontal"
	 */
	orientation?: ProgressStepsOrientation;
	/** Textos: el estado de cada paso para lectores de pantalla y el «Paso n de N» de los tipos mínimos. */
	labels?: Partial<ProgressStepsLabels>;
	/** Nombre de la lista («Pasos del alta»). */
	"aria-label"?: string;
	className?: string;
}

type State = "complete" | "current" | "pending";

const MARK: Record<ProgressStepsSize, string> = { sm: "size-6", md: "size-8" };
const CHECK: Record<ProgressStepsSize, number> = { sm: 12, md: 16 };

/** El marcador de un paso: decorativo, el estado lo dice el texto para lectores. */
function Marker({
	marker,
	size,
	state,
	index,
	icon,
}: {
	marker: ProgressStepsMarker;
	size: ProgressStepsSize;
	state: State;
	index: number;
	icon?: IconName | ReactNode;
}) {
	const base = cx("relative flex flex-none items-center justify-center rounded-full", MARK[size]);
	if (marker === "featured" && icon)
		return (
			<span aria-hidden="true" className={cx("inline-flex", state === "pending" && "opacity-50")}>
				<FeaturedIcon variant="modern" color="gray" icon={icon} size={size === "sm" ? "md" : "lg"} />
			</span>
		);
	if (marker === "number" || marker === "featured") {
		if (state === "complete")
			return (
				<span aria-hidden="true" className={cx(base, "bg-success-solid text-white")}>
					<Icon name="check" size={CHECK[size]} strokeWidth={2} />
				</span>
			);
		return (
			<span
				aria-hidden="true"
				className={cx(
					base,
					"bg-primary font-body font-medium shadow-[inset_0_0_0_1px_var(--border-primary)]",
					size === "sm" ? "text-xs" : "text-sm",
					state === "current" ? "text-primary" : "text-quaternary",
				)}
			>
				{index + 1}
			</span>
		);
	}
	if (state === "complete")
		return (
			<span aria-hidden="true" className={cx(base, "bg-brand-solid text-white")}>
				<Icon name="check" size={CHECK[size]} strokeWidth={2} />
			</span>
		);
	if (state === "current")
		// Anillo de marca, un hueco y un disco de marca con un punto claro: el doble anillo del Figma
		return (
			<span
				aria-hidden="true"
				className={cx(base, "bg-primary shadow-[inset_0_0_0_2px_var(--border-brand)]")}
			>
				<span
					className={cx(
						"flex items-center justify-center rounded-full bg-brand-solid",
						size === "sm" ? "size-4" : "size-6",
					)}
				>
					<span className={cx("rounded-full bg-fg-white", size === "sm" ? "size-1.5" : "size-2")} />
				</span>
			</span>
		);
	return (
		<span
			aria-hidden="true"
			className={cx(base, "bg-primary shadow-[inset_0_0_0_1px_var(--border-primary)]")}
		>
			<span className={cx("rounded-full bg-fg-quaternary", size === "sm" ? "size-1.5" : "size-2")} />
		</span>
	);
}

/** Color del texto de un paso: el actual en marca; los pendientes, atenuados salvo con el marcador `check`. */
const titleColor = (state: State, marker: ProgressStepsMarker) =>
	state === "current"
		? "text-brand-secondary"
		: state === "pending" && marker !== "check"
			? "text-quaternary"
			: "text-secondary";
const descColor = (state: State, marker: ProgressStepsMarker) =>
	state === "current"
		? "text-brand-tertiary"
		: state === "pending" && marker !== "check"
			? "text-quaternary"
			: "text-tertiary";

/** Pasos de un proceso con su estado: completo, actual o pendiente, en cinco tipos y dos orientaciones. */
export function ProgressSteps({
	steps,
	current,
	type = "icons-centered",
	marker = "check",
	size = "md",
	orientation = "horizontal",
	labels,
	"aria-label": ariaLabel,
	className,
}: ProgressStepsProps) {
	const l: ProgressStepsLabels = {
		complete: labels?.complete ?? defaultStrings.stepComplete,
		current: labels?.current ?? defaultStrings.stepCurrent,
		pending: labels?.pending ?? defaultStrings.stepPending,
		stepOf: labels?.stepOf ?? defaultStrings.stepOf,
	};
	const total = steps.length;
	const at = Math.max(0, Math.min(total, current));
	const stateOf = (i: number): State => (i < at ? "complete" : i === at ? "current" : "pending");
	const minimal = type === "minimal" || type === "minimal-connected";
	// `icons-text` siempre va en columna; en los mínimos, la orientación no cambia nada
	const vertical = type === "icons-text" || (!minimal && orientation === "vertical");
	const kind = minimal && marker === "featured" ? "check" : marker;
	const sm = size === "sm";
	const markPx = sm ? 24 : 32;
	const stepOf = l.stepOf(Math.min(at + 1, total), total);

	// El estado de cada paso, en texto solo para lectores, antes del título
	const state = (s: State) => <span className="sr-only">{`${l[s]}: `}</span>;
	const text = (step: ProgressStep, s: State, align = "") => {
		const sizes = type === "icons-centered" ? (sm ? "text-xs" : "text-sm") : sm ? "text-sm" : "text-md";
		return (
			<span className={cx("flex min-w-0 flex-col", align, sizes)}>
				<span className={cx("font-semibold", titleColor(s, kind))}>
					{state(s)}
					{step.title}
				</span>
				{step.description != null ? (
					<span className={cx("font-normal", descColor(s, kind))}>{step.description}</span>
				) : null}
			</span>
		);
	};
	// Línea que sale de un paso hacia el siguiente: de marca si el paso está completo, y punteada con números
	const line = (i: number, axis: "x" | "y") =>
		cx(
			kind === "number"
				? [axis === "x" ? "border-t-2" : "border-l-2", "border-dotted border-secondary"]
				: [
						axis === "x" ? "h-0.5" : "w-0.5",
						i < at
							? kind === "featured"
								? "bg-fg-secondary"
								: "bg-brand-solid"
							: "bg-quaternary",
					],
		);

	if (type === "text-line")
		return (
			<ol
				aria-label={ariaLabel}
				className={cx(
					"m-0 flex list-none gap-4 p-0 font-body",
					vertical ? "flex-col" : "flex-row",
					className,
				)}
			>
				{steps.map((step, i) => {
					const s = stateOf(i);
					return (
						<li
							// biome-ignore lint/suspicious/noArrayIndexKey: los pasos se identifican por su posición
							key={i}
							aria-current={s === "current" ? "step" : undefined}
							className={cx("flex min-w-0 flex-col gap-2", !vertical && "flex-1")}
						>
							<span
								aria-hidden="true"
								className={cx(
									"block h-1 w-full",
									s === "pending" ? "bg-quaternary" : "bg-brand-solid",
								)}
							/>
							{text(step, s)}
						</li>
					);
				})}
			</ol>
		);

	if (minimal)
		return (
			<div className={cx("inline-flex items-center gap-3 font-body", className)}>
				{type === "minimal" ? (
					<span className={cx("font-medium text-secondary", sm ? "text-xs" : "text-sm")}>
						{stepOf}
					</span>
				) : (
					<span className="sr-only">{stepOf}</span>
				)}
				<ol
					aria-label={ariaLabel}
					className={cx(
						"m-0 flex list-none items-center p-0",
						type === "minimal" ? "gap-2" : "gap-0",
					)}
				>
					{steps.map((step, i) => {
						const s = stateOf(i);
						return (
							<li
								// biome-ignore lint/suspicious/noArrayIndexKey: los pasos se identifican por su posición
								key={i}
								aria-current={s === "current" ? "step" : undefined}
								className="flex items-center"
							>
								<span className="sr-only">
									{state(s)}
									{step.title}
								</span>
								<Marker marker={kind} size={size} state={s} index={i} />
								{type === "minimal-connected" && i < total - 1 ? (
									<span
										aria-hidden="true"
										className={cx("block", sm ? "w-5" : "w-6", line(i, "x"))}
									/>
								) : null}
							</li>
						);
					})}
				</ol>
			</div>
		);

	// icons-centered e icons-text
	const gap = sm ? "gap-3" : "gap-4";
	return (
		<ol
			aria-label={ariaLabel}
			className={cx("m-0 flex list-none p-0 font-body", vertical ? "flex-col" : "flex-row", className)}
		>
			{steps.map((step, i) => {
				const s = stateOf(i);
				const last = i === total - 1;
				const mark = <Marker marker={kind} size={size} state={s} index={i} icon={step.icon} />;
				const markHeight = kind === "featured" && step.icon ? (sm ? 40 : 48) : markPx;
				if (vertical)
					return (
						<li
							// biome-ignore lint/suspicious/noArrayIndexKey: los pasos se identifican por su posición
							key={i}
							aria-current={s === "current" ? "step" : undefined}
							className={cx("flex items-stretch", gap)}
						>
							<span className="flex flex-none flex-col items-center gap-1">
								{mark}
								{last ? null : (
									<span
										aria-hidden="true"
										className={cx("block min-h-6 flex-1", line(i, "y"))}
									/>
								)}
							</span>
							<span className={cx("min-w-0 pt-0.5", !last && (sm ? "pb-6" : "pb-8"))}>
								{text(step, s)}
							</span>
						</li>
					);
				return (
					<li
						// biome-ignore lint/suspicious/noArrayIndexKey: los pasos se identifican por su posición
						key={i}
						aria-current={s === "current" ? "step" : undefined}
						className="relative flex min-w-0 flex-1 flex-col items-center gap-3 text-center"
					>
						{last ? null : (
							<span
								aria-hidden="true"
								className={cx("absolute block", line(i, "x"))}
								style={{
									top: markHeight / 2 - 1,
									left: `calc(50% + ${markHeight / 2 + 4}px)`,
									right: `calc(-50% + ${markHeight / 2 + 4}px)`,
								}}
							/>
						)}
						{mark}
						{text(step, s, "items-center")}
					</li>
				);
			})}
		</ol>
	);
}
