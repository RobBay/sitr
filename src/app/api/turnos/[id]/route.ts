import { NextResponse } from "next/server";
import { obtenerUsuarioActual } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma";

function convertirHora(hora: string): Date {
  const [horas, minutos] = hora.split(":").map(Number);

  if (
    Number.isNaN(horas) ||
    Number.isNaN(minutos) ||
    horas < 0 ||
    horas > 23 ||
    minutos < 0 ||
    minutos > 59
  ) {
    throw new Error("La hora debe tener un formato válido HH:mm.");
  }

  const fecha = new Date(1970, 0, 1);
  fecha.setHours(horas, minutos, 0, 0);

  return fecha;
}

function calcularHorasTurno(horaInicio: string, horaFin: string) {
  const [inicioHoras, inicioMinutos] = horaInicio.split(":").map(Number);
  const [finHoras, finMinutos] = horaFin.split(":").map(Number);

  const inicio = inicioHoras * 60 + inicioMinutos;
  const fin = finHoras * 60 + finMinutos;

  if (inicio === fin) {
    throw new Error(
      "La hora de inicio y la hora de fin no pueden ser iguales."
    );
  }

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

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function PUT(
  request: Request,
  context: RouteContext
) {
  try {
    const usuario = await obtenerUsuarioActual();

    if (!usuario) {
      return NextResponse.json(
        {
          ok: false,
          mensaje: "No autenticado.",
        },
        { status: 401 }
      );
    }

    const { id } = await context.params;
    const idTurno = Number(id);

    if (!Number.isInteger(idTurno) || idTurno <= 0) {
      return NextResponse.json(
        {
          ok: false,
          mensaje: "El identificador del turno no es válido.",
        },
        { status: 400 }
      );
    }

    const turnoExistente = await prisma.turno.findFirst({
      where: {
        id_turno: idTurno,
        id_empresa: usuario.id_empresa,
      },
      select: {
        id_turno: true,
      },
    });

    if (!turnoExistente) {
      return NextResponse.json(
        {
          ok: false,
          mensaje: "No se encontró el turno.",
        },
        { status: 404 }
      );
    }

    const body = await request.json();

    const nombreTurno = String(body.nombre_turno ?? "").trim();
    const horaInicio = String(body.hora_inicio ?? "").trim();
    const horaFin = String(body.hora_fin ?? "").trim();

    const colorCalendario =
      body.color_calendario === null ||
      body.color_calendario === undefined ||
      String(body.color_calendario).trim() === ""
        ? null
        : String(body.color_calendario).trim();

    const estado = String(body.estado ?? "ACTIVO")
      .trim()
      .toUpperCase();

    if (!nombreTurno || !horaInicio || !horaFin) {
      return NextResponse.json(
        {
          ok: false,
          mensaje:
            "El nombre del turno, la hora de inicio y la hora de fin son obligatorios.",
        },
        { status: 400 }
      );
    }

    if (nombreTurno.length > 50) {
      return NextResponse.json(
        {
          ok: false,
          mensaje:
            "El nombre del turno no puede superar los 50 caracteres.",
        },
        { status: 400 }
      );
    }

    if (colorCalendario && colorCalendario.length > 20) {
      return NextResponse.json(
        {
          ok: false,
          mensaje:
            "El color del calendario no puede superar los 20 caracteres.",
        },
        { status: 400 }
      );
    }

    if (!["ACTIVO", "INACTIVO"].includes(estado)) {
      return NextResponse.json(
        {
          ok: false,
          mensaje: "El estado del turno no es válido.",
        },
        { status: 400 }
      );
    }

    const turnoDuplicado = await prisma.turno.findFirst({
      where: {
        id_empresa: usuario.id_empresa,
        nombre_turno: nombreTurno,
        id_turno: {
          not: idTurno,
        },
      },
      select: {
        id_turno: true,
      },
    });

    if (turnoDuplicado) {
      return NextResponse.json(
        {
          ok: false,
          mensaje: "Ya existe otro turno con ese nombre en tu empresa.",
        },
        { status: 409 }
      );
    }

    const resultadoHoras = calcularHorasTurno(
      horaInicio,
      horaFin
    );

    const fechaHoraInicio = convertirHora(horaInicio);
    const fechaHoraFin = convertirHora(horaFin);

    const turno = await prisma.turno.update({
      where: {
        id_turno: idTurno,
      },
      data: {
        nombre_turno: nombreTurno,
        hora_inicio: fechaHoraInicio,
        hora_fin: fechaHoraFin,
        cruza_medianoche: resultadoHoras.cruzaMedianoche,
        horas_turno: resultadoHoras.horas,
        color_calendario: colorCalendario,
        estado,
      },
      select: {
        id_turno: true,
        nombre_turno: true,
        hora_inicio: true,
        hora_fin: true,
        cruza_medianoche: true,
        horas_turno: true,
        color_calendario: true,
        estado: true,
      },
    });

    return NextResponse.json({
      ok: true,
      mensaje: "Turno actualizado correctamente.",
      turno,
    });
  } catch (error) {
    console.error("Error al actualizar turno:", error);

    const mensaje =
      error instanceof Error
        ? error.message
        : "No fue posible actualizar el turno.";

    return NextResponse.json(
      {
        ok: false,
        mensaje,
      },
      { status: 500 }
    );
  }
}
