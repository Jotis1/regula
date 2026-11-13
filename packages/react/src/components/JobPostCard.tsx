import { ArrowUpRight, Clock, CurrencyDollarCircle, MarkerPin01 } from "@untitledui/icons";
import type { ReactNode } from "react";
import { cx } from "../internal/cx.js";
import { Badge, type BadgeColor } from "./Badge.js";

export interface JobPostCardProps {
	/** La oferta. El título es el enlace y toda la tarjeta responde al clic. */
	href: string;
	title: ReactNode;
	description?: ReactNode;
	/** Departamento, en una etiqueta con punto: «Diseño». */
	department?: ReactNode;
	/** Color del punto del departamento. @default "blue" */
	departmentColor?: BadgeColor;
	/** Lugar: «En remoto», «Madrid». */
	location?: ReactNode;
	/** Bandera del lugar en `card-02` (de `@untitledui/country-flags`). */
	flag?: ReactNode;
	/** Jornada: «Jornada completa». */
	employment?: ReactNode;
	/** Sueldo, en `card-02`: «40.000-50.000 €». */
	salary?: ReactNode;
	/** Encima del título en `card-01`. */
	category?: ReactNode;
	/** Enlace de `card-01`. @default "Ver la oferta" */
	viewLabel?: string;
	/** `simple` con una raya encima · `card-01` · `card-02`. @default "simple" */
	type?: "simple" | "card-01" | "card-02";
	className?: string;
}

/**
 * Oferta de empleo para la página de empleo (Figma `_Job post`, `1506:244681`): puesto, departamento, resumen, lugar,
 * jornada y sueldo, en tres tipos. En un contenedor estrecho, la etiqueta baja bajo el título, como el Figma en móvil.
 */
export function JobPostCard({
	href,
	title,
	description,
	department,
	departmentColor = "blue",
	location,
	flag,
	employment,
	salary,
	category,
	viewLabel = "Ver la oferta",
	type = "simple",
	className,
}: JobPostCardProps) {
	const card = type !== "simple";
	const meta = [
		type === "card-02"
			? null
			: location
				? { key: "lugar", icon: <MarkerPin01 size={20} />, text: location }
				: null,
		employment ? { key: "jornada", icon: <Clock size={20} />, text: employment } : null,
		type === "card-02" && salary
			? { key: "sueldo", icon: <CurrencyDollarCircle size={20} />, text: salary }
			: null,
	].filter((m) => m !== null);
	const dept = department ? (
		<Badge
			size="md"
			color={type === "card-02" ? "gray" : departmentColor}
			dot
			type={type === "card-02" ? "modern" : "pill"}
		>
			{department}
		</Badge>
	) : null;
	const place =
		type === "card-02" && location ? (
			<Badge size="md" color="gray" type="modern" flag={flag}>
				{location}
			</Badge>
		) : null;
	return (
		<article
			className={cx(
				"@container relative flex flex-col gap-2 font-body",
				card
					? "rounded-2xl bg-primary p-6 shadow-[inset_0_0_0_1px_var(--border-secondary)] hover:shadow-[var(--shadow-md),inset_0_0_0_1px_var(--border-secondary)]"
					: "border-t border-secondary pt-6",
				className,
			)}
		>
			<div className="flex items-start justify-between gap-4">
				<div className="flex flex-col gap-1">
					{type === "card-01" && category ? (
						<p className="m-0 text-sm font-semibold text-brand-secondary">{category}</p>
					) : null}
					<div className="flex flex-wrap items-center gap-2 @max-md:flex-col @max-md:items-start">
						<h3 className="m-0 text-md font-semibold text-primary">
							<a
								href={href}
								className="text-inherit no-underline after:absolute after:inset-0 after:rounded-2xl focus-visible:outline-none focus-visible:after:shadow-focus-ring"
							>
								{title}
							</a>
						</h3>
						<span className="flex flex-wrap gap-2">
							{type === "card-02" ? <span className="@md:hidden">{place}</span> : null}
							{type === "card-01" ? <span className="@max-md:hidden">{dept}</span> : dept}
						</span>
					</div>
				</div>
				{type === "card-01" ? (
					<>
						<span
							aria-hidden="true"
							className="flex items-center gap-1.5 text-sm font-semibold text-brand-secondary @max-md:hidden"
						>
							{viewLabel}
							<ArrowUpRight size={20} />
						</span>
						<span className="@md:hidden">{dept}</span>
					</>
				) : null}
				{type === "card-02" ? <span className="@max-md:hidden">{place}</span> : null}
			</div>
			{description ? <p className="m-0 text-md text-tertiary">{description}</p> : null}
			{meta.length ? (
				<ul className="m-0 mt-4 flex list-none flex-wrap gap-6 p-0">
					{meta.map((m) => (
						<li
							key={m.key}
							className="flex items-center gap-1.5 text-md font-medium text-tertiary"
						>
							<span aria-hidden="true" className="flex text-fg-quaternary">
								{m.icon}
							</span>
							{m.text}
						</li>
					))}
				</ul>
			) : null}
		</article>
	);
}
