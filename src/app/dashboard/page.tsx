import { requerirAutenticacion } from "@/lib/auth/require-auth";
import DashboardContent from "./dashboard-content";

export default async function DashboardPage() {
  await requerirAutenticacion();

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-6xl">
        <DashboardContent />
      </div>
    </main>
  );
}