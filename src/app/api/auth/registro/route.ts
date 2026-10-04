import { NextResponse } from "next/server";
import { crearSesion } from "@/lib/auth/auth";
import { registrarEmpresa } from "@/lib/auth/registro";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      nit,
      nombre_empresa,
      correo_contacto,
      telefono,
      direccion,
      nombre_usuario,
      correo,
      contrasena,
      id_plan,
    } = body;

    if (
      !nit ||
      !nombre_empresa ||
      !correo_contacto ||
      !telefono ||
      !direccion ||
      !nombre_usuario ||
      !correo ||
      !contrasena ||
      !id_plan
    ) {
      return NextResponse.json(
        {
          ok: false,
          mensaje: "Todos los campos son obligatorios.",
        },
        { status: 400 }
      );
    }

    const resultado = await registrarEmpresa({
      nit,
      nombre_empresa,
      correo_contacto,
      telefono,
      direccion,
      nombre_usuario,
      correo,
      contrasena,
      id_plan: Number(id_plan),
    });

    const sesion = await crearSesion(resultado.id_usuario);

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
      mensaje: "Cuenta creada correctamente.",
      usuario: {
        id_usuario: resultado.id_usuario,
      },
      empresa: {
        id_empresa: resultado.id_empresa,
      },
      suscripcion: {
        id_suscripcion: resultado.id_suscripcion,
      },
    });
  } catch (error) {
    console.error("Error en registro:", error);

    const mensaje =
      error instanceof Error
        ? error.message
        : "No fue posible crear la cuenta.";

    return NextResponse.json(
      {
        ok: false,
        mensaje,
      },
      { status: 500 }
    );
  }
}