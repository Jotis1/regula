/// <reference types="vitest/config" />
import { getViteConfig } from "astro/config";

// Config de Vite de Astro para poder renderizar componentes .astro en los tests (container API)
// `testTimeout`: los tests que cargan módulos del ejemplo interactivo pasan de los 5 s por defecto en los runners de CI,
// y en local cuando turbo corre a la vez el build y los tipos.
export default getViteConfig({ test: { include: ["test/**/*.test.ts"], testTimeout: 30_000 } });
