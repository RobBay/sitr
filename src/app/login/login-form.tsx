"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);
  const router = useRouter();

  async function manejarLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setMensaje("");
    setCargando(true);

    try {
      const respuesta = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          correo,
          contrasena,
        }),
      });

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        setMensaje(datos.mensaje || "No fue posible iniciar sesión.");
        return;
      }

      router.push("/dashboard");
    } catch {
      setMensaje("No fue posible conectar con el servidor.");
    } finally {
      setCargando(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">SITR</h1>

          <p className="mt-2 text-sm text-gray-500">
            Sistema Integral de Turnos Rotativos
          </p>
        </div>

        <form onSubmit={manejarLogin} className="space-y-5">
          <div>
            <label
              htmlFor="correo"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Correo electrónico
            </label>

            <input
              id="correo"
              type="email"
              value={correo}
              onChange={(event) => setCorreo(event.target.value)}
              placeholder="correo@empresa.com"
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
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
              value={contrasena}
              onChange={(event) => setContrasena(event.target.value)}
              placeholder="Ingresa tu contraseña"
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </div>

          {mensaje && (
            <div className="rounded-lg bg-gray-100 px-4 py-3 text-sm text-gray-700">
              {mensaje}
            </div>
          )}

          <button
            type="submit"
            disabled={cargando}
            className="w-full rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {cargando ? "Iniciando sesión..." : "Iniciar sesión"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            className="text-sm text-blue-600 hover:underline"
          >
            ¿Olvidaste tu contraseña?
          </button>
        </div>

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-xs text-gray-400">O</span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-500">¿No tienes una cuenta?</p>

          <button
            type="button"
            onClick={() => router.push("/registro")}
            className="mt-2 text-sm font-medium text-blue-600 hover:underline"
          >
            Crear cuenta
          </button>
        </div>
      </div>
    </main>
  );
}
