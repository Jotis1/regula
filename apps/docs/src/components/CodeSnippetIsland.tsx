// `CodeSnippet` como isla de la web. Un componente del paquete no se hidrata directamente: Astro apuntaría la isla al
// índice de `@jotis-me/react`, que pasa a ser punto de entrada y obliga a conservar todos sus componentes en el JS
// de cada página. Esta isla lo importa por nombre y el bundler solo se lleva lo que usa.
import { CodeSnippet, type CodeSnippetProps } from "@jotis-me/react";

export default function CodeSnippetIsland(props: CodeSnippetProps) {
	return <CodeSnippet {...props} />;
}
