// Entrada del bundle del artefacto: @jotis-me/react tal cual, más `iconNames` (como en la guía) y los ejemplos del
// registro de la web en `previews`, que montan las vistas previas. Se compila como un único script clásico (IIFE).
// @ts-nocheck: el registro trae los ejemplos .tsx de la web, que se comprueban con los tipos de la web.
import { iconNames } from "@jotis-me/icons";
import * as lib from "@jotis-me/react";
import { visualExamples } from "../../../apps/docs/src/visual/registry";

window.Jotis = Object.assign({}, lib, { iconNames, previews: visualExamples });
