"use client";

import { useState } from "react";

export type Empleado = {
  id_empleado: number;
  documento: string;
  nombres: string;
  apellidos: string;
  correo: string | null;
  telefono: string | null;
  fecha_ingreso: string;
  estado: string;
};

type Props = {
  empleado: Empleado | null;
  onGuardado: (empleado: Empleado, editando: boolean) => void;
  onCancelar: () => void;
};

export default function EmpleadosForm({
  empleado,
  onGuardado,
  onCancelar,
}: Props) {
  const [guardando, setGuardando] = useState(false);
  const [mensajeFormulario, setMensajeFormulario] = useState("");
  const [errorFormulario, setErrorFormulario] = useState("");

  async function guardarEmpleado(
    event: React.FormEvent<HTMLFormElement>,
  ) {
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

    const editando = empleado !== null;

    try {
      const respuesta = await fetch(
        editando
          ? `/api/empleados/${empleado.id_empleado}`
          : "/api/empleados",
        {
          method: editando ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(datosEmpleado),
        },
      );

      const datos = await respuesta.json();

      if (!respuesta.ok || !datos.ok) {
        throw new Error(
          datos.mensaje || "No fue posible guardar el empleado.",
        );
      }

      setMensajeFormulario(
        editando
          ? "Empleado actualizado correctamente."
          : "Empleado creado correctamente.",
      );

      onGuardado(datos.empleado, editando);

      formulario.reset();

      setTimeout(() => {
        setMensajeFormulario("");
      }, 1200);
    } catch (error) {
      console.error(error);

      setErrorFormulario(
        error instanceof Error
          ? error.message
          : "No fue posible guardar el empleado.",
      );
    } finally {
      setGuardando(false);
    }
  }

  return (
    <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-slate-900">
          {empleado ? "Editar empleado" : "Nuevo empleado"}
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          {empleado
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
        key={empleado?.id_empleado ?? "nuevo"}
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
              defaultValue={empleado?.nombres ?? ""}
              placeholder="Ej. Juan Carlos"
              required
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
              defaultValue={empleado?.apellidos ?? ""}
              placeholder="Ej. Pérez Gómez"
              required
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
              defaultValue={empleado?.documento ?? ""}
              placeholder="Ej. 1234567890"
              required
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
              defaultValue={empleado?.correo ?? ""}
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
              defaultValue={empleado?.telefono ?? ""}
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
                empleado?.fecha_ingreso
                  ? empleado.fecha_ingreso.slice(0, 10)
                  : ""
              }
              required
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
              defaultValue={empleado?.estado ?? "ACTIVO"}
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
            onClick={onCancelar}
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
              ? empleado
                ? "Actualizando..."
                : "Guardando..."
              : empleado
                ? "Actualizar empleado"
                : "Guardar empleado"}
          </button>
        </div>
      </form>
    </div>
  );
}