// Genera src/components.generated.tsx: un componente por icono (IconCalendar, IconAlertCircle…).
// Uso: bun run scripts/generate.ts
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { icons } from "../src/data/icons.ts";

export const componentName = (name: string) =>
	`Icon${name
		.split("-")
		.map((p) => p.charAt(0).toUpperCase() + p.slice(1))
		.join("")}`;

const lines = Object.keys(icons).map(
	(name) =>
		`export const ${componentName(name)} = (props: IconComponentProps) => <Icon name="${name}" {...props} />;`,
);

writeFileSync(
	join(import.meta.dirname, "../src/components.generated.tsx"),
	`// Generado por scripts/generate.ts. No editar a mano.
import { Icon, type IconProps } from "./Icon.js";

export type IconComponentProps = Omit<IconProps, "name">;

${lines.join("\n")}
`,
);
console.log(`${lines.length} componentes de icono → src/components.generated.tsx`);
