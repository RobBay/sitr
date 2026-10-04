import { NextResponse } from "next/server";
import { obtenerUsuarioActual } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
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

    const empleados = await prisma.empleado.findMany({
      where: {
        id_empresa: usuario.id_empresa,
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
      orderBy: [
        {
          apellidos: "asc",
        },
        {
          nombres: "asc",
        },
      ],
    });

    return NextResponse.json({
      ok: true,
      empleados,
    });
  } catch (error) {
    console.error("Error al consultar empleados:", error);

    return NextResponse.json(
      {
        ok: false,
        mensaje: "No fue posible consultar los empleados.",
      },
      { status: 500 }
    );
  }
}