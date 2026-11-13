"use client";

import { type ReactNode, useEffect, useState } from "react";
import { cx } from "../internal/cx.js";
import type { IconProp } from "../internal/icon.js";
import { defaultStrings } from "../internal/strings.js";
import { Button } from "./Button.js";
import { CloseButton } from "./CloseButton.js";
import { FeaturedIcon } from "./FeaturedIcon.js";
import { Input } from "./Input.js";

export interface BannerEmail {
	/** @default "Tu correo" */
	placeholder?: string;
	/** @default "Suscribirme" */
	buttonLabel?: string;
	/** Texto bajo el campo, como "Puedes darte de baja cuando quieras." */
	hint?: ReactNode;
	onSubmit?: (value: string) => void;
}

export interface BannerProps {
	title: ReactNode;
	description?: ReactNode;
	/** Icono destacado de 48px: `modern` en el tema por defecto y `light` en `brand`. */
	icon?: IconProp;
	actions?: ReactNode;
	/** Campo de correo de 360px con botón, para captar suscripciones. */
	email?: BannerEmail;
	/** Fecha objetivo de una cuenta atrás (días, horas, minutos y segundos). */
	countdown?: Date;
	/** Congela el reloj de la cuenta atrás en esta fecha (capturas y vistas previas). */
	now?: Date;
	/**
	 * `default`: `bg-secondary`. `brand`: `bg-brand-section_subtle` con textos `on-brand`.
	 * @default "default"
	 */
	theme?: "default" | "brand";
	/**
	 * `floating`: con radio y sombra. `full`: pegado al borde superior, a todo el ancho y sin radio.
	 * @default "floating"
	 */
	layout?: "floating" | "full";
	/** Una línea, centrada y sin icono. */
	slim?: boolean;
	/** Muestra la X. Un banner siempre se puede descartar salvo que el aviso bloquee algo de verdad. */
	onClose?: () => void;
	/** Nombre de la X. @default "Cerrar aviso" */
	closeLabel?: string;
	/** Nombre de la región. Por defecto, el título si es texto, o "Aviso". */
	"aria-label"?: string;
	className?: string;
}

const pad2 = (n: number) => String(n).padStart(2, "0");
const UNITS = ["días", "horas", "min", "seg"] as const;

function Countdown({ to, now, brand }: { to: Date; now?: Date; brand: boolean }) {
	const [tick, setTick] = useState(() => Date.now());
	useEffect(() => {
		if (now) return;
		const t = setInterval(() => setTick(Date.now()), 1000);
		return () => clearInterval(t);
	}, [now]);
	const s = Math.max(0, Math.floor((to.getTime() - (now ? now.getTime() : tick)) / 1000));
	const parts = [
		Math.floor(s / 86400),
		Math.floor((s % 86400) / 3600),
		Math.floor((s % 3600) / 60),
		s % 60,
	];
	return (
		<div
			role="timer"
			aria-label={parts.map((n, i) => `${n} ${UNITS[i]}`).join(", ")}
			className="flex shrink-0 gap-2"
		>
			{parts.map((n, i) => (
				<div
					key={UNITS[i]}
					aria-hidden="true"
					className={cx(
						"flex min-w-12 flex-col items-center rounded-lg px-1.5 py-1",
						brand
							? "bg-fg-white/10 shadow-[inset_0_0_0_1px_var(--border-brand_alt)]"
							: "bg-primary shadow-[inset_0_0_0_1px_var(--border-secondary)]",
					)}
				>
					<span
						className={cx(
							"text-lg font-semibold tabular-nums",
							brand ? "text-primary_on-brand" : "text-primary",
						)}
					>
						{pad2(n)}
					</span>
					<span
						className={cx(
							"text-[11px] leading-4 font-medium",
							// En brand, blanco y no tertiary_on-brand: sobre la celda este daba 4,4:1 (decisión del usuario)
							brand ? "text-primary_on-brand" : "text-tertiary",
						)}
					>
						{UNITS[i]}
					</span>
				</div>
			))}
		</div>
	);
}

