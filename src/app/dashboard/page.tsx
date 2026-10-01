import { requerirAutenticacion } from "@/lib/auth/require-auth";

export default async function DashboardPage() {
  const usuario = await requerirAutenticacion();

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-900">
          Dashboard SITR
        </h1>

        <div className="mt-8 rounded-xl bg-white p-6 shadow">
          <h2 className="text-xl font-semibold">
            Bienvenido, {usuario.nombre_usuario}
          </h2>

          <div className="mt-4 space-y-2 text-gray-600">
            <p>
              <strong>Correo:</strong> {usuario.correo}
            </p>

            <p>
              <strong>Rol:</strong> {usuario.rol}
            </p>

            <p>
              <strong>Empresa:</strong> {usuario.id_empresa}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}