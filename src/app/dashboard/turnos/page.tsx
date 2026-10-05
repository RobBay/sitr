"use client";

import { useEffect, useState } from "react";
import { Clock3, Plus } from "lucide-react";
import TurnoForm from "./turno-form";

type Turno = {
  id_turno: number;
  nombre_turno: string;
  hora_inicio: string;
  hora_fin: string;
  cruza_medianoche: boolean;
  horas_turno: string;
  color_calendario: string | null;
  estado: string;
};

function formatearHora(hora: string) {
  const fecha = new Date(hora);

  return fecha.toLocaleTimeString("es-CO", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export default function TurnosPage() {
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [turnoEditando, setTurnoEditando] = useState<Turno | null>(null);

  useEffect(() => {
    async function cargarTurnos() {
      try {
        const respuesta = await fetch("/api/turnos");
        const datos = await respuesta.json();

        if (!respuesta.ok || !datos.ok) {
          throw new Error(datos.mensaje || "No fue posible cargar los turnos.");
        }

        setTurnos(datos.turnos);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "No fue posible cargar los turnos.",
        );
      } finally {
        setCargando(false);
      }
    }

    cargarTurnos();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Clock3 className="h-7 w-7 text-blue-600" />

            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Turnos
            </h1>
          </div>

          <p className="mt-1 text-sm text-slate-500">
            Gestiona los turnos disponibles para tu empresa.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setTurnoEditando(null);
            setMostrarFormulario(true);
          }}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Crear turno
        </button>
      </div>

      {mostrarFormulario && (
        <TurnoForm
          key={turnoEditando?.id_turno ?? "nuevo"}
          turnoInicial={turnoEditando}
          onGuardado={(turno) => {
            if (turnoEditando) {
              setTurnos((turnosActuales) =>
                turnosActuales.map((turnoActual) =>
                  turnoActual.id_turno === turno.id_turno ? turno : turnoActual,
                ),
              );
            } else {
              setTurnos((turnosActuales) =>
                [...turnosActuales, turno].sort((a, b) =>
                  a.nombre_turno.localeCompare(b.nombre_turno),
                ),
              );
            }

            setTurnoEditando(null);
            setMostrarFormulario(false);
          }}
          onCancelar={() => {
            setTurnoEditando(null);
            setMostrarFormulario(false);
          }}
        />
      )}

      {cargando && (
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="text-sm text-slate-500">Cargando turnos...</p>
        </div>
      )}

      {!cargando && error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {!cargando && !error && (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          {turnos.length === 0 ? (
            <div className="p-10 text-center">
              <Clock3 className="mx-auto h-10 w-10 text-slate-300" />

              <h2 className="mt-3 text-base font-semibold text-slate-900">
                No hay turnos registrados
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Crea el primer turno para comenzar a configurar la operación.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-190 text-sm">
                <thead className="border-b border-slate-200 bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold text-slate-700">
                      Turno
                    </th>

                    <th className="px-6 py-4 text-left font-semibold text-slate-700">
                      Horario
                    </th>

                    <th className="px-6 py-4 text-left font-semibold text-slate-700">
                      Duración
                    </th>

                    <th className="px-6 py-4 text-left font-semibold text-slate-700">
                      Estado
                    </th>

                    <th className="px-6 py-4 text-right font-semibold text-slate-700">
                      Acciones
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {turnos.map((turno) => (
                    <tr
                      key={turno.id_turno}
                      className="transition hover:bg-slate-50"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span
                            className="h-3 w-3 rounded-full"
                            style={{
                              backgroundColor:
                                turno.color_calendario || "#64748b",
                            }}
                          />

                          <div>
                            <p className="font-medium text-slate-900">
                              {turno.nombre_turno}
                            </p>

                            {turno.cruza_medianoche && (
                              <p className="mt-0.5 text-xs text-slate-500">
                                Cruza medianoche
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 font-medium text-slate-700">
                        {formatearHora(turno.hora_inicio)} -{" "}
                        {formatearHora(turno.hora_fin)}
                      </td>

                      <td className="px-6 py-4 text-slate-600">
                        {turno.horas_turno} horas
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                            turno.estado === "ACTIVO"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {turno.estado}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            title="Editar turno"
                            onClick={() => {
                              setTurnoEditando(turno);
                              setMostrarFormulario(true);
                            }}
                            className="inline-flex items-center justify-center rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-medium text-blue-600 transition hover:border-blue-300 hover:bg-blue-100 hover:text-blue-700"
                          >
                            Editar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
