// Entrada del bundle del artefacto: @jotis-me/react tal cual, más `iconNames` (como en la guía) y los ejemplos del
// registro de la web en `previews`, que montan las vistas previas. Se compila como un único script clásico (IIFE).
// @ts-nocheck: el registro trae los ejemplos .tsx de la web, que se comprueban con los tipos de la web.
import { iconNames } from "@jotis-me/icons";
import * as lib from "@jotis-me/react";
import { COMPOSITIONS } from "../../../apps/docs/src/visual/compositions";
import { visualExamples } from "../../../apps/docs/src/visual/registry";

// Una vista previa por componente del catálogo: las composiciones de la web (design D7) no son componentes
const compositions = new Set(COMPOSITIONS.map((c) => c.name));
const previews = Object.fromEntries(
	Object.entries(visualExamples).filter(([name]) => !compositions.has(name)),
);

window.Jotis = Object.assign({}, lib, { iconNames, previews });
