"use client";

import { useEffect, useState } from "react";

type DashboardData = {
  empresa: {
    id_empresa: number;
    nit: string;
    nombre_empresa: string;
    correo_contacto: string | null;
    telefono: string | null;
    direccion: string | null;
    estado: string;
  };
  plan: {
    id_plan: number;
    nombre_plan: string;
    maximo_empleados: number;
    valor_mensual: string;
  };
  suscripcion: {
    id_suscripcion: number;
    estado: string;
    fecha_inicio: string;
    fecha_fin_prueba: string | null;
    fecha_fin_suscripcion: string | null;
    fecha_proxima_renovacion: string | null;
  } | null;
  empleados: {
    cantidad: number;
    maximo: number;
  };
};

export default function DashboardContent() {
  const [datos, setDatos] = useState<DashboardData | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function cargarDashboard() {
      try {
        const respuesta = await fetch("/api/dashboard/resumen");

        const resultado = await respuesta.json();

        if (!respuesta.ok || !resultado.ok) {
          setError(resultado.mensaje || "No fue posible cargar el dashboard.");
          return;
        }

        setDatos(resultado);
      } catch {
        setError("Ocurrió un error al cargar el dashboard.");
      } finally {
        setCargando(false);
      }
    }

    cargarDashboard();
  }, []);

  if (cargando) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-gray-500">Cargando dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
        {error}
      </div>
    );
  }

  if (!datos) {
    return null;
  }

  return (
    <div>
      <div>
        <p className="text-sm font-medium text-gray-500">
          Panel de administración
        </p>

        <h1 className="mt-1 text-3xl font-bold tracking-tight text-gray-900">
          Dashboard SITR
        </h1>

        <p className="mt-2 text-gray-600">
          Gestiona la operación de{" "}
          <span className="font-semibold text-gray-900">
            {datos.empresa.nombre_empresa}
          </span>
          .
        </p>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md">
          <p className="text-sm font-medium text-gray-500">Plan actual</p>

          <h2 className="mt-3 text-2xl font-bold text-gray-900">
            {datos.plan.nombre_plan}
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Hasta {datos.plan.maximo_empleados} empleados
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md">
          <p className="text-sm font-medium text-gray-500">Empleados</p>

          <h2 className="mt-3 text-2xl font-bold text-gray-900">
            {datos.empleados.cantidad}
            <span className="text-base font-normal text-gray-500">
              {" "}
              / {datos.empleados.maximo}
            </span>
          </h2>

          <p className="mt-2 text-sm text-gray-500"> Empleados que ocupan cupo </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md">
          <p className="text-sm font-medium text-gray-500">
            Estado de suscripción
          </p>

          <h2 className="mt-3 text-2xl font-bold text-gray-900">
            {datos.suscripcion?.estado ?? "Sin suscripción"}
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            {datos.suscripcion?.fecha_fin_prueba
              ? `Prueba hasta ${datos.suscripcion.fecha_fin_prueba.slice(0, 10).split("-").reverse().join("/")}`
              : "Sin fecha de finalización"}
          </p>
        </div>
      </div>
    </div>
  );
}
