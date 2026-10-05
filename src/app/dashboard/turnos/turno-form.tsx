"use client";

import { useState } from "react";

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

type TurnoFormProps = {
  turnoInicial?: Turno | null;
  onGuardado: (turno: Turno) => void;
  onCancelar: () => void;
};

function obtenerHora(hora: string) {
  if (!hora) {
    return "";
  }

  const fecha = new Date(hora);

  return fecha.toLocaleTimeString("es-CO", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function calcularDuracion(horaInicio: string, horaFin: string) {
  if (!horaInicio || !horaFin || horaInicio === horaFin) {
    return {
      horas: null,
      cruzaMedianoche: false,
    };
  }

  const [inicioHoras, inicioMinutos] = horaInicio.split(":").map(Number);
  const [finHoras, finMinutos] = horaFin.split(":").map(Number);

  const inicio = inicioHoras * 60 + inicioMinutos;
  const fin = finHoras * 60 + finMinutos;

  let minutos = fin - inicio;

  const cruzaMedianoche = minutos < 0;

  if (cruzaMedianoche) {
    minutos += 24 * 60;
  }

  return {
    horas: Number((minutos / 60).toFixed(2)),
    cruzaMedianoche,
  };
}

export default function TurnoForm({
  turnoInicial,
  onGuardado,
  onCancelar,
}: TurnoFormProps) {
  const modoEdicion = Boolean(turnoInicial);

  const [nombreTurno, setNombreTurno] = useState(
    turnoInicial?.nombre_turno ?? ""
  );

  const [horaInicio, setHoraInicio] = useState(
    turnoInicial ? obtenerHora(turnoInicial.hora_inicio) : ""
  );

  const [horaFin, setHoraFin] = useState(
    turnoInicial ? obtenerHora(turnoInicial.hora_fin) : ""
  );

  const [colorCalendario, setColorCalendario] = useState(
    turnoInicial?.color_calendario ?? "#2196F3"
  );

  const [estado, setEstado] = useState(
    turnoInicial?.estado ?? "ACTIVO"
  );

 

  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  const { horas, cruzaMedianoche } = calcularDuracion(
    horaInicio,
    horaFin
  );

  async function guardarTurno(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setError("");

    if (!nombreTurno.trim()) {
      setError("Ingresa el nombre del turno.");
      return;
    }

    if (!horaInicio || !horaFin) {
      setError("Selecciona la hora de inicio y la hora de fin.");
      return;
    }

    if (horaInicio === horaFin) {
      setError(
        "La hora de inicio y la hora de fin no pueden ser iguales."
      );
      return;
    }

    try {
      setGuardando(true);

      const url = modoEdicion
        ? `/api/turnos/${turnoInicial?.id_turno}`
        : "/api/turnos";

      const respuesta = await fetch(url, {
        method: modoEdicion ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre_turno: nombreTurno.trim(),
          hora_inicio: horaInicio,
          hora_fin: horaFin,
          color_calendario: colorCalendario,
          estado,
        }),
      });

      const datos = await respuesta.json();

      if (!respuesta.ok || !datos.ok) {
        throw new Error(
          datos.mensaje ||
            (modoEdicion
              ? "No fue posible actualizar el turno."
              : "No fue posible crear el turno.")
        );
      }

      onGuardado(datos.turno);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : modoEdicion
            ? "No fue posible actualizar el turno."
            : "No fue posible crear el turno."
      );
    } finally {
      setGuardando(false);
    }
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-slate-900">
          {modoEdicion ? "Editar turno" : "Crear turno"}
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          {modoEdicion
            ? "Modifica la configuración del turno."
            : "Define el horario que podrá ser utilizado posteriormente por máquinas o equipos de la empresa."}
        </p>
      </div>

      <form onSubmit={guardarTurno} className="space-y-5">
        <div>
          <label
            htmlFor="nombre_turno"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            Nombre del turno
          </label>

          <input
            id="nombre_turno"
            type="text"
            value={nombreTurno}
            onChange={(event) => setNombreTurno(event.target.value)}
            placeholder="Ej. Turno Mañana"
            maxLength={50}
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label
              htmlFor="hora_inicio"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Hora de inicio
            </label>

            <input
              id="hora_inicio"
              type="time"
              value={horaInicio}
              onChange={(event) => setHoraInicio(event.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label
              htmlFor="hora_fin"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Hora de fin
            </label>

            <input
              id="hora_fin"
              type="time"
              value={horaFin}
              onChange={(event) => setHoraFin(event.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

        {horas !== null && (
          <div className="rounded-lg border border-blue-100 bg-blue-50 p-4">
            <p className="text-sm font-medium text-blue-900">
              Duración calculada: {horas} horas
            </p>

            {cruzaMedianoche && (
              <p className="mt-1 text-xs text-blue-700">
                Este turno cruza la medianoche.
              </p>
            )}
          </div>
        )}

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label
              htmlFor="color_calendario"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Color del calendario
            </label>

            <div className="flex items-center gap-3">
              <input
                id="color_calendario"
                type="color"
                value={colorCalendario}
                onChange={(event) =>
                  setColorCalendario(event.target.value)
                }
                className="h-10 w-14 cursor-pointer rounded-lg border border-slate-300 bg-white p-1"
              />

              <span className="text-sm text-slate-600">
                {colorCalendario}
              </span>
            </div>
          </div>

          <div>
            <label
              htmlFor="estado"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Estado
            </label>

            <select
              id="estado"
              value={estado}
              onChange={(event) => setEstado(event.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="ACTIVO">ACTIVO</option>
              <option value="INACTIVO">INACTIVO</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
          <button
            type="button"
            onClick={onCancelar}
            disabled={guardando}
            className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancelar
          </button>

          <button
            type="submit"
            disabled={guardando}
            className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {guardando
              ? "Guardando..."
              : modoEdicion
                ? "Guardar cambios"
                : "Crear turno"}
          </button>
        </div>
      </form>
    </div>
  );
}