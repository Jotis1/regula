import { type ReactNode, useId } from "react";
import { cx } from "../internal/cx.js";
import { keyText, STREAM_ROOT, stableKeys, TABULAR } from "../internal/stream.js";
import { Button, type ButtonHierarchy } from "./Button.js";
import { type IconName, iconSlot } from "./Icon.js";

export interface ChannelPanelRow {
	label: ReactNode;
	value: ReactNode;
}

export interface ChannelPanelAction {
	label: ReactNode;
	href?: string;
	/** Icono tras el texto. */
	icon?: IconName | ReactNode;
	/** @default "secondary" */
	hierarchy?: ButtonHierarchy;
	/** Sin `href`, lo que hace el botón (ampliación sobre la guía). */
	onClick?: () => void;
}

export interface ChannelPanelProps {
	/** En Bricolage Grotesque 24/32 semibold. */
	title: ReactNode;
	icon?: IconName | ReactNode;
	/** Párrafos; no más de cuatro líneas cada uno. */
	children?: ReactNode;
	/** Filas de datos: horario, normas cortas o enlaces. */
	rows?: ChannelPanelRow[];
	/** Una sola acción, a todo el ancho. */
	action?: ChannelPanelAction;
	/**
	 * Twitch pide 320px de ancho (exporta a 640px, 2x).
	 * @default 320
	 */
	width?: number | string;
	className?: string;
}

/** Panel de 320px para la página del canal de Twitch, siempre en oscuro. */
export function ChannelPanel({ title, icon, children, rows, action, width, className }: ChannelPanelProps) {
	const titleId = useId();
	const keys = stableKeys(rows ?? [], (r) => `${keyText(r.label)}|${keyText(r.value)}`);
	return (
		<section
			aria-labelledby={titleId}
			className={cx(
				STREAM_ROOT,
				"max-w-full rounded-xl border border-secondary bg-primary_alt p-6",
				width == null && "w-[320px]",
				className,
			)}
			style={width == null ? undefined : { width }}
		>
			<header className="flex items-center gap-3">
				{icon ? (
					<span className="inline-flex size-9 flex-none items-center justify-center rounded-lg bg-tertiary text-fg-secondary">
						{iconSlot(icon, 20)}
					</span>
				) : null}
				<h3 id={titleId} className="m-0 font-display text-display-xs font-semibold text-primary">
					{title}
				</h3>
			</header>
			{children ? (
				<div className="mt-3 text-md text-secondary [&_p]:mb-2 [&_p]:last:mb-0">{children}</div>
			) : null}
			{rows?.length ? (
				<dl className="mt-3 mb-0">
					{rows.map((r, i) => (
						<div
							key={keys[i]}
							className="flex justify-between gap-4 border-t border-secondary py-3 text-md"
						>
							<dt className="text-tertiary">{r.label}</dt>
							<dd className={cx(TABULAR, "m-0 text-right font-medium text-primary")}>
								{r.value}
							</dd>
						</div>
					))}
				</dl>
			) : null}
			{action ? (
				<div className="mt-4">
					{action.href ? (
						<Button
							hierarchy={action.hierarchy ?? "secondary"}
							size="md"
							href={action.href}
							iconTrailing={action.icon}
							className="w-full"
						>
							{action.label}
						</Button>
					) : (
						<Button
							hierarchy={action.hierarchy ?? "secondary"}
							size="md"
							iconTrailing={action.icon}
							onClick={action.onClick}
							className="w-full"
						>
							{action.label}
						</Button>
					)}
				</div>
			) : null}
		</section>
	);
}
