import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

type DatosRegistro = {
  nit: string;
  nombre_empresa: string;
  correo_contacto: string;
  telefono: string;
  direccion: string;
  nombre_usuario: string;
  correo: string;
  contrasena: string;
  id_plan: number;
};

export async function registrarEmpresa(datos: DatosRegistro) {
  const nit = datos.nit.trim();
  const nombreEmpresa = datos.nombre_empresa.trim();
  const correoContacto = datos.correo_contacto.trim().toLowerCase();
  const telefono = datos.telefono.trim();
  const direccion = datos.direccion.trim();
  const nombreUsuario = datos.nombre_usuario.trim();
  const correo = datos.correo.trim().toLowerCase();

  if (
    !nit ||
    !nombreEmpresa ||
    !correoContacto ||
    !telefono ||
    !direccion ||
    !nombreUsuario ||
    !correo ||
    !datos.contrasena ||
    !datos.id_plan
  ) {
    throw new Error("Todos los campos son obligatorios.");
  }

  const usuarioExistente = await prisma.usuario.findFirst({
    where: {
      correo,
    },
  });

  if (usuarioExistente) {
    throw new Error("El correo ya está registrado.");
  }

  const empresaExistente = await prisma.empresa.findFirst({
    where: {
      nit,
    },
  });

  if (empresaExistente) {
    throw new Error("El NIT ya está registrado.");
  }

  const plan = await prisma.plan_suscripcion.findFirst({
    where: {
      id_plan: datos.id_plan,
      estado: "ACTIVO",
    },
  });

  if (!plan) {
    throw new Error("El plan seleccionado no está disponible.");
  }

  const contrasenaHash = await bcrypt.hash(datos.contrasena, 12);

  const fechaInicio = new Date();

  const fechaFinPrueba = new Date(fechaInicio);
  fechaFinPrueba.setDate(fechaFinPrueba.getDate() + 30);

  const resultado = await prisma.$transaction(async (tx) => {
    const empresa = await tx.empresa.create({
      data: {
        nit,
        nombre_empresa: nombreEmpresa,
        correo_contacto: correoContacto,
        telefono,
        direccion,
        estado: "ACTIVO",
        id_plan: plan.id_plan,
      },
    });

    const usuario = await tx.usuario.create({
      data: {
        nombre_usuario: nombreUsuario,
        correo,
        contrasena_hash: contrasenaHash,
        rol: "ADMIN_EMPRESA",
        estado: "ACTIVO",
        id_empresa: empresa.id_empresa,
      },
    });

    

    const suscripcion = await tx.suscripcion.create({
      data: {
        id_empresa: empresa.id_empresa,
        id_plan: plan.id_plan,
        estado: "PRUEBA",
        fecha_inicio: fechaInicio,
        fecha_fin_prueba: fechaFinPrueba,
        fecha_proxima_renovacion: null,
      },
    });

    return {
      empresa,
      usuario,
      suscripcion,
    };
  });

  return {
    id_empresa: resultado.empresa.id_empresa,
    id_usuario: resultado.usuario.id_usuario,
    id_suscripcion: resultado.suscripcion.id_suscripcion,
  };
}