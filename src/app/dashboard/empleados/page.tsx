"use client";

import { useEffect, useState } from "react";
import EmpleadosForm, { type Empleado } from "./empleados-form";

export default function EmpleadosPage() {
const [empleados, setEmpleados] = useState<Empleado[]>([]);
const [cargando, setCargando] = useState(true);
const [error, setError] = useState("");
const [busqueda, setBusqueda] = useState("");

const [mostrarFormulario, setMostrarFormulario] = useState(false);
const [empleadoEditando, setEmpleadoEditando] =
useState<Empleado | null>(null);

useEffect(() => {
async function cargarEmpleados() {
try {
const respuesta = await fetch("/api/empleados");


    if (!respuesta.ok) {
      throw new Error("No fue posible consultar los empleados.");
    }

    const datos = await respuesta.json();

    if (!datos.ok) {
      throw new Error(
        datos.mensaje || "No fue posible consultar los empleados.",
      );
    }

    setEmpleados(datos.empleados);
  } catch (error) {
    console.error(error);
    setError("No fue posible cargar los empleados.");
  } finally {
    setCargando(false);
  }
}

cargarEmpleados();


}, []);

function nuevoEmpleado() {
setEmpleadoEditando(null);
setMostrarFormulario(true);
}

function editarEmpleado(empleado: Empleado) {
setEmpleadoEditando(empleado);
setMostrarFormulario(true);
}

function cerrarFormulario() {
setEmpleadoEditando(null);
setMostrarFormulario(false);
}

function manejarEmpleadoGuardado(
empleadoGuardado: Empleado,
editando: boolean,
) {
if (editando) {
setEmpleados((empleadosActuales) =>
empleadosActuales.map((empleado) =>
empleado.id_empleado === empleadoGuardado.id_empleado
? empleadoGuardado
: empleado,
),
);
} else {
setEmpleados((empleadosActuales) => [
...empleadosActuales,
empleadoGuardado,
]);
}


setTimeout(() => {
  cerrarFormulario();
}, 1200);


}

const empleadosFiltrados = empleados.filter((empleado) => {
const termino = busqueda.toLowerCase().trim();


if (!termino) {
  return true;
}

const nombreCompleto =
  `${empleado.nombres} ${empleado.apellidos}`.toLowerCase();

return (
  nombreCompleto.includes(termino) ||
  empleado.documento.toLowerCase().includes(termino)
);


});

return ( <div>
{/* Encabezado */} <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"> <div> <h1 className="text-2xl font-bold text-slate-900">
Empleados </h1>

```
      <p className="mt-1 text-sm text-slate-500">
        Gestiona los empleados de tu empresa.
      </p>
    </div>

    <button
      type="button"
      onClick={nuevoEmpleado}
      className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700"
    >
      + Nuevo empleado
    </button>
  </div>

  {/* Formulario */}
  {mostrarFormulario && (
    <EmpleadosForm
      empleado={empleadoEditando}
      onGuardado={manejarEmpleadoGuardado}
      onCancelar={cerrarFormulario}
    />
  )}

  {/* Lista de empleados */}
  <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
    {/* Buscador */}
    <div className="mb-6">
      <label
        htmlFor="buscar-empleado"
        className="mb-2 block text-sm font-medium text-slate-700"
      >
        Buscar empleado
      </label>

      <input
        id="buscar-empleado"
        type="text"
        value={busqueda}
        onChange={(event) => setBusqueda(event.target.value)}
        placeholder="Nombre, apellido o documento..."
        className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />
    </div>

    {/* Cargando */}
    {cargando && (
      <p className="text-sm text-slate-500">
        Cargando empleados...
      </p>
    )}

    {/* Error */}
    {!cargando && error && (
      <p className="text-sm text-red-600">
        {error}
      </p>
    )}

    {/* Sin empleados */}
    {!cargando &&
      !error &&
      empleados.length === 0 &&
      !mostrarFormulario && (
        <div className="py-12 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-2xl">
            👥
          </div>

          <h2 className="mt-4 text-lg font-semibold text-slate-900">
            No hay empleados registrados
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
            Agrega el primer empleado de tu empresa para comenzar a
            gestionar sus turnos y asignaciones.
          </p>
        </div>
      )}

    {/* Tabla */}
    {!cargando && !error && empleados.length > 0 && (
      <div className="overflow-x-auto">
        <table className="w-full min-w-200 text-left">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Empleado
              </th>

              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Documento
              </th>

              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Correo
              </th>

              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Teléfono
              </th>

              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Ingreso
              </th>

              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Estado
              </th>

              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Acciones
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {empleadosFiltrados.map((empleado) => (
              <tr
                key={empleado.id_empleado}
                className="transition hover:bg-slate-50"
              >
                <td className="px-4 py-4">
                  <div>
                    <p className="font-medium text-slate-900">
                      {empleado.nombres} {empleado.apellidos}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      ID: {empleado.id_empleado}
                    </p>
                  </div>
                </td>

                <td className="px-4 py-4 text-sm text-slate-700">
                  {empleado.documento}
                </td>

                <td className="px-4 py-4 text-sm text-slate-700">
                  {empleado.correo || "Sin correo"}
                </td>

                <td className="px-4 py-4 text-sm text-slate-700">
                  {empleado.telefono || "Sin teléfono"}
                </td>

                <td className="px-4 py-4 text-sm text-slate-700">
                  {empleado.fecha_ingreso
                    .slice(0, 10)
                    .split("-")
                    .reverse()
                    .join("/")}
                </td>

                <td className="px-4 py-4">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                      empleado.estado === "ACTIVO"
                        ? "bg-green-100 text-green-700"
                        : empleado.estado === "SUSPENDIDO"
                          ? "bg-yellow-100 text-yellow-700"
                          : empleado.estado === "INACTIVO"
                            ? "bg-slate-100 text-slate-600"
                            : "bg-red-100 text-red-700"
                    }`}
                  >
                    {empleado.estado === "ACTIVO"
                      ? "Activo"
                      : empleado.estado === "SUSPENDIDO"
                        ? "Suspendido"
                        : empleado.estado === "INACTIVO"
                          ? "Inactivo"
                          : "Retirado"}
                  </span>
                </td>

                <td className="px-4 py-4">
                  <button
                    type="button"
                    onClick={() => editarEmpleado(empleado)}
                    className="inline-flex items-center justify-center rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-medium text-blue-600 transition hover:border-blue-300 hover:bg-blue-100 hover:text-blue-700"
                  >
                    Editar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
    {/* Sin resultados de búsqueda */}
    {!cargando &&
      !error &&
      empleados.length > 0 &&
      empleadosFiltrados.length === 0 && (
        <div className="py-10 text-center">
          <p className="text-sm font-medium text-slate-700">
            No se encontraron empleados.
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Intenta con otro nombre, apellido o documento.
          </p>
        </div>
      )}
  </div>
</div>
);
}
