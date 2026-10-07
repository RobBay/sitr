# Estructura del proyecto SITR

```text
sitr/
│
├── .agents/
│   └── skills/
│       └── ...                         → Skills auxiliares para herramientas de desarrollo.
│
├── .claude/
│   └── skills/
│       └── ...                         → Skills auxiliares para herramientas de desarrollo.
│
├── .windsurf/
│   └── skills/
│       └── ...                         → Skills auxiliares para herramientas de desarrollo.
│
├── public/
│   ├── file.svg                        → Recurso estático de la aplicación.
│   ├── globe.svg                       → Recurso estático de la aplicación.
│   ├── next.svg                        → Recurso inicial de Next.js.
│   ├── vercel.svg                      → Recurso inicial de Next.js.
│   └── window.svg                      → Recurso estático de la aplicación.
│
├── prisma/
│   └── schema.prisma                   → Define los modelos, campos y relaciones de la base de datos.
│
├── src/
│   │
│   ├── app/
│   │   │
│   │   ├── api/
│   │   │   │
│   │   │   ├── auth/
│   │   │   │   ├── login/
│   │   │   │   │   └── route.ts        → Autentica al usuario e inicia su sesión.
│   │   │   │   │
│   │   │   │   ├── logout/
│   │   │   │   │   └── route.ts        → Cierra la sesión del usuario.
│   │   │   │   │
│   │   │   │   ├── me/
│   │   │   │   │   └── route.ts        → Consulta el usuario actualmente autenticado.
│   │   │   │   │
│   │   │   │   ├── planes/
│   │   │   │   │   └── route.ts        → Consulta los planes disponibles para el registro.
│   │   │   │   │
│   │   │   │   └── registro/
│   │   │   │       └── route.ts        → Procesa el registro de una empresa y su administrador.
│   │   │   │
│   │   │   ├── dashboard/
│   │   │   │   └── resumen/
│   │   │   │       └── route.ts        → Obtiene información resumida para el dashboard.
│   │   │   │
│   │   │   ├── empleados/
│   │   │   │   ├── route.ts            → Consulta y crea empleados.
│   │   │   │   └── [id]/
│   │   │   │       └── route.ts        → Consulta y modifica un empleado específico.
│   │   │   │
│   │   │   ├── turnos/
│   │   │   │   ├── route.ts            → Consulta y crea turnos.
│   │   │   │   └── [id]/
│   │   │   │       └── route.ts        → Modifica un turno específico.
│   │   │   │
│   │   │   └── prueba-db/
│   │   │       └── route.ts            → Comprueba la conexión entre la aplicación y la base de datos.
│   │   │
│   │   ├── dashboard/
│   │   │   ├── empleados/
│   │   │   │   ├── page.tsx            → Pantalla principal del módulo de empleados.
│   │   │   │   └── empleados-form.tsx  → Formulario para crear y editar empleados.
│   │   │   │
│   │   │   ├── turnos/
│   │   │   │   ├── page.tsx            → Pantalla principal del módulo de turnos.
│   │   │   │   └── turno-form.tsx      → Formulario para crear y editar turnos.
│   │   │   │
│   │   │   ├── dashboard-content.tsx   → Contenido principal del dashboard.
│   │   │   ├── dashboard-layout.tsx    → Estructura, sidebar y navegación del dashboard.
│   │   │   ├── layout.tsx              → Layout utilizado por las páginas del dashboard.
│   │   │   └── page.tsx                → Página principal del dashboard.
│   │   │
│   │   ├── login/
│   │   │   ├── page.tsx                → Página de inicio de sesión.
│   │   │   └── login-form.tsx           → Formulario y lógica del inicio de sesión.
│   │   │
│   │   ├── registro/
│   │   │   ├── page.tsx                → Página que muestra el registro.
│   │   │   └── registro-form.tsx       → Formulario de registro de empresa y administrador.
│   │   │
│   │   ├── favicon.ico                 → Icono de la aplicación.
│   │   ├── globals.css                 → Estilos CSS globales.
│   │   ├── layout.tsx                  → Layout raíz de toda la aplicación.
│   │   └── page.tsx                    → Página inicial.
│   │
│   └── lib/
│       │
│       ├── auth/
│       │   ├── auth.ts                 → Autenticación, sesiones y validación de contraseñas.
│       │   ├── registro.ts             → Lógica para registrar empresas y usuarios.
│       │   └── require-auth.ts         → Utilidades para proteger funcionalidades autenticadas.
│       │
│       └── prisma.ts                   → Configuración y acceso centralizado a Prisma.
│
├── .gitignore                          → Define archivos que Git no debe subir al repositorio.
├── AGENTS.md                            → Instrucciones auxiliares para agentes de desarrollo.
├── CLAUDE.md                            → Instrucciones auxiliares para Claude.
├── eslint.config.mjs                   → Configuración de ESLint.
├── next.config.ts                      → Configuración de Next.js.
├── package.json                         → Dependencias, scripts y configuración del proyecto.
├── package-lock.json                    → Versiones exactas de las dependencias instaladas.
├── postcss.config.mjs                  → Configuración de PostCSS.
├── prisma7.config.ts                   → Configuración de Prisma 7.
├── README.md                            → Documentación principal del proyecto.
├── skills-lock.json                     → Control de versiones de las skills utilizadas.
└── tsconfig.json                        → Configuración de TypeScript.
```

## Archivos auxiliares

Las carpetas `.agents`, `.claude` y `.windsurf` contienen documentación y **skills de apoyo para el desarrollo**, principalmente relacionadas con Prisma. No forman parte de la lógica funcional de SITR.

## Librerías principales

* **Next.js** → Framework principal de la aplicación.
* **React** → Construcción de la interfaz.
* **TypeScript** → Tipado del proyecto.
* **Prisma** → ORM para la base de datos.
* **mysql2** → Conexión con MySQL.
* **@prisma/adapter-mariadb** → Adaptador utilizado por Prisma.
* **bcryptjs** → Generación y comparación de hashes de contraseñas.
* **Lucide React** → Iconos de la interfaz.
* **Tailwind CSS** → Estilos de la aplicación.
* **ESLint** → Revisión y calidad del código.
