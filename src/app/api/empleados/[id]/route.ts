import { NextResponse } from "next/server";
import { obtenerUsuarioActual } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const usuario = await obtenerUsuarioActual();

    if (!usuario) {
      return NextResponse.json(
        {
          ok: false,
          mensaje: "No autenticado.",
        },
        { status: 401 },
      );
    }

    const { id } = await params;
    const idEmpleado = Number(id);

    if (!Number.isInteger(idEmpleado) || idEmpleado <= 0) {
      return NextResponse.json(
        {
          ok: false,
          mensaje: "El identificador del empleado no es válido.",
        },
        { status: 400 },
      );
    }

    const empleadoExistente = await prisma.empleado.findFirst({
      where: {
        id_empleado: idEmpleado,
        id_empresa: usuario.id_empresa,
      },
      select: {
        id_empleado: true,
      },
    });

    if (!empleadoExistente) {
      return NextResponse.json(
        {
          ok: false,
          mensaje: "Empleado no encontrado.",
        },
        { status: 404 },
      );
    }

    const body = await request.json();

    const documento = String(body.documento ?? "").trim();
    const nombres = String(body.nombres ?? "").trim();
    const apellidos = String(body.apellidos ?? "").trim();
    const correo = String(body.correo ?? "").trim().toLowerCase();
    const telefono = String(body.telefono ?? "").trim();
    const fechaIngreso = String(body.fecha_ingreso ?? "").trim();
    const estado = String(body.estado ?? "").trim().toUpperCase();

    if (!documento || !nombres || !apellidos || !fechaIngreso || !estado) {
      return NextResponse.json(
        {
          ok: false,
          mensaje: "Completa todos los campos obligatorios.",
        },
        { status: 400 },
      );
    }

    const estadosPermitidos = [
      "ACTIVO",
      "INACTIVO",
      "SUSPENDIDO",
      "RETIRADO",
    ];

    if (!estadosPermitidos.includes(estado)) {
      return NextResponse.json(
        {
          ok: false,
          mensaje: "El estado del empleado no es válido.",
        },
        { status: 400 },
      );
    }

    const fechaValida = /^\d{4}-\d{2}-\d{2}$/.test(fechaIngreso);

    if (!fechaValida) {
      return NextResponse.json(
        {
          ok: false,
          mensaje: "La fecha de ingreso no es válida.",
        },
        { status: 400 },
      );
    }

    const empleadoConDocumento = await prisma.empleado.findFirst({
      where: {
        id_empresa: usuario.id_empresa,
        documento,
        NOT: {
          id_empleado: idEmpleado,
        },
      },
      select: {
        id_empleado: true,
      },
    });

    if (empleadoConDocumento) {
      return NextResponse.json(
        {
          ok: false,
          mensaje: "Ya existe otro empleado con ese documento en esta empresa.",
        },
        { status: 409 },
      );
    }

    if (estado === "ACTIVO" || estado === "SUSPENDIDO") {
      const empresa = await prisma.empresa.findUnique({
        where: {
          id_empresa: usuario.id_empresa,
        },
        select: {
          plan_suscripcion: {
            select: {
              maximo_empleados: true,
            },
          },
        },
      });

      if (!empresa?.plan_suscripcion) {
        return NextResponse.json(
          {
            ok: false,
            mensaje:
              "No fue posible determinar el límite de empleados de la empresa.",
          },
          { status: 500 },
        );
      }

      const empleadoActual = await prisma.empleado.findUnique({
        where: {
          id_empleado: idEmpleado,
        },
        select: {
          estado: true,
        },
      });

      const yaCuentaEnLimite =
        empleadoActual?.estado === "ACTIVO" ||
        empleadoActual?.estado === "SUSPENDIDO";

      if (!yaCuentaEnLimite) {
        const empleadosActivos = await prisma.empleado.count({
          where: {
            id_empresa: usuario.id_empresa,
            estado: {
              in: ["ACTIVO", "SUSPENDIDO"],
            },
          },
        });

        if (
          empleadosActivos >= empresa.plan_suscripcion.maximo_empleados
        ) {
          return NextResponse.json(
            {
              ok: false,
              mensaje: `Has alcanzado el límite de ${empresa.plan_suscripcion.maximo_empleados} empleados de tu plan.`,
            },
            { status: 409 },
          );
        }
      }
    }

    const [year, month, day] = fechaIngreso.split("-").map(Number);

    const fechaIngresoDate = new Date(year, month - 1, day);

    const empleado = await prisma.empleado.update({
      where: {
        id_empleado: idEmpleado,
      },
      data: {
        documento,
        nombres,
        apellidos,
        correo: correo || null,
        telefono: telefono || null,
        fecha_ingreso: fechaIngresoDate,
        estado,
      },
      select: {
        id_empleado: true,
        documento: true,
        nombres: true,
        apellidos: true,
        correo: true,
        telefono: true,
        fecha_ingreso: true,
        estado: true,
      },
    });

    return NextResponse.json({
      ok: true,
      mensaje: "Empleado actualizado correctamente.",
      empleado,
    });
  } catch (error) {
    console.error("Error al actualizar empleado:", error);

    return NextResponse.json(
      {
        ok: false,
        mensaje: "No fue posible actualizar el empleado.",
      },
      { status: 500 },
    );
  }
}