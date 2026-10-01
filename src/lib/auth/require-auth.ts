import { redirect } from "next/navigation";
import { obtenerUsuarioActual } from "@/lib/auth/auth";

export async function requerirAutenticacion() {
  const usuario = await obtenerUsuarioActual();

  if (!usuario) {
    redirect("/login");
  }

  return usuario;
}