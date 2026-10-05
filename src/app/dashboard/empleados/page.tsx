"use client";

import { useEffect, useState } from "react";

type Empleado = {
  id_empleado: number;
  documento: string;
  nombres: string;
  apellidos: string;
  correo: string | null;
  telefono: string | null;
  fecha_ingreso: string;
  estado: string;
};

export default function EmpleadosPage() {
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [empleadoEditando, setEmpleadoEditando] = useState<Empleado | null>(
    null,
  );
  const [guardando, setGuardando] = useState(false);
  const [mensajeFormulario, setMensajeFormulario] = useState("");
  const [errorFormulario, setErrorFormulario] = useState("");

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

  function editarEmpleado(empleado: Empleado) {
    setEmpleadoEditando(empleado);
    setMostrarFormulario(true);
    setMensajeFormulario("");
    setErrorFormulario("");
  }
  function nuevoEmpleado() {
    setEmpleadoEditando(null);
    setMostrarFormulario(true);
    setMensajeFormulario("");
    setErrorFormulario("");
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

  async function guardarEmpleado(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setGuardando(true);
    setMensajeFormulario("");
    setErrorFormulario("");

    const formulario = event.currentTarget;
    const datosFormulario = new FormData(formulario);

    const datosEmpleado = {
      nombres: datosFormulario.get("nombres"),
      apellidos: datosFormulario.get("apellidos"),
      documento: datosFormulario.get("documento"),
      correo: datosFormulario.get("correo"),
      telefono: datosFormulario.get("telefono"),
      fecha_ingreso: datosFormulario.get("fecha_ingreso"),
      estado: datosFormulario.get("estado"),
    };

    try {
      const respuesta = await fetch(
        empleadoEditando
          ? `/api/empleados/${empleadoEditando.id_empleado}`
          : "/api/empleados",
        {
          method: empleadoEditando ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(datosEmpleado),
        },
      );

      const datos = await respuesta.json();

      if (!respuesta.ok || !datos.ok) {
        throw new Error(datos.mensaje || "No fue posible crear el empleado.");
      }

      if (empleadoEditando) {
        setEmpleados((empleadosActuales) =>
          empleadosActuales.map((empleado) =>
            empleado.id_empleado === datos.empleado.id_empleado
              ? datos.empleado
              : empleado,
          ),
        );

        setMensajeFormulario("Empleado actualizado correctamente.");
      } else {
        setEmpleados((empleadosActuales) => [
          ...empleadosActuales,
          datos.empleado,
        ]);

        setMensajeFormulario("Empleado creado correctamente.");
      }

      formulario.reset();

      setEmpleadoEditando(null);

      setTimeout(() => {
        setMostrarFormulario(false);
        setMensajeFormulario("");
      }, 1200);
    } catch (error) {
      console.error(error);

      setErrorFormulario(
        error instanceof Error
          ? error.message
          : "No fue posible crear el empleado.",
      );
    } finally {
      setGuardando(false);
    }
  }

  return (
    <div>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Empleados</h1>

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

      {mostrarFormulario && (
        <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-slate-900">
              {empleadoEditando ? "Editar empleado" : "Nuevo empleado"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {empleadoEditando
                ? "Actualiza la información del empleado."
                : "Registra la información básica del empleado."}
            </p>
            {mensajeFormulario && (
              <p className="mt-4 text-sm font-medium text-green-600">
                {mensajeFormulario}
              </p>
            )}

            {errorFormulario && (
              <p className="mt-4 text-sm font-medium text-red-600">
                {errorFormulario}
              </p>
            )}
          </div>

          <form
            key={empleadoEditando?.id_empleado ?? "nuevo"}
            onSubmit={guardarEmpleado}
            className="space-y-6"
          >
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label
                  htmlFor="nombres"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Nombres *
                </label>

                <input
                  id="nombres"
                  name="nombres"
                  type="text"
                  defaultValue={empleadoEditando?.nombres ?? ""}
                  placeholder="Ej. Juan Carlos"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label
                  htmlFor="apellidos"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Apellidos *
                </label>

                <input
                  id="apellidos"
                  name="apellidos"
                  type="text"
                  defaultValue={empleadoEditando?.apellidos ?? ""}
                  placeholder="Ej. Pérez Gómez"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label
                  htmlFor="documento"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Documento *
                </label>

                <input
                  id="documento"
                  name="documento"
                  type="text"
                  defaultValue={empleadoEditando?.documento ?? ""}
                  placeholder="Ej. 1234567890"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label
                  htmlFor="correo"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Correo
                </label>

                <input
                  id="correo"
                  name="correo"
                  type="email"
                  defaultValue={empleadoEditando?.correo ?? ""}
                  placeholder="Ej. empleado@empresa.com"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label
                  htmlFor="telefono"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Teléfono
                </label>

                <input
                  id="telefono"
                  name="telefono"
                  type="tel"
                  defaultValue={empleadoEditando?.telefono ?? ""}
                  placeholder="Ej. 3001234567"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label
                  htmlFor="fecha_ingreso"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Fecha de ingreso *
                </label>

                <input
                  id="fecha_ingreso"
                  name="fecha_ingreso"
                  type="date"
                  defaultValue={
                    empleadoEditando?.fecha_ingreso
                      ? empleadoEditando.fecha_ingreso.slice(0, 10)
                      : ""
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label
                  htmlFor="estado"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Estado *
                </label>

                <select
                  id="estado"
                  name="estado"
                  defaultValue={empleadoEditando?.estado ?? "ACTIVO"}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="ACTIVO">Activo</option>
                  <option value="INACTIVO">Inactivo</option>
                  <option value="SUSPENDIDO">Suspendido</option>
                  <option value="RETIRADO">Retirado</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-slate-200 pt-6">
              <button
                type="button"
                onClick={() => {
                  setEmpleadoEditando(null);
                  setMostrarFormulario(false);
                  setMensajeFormulario("");
                  setErrorFormulario("");
                }}
                className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Cancelar
              </button>

              <button
                type="submit"
                disabled={guardando}
                className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {guardando
                  ? empleadoEditando
                    ? "Actualizando..."
                    : "Guardando..."
                  : empleadoEditando
                    ? "Actualizar empleado"
                    : "Guardar empleado"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
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
        {cargando && (
          <p className="text-sm text-slate-500">Cargando empleados...</p>
        )}
        {!cargando && error && <p className="text-sm text-red-600">{error}</p>}
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
                        className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
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
      </div>
    </div>
  );
}
