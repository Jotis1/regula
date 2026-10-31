/// <reference types="vitest/config" />
import { getViteConfig } from "astro/config";

// Config de Vite de Astro para poder renderizar componentes .astro en los tests (container API)
export default getViteConfig({ test: { include: ["test/**/*.test.ts"] } });
