// Vista previa de FilterBar: la de siempre y los ocho tipos del Figma. Va en su propio fichero: `FilterBar` lleva
// `DatePicker`, y en `navigation.tsx` pesaba en las páginas de Tabs y del resto de navegación.

import { Button, DatePicker, FilterBar, type FilterCondition, Input, Select } from "@jotis-me/react";
import { useState } from "react";

const hoy = new Date(2027, 0, 8);
const fechas = (
	<DatePicker
		range
		today={hoy}
		defaultValue={{ start: new Date(2027, 0, 8), end: new Date(2027, 0, 14) }}
	/>
);
const vistas = [
	{ value: "todo", label: "Ver todo" },
	{ value: "activos", label: "Activos" },
	{ value: "archivados", label: "Archivados" },
];
const periodos = [
	{ value: "12m", label: "12 meses" },
	{ value: "30d", label: "30 días" },
	{ value: "7d", label: "7 días" },
	{ value: "24h", label: "24 horas" },
];
const nada = () => {};
const campos = [
	{ value: "estado", label: "Estado" },
	{ value: "correo", label: "Correo" },
	{ value: "equipo", label: "Equipo" },
];
const operadores = [
	{ value: "es", label: "Es igual a" },
	{ value: "contiene", label: "Contiene" },
	{ value: "no-contiene", label: "No contiene" },
];

function Avanzada({ inicial }: { inicial: FilterCondition[] }) {
	const [condiciones, setCondiciones] = useState(inicial);
	return (
		<FilterBar
			type="advanced"
			conditions={condiciones}
			conditionFields={campos}
			conditionOperators={operadores}
			onConditionsChange={setCondiciones}
			onClear={() => setCondiciones([])}
			onOpenFilters={nada}
		/>
	);
}

export function FilterBarExample() {
	return (
		<div className="flex flex-col gap-10">
			<FilterBar
				segments={[
					{ value: "t", label: "Todo" },
					{ value: "g", label: "Gastos" },
					{ value: "i", label: "Ingresos" },
				]}
				defaultSegment="t"
				search
				searchPlaceholder="Buscar movimientos"
				activeFilters={[{ label: "Categoría: Hogar" }, { label: "Importe > 50 €" }]}
				onRemoveFilter={nada}
				onClear={nada}
			/>
			<FilterBar
				type="simple"
				dates={
					<Button hierarchy="secondary" size="sm" iconLeading="calendar">
						Elegir fechas
					</Button>
				}
				onOpenFilters={nada}
			/>
			<FilterBar type="tabs-search" segments={vistas} defaultSegment="todo" onOpenFilters={nada} />
			<FilterBar
				type="tabs-date"
				segments={periodos}
				defaultSegment="12m"
				dates={fechas}
				onOpenFilters={nada}
			/>
			<FilterBar
				type="date"
				extra={
					<>
						<Button hierarchy="secondary" size="sm">
							Hoy
						</Button>
						<Select
							size="sm"
							aria-label="Periodo"
							defaultValue="7"
							options={[
								{ value: "7", label: "Últimos 7 días" },
								{ value: "30", label: "Últimos 30 días" },
							]}
						/>
					</>
				}
				dates={fechas}
				onOpenFilters={nada}
			/>
			<FilterBar
				type="dropdowns"
				fields={[
					{
						label: "Buscar un pedido",
						control: (
							<Input
								size="sm"
								icon="search-lg"
								aria-label="Buscar un pedido"
								placeholder="Buscar"
							/>
						),
					},
					{
						label: "Estado",
						control: (
							<Select
								size="sm"
								aria-label="Estado"
								defaultValue="pagado"
								options={[
									{ value: "pagado", label: "Pagado" },
									{ value: "pendiente", label: "Pendiente" },
								]}
							/>
						),
					},
					{
						label: "Categoría",
						control: (
							<Select
								size="sm"
								aria-label="Categoría"
								defaultValue="todo"
								options={[
									{ value: "todo", label: "Ver todo" },
									{ value: "hogar", label: "Hogar" },
								]}
							/>
						),
					},
				]}
				onClear={nada}
			/>
			<FilterBar
				type="dropdowns-date"
				fields={[
					{
						label: "Ordenar por",
						control: (
							<Select
								size="sm"
								aria-label="Ordenar por"
								defaultValue="desc"
								options={[
									{ value: "desc", label: "Descendente" },
									{ value: "asc", label: "Ascendente" },
								]}
							/>
						),
					},
					{
						label: "Estado",
						control: (
							<Select
								size="sm"
								aria-label="Estado del equipo"
								defaultValue="2"
								options={[{ value: "2", label: "2 elegidos" }]}
							/>
						),
					},
				]}
				dates={fechas}
				onClear={nada}
				onOpenFilters={nada}
				onOpenSearch={nada}
			/>
			<Avanzada inicial={[]} />
			<Avanzada
				inicial={[
					{ field: "estado", operator: "es", value: "Activo" },
					{ field: "correo", operator: "contiene", value: "gmail" },
				]}
			/>
			<div className="flex flex-col gap-6" style={{ width: 375 }}>
				<FilterBar type="tabs-search" segments={vistas} defaultSegment="todo" onOpenFilters={nada} />
				<Avanzada inicial={[{ field: "estado", operator: "es", value: "Activo" }]} />
			</div>
		</div>
	);
}
