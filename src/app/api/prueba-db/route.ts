import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const usuarios = await prisma.usuario.findMany({
      select: {
        id_usuario: true,
        nombre_usuario: true,
        correo: true,
        rol: true,
      },
    });

    return NextResponse.json({
      ok: true,
      cantidad: usuarios.length,
      usuarios,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        ok: false,
        mensaje: "No fue posible consultar la base de datos",
      },
      { status: 500 }
    );
  }
}