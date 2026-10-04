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

  useEffect(() => {
    async function cargarEmpleados() {
      try {
        const respuesta = await fetch("/api/empleados");

        if (!respuesta.ok) {
          throw new Error("No fue posible consultar los empleados.");
        }

        const datos = await respuesta.json();

        if (!datos.ok) {
          throw new Error(datos.mensaje || "No fue posible consultar los empleados.");
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

  return (
    <div>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Empleados
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Gestiona los empleados de tu empresa.
          </p>
        </div>

        <button
          type="button"
          className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700"
        >
          + Nuevo empleado
        </button>
      </div>

      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        {cargando && (
          <p className="text-sm text-slate-500">
            Cargando empleados...
          </p>
        )}

        {!cargando && error && (
          <p className="text-sm text-red-600">
            {error}
          </p>
        )}

        {!cargando && !error && empleados.length === 0 && (
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
          <div>
            Aquí mostraremos la tabla de empleados.
          </div>
        )}
      </div>
    </div>
  );
}