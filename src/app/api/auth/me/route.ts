import { NextResponse } from "next/server";
import { obtenerUsuarioActual } from "@/lib/auth/auth";

export async function GET() {
  const usuario = await obtenerUsuarioActual();

  if (!usuario) {
    return NextResponse.json(
      {
        ok: false,
        mensaje: "No hay una sesión activa",
      },
      { status: 401 }
    );
  }

  return NextResponse.json({
    ok: true,
    usuario,
  });
}