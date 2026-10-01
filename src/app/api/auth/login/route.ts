import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { autenticarUsuario, crearSesion } from "@/lib/auth/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const correo = body.correo?.trim();
    const contrasena = body.contrasena;

    if (!correo || !contrasena) {
      return NextResponse.json(
        {
          ok: false,
          mensaje: "Correo y contraseña son obligatorios",
        },
        { status: 400 }
      );
    }

    const usuario = await autenticarUsuario(correo, contrasena);

    if (!usuario) {
      return NextResponse.json(
        {
          ok: false,
          mensaje: "Correo o contraseña incorrectos",
        },
        { status: 401 }
      );
    }

    const sesion = await crearSesion(usuario.id_usuario);

    const cookieStore = await cookies();

    cookieStore.set("sitr_session", sesion.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return NextResponse.json({
      ok: true,
      mensaje: "Inicio de sesión exitoso",
      usuario,
    });
  } catch (error) {
    console.error("Error en login:", error);

    return NextResponse.json(
      {
        ok: false,
        mensaje: "Ocurrió un error al iniciar sesión",
      },
      { status: 500 }
    );
  }
}