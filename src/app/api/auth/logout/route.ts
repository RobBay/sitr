import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("sitr_session")?.value;

    if (token) {
      await prisma.sesion.deleteMany({
        where: {
          token,
        },
      });
    }

    cookieStore.delete("sitr_session");

    return NextResponse.json({
      ok: true,
      mensaje: "Sesión cerrada correctamente",
    });
  } catch (error) {
    console.error("Error en logout:", error);

    return NextResponse.json(
      {
        ok: false,
        mensaje: "Ocurrió un error al cerrar sesión",
      },
      { status: 500 }
    );
  }
}