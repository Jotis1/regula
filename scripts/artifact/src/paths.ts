// Rutas del repo que lee el generador. Nunca `reference/` (design D1): todo sale de los paquetes y de la web.
import { join } from "node:path";

export const ROOT = join(import.meta.dirname, "../../..");
export const DOCS = join(ROOT, "apps/docs");
export const REACT = join(ROOT, "packages/react");
export const ASSETS = join(ROOT, "packages/assets");
export const TOKENS = join(ROOT, "packages/tokens");
/** Carpeta de salida por defecto: `dist-artifact/` en la raíz (en .gitignore). */
export const OUT = join(ROOT, "dist-artifact");

export const REPO = "Jotis1/regula";
export const TITLE = "Jotis.me";
export const NAMESPACE = "Jotis";
