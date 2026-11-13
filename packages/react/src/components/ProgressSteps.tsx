import { Check } from "@untitledui/icons";
import { type CSSProperties, type ReactNode, useId } from "react";
import { cx } from "../internal/cx.js";
import type { IconProp } from "../internal/icon.js";
import { defaultStrings } from "../internal/strings.js";
import { FeaturedIcon } from "./FeaturedIcon.js";

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
	icon?: IconProp;
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
	/**
	 * Hace navegables los pasos: cada uno (marcador y texto) es un botón cuyo nombre es el título y que llama a
	 * `onChange` con su índice, también los pendientes. Quien quiera bloquearlos no pasa `onChange` o lo ignora. El
	 * componente no guarda el paso actual: `current` sigue siendo de quien lo usa.
	 */
	onChange?: (index: number) => void;
	/**
	 * Contenido del paso actual, que recibe su índice. En vertical va dentro del `<li>` del actual, bajo su texto; en
	 * horizontal, en un bloque bajo la lista (y entonces `className` va en el envoltorio de ambos). Va en una región
	 * `aria-live="polite"`.
	 */
	children?: (current: number) => ReactNode;
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
	icon?: IconProp;
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
					<Check size={CHECK[size]} strokeWidth={2} />
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
				<Check size={CHECK[size]} strokeWidth={2} />
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

/** Botón de un paso navegable: sin borde ni fondo, con el anillo de foco del sistema. */
const STEP_BUTTON =
	"cursor-pointer border-0 bg-transparent p-0 text-left outline-none focus-visible:shadow-focus-ring";

