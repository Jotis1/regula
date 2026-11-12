"use client";

import { type FormEvent, type ReactNode, useId } from "react";
import { cx } from "../internal/cx.js";
import { Button } from "./Button.js";
import { FeaturedIcon } from "./FeaturedIcon.js";

export interface SubscribeCardProps {
	/** @default "Boletín semanal" */
	title?: ReactNode;
	description?: ReactNode;
	/**
	 * `default` con el avión de papel · `line` con el sobre y una raya de marca arriba.
	 * @default "default"
	 */
	type?: "default" | "line";
	/** Recibe el correo al enviar el formulario. */
	onSubscribe?: (email: string) => void;
	/** @default "Tu correo" */
	placeholder?: string;
	/** @default "Suscribirme" */
	buttonLabel?: string;
	/** Bajo el campo: «Lee nuestra política de privacidad», con su enlace. */
	privacy?: ReactNode;
	className?: string;
}

/**
 * Tarjeta de suscripción al blog (Figma `Blog subscribe card`, `1391:213014`): icono, título, texto, el campo del
 * correo, una nota de privacidad y el botón a todo el ancho. Es un formulario.
 */
export function SubscribeCard({
	title = "Boletín semanal",
	description,
	type = "default",
	onSubscribe,
	placeholder = "Tu correo",
	buttonLabel = "Suscribirme",
	privacy,
	className,
}: SubscribeCardProps) {
	const id = useId();
	const submit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const email = new FormData(e.currentTarget).get("email");
		if (typeof email === "string" && email) onSubscribe?.(email);
	};
	return (
		<section
			aria-labelledby={`${id}-title`}
			className={cx(
				"flex flex-col gap-8 rounded-2xl bg-secondary p-8 font-body @container",
				type === "line"
					? "rounded-t-none shadow-[inset_0_4px_0_var(--fg-brand-primary_alt)]"
					: "shadow-[inset_0_0_0_1px_var(--border-secondary)]",
				className,
			)}
		>
			<FeaturedIcon
				icon={type === "line" ? "mail-01" : "send-01"}
				variant="modern"
				color="gray"
				size="xl"
			/>
			<div className="flex flex-col gap-2">
				<h3 id={`${id}-title`} className="m-0 text-xl font-semibold text-primary">
					{title}
				</h3>
				{description ? <p className="m-0 text-md text-tertiary">{description}</p> : null}
			</div>
			<form onSubmit={submit} className="flex flex-col gap-4">
				<div className="flex flex-col gap-1.5">
					<label htmlFor={`${id}-email`} className="sr-only">
						{placeholder}
					</label>
					<input
						id={`${id}-email`}
						name="email"
						type="email"
						required
						autoComplete="email"
						placeholder={placeholder}
						aria-describedby={privacy ? `${id}-privacy` : undefined}
						className="h-11 w-full rounded-lg border-0 bg-primary px-3.5 text-md text-primary shadow-[var(--shadow-xs),inset_0_0_0_1px_var(--border-primary)] placeholder:text-placeholder focus-visible:shadow-[var(--shadow-xs),inset_0_0_0_2px_var(--border-brand)] focus-visible:outline-none"
					/>
					{privacy ? (
						<p id={`${id}-privacy`} className="m-0 text-sm text-tertiary">
							{privacy}
						</p>
					) : null}
				</div>
				<Button type="submit" size="lg" className="w-full">
					{buttonLabel}
				</Button>
			</form>
		</section>
	);
}
