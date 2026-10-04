"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Plan = {
  id_plan: number;
  nombre_plan: string;
  maximo_empleados: number;
  valor_mensual: string;
};

export default function RegistroForm() {
  const router = useRouter();
  const [planes, setPlanes] = useState<Plan[]>([]);
  const [cargandoPlanes, setCargandoPlanes] = useState(true);
  const [errorPlanes, setErrorPlanes] = useState("");
  const [planSeleccionado, setPlanSeleccionado] = useState<number | null>(null);

  const [formulario, setFormulario] = useState({
  nit: "",
  nombre_empresa: "",
  correo_contacto: "",
  telefono: "",
  direccion: "",
  nombre_usuario: "",
  correo: "",
  contrasena: "",
  confirmar_contrasena: "",
});

function manejarCambio(
  event: React.ChangeEvent<HTMLInputElement>
) {
  const { id, value } = event.target;

  setFormulario((anterior) => ({
    ...anterior,
    [id]: value,
  }));
}

  useEffect(() => {
    async function cargarPlanes() {
      try {
        const response = await fetch("/api/auth/planes");

        const data = await response.json();

        if (!response.ok || !data.ok) {
          throw new Error("No fue posible cargar los planes");
        }

        setPlanes(data.planes);
      } catch (error) {
        console.error(error);
        setErrorPlanes("No fue posible cargar los planes.");
      } finally {
        setCargandoPlanes(false);
      }
    }

    cargarPlanes();
  }, []);

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-10">
      <div className="mx-auto max-w-5xl">
        <form 
            onSubmit={async (event) => {
                event.preventDefault();
                
                if (planSeleccionado === null) {
                    alert("Debes seleccionar un plan.");
                    return;
                }

                if (formulario.contrasena !== formulario.confirmar_contrasena) {
                    alert("Las contraseñas no coinciden.");
                    return;
                }

                try {
                    const response = await fetch("/api/auth/registro", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        nit: formulario.nit,
                        nombre_empresa: formulario.nombre_empresa,
                        correo_contacto: formulario.correo_contacto,
                        telefono: formulario.telefono,
                        direccion: formulario.direccion,
                        nombre_usuario: formulario.nombre_usuario,
                        correo: formulario.correo,
                        contrasena: formulario.contrasena,
                        id_plan: planSeleccionado,
                    }),
                    });

                    const data = await response.json();

                    if (!response.ok || !data.ok) {
                    alert(data.mensaje || "No fue posible crear la cuenta.");
                    return;
                    }

                    alert("¡Cuenta creada correctamente!");

                    router.push("/dashboard");
                } catch (error) {
                    console.error("Error al registrar:", error);
                    alert("No fue posible conectar con el servidor.");
                }
                }}

            // onSubmit={(event) => {
            //     event.preventDefault();
            //     console.log("Formulario:", formulario);
            //     console.log("Plan seleccionado:", planSeleccionado);
            // }}
            className="rounded-2xl bg-white p-8 shadow"
            >
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900">
              Crear cuenta
            </h1>

            <p className="mt-2 text-gray-600">
              Registra tu empresa y crea la cuenta del administrador.
            </p>
          </div>

          {/* Datos de la empresa */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900">
              Datos de la empresa
            </h2>

            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <div>
                <label
                  htmlFor="nit"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  NIT
                </label>

                <input
                id="nit"
                type="text"
                value={formulario.nit}
                onChange={manejarCambio}
                placeholder="Ej. 900123456-7"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label
                  htmlFor="nombre_empresa"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Nombre de la empresa
                </label>

                <input
                  id="nombre_empresa"
                  type="text"
                  placeholder="Nombre de la empresa"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                  value={formulario.nombre_empresa}
                  onChange={manejarCambio}
                />
              </div>

              <div>
                <label
                  htmlFor="correo_contacto"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Correo de contacto
                </label>

                <input
                  id="correo_contacto"
                  type="email"
                  placeholder="contacto@empresa.com"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                  value={formulario.correo_contacto}
                  onChange={manejarCambio}
                />
              </div>

              <div>
                <label
                  htmlFor="telefono"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Teléfono
                </label>

                <input
                  id="telefono"
                  type="tel"
                  placeholder="300 123 4567"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                  value={formulario.telefono}
                  onChange={manejarCambio}
                />
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="direccion"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Dirección
                </label>

                <input
                  id="direccion"
                  type="text"
                  placeholder="Dirección de la empresa"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                  value={formulario.direccion}
                  onChange={manejarCambio}
                />
              </div>
            </div>
          </section>

          {/* Planes */}
          <section className="mt-10">
            <h2 className="text-xl font-semibold text-gray-900">
              Selecciona tu plan
            </h2>

            {cargandoPlanes && (
              <p className="mt-4 text-gray-600">
                Cargando planes...
              </p>
            )}

            {errorPlanes && (
              <p className="mt-4 text-red-600">
                {errorPlanes}
              </p>
            )}

            {!cargandoPlanes && !errorPlanes && (
              <div className="mt-5 grid gap-5 md:grid-cols-3">
                {planes.map((plan) => (
                  <div
                    key={plan.id_plan}
                    className={`rounded-xl border p-5 transition ${
                        planSeleccionado === plan.id_plan
                        ? "border-blue-600 bg-blue-50 ring-2 ring-blue-200"
                        : "border-gray-200"
                    }`}
                  >
                    <h3 className="text-lg font-bold text-gray-900">
                      {plan.nombre_plan}
                    </h3>

                    <p className="mt-2 text-2xl font-bold text-blue-600">
                      ${Number(plan.valor_mensual).toLocaleString("es-CO")}
                    </p>

                    <p className="mt-2 text-sm text-gray-600">
                      Hasta {plan.maximo_empleados} empleados
                    </p>

                    <button
                        type="button"
                        onClick={() => setPlanSeleccionado(plan.id_plan)}
                        className={`mt-5 w-full rounded-lg px-4 py-2 font-medium ${
                        planSeleccionado === plan.id_plan
                        ? "bg-blue-600 text-white"
                        : "border border-blue-600 text-blue-600 hover:bg-blue-50"
                        }`}
                    >
                        {planSeleccionado === plan.id_plan
                        ? "Plan seleccionado"
                        : "Seleccionar"}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Datos del administrador */}
          <section className="mt-10">
            <h2 className="text-xl font-semibold text-gray-900">
              Datos del administrador
            </h2>

            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <div>
                <label
                  htmlFor="nombre_usuario"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Nombre completo
                </label>

                <input
                  id="nombre_usuario"
                  type="text"
                  placeholder="Nombre del administrador"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                  value={formulario.nombre_usuario}
                  onChange={manejarCambio}
                />
              </div>

              <div>
                <label
                  htmlFor="correo"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Correo
                </label>

                <input
                  id="correo"
                  type="email"
                  placeholder="admin@empresa.com"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                  value={formulario.correo}
                  onChange={manejarCambio}
                />
              </div>

              <div>
                <label
                  htmlFor="contrasena"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Contraseña
                </label>

                <input
                  id="contrasena"
                  type="password"
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                  value={formulario.contrasena}
                  onChange={manejarCambio}
                />
              </div>

              <div>
                <label
                  htmlFor="confirmar_contrasena"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Confirmar contraseña
                </label>

                <input
                  id="confirmar_contrasena"
                  type="password"
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                  value={formulario.confirmar_contrasena}
                  onChange={manejarCambio}
                />
              </div>
            </div>
          </section>

          <div className="mt-10">
            <button
              type="submit"
              className="w-full rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
            >
              Crear cuenta
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}