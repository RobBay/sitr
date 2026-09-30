This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# SITR — Sistema Integral de Turnos Rotativos

Sistema web para la gestión integral de turnos rotativos, empleados, equipos, novedades, rotaciones, asignaciones y solicitudes de cambio de turno.

El proyecto está diseñado como una solución multiempresa (multi-tenant), donde cada empresa administra su propia información y los usuarios solo pueden acceder a los datos correspondientes a su empresa.

---

## 1. Tecnologías utilizadas

### Frontend y aplicación

* Next.js 16
* React
* TypeScript
* Tailwind CSS
* App Router

### Backend

* Next.js API Routes
* Prisma ORM 7
* Prisma Adapter MariaDB

### Base de datos

* MySQL
* Base de datos: `sitr`

### Control de versiones

* Git
* GitHub

### Herramientas de desarrollo

* Visual Studio Code
* Git Bash
* MySQL Workbench
* Node.js / npm

---

# 2. Arquitectura general

SITR utiliza una arquitectura integrada basada en Next.js:

```text
┌─────────────────────────────┐
│          Usuario            │
│   Administrador / Supervisor│
│         / Empleado          │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│          Next.js            │
│       App Router            │
│                             │
│  Interfaces + API + lógica  │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│          Prisma 7           │
│       Prisma Client         │
│     + MariaDB Adapter       │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│           MySQL             │
│            sitr              │
└─────────────────────────────┘
```

Se decidió utilizar Next.js en lugar de separar inicialmente Django como backend y React como frontend.

La razón principal es mantener una arquitectura más sencilla para el proyecto, evitando inicialmente complejidad adicional de CORS, autenticación entre aplicaciones y despliegues separados.

---

# 3. Estructura inicial del proyecto

La estructura relevante actualmente es:

```text
sitr/
│
├── prisma/
│   └── schema.prisma
│
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── prueba-db/
│   │   │       └── route.ts
│   │   │
│   │   └── ...
│   │
│   ├── generated/
│   │   └── prisma/
│   │
│   └── lib/
│       └── prisma.ts
│
├── .env
├── .gitignore
├── package.json
├── package-lock.json
├── prisma7.config.ts
├── skills-lock.json
└── README.md
```

> `src/generated/prisma` es generado automáticamente por Prisma y está incluido en `.gitignore`.

---

# 4. Creación del proyecto Next.js

El proyecto se creó utilizando:

```bash
npx create-next-app@latest sitr
```

Durante la configuración se seleccionó:

* TypeScript: Sí
* ESLint: Sí
* React Compiler: No
* Tailwind CSS: Sí
* Directorio `src/`: Sí
* App Router: Sí
* Import alias: `@/*`
* AGENTS.md: Sí

La versión utilizada actualmente es:

```text
Next.js 16.3.7
```

---

# 5. Primera prueba de Next.js

Se ejecutó:

```bash
npm run dev
```

Esto permitió comprobar que la aplicación iniciaba correctamente en:

```text
http://localhost:3000
```

---

# 6. Instalación de Prisma

Se instalaron Prisma y Prisma Client:

```bash
npm install prisma @prisma/client
```

Versión utilizada:

```text
Prisma 7.10.0
@prisma/client 7.10.0
```

---

# 7. Inicialización de Prisma

Se ejecutó:

```bash
npx prisma init
```

Esto creó principalmente:

```text
prisma/schema.prisma
prisma7.config.ts
.env
```

Además se generaron archivos auxiliares relacionados con las herramientas de Prisma.

---

# 8. Configuración de MySQL

Inicialmente Prisma fue generado utilizando PostgreSQL, por lo que se cambió el proveedor en:

```text
prisma/schema.prisma
```

de:

```prisma
provider = "postgresql"
```

a:

```prisma
provider = "mysql"
```

La conexión utiliza la base de datos:

```text
sitr
```

---

# 9. Configuración de variables de entorno

El archivo `.env` contiene las credenciales de conexión a MySQL.

Ejemplo conceptual:

```env
DATABASE_URL="mysql://root:CONTRASEÑA@localhost:3306/sitr"
DB_PASSWORD="CONTRASEÑA"
```

### Importante

El archivo `.env` **NO debe subirse a GitHub** porque contiene información sensible.