/** Pasos de un proceso con su estado: completo, actual o pendiente, en cinco tipos y dos orientaciones. */
export function ProgressSteps({
	steps,
	current,
	type = "icons-centered",
	marker = "check",
	size = "md",
	orientation = "horizontal",
	labels,
	onChange,
	children,
	"aria-label": ariaLabel,
	className,
}: ProgressStepsProps) {
	const uid = useId();
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
	const interactive = onChange != null;
	// Con `children` en horizontal, el contenido va en un bloque bajo la lista y `className` pasa a envolver ambos
	const below = children != null && !vertical;
	const listClass = below ? undefined : className;

	// El estado de cada paso, en texto solo para lectores, antes del título
	const state = (s: State) => <span className="sr-only">{`${l[s]}: `}</span>;
	const sizes = type === "icons-centered" ? (sm ? "text-xs" : "text-sm") : sm ? "text-sm" : "text-md";
	const desc = (step: ProgressStep, s: State, i: number, style?: CSSProperties) =>
		step.description != null ? (
			<span
				id={interactive ? `${uid}-d${i}` : undefined}
				className={cx("font-normal", descColor(s, kind), interactive && sizes)}
				style={style}
			>
				{step.description}
			</span>
		) : null;
	// Con `onChange`, solo el título: la descripción va fuera del botón (`hit`), para que su texto visible sea su nombre
	const text = (step: ProgressStep, s: State, i: number, align = "") => (
		<span className={cx("flex min-w-0 flex-col", align, sizes)}>
			<span
				id={interactive ? `${uid}-t${i}` : undefined}
				className={cx("font-semibold", titleColor(s, kind))}
			>
				{interactive ? null : state(s)}
				{step.title}
			</span>
			{interactive ? null : desc(step, s, i)}
		</span>
	);
	// Con `onChange`, el marcador y el título de un paso son un botón cuyo nombre es el título, y la descripción va
	// debajo, fuera del botón, como su descripción accesible (WCAG 2.5.3); sin él, van sueltos. `wrap` agrupa el botón
	// y la descripción; `descStyle`, en vertical, la sangra hasta la columna del título.
	const hit = (
		i: number,
		step: ProgressStep,
		s: State,
		cls: string,
		kids: ReactNode,
		wrap = "",
		descStyle?: CSSProperties,
	) =>
		interactive ? (
			<span className={cx("flex flex-col", wrap)}>
				<button
					type="button"
					aria-labelledby={`${uid}-t${i}`}
					aria-describedby={step.description != null ? `${uid}-d${i}` : undefined}
					onClick={() => onChange?.(i)}
					className={cx(STEP_BUTTON, "rounded-md", cls)}
				>
					{kids}
				</button>
				{desc(step, s, i, descStyle)}
			</span>
		) : (
			kids
		);
	// En vertical, cada paso lleva su región: solo la del actual tiene contenido, y así se anuncia al cambiar
	const live = (i: number, style?: CSSProperties) =>
		children != null && vertical ? (
			<div aria-live="polite" className={style ? "mt-3" : "mt-2"} style={style}>
				{i === at ? children(at) : null}
			</div>
		) : null;
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

	let list: ReactNode;
	if (type === "text-line")
		list = (
			<ol
				aria-label={ariaLabel}
				className={cx(
					"m-0 flex list-none gap-4 p-0 font-body",
					vertical ? "flex-col" : "flex-row",
					listClass,
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
							{interactive ? state(s) : null}
							{hit(
								i,
								step,
								s,
								"flex w-full flex-col gap-2",
								<>
									<span
										aria-hidden="true"
										className={cx(
											"block h-1 w-full",
											s === "pending" ? "bg-quaternary" : "bg-brand-solid",
										)}
									/>
									{text(step, s, i)}
								</>,
							)}
							{live(i)}
						</li>
					);
				})}
			</ol>
		);
	else if (minimal)
		list = (
			<div className={cx("inline-flex items-center gap-3 font-body", listClass)}>
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
						const mark = <Marker marker={kind} size={size} state={s} index={i} />;
						return (
							<li
								// biome-ignore lint/suspicious/noArrayIndexKey: los pasos se identifican por su posición
								key={i}
								aria-current={s === "current" ? "step" : undefined}
								className="flex items-center"
							>
								{interactive ? (
									<>
										{state(s)}
										<button
											type="button"
											onClick={() => onChange?.(i)}
											className={cx(STEP_BUTTON, "inline-flex rounded-full")}
										>
											<span className="sr-only">{step.title}</span>
											{mark}
										</button>
									</>
								) : (
									<>
										<span className="sr-only">
											{state(s)}
											{step.title}
										</span>
										{mark}
									</>
								)}
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
	else {
		// icons-centered e icons-text
		const gap = sm ? "gap-3" : "gap-4";
		list = (
			<ol
				aria-label={ariaLabel}
				className={cx(
					"m-0 flex list-none p-0 font-body",
					vertical ? "flex-col" : "flex-row",
					listClass,
				)}
			>
				{steps.map((step, i) => {
					const s = stateOf(i);
					const last = i === total - 1;
					const mark = <Marker marker={kind} size={size} state={s} index={i} icon={step.icon} />;
					const markHeight = kind === "featured" && step.icon ? (sm ? 40 : 48) : markPx;
					if (vertical && interactive)
						// La línea sale del botón: va suelta en el `<li>` y llega hasta el siguiente paso
						return (
							<li
								// biome-ignore lint/suspicious/noArrayIndexKey: los pasos se identifican por su posición
								key={i}
								aria-current={s === "current" ? "step" : undefined}
								className={cx("relative flex flex-col", !last && (sm ? "pb-6" : "pb-8"))}
							>
								{state(s)}
								{hit(
									i,
									step,
									s,
									cx("flex items-start", gap),
									<>
										{mark}
										<span className="min-w-0 pt-0.5">{text(step, s, i)}</span>
									</>,
									"",
									{ paddingInlineStart: markHeight + (sm ? 12 : 16) },
								)}
								{last ? null : (
									<span
										aria-hidden="true"
										className={cx("absolute block", line(i, "y"))}
										style={{ top: markHeight + 4, bottom: 0, left: markHeight / 2 - 1 }}
									/>
								)}
								{live(i, { paddingInlineStart: markHeight + (sm ? 12 : 16) })}
							</li>
						);
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
									{text(step, s, i)}
									{live(i)}
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
							{interactive ? state(s) : null}
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
							{hit(
								i,
								step,
								s,
								"flex flex-col items-center gap-3 text-center",
								<>
									{mark}
									{text(step, s, i, "items-center")}
								</>,
								"items-center text-center",
							)}
						</li>
					);
				})}
			</ol>
		);
	}

	if (!below) return list;
	return (
		<div className={cx("flex flex-col gap-6", className)}>
			{list}
			<div aria-live="polite">{children(at)}</div>
		</div>
	);
}
