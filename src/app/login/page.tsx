import { redirect } from "next/navigation";
import { obtenerUsuarioActual } from "@/lib/auth/auth";
import LoginForm from "./login-form";

export default async function LoginPage() {
  const usuario = await obtenerUsuarioActual();

  if (usuario) {
    redirect("/dashboard");
  }

  return <LoginForm />;
}