/**
 * Aviso de ancho de página o flotante para anunciar algo a toda la app: novedades, mantenimiento, captación de
 * correo, cuenta atrás. Uno a la vez. En móvil se apila y oculta el icono.
 */
export function Banner({
	title,
	description,
	icon,
	actions,
	email,
	countdown,
	now,
	theme = "default",
	layout = "floating",
	slim,
	onClose,
	closeLabel,
	className,
	...rest
}: BannerProps) {
	const brand = theme === "brand";
	const [value, setValue] = useState("");
	const mail = email
		? { placeholder: defaultStrings.yourEmail, buttonLabel: defaultStrings.subscribe, ...email }
		: null;

	return (
		<section
			aria-label={rest["aria-label"] ?? (typeof title === "string" ? title : defaultStrings.notice)}
			className={cx(
				"font-body",
				brand ? "bg-brand-section_subtle" : "bg-secondary",
				layout === "floating"
					? cx(
							"rounded-xl",
							brand
								? "shadow-[inset_0_0_0_1px_var(--border-brand_alt),var(--shadow-lg)]"
								: "shadow-[inset_0_0_0_1px_var(--border-secondary_alt),var(--shadow-lg)]",
						)
					: brand
						? "shadow-[inset_0_-1px_0_var(--border-brand_alt)]"
						: "shadow-[inset_0_-1px_0_var(--border-secondary_alt)]",
				className,
			)}
		>
			<div
				className={cx(
					"relative flex items-center gap-4 max-[720px]:flex-wrap",
					// En móvil el banner se apila (el estrecho conserva su relleno y su X centrada, como en la guía)
					!slim && "max-[720px]:p-4",
					layout === "full"
						? "mx-auto max-w-[var(--container-max-width-desktop)] px-8 py-3"
						: "p-3",
					slim && "justify-center px-4 py-3",
				)}
			>
				{icon && !slim ? (
					<FeaturedIcon
						icon={icon}
						variant={brand ? "light" : "modern"}
						size="lg"
						color={brand ? "brand" : "gray"}
						className="max-[720px]:hidden"
					/>
				) : null}
				<div
					className={cx(
						"flex min-w-0 flex-wrap gap-x-1.5 text-sm max-[720px]:basis-[calc(100%-48px)]",
						slim ? "flex-initial" : "flex-1",
					)}
				>
					<span className={cx("font-semibold", brand ? "text-primary_on-brand" : "text-secondary")}>
						{title}
					</span>
					{description ? (
						<span className={brand ? "text-tertiary_on-brand" : "text-tertiary"}>
							{description}
						</span>
					) : null}
				</div>
				{countdown ? <Countdown to={countdown} now={now} brand={brand} /> : null}
				{mail ? (
					<form
						className="flex w-[360px] max-w-full shrink-0 flex-wrap gap-3 max-[720px]:w-full"
						onSubmit={(e) => {
							e.preventDefault();
							mail.onSubmit?.(value);
						}}
					>
						<Input
							type="email"
							required
							size="sm"
							placeholder={mail.placeholder}
							aria-label={mail.placeholder}
							value={value}
							onChange={(e) => setValue(e.target.value)}
							className="min-w-0 flex-1"
						/>
						<Button type="submit" size="sm" hierarchy={brand ? "secondary" : "primary"}>
							{mail.buttonLabel}
						</Button>
						{mail.hint ? (
							<p
								className={cx(
									"m-0 w-full text-xs",
									brand ? "text-tertiary_on-brand" : "text-tertiary",
								)}
							>
								{mail.hint}
							</p>
						) : null}
					</form>
				) : null}
				{actions ? <div className="flex shrink-0 gap-3 max-[720px]:w-full">{actions}</div> : null}
				{onClose ? (
					<CloseButton
						label={closeLabel ?? defaultStrings.closeNotice}
						onClick={onClose}
						className={cx(
							"shrink-0",
							slim
								? "absolute top-1/2 right-2 -translate-y-1/2"
								: "max-[720px]:absolute max-[720px]:top-2 max-[720px]:right-2",
							brand &&
								"text-tertiary_on-brand hover:bg-fg-white/10 hover:text-primary_on-brand",
						)}
					/>
				) : null}
			</div>
		</section>
	);
}
