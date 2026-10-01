import bcrypt from "bcryptjs";
import crypto from "node:crypto";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function autenticarUsuario(
  correo: string,
  contrasena: string
) {
  const usuario = await prisma.usuario.findFirst({
    where: {
      correo,
    },
    select: {
      id_usuario: true,
      nombre_usuario: true,
      correo: true,
      contrasena_hash: true,
      rol: true,
      estado: true,
      id_empresa: true,
    },
  });

  if (!usuario) {
    return null;
  }

  if (usuario.estado !== "ACTIVO") {
    return null;
  }

  const contrasenaValida = await bcrypt.compare(
    contrasena,
    usuario.contrasena_hash
  );

  if (!contrasenaValida) {
    return null;
  }

  return {
    id_usuario: usuario.id_usuario,
    nombre_usuario: usuario.nombre_usuario,
    correo: usuario.correo,
    rol: usuario.rol,
    id_empresa: usuario.id_empresa,
  };
}

export async function crearSesion(id_usuario: number) {
  const token = crypto.randomBytes(32).toString("hex");

  const fechaExpiracion = new Date();
  fechaExpiracion.setDate(fechaExpiracion.getDate() + 7);

  const sesion = await prisma.sesion.create({
    data: {
      token,
      id_usuario,
      fecha_expiracion: fechaExpiracion,
    },
  });

  return sesion;
}


export async function obtenerSesionPorToken(token: string) {
  const sesion = await prisma.sesion.findUnique({
    where: {
      token,
    },
    include: {
      usuario: {
        select: {
          id_usuario: true,
          nombre_usuario: true,
          correo: true,
          rol: true,
          estado: true,
          id_empresa: true,
        },
      },
    },
  });

  if (!sesion) {
    return null;
  }

  if (sesion.fecha_expiracion <= new Date()) {
    await prisma.sesion.delete({
      where: {
        id_sesion: sesion.id_sesion,
      },
    });

    return null;
  }

  if (sesion.usuario.estado !== "ACTIVO") {
    return null;
  }

  return {
    id_sesion: sesion.id_sesion,
    id_usuario: sesion.usuario.id_usuario,
    nombre_usuario: sesion.usuario.nombre_usuario,
    correo: sesion.usuario.correo,
    rol: sesion.usuario.rol,
    id_empresa: sesion.usuario.id_empresa,
    fecha_expiracion: sesion.fecha_expiracion,
  };
}

export async function obtenerUsuarioActual() {
  const cookieStore = await cookies();
  const token = cookieStore.get("sitr_session")?.value;

  if (!token) {
    return null;
  }

  return obtenerSesionPorToken(token);
}