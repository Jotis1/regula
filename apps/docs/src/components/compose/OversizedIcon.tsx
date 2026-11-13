// El «esto no» de Iconografía: un `Button` con el icono a 28 px en vez de los 20 que le pone el propio botón. Va en
// un .tsx porque el icono se pasa como nodo de React, y desde un .mdx no se puede.
import { Button } from "@jotis-me/react";
import { Plus } from "@untitledui/icons";

export default function OversizedIcon({ label }: { label: string }) {
	return <Button iconLeading={<Plus size={28} aria-hidden="true" />}>{label}</Button>;
}
