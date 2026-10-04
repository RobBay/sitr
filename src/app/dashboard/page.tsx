import { requerirAutenticacion } from "@/lib/auth/require-auth";
import DashboardContent from "./dashboard-content";
import DashboardLayout from "./dashboard-layout";

export default async function DashboardPage() {
  const usuario = await requerirAutenticacion();

  return (
    <DashboardLayout nombreUsuario={usuario.nombre_usuario}>
      <DashboardContent />
    </DashboardLayout>
  );
}