"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  children: React.ReactNode;
  nombreUsuario: string;
};

export default function DashboardLayout({
  children,
  nombreUsuario,
}: Props) {
  const router = useRouter();
  const [menuAbierto, setMenuAbierto] = useState(false);

  async function cerrarSesion() {
    await fetch("/api/auth/logout", {
      method: "POST",
    });

    router.push("/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-slate-950 text-white transition-transform duration-300 lg:translate-x-0 ${
          menuAbierto ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-20 items-center border-b border-slate-800 px-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                SITR
              </h1>
              <p className="text-xs text-slate-400">
                Sistema Integral de Turnos
              </p>
            </div>
          </div>

          <nav className="flex-1 space-y-1 px-3 py-6">
            <a
              href="/dashboard"
              className="flex items-center rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium text-white shadow-sm"
            >
              Dashboard
            </a>

            <a
              href="#"
              className="flex items-center rounded-lg px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
            >
              Empleados
            </a>

            <a
              href="#"
              className="flex items-center rounded-lg px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
            >
              Equipos
            </a>

            <a
              href="#"
              className="flex items-center rounded-lg px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
            >
              Turnos
            </a>

            <a
              href="#"
              className="flex items-center rounded-lg px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
            >
              Rotaciones
            </a>

            <a
              href="#"
              className="flex items-center rounded-lg px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
            >
              Asignaciones
            </a>

            <a
              href="#"
              className="flex items-center rounded-lg px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
            >
              Novedades
            </a>

            <a
              href="#"
              className="flex items-center rounded-lg px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
            >
              Reportes
            </a>

            <div className="my-5 border-t border-slate-800" />

            <a
              href="#"
              className="flex items-center rounded-lg px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
            >
              Configuración
            </a>
          </nav>

          <div className="border-t border-slate-800 p-4">
            <div className="mb-3 rounded-lg bg-slate-900 p-3">
              <p className="text-xs text-slate-400">
                Usuario
              </p>

              <p className="mt-1 truncate text-sm font-medium text-white">
                {nombreUsuario}
              </p>
            </div>

            <button
              onClick={cerrarSesion}
              className="w-full rounded-lg px-4 py-2.5 text-left text-sm font-medium text-slate-300 transition hover:bg-red-500/10 hover:text-red-400"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </aside>

      {menuAbierto && (
        <button
          aria-label="Cerrar menú"
          onClick={() => setMenuAbierto(false)}
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
        />
      )}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-slate-200 bg-white/95 px-4 shadow-sm backdrop-blur sm:px-6">
          <button
            onClick={() => setMenuAbierto(true)}
            className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 lg:hidden"
            aria-label="Abrir menú"
          >
            ☰
          </button>

          <div className="hidden lg:block">
            <p className="text-sm text-slate-500">
              Administración
            </p>
            <p className="text-sm font-semibold text-slate-900">
              Sistema Integral de Turnos Rotativos
            </p>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-slate-900">
                {nombreUsuario}
              </p>
              <p className="text-xs text-slate-500">
                Administrador
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-semibold text-white">
              {nombreUsuario.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}