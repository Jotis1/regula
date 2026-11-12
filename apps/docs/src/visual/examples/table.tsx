// Vista previa de Table: la de siempre y las cuatro tablas del Figma (miembros del equipo, empresas, ventas y archivos),
// con los tipos de celda, el orden, la ayuda, la selección y las filas alternas.

import { Badge, Button, Pagination, Table } from "@jotis-me/react";
import { FileIcon } from "@untitledui/file-icons";
import { Download01, Edit02, Trash01, UploadCloud02 } from "@untitledui/icons";

type Movimiento = { c: string; f: string; ok: boolean; i: string };

function Movimientos() {
	return (
		<Table<Movimiento>
			title="Movimientos"
			count="240"
			description="Octubre de 2026."
			actions={
				<Button hierarchy="secondary" iconLeading={Download01} size="sm">
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

const equipos = ["Diseño", "Producto", "Marketing", "Ventas", "Datos"];
const miembros = [
	["Olivia Rhye", "olivia", "Diseñadora de producto", 5],
	["Phoenix Baker", "phoenix", "Responsable de producto", 4],
	["Lana Steiner", "lana", "Desarrolladora frontend", 2],
	["Demi Wilkinson", "demi", "Desarrolladora backend", 3],
].map(([nombre, usuario, rol, n]) => ({
	id: String(usuario),
	persona: {
		name: nombre,
		subtitle: `@${usuario}`,
		avatar: {
			initials: String(nombre)
				.split(" ")
				.map((p) => p[0])
				.join(""),
		},
	},
	estado: { label: "Activo", color: "success", dot: true },
	rol,
	correo: `${usuario}@jotis.me`,
	equipos: { labels: equipos.slice(0, Number(n)) },
	acciones: [
		{ icon: Trash01, label: `Borrar a ${nombre}` },
		{ icon: Edit02, label: `Editar a ${nombre}` },
	],
}));

const empresas = [
	["Efímera", "efimera.io", "Customer", 70],
	["Pila 3D", "pila3d.com", "Churned", 60],
	["Ventisca", "ventisca.es", "Customer", 30],
	["Nubarrón", "nubarron.app", "Customer", 80],
].map(([nombre, web, estado, uso], i) => ({
	id: String(web),
	empresa: { name: nombre, subtitle: web, avatar: { initials: String(nombre).slice(0, 2) } },
	estado: {
		label: estado === "Customer" ? "Cliente" : "De baja",
		color: estado === "Customer" ? "success" : "gray",
		dot: true,
	},
	usuarios: {
		avatars: Array.from({ length: 8 }, (_, k) => ({ initials: "ABCDEFGHIJ"[(k + i) % 10] })),
		max: 4,
	},
	uso,
	valoracion: [4, 3.5, 5, 4.5][i],
	menu: { label: `Más opciones de ${nombre}` },
}));

const ventas = [
	["#3066", "6 ene 2027", "Pagada", "Olivia Rhye", "1.800 €", "up"],
	["#3065", "6 ene 2027", "Pagada", "Phoenix Baker", "1.240 €", "down"],
	["#3064", "5 ene 2027", "Devuelta", "Lana Steiner", "420 €", "down"],
	["#3063", "5 ene 2027", "Cancelada", "Demi Wilkinson", "980 €", "up"],
].map(([factura, fecha, estado, cliente, importe, dir]) => ({
	id: String(factura),
	factura,
	fecha,
	estado: {
		label: estado,
		color: estado === "Pagada" ? "success" : estado === "Cancelada" ? "error" : "gray",
		icon: estado === "Pagada" ? "check" : undefined,
	},
	cliente: {
		name: cliente,
		subtitle: `${String(cliente).split(" ")[0]?.toLowerCase()}@jotis.me`,
		avatar: {
			initials: String(cliente)
				.split(" ")
				.map((p) => p[0])
				.join(""),
		},
	},
	importe: { value: importe, change: "20%", direction: dir },
	acciones: [{ label: "Borrar" }, { label: "Editar" }],
}));

const archivos = [
	["Requisitos técnicos.pdf", "200 KB", <FileIcon type="pdf" key="i" />, "4 ene 2027"],
	["Captura del panel.jpg", "720 KB", <FileIcon type="jpg" key="i" />, "4 ene 2027"],
	["Prototipo final.fig", "4,2 MB", <FileIcon type="fig" key="i" />, "6 ene 2027"],
	["Guía de diseño.docx", "400 KB", <FileIcon type="docx" key="i" />, "8 ene 2027"],
	["Llamada de arranque.mp3", "18,6 MB", <FileIcon type="mp3" key="i" />, "4 ene 2027"],
].map(([nombre, peso, icono, fecha]) => ({
	id: String(nombre),
	archivo: { name: nombre, size: peso, icon: icono },
	peso,
	fecha,
	menu: { label: `Más opciones de ${nombre}` },
}));

export function TableExample() {
	return (
		<div className="flex flex-col gap-10">
			<Movimientos />
			<Table
				title="Miembros del equipo"
				count="100 usuarios"
				selection="checkbox"
				defaultSort={{ key: "persona", direction: "ascending" }}
				columns={[
					{
						key: "persona",
						label: "Nombre",
						type: "avatar",
						sortable: true,
						sortValue: (r) => String((r.persona as { name: string }).name),
					},
					{ key: "estado", label: "Estado", type: "badge" },
					{ key: "rol", label: "Rol", help: "Lo que hace en el equipo" },
					{ key: "correo", label: "Correo" },
					{ key: "equipos", label: "Equipos", type: "badges" },
					{ key: "acciones", label: "Acciones", type: "action-icons" },
				]}
				rows={miembros}
			/>
			<Table
				title="Empresas"
				description="Las que han comprado en los últimos 12 meses."
				striped
				columns={[
					{ key: "empresa", label: "Empresa", type: "avatar" },
					{ key: "estado", label: "Estado", type: "badge" },
					{ key: "usuarios", label: "Usuarios", type: "avatar-group" },
					{ key: "uso", label: "Uso de licencias", type: "progress", sortable: true },
					{ key: "valoracion", label: "Valoración", type: "rating" },
					{ key: "menu", label: "", type: "menu" },
				]}
				rows={empresas}
			/>
			<Table
				title="Ventas"
				selection="radio"
				size="sm"
				columns={[
					{ key: "factura", label: "Factura", sortable: true, primary: true },
					{ key: "fecha", label: "Fecha" },
					{ key: "estado", label: "Estado", type: "badge" },
					{ key: "cliente", label: "Cliente", type: "avatar" },
					{ key: "importe", label: "Importe", type: "trend" },
					{ key: "acciones", label: "", type: "actions" },
				]}
				rows={ventas}
			/>
			<Table
				title="Archivos subidos"
				selection="toggle"
				actions={
					<>
						<Button hierarchy="secondary" size="sm">
							Descargar todo
						</Button>
						<Button size="sm" iconLeading={UploadCloud02}>
							Subir
						</Button>
					</>
				}
				columns={[
					{ key: "archivo", label: "Archivo", type: "file" },
					{ key: "peso", label: "Tamaño" },
					{ key: "fecha", label: "Subido el" },
					{ key: "menu", label: "", type: "menu" },
				]}
				rows={archivos}
			/>
		</div>
	);
}
