import { requerirAutenticacion } from "@/lib/auth/require-auth";
import DashboardLayout from "./dashboard-layout";

export default async function DashboardLayoutRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const usuario = await requerirAutenticacion();

  return (
    <DashboardLayout nombreUsuario={usuario.nombre_usuario}>
      {children}
    </DashboardLayout>
  );
}