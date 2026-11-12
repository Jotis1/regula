"use client";

import { Mail01 } from "@untitledui/icons";
import { type FormEvent, useId, useState } from "react";
import { Button } from "../components/Button.js";
import { cx } from "./cx.js";
import { controlClasses, FieldShell, nativeClasses } from "./field.js";
import { iconSlot } from "./icon.js";

/**
 * Campo de correo y botón del tipo `email` de `InlineCTA`. Va aparte, como isla, para que `InlineCTA` siga siendo de
 * servidor; usa las mismas piezas que `Input` (marco, etiqueta y nativo) sin cargar sus desplegables.
 */
export function InlineCTAEmail({
	label,
	placeholder,
	submitLabel,
	onSubmit,
}: {
	label: string;
	placeholder: string;
	submitLabel: string;
	onSubmit?: (email: string) => void;
}) {
	const id = useId();
	const [email, setEmail] = useState("");
	return (
		<form
			onSubmit={(e: FormEvent) => {
				e.preventDefault();
				onSubmit?.(email.trim());
			}}
		>
			<FieldShell id={id} label={label} size="sm">
				<div className="flex items-start gap-3 @max-md:flex-col @max-md:items-stretch">
					<div className={cx(controlClasses("sm", false), "max-w-80 flex-1 @max-md:max-w-none")}>
						{iconSlot(Mail01, 20)}
						<input
							id={id}
							type="email"
							autoComplete="email"
							placeholder={placeholder}
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className={nativeClasses("sm")}
						/>
					</div>
					<Button type="submit" size="sm">
						{submitLabel}
					</Button>
				</div>
			</FieldShell>
		</form>
	);
}
