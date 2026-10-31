// Envoltorio .tsx: las props que son funciones (onChange) no pueden pasar de un .astro a una isla.
import { ButtonGroup } from "@jotis-me/react";
import { useState } from "react";

export default function Periodo() {
	const [value, setValue] = useState("m");
	return (
		<div className="flex flex-col gap-3">
			<ButtonGroup
				aria-label="Periodo"
				value={value}
				onChange={setValue}
				items={[
					{ value: "a", label: "12 meses" },
					{ value: "m", label: "7 días" },
					{ value: "d", label: "24 horas", icon: "clock" },
				]}
			/>
			<p className="text-sm text-tertiary" data-testid="elegido">
				Elegido: {value}
			</p>
		</div>
	);
}
