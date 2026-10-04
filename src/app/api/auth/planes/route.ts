import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const planes = await prisma.plan_suscripcion.findMany({
      where: {
        estado: "ACTIVO",
      },
      select: {
        id_plan: true,
        nombre_plan: true,
        maximo_empleados: true,
        valor_mensual: true,
      },
      orderBy: {
        id_plan: "asc",
      },
    });

    return NextResponse.json({
      ok: true,
      planes,
    });
  } catch (error) {
    console.error("Error al consultar planes:", error);

    return NextResponse.json(
      {
        ok: false,
        mensaje: "No fue posible consultar los planes",
      },
      { status: 500 }
    );
  }
}