Por eso `.gitignore` contiene:

```gitignore
.env*
```

Nunca se deben guardar contraseñas directamente en archivos versionados.

---

# 10. Conexión de Prisma con la base de datos existente

La base de datos `sitr` ya había sido creada previamente en MySQL con las tablas del sistema.

Para obtener automáticamente la estructura existente se utilizó:

```bash
npx prisma db pull
```

Resultado:

```text
✔ Introspected 16 models
```

Esto permitió que Prisma generara los modelos correspondientes a las tablas existentes.

---

# 11. Generación de Prisma Client

Después se ejecutó:

```bash
npx prisma generate
```

Prisma generó el cliente en:

```text
src/generated/prisma
```

La configuración actual del generador es:

```prisma
generator client {
  provider = "prisma-client"
  output   = "../src/generated/prisma"
}
```

---

# 12. Prisma 7 y el Adapter para MySQL

Prisma 7 requiere utilizar un adapter para conectarse a la base de datos.

Se instaló:

```bash
npm install @prisma/adapter-mariadb
```

Aunque la base de datos utilizada es MySQL, el adapter compatible utilizado es:

```text
@prisma/adapter-mariadb
```

---

# 13. Cliente Prisma centralizado

Se creó:

```text
src/lib/prisma.ts
```

Este archivo centraliza la instancia de Prisma utilizada por la aplicación.

La configuración utiliza:

```text
PrismaClient
+
PrismaMariaDb
+
variables de entorno
```

Además se utiliza `globalThis` para evitar crear múltiples instancias innecesarias de Prisma durante el desarrollo con Next.js.

---

# 14. Primera prueba de conexión Next.js → Prisma → MySQL

Se creó temporalmente una API:

```text
src/app/api/prueba-db/route.ts
```

La ruta:

```text
GET /api/prueba-db
```

consulta los usuarios existentes en MySQL.

La consulta utilizada fue conceptualmente:

```ts
const usuarios = await prisma.usuario.findMany(...)
```

Se probó desde el navegador:

```text
http://localhost:3000/api/prueba-db
```

Y se obtuvo correctamente:

```json
{
  "ok": true,
  "cantidad": 4
}
```

Esto confirmó que funciona correctamente toda la cadena:

```text
Next.js
   ↓
API Route
   ↓
Prisma 7
   ↓
Prisma Adapter
   ↓
MySQL
   ↓
Base de datos SITR
```

---

# 15. Git

El proyecto ya contaba con Git inicializado.

Se verificó mediante:

```bash
git status
```

La rama inicialmente era:

```text
master
```

---

# 16. Primer commit

Se agregaron los archivos:

```bash
git add .
```

Y se creó el primer commit:

```bash
git commit -m "chore: configurar proyecto SITR con Prisma y MySQL"
```

Después se verificó:

```bash
git status
```

Resultado:

```text
nothing to commit, working tree clean
```

---

# 17. Conexión con GitHub

Se creó el repositorio:

```text
https://github.com/RobBay/sitr
```

El repositorio remoto se agregó mediante:

```bash
git remote add origin https://github.com/RobBay/sitr.git
```

Se verificó con:

```bash
git remote -v
```

Resultado:

```text
origin  https://github.com/RobBay/sitr.git (fetch)
origin  https://github.com/RobBay/sitr.git (push)
```

---

# 18. Cambio de master a main

La rama local se cambió de:

```text
master
```

a:

```text
main
```

mediante:

```bash
git branch -M main
```

Se verificó con:

```bash
git status
```

Resultado:

```text
On branch main
nothing to commit, working tree clean
```

---

# 19. Configuración de autenticación GitHub

Git inicialmente no tenía configurado un administrador de credenciales.

Se verificó mediante:

```bash
git config --global credential.helper
```

No se obtuvo ningún resultado.

Se configuró Git Credential Manager:

```bash
git config --global credential.helper manager
```

Posteriormente GitHub solicitó autenticación mediante el navegador.

---

# 20. Primer Push a GitHub

Finalmente se ejecutó:

```bash
git push -u origin main
```

Resultado:

```text
[new branch]      main -> main
branch 'main' set up to track 'origin/main'
```

Esto significa que actualmente:

```text
PC
 │
 │ git push
 ▼
GitHub
 │
 └── main
```

La rama local:

```text
main
```

está vinculada con:

```text
origin/main
```

Por eso, en futuros cambios normalmente podremos utilizar:

```bash
git push
```

---

# 21. Estado actual del proyecto

Actualmente SITR cuenta con:

* ✅ Proyecto Next.js funcionando
* ✅ TypeScript configurado
* ✅ Tailwind CSS configurado
* ✅ MySQL funcionando
* ✅ Base de datos SITR creada
* ✅ 16 modelos/tables reconocidos por Prisma
* ✅ Prisma 7 configurado
* ✅ Prisma Client generado
* ✅ Adapter MariaDB configurado
* ✅ API de prueba funcionando
* ✅ Git configurado
* ✅ Primer commit realizado
* ✅ GitHub conectado
* ✅ Rama `main`
* ✅ Primer push realizado
* ✅ `.env` protegido mediante `.gitignore`

---

# 22. Flujo de trabajo Git que utilizaremos

A partir de ahora, cada funcionalidad nueva seguirá aproximadamente este ciclo:

```text
1. Desarrollar
      ↓
2. Probar localmente
      ↓
3. git status
      ↓
4. git add .
      ↓
5. git commit -m "mensaje"
      ↓
6. git push
```

Ejemplo:

```bash
git status

git add .

git commit -m "feat: agregar modulo de empleados"

git push
```

---

# 23. Próximas etapas de SITR

El desarrollo funcional se realizará progresivamente:

### Etapa 1 — Base técnica

* [x] Crear proyecto Next.js
* [x] Configurar TypeScript
* [x] Configurar Tailwind
* [x] Configurar MySQL
* [x] Configurar Prisma
* [x] Probar conexión con BD
* [x] Configurar Git
* [x] Conectar GitHub

### Etapa 2 — Seguridad y acceso

* [ ] Login
* [ ] Sesiones
* [ ] Autenticación
* [ ] Roles
* [ ] Protección de rutas
* [ ] Aislamiento por empresa

### Etapa 3 — Interfaz principal

* [ ] Layout general
* [ ] Menú lateral
* [ ] Dashboard
* [ ] Navegación según rol

### Etapa 4 — Administración

* [ ] Empresas
* [ ] Empleados
* [ ] Equipos
* [ ] Turnos
* [ ] Configuración de rotaciones

### Etapa 5 — Operación

* [ ] Asignaciones de turnos
* [ ] Calendario
* [ ] Novedades
* [ ] Solicitudes de cambio
* [ ] Supervisión

### Etapa 6 — Información y control

* [ ] Notificaciones
* [ ] Reportes
* [ ] Auditoría
* [ ] Indicadores

### Etapa 7 — Mejoras

* [ ] Automatización
* [ ] Validaciones avanzadas
* [ ] Experiencia de usuario
* [ ] Optimización
* [ ] Despliegue

---

# 24. Regla importante de arquitectura

SITR es un sistema **multiempresa**.

Por lo tanto, las operaciones realizadas desde el backend deben respetar siempre:

```text
usuario autenticado
       ↓
id_empresa
       ↓
datos pertenecientes a esa empresa
```

No se debe confiar en un `id_empresa` enviado directamente desde el frontend para determinar qué información puede consultar o modificar un usuario.

La empresa debe obtenerse desde la sesión/autenticación del usuario.

Esto será especialmente importante cuando implementemos:

* empleados
* turnos
* equipos
* rotaciones
* asignaciones
* reportes
* novedades

---

# 25. Nota sobre seguridad

Nunca subir al repositorio:

```text
.env
contraseñas
tokens
claves API
credenciales
```

Antes de realizar un `git push`, revisar:

```bash
git status
```

y verificar que `.env` no aparezca como archivo preparado para commit.

---

## Comandos Git básicos de SITR

### Ver estado

```bash
git status
```

### Ver historial

```bash
git log --oneline
```

### Agregar cambios

```bash
git add .
```

### Crear commit

```bash
git commit -m "mensaje"
```

### Subir cambios

```bash
git push
```

### Actualizar desde GitHub

```bash
git pull
```

### Ver repositorio remoto

```bash
git remote -v
```

---

## Repositorio

GitHub:

https://github.com/RobBay/sitr


