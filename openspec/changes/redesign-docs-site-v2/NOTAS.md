# Notas de la implementación

- **0.1.** Los tres cambios previos (`unblock-docs-redesign`, `add-docs-variants`, `add-docs-pieces`) están hechos en la misma rama, sin archivar ni publicar: se decidió juntar todo en un solo despliegue. `apps/docs` usa el paquete del monorepo.
- **Menú móvil (D2).** `SidebarNav` anida un solo nivel, así que los bloques Componentes y Stream del menú llevan «Todos los componentes» (o la guía) y los grupos como enlaces a su ancla del índice, como en el lienzo. El filtro del menú encuentra un grupo por los componentes que contiene («tabla» enseña «Datos»).
- **Fundamentos en el lateral.** Son nueve páginas; la guía de Stream va en la sección Stream.
- **Sin lateral.** Portada (`wide`), iconos (por sección) y 404 (`noindex`); `Base` admite `sidebar` para forzarlo.
- **Esqueleto (D1).** Piezas de la web: `SectionTitle.astro` (`SectionHeader` `sm` con su `id`), `MdxH2.astro` (los `##` de los `.mdx`), `PageToc.astro` («En esta página») y `lib/layout.ts` (columna de 720 px y 56 px entre secciones). La importación se copia con el `CopyTooltip` global (`data-copy`), sin JavaScript nuevo. «En esta página» se pinta desde 1.280 px; por debajo no hay índice.
- **Test de estructura.** Ya no hay excepción para el lateral: comprueba que es `SidebarNav` con `disclosure="native"` y sin isla.
