// Puertos de las vistas previas de datos de la guía (reference/components/*/preview.html).

import { FileDocumentPdf } from "@jotis-me/icons/files";
import { ActivityFeed, Badge, Button, CodeSnippet, MetricCard, Pagination, Table } from "@jotis-me/react";

type Movimiento = { c: string; f: string; ok: boolean; i: string };

export function TableExample() {
	return (
		<Table<Movimiento>
			title="Movimientos"
			count="240"
			description="Octubre de 2026."
			actions={
				<Button hierarchy="secondary" iconLeading="download-01" size="sm">
					Exportar
				</Button>
			}
			columns={[
				{ key: "c", label: "Concepto", primary: true },
				{ key: "f", label: "Fecha" },
				{
					key: "e",
					label: "Estado",
					render: (r) => (
						<Badge color={r.ok ? "success" : "warning"} dot size="sm">
							{r.ok ? "Pagado" : "Pendiente"}
						</Badge>
					),
				},
				{ key: "i", label: "Importe", align: "right" },
			]}
			rows={[
				{ c: "Alquiler", f: "01 oct", ok: true, i: "650,00 €" },
				{ c: "Electricidad", f: "05 oct", ok: true, i: "48,20 €" },
				{ c: "Seguro del coche", f: "15 oct", ok: false, i: "210,00 €" },
				{ c: "Gimnasio", f: "20 oct", ok: false, i: "35,00 €" },
			]}
			footer={
				<div style={{ padding: "0 24px 16px" }}>
					<Pagination total={24} />
				</div>
			}
		/>
	);
}

export function MetricCardExample() {
	return (
		<div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 24 }}>
			<MetricCard
				label="Gasto del mes"
				value="1.284 €"
				change="12%"
				trend="down"
				period="vs. septiembre"
				menu
			/>
			<MetricCard label="Ahorro" value="420 €" change="8%" period="vs. septiembre" />
		</div>
	);
}

export function ActivityFeedExample() {
	return (
		<div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 40 }}>
			<ActivityFeed
				items={[
					{
						author: "Pecunia",
						avatar: { initials: "Pe" },
						time: "Hace 2 min",
						text: (
							<>
								Importado <strong>extracto-octubre.csv</strong> con 84 movimientos.
							</>
						),
						unread: true,
					},
					{
						author: "Emptor",
						avatar: { initials: "Em" },
						time: "Hace 1 h",
						text: "Ha bajado de precio una aspiradora que seguías.",
						unread: true,
					},
					{
						author: "Vinculum",
						avatar: { initials: "Vi" },
						time: "Ayer",
						text: "3 contactos fusionados.",
					},
				]}
			/>
			<ActivityFeed
				connector
				items={[
					{
						author: "Administrador",
						avatar: { initials: "AD" },
						time: "09:12",
						text: "Creó la categoría Mascotas.",
					},
					{
						author: "Administrador",
						avatar: { initials: "AD" },
						time: "09:15",
						text: "Movió 6 gastos a Mascotas.",
					},
					{
						author: "Pecunia",
						avatar: { initials: "Pe" },
						time: "09:16",
						text: "Recalculó el presupuesto de octubre.",
					},
				]}
			/>
			<ActivityFeed
				divider="none"
				items={[
					{
						author: "Ana Ruiz",
						avatar: { initials: "AR" },
						time: "Hace 5 min",
						text: (
							<>
								Etiquetó <strong>Viaje a Lisboa</strong>.
							</>
						),
						supporting: { type: "tags", tags: ["Vacaciones", "Compartido"] },
					},
					{
						author: "Luis Gil",
						avatar: { initials: "LG" },
						time: "Hace 1 h",
						text: "Comentó en Presupuesto de octubre.",
						supporting: { type: "text", text: "¿Subimos el límite de ocio a 150 €?" },
					},
				]}
			/>
			<ActivityFeed
				type="messages"
				divider="divider"
				items={[
					{
						author: "Lana Steiner",
						avatar: { initials: "LS" },
						handle: "@lana",
						time: "Ahora",
						text: "Me parece bien, ¡gracias!",
						online: true,
						unread: true,
					},
					{
						author: "Orlando Díaz",
						avatar: { initials: "OD" },
						handle: "@orlando",
						time: "15:42",
						text: "Ficha técnica",
						supporting: {
							type: "file",
							name: "ficha-tecnica-02.pdf",
							size: "720 KB",
							icon: <FileDocumentPdf size={40} />,
						},
					},
				]}
			/>
		</div>
	);
}

const SNIPPET_LONG = Array.from({ length: 24 }, (_, i) => `  clave${i + 1}: "valor ${i + 1}",`).join("\n");

/** La horizontal con pestañas, la vertical con pestañas y recortada con «Ver más», y la vertical simple con ampliar. */
export function CodeSnippetExample() {
	return (
		<div className="flex flex-col gap-6">
			<CodeSnippet
				tabs={[
					{
						label: "js",
						code: "// Cargar el sistema\nimport { Button } from 'jotis'\n\nexport const guardar = new Button({\n  hierarchy: 'primary',\n  label: 'Guardar',\n})\n",
					},
					{ label: "bash", code: "npm install jotis" },
				]}
			/>
			<CodeSnippet
				variant="vertical"
				maxHeight={220}
				tabs={[
					{ label: "npm", code: `export const colores = {\n${SNIPPET_LONG}\n}` },
					{ label: "yarn", code: "yarn add jotis" },
					{ label: "bun", code: "bun add jotis" },
				]}
			/>
			<CodeSnippet
				variant="vertical"
				onExpand={() => {}}
				code={"// Instalar\nnpm install jotis"}
				language="bash"
			/>
		</div>
	);
}
