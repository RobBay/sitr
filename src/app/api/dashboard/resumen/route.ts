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

    const empresa = await prisma.empresa.findUnique({
      where: {
        id_empresa: usuario.id_empresa,
      },
      select: {
        id_empresa: true,
        nit: true,
        nombre_empresa: true,
        correo_contacto: true,
        telefono: true,
        direccion: true,
        estado: true,
        plan_suscripcion: {
          select: {
            id_plan: true,
            nombre_plan: true,
            maximo_empleados: true,
            valor_mensual: true,
          },
        },
        suscripcion: {
          orderBy: {
            id_suscripcion: "desc",
          },
          take: 1,
          select: {
            id_suscripcion: true,
            estado: true,
            fecha_inicio: true,
            fecha_fin_prueba: true,
            fecha_fin_suscripcion: true,
            fecha_proxima_renovacion: true,
          },
        },
        _count: {
          select: {
            empleado: true,
          },
        },
      },
    });

    if (!empresa) {
      return NextResponse.json(
        {
          ok: false,
          mensaje: "No se encontró la empresa.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ok: true,
      empresa: {
        id_empresa: empresa.id_empresa,
        nit: empresa.nit,
        nombre_empresa: empresa.nombre_empresa,
        correo_contacto: empresa.correo_contacto,
        telefono: empresa.telefono,
        direccion: empresa.direccion,
        estado: empresa.estado,
      },
      plan: empresa.plan_suscripcion,
      suscripcion: empresa.suscripcion[0] ?? null,
      empleados: {
        cantidad: empresa._count.empleado,
        maximo: empresa.plan_suscripcion.maximo_empleados,
      },
    });
  } catch (error) {
    console.error("Error al consultar resumen del dashboard:", error);

    return NextResponse.json(
      {
        ok: false,
        mensaje: "No fue posible consultar el resumen del dashboard.",
      },
      { status: 500 }
    );
  }
}