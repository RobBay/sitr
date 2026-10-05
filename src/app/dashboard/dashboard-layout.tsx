"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  LayoutDashboard,
  Users,
  BriefcaseBusiness,
  Clock3,
  RefreshCw,
  ClipboardList,
  Bell,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react";

type Props = {
  children: React.ReactNode;
  nombreUsuario: string;
};

export default function DashboardLayout({ children, nombreUsuario }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const [menuAbierto, setMenuAbierto] = useState(false);
  const [sidebarColapsado, setSidebarColapsado] = useState(false);

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
        className={`fixed inset-y-0 left-0 z-40 transform bg-slate-950 text-white transition-all duration-300 ${
          menuAbierto ? "translate-x-0" : "-translate-x-full"
        } ${
          sidebarColapsado
            ? "lg:w-16 lg:translate-x-0"
            : "lg:w-64 lg:translate-x-0"
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Encabezado del sidebar */}
          <div
            className={`flex h-20 items-center border-b border-slate-800 ${
              sidebarColapsado ? "justify-center px-2" : "justify-between px-6"
            }`}
          >
            {!sidebarColapsado && (
              <div>
                <h1 className="text-2xl font-bold tracking-tight">SITR</h1>

                <p className="text-xs text-slate-400">
                  Sistema Integral de Turnos
                </p>
              </div>
            )}

            <button
              type="button"
              onClick={() => setSidebarColapsado(!sidebarColapsado)}
              className="hidden rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white lg:block"
              aria-label={sidebarColapsado ? "Expandir menú" : "Colapsar menú"}
              title={sidebarColapsado ? "Expandir menú" : "Colapsar menú"}
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>

          {/* Navegación */}
          <nav
            className={`flex-1 space-y-1 overflow-y-auto py-6 ${
              sidebarColapsado ? "px-2" : "px-3"
            }`}
          >
            <a
              href="/dashboard"
              title="Dashboard"
              className={`flex items-center rounded-lg text-sm font-medium transition ${
                pathname === "/dashboard"
                  ? "bg-blue-600 text-white shadow-sm hover:bg-blue-700"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              } ${
                sidebarColapsado
                  ? "justify-center px-2 py-3"
                  : "gap-3 px-4 py-3"
              }`}
            >
              <LayoutDashboard className="h-5 w-5 shrink-0" />

              {!sidebarColapsado && <span>Dashboard</span>}
            </a>

            <a
              href="/dashboard/empleados"
              title="Empleados"
              className={`flex items-center rounded-lg text-sm font-medium transition ${
                pathname.startsWith("/dashboard/empleados")
                  ? "bg-blue-600 text-white shadow-sm hover:bg-blue-700"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              } ${
                sidebarColapsado
                  ? "justify-center px-2 py-3"
                  : "gap-3 px-4 py-3"
              }`}
            >
              <Users className="h-5 w-5 shrink-0" />

              {!sidebarColapsado && <span>Empleados</span>}
            </a>

            <a
              href="#"
              title="Equipos"
              className={`flex items-center rounded-lg text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white ${
                sidebarColapsado
                  ? "justify-center px-2 py-3"
                  : "gap-3 px-4 py-3"
              }`}
            >
              <BriefcaseBusiness className="h-5 w-5 shrink-0" />

              {!sidebarColapsado && <span>Equipos</span>}
            </a>

            <a
              href="/dashboard/turnos"
              title="Turnos"
              className={`flex items-center rounded-lg text-sm font-medium transition ${
                pathname.startsWith("/dashboard/turnos")
                  ? "bg-blue-600 text-white shadow-sm hover:bg-blue-700"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              } ${
                sidebarColapsado
                  ? "justify-center px-2 py-3"
                  : "gap-3 px-4 py-3"
              }`}
            >
              <Clock3 className="h-5 w-5 shrink-0" />

              {!sidebarColapsado && <span>Turnos</span>}
            </a>

            <a
              href="#"
              title="Rotaciones"
              className={`flex items-center rounded-lg text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white ${
                sidebarColapsado
                  ? "justify-center px-2 py-3"
                  : "gap-3 px-4 py-3"
              }`}
            >
              <RefreshCw className="h-5 w-5 shrink-0" />

              {!sidebarColapsado && <span>Rotaciones</span>}
            </a>

            <a
              href="#"
              title="Asignaciones"
              className={`flex items-center rounded-lg text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white ${
                sidebarColapsado
                  ? "justify-center px-2 py-3"
                  : "gap-3 px-4 py-3"
              }`}
            >
              <ClipboardList className="h-5 w-5 shrink-0" />

              {!sidebarColapsado && <span>Asignaciones</span>}
            </a>

            <a
              href="#"
              title="Novedades"
              className={`flex items-center rounded-lg text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white ${
                sidebarColapsado
                  ? "justify-center px-2 py-3"
                  : "gap-3 px-4 py-3"
              }`}
            >
              <Bell className="h-5 w-5 shrink-0" />

              {!sidebarColapsado && <span>Novedades</span>}
            </a>

            <a
              href="#"
              title="Reportes"
              className={`flex items-center rounded-lg text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white ${
                sidebarColapsado
                  ? "justify-center px-2 py-3"
                  : "gap-3 px-4 py-3"
              }`}
            >
              <BarChart3 className="h-5 w-5 shrink-0" />

              {!sidebarColapsado && <span>Reportes</span>}
            </a>

            <div className="my-5 border-t border-slate-800" />
          </nav>

          {/* Usuario y cierre de sesión */}
          <div className="border-t border-slate-800 p-4">
            {!sidebarColapsado && (
              <div className="mb-3 rounded-lg bg-slate-900 p-3">
                <p className="text-xs text-slate-400">Usuario</p>

                <p className="mt-1 truncate text-sm font-medium text-white">
                  {nombreUsuario}
                </p>
              </div>
            )}
            <a
              href="#"
              title="Configuración"
              className={`flex items-center rounded-lg text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white ${
                sidebarColapsado
                  ? "justify-center px-2 py-3"
                  : "gap-3 px-4 py-3"
              }`}
            >
              <Settings className="h-5 w-5 shrink-0" />

              {!sidebarColapsado && <span>Configuración</span>}
            </a>
            <button
              type="button"
              onClick={cerrarSesion}
              title="Cerrar sesión"
              className={`flex w-full items-center rounded-lg text-sm font-medium text-slate-300 transition hover:bg-red-500/10 hover:text-red-400 ${
                sidebarColapsado
                  ? "justify-center px-2 py-2.5"
                  : "gap-3 px-4 py-2.5 text-left"
              }`}
            >
              <LogOut className="h-5 w-5 shrink-0" />

              {!sidebarColapsado && <span>Cerrar sesión</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Fondo oscuro para menú móvil */}
      {menuAbierto && (
        <button
          aria-label="Cerrar menú"
          onClick={() => setMenuAbierto(false)}
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
        />
      )}

      {/* Contenido principal */}
      <div
        className={`transition-all duration-300 ${
          sidebarColapsado ? "lg:pl-16" : "lg:pl-64"
        }`}
      >
        <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-slate-200 bg-white/95 px-4 shadow-sm backdrop-blur sm:px-6">
          {/* Botón móvil */}
          <button
            type="button"
            onClick={() => setMenuAbierto(true)}
            className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 lg:hidden"
            aria-label="Abrir menú"
          >
            <Menu className="h-6 w-6" />
          </button>

          <div className="hidden lg:block">
            <p className="text-sm text-slate-500">Administración</p>

            <p className="text-sm font-semibold text-slate-900">
              Sistema Integral de Turnos Rotativos
            </p>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-slate-900">
                {nombreUsuario}
              </p>

              <p className="text-xs text-slate-500">Administrador</p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-semibold text-white">
              {nombreUsuario.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
