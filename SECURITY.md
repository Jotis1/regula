# Política de seguridad

## Versiones con arreglos

Regula publica tres paquetes con el mismo número de versión: `@jotis-me/tokens`, `@jotis-me/assets` y `@jotis-me/react`. Mientras la versión sea 0.x, solo recibe arreglos de seguridad la última publicada en npm.

## Cómo avisar de una vulnerabilidad

**No abras un issue público ni una PR con el problema.** Avisa en privado desde la pestaña de seguridad del repositorio:

1. Abre <https://github.com/Jotis1/regula/security/advisories/new>.
2. Cuenta qué has encontrado, en qué paquete o página, y cómo reproducirlo.
3. Si puedes, añade la versión afectada y una propuesta de arreglo.

Solo lo ve quien mantiene el repositorio. No hace falta que el aviso esté completo: es mejor uno corto ahora que uno perfecto dentro de un mes.

## Qué esperar

- Se acusa recibo del aviso y se confirma si el problema es real.
- Si lo es, se arregla en una versión nueva y se publica un aviso de seguridad (GHSA) con el crédito de quien lo encontró, si quiere aparecer.
- Hasta que haya arreglo, se pide no publicar los detalles.

## Qué cuenta

- **Entra:** los paquetes publicados en npm, la web de documentación (regula.jotis.me) y su servidor MCP (`/mcp`).
- **No entra:** los avisos de dependencias de desarrollo que no llegan a lo que se publica (los sigue la auditoría del CI), ni los resultados de un escáner automático sin un caso que se pueda reproducir.
