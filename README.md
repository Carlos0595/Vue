# Conflict Tracker - Deploy Fullstack (Vue + Spring Boot)

## 1) URL pública del Frontend

- Frontend (Vercel): `https://vue-git-master-carlos0595s-projects.vercel.app/`


## 2) Arquitectura utilizada

```text
Usuario (Browser)
   |
   v
Frontend Vue 3 + Vite (Vercel)
   |
   | /api/v1/*  (rewrite en vercel.json)
   v
Backend Spring Boot (Railway)
   |
   v
Base de datos (persistencia backend)
```

### Detalle técnico

- Frontend: Vue 3 + Pinia + Vue Router.
- Build/hosting frontend: Vercel.
- Backend: Spring Boot (API REST bajo `/api/v1`).
- Hosting backend: Railway.
- Integración FE-BE:
  - En producción el frontend llama a `/api/v1/...`.
  - Vercel redirige esas llamadas al backend de Railway mediante `vercel.json`.

## 3) Variables de entorno para un nuevo despliegue

### Frontend (Vercel)

Configurar en `Project Settings > Environment Variables`:

```bash
VITE_API_BASE_URL=/api/v1
```

### Archivo de referencia local

El repositorio incluye:

- `.env.example`

Con el valor:

```bash
VITE_API_BASE_URL=/api/v1
```

### Rewrite necesario en Vercel

Archivo `vercel.json`:

```json
{
  "rewrites": [
    {
      "source": "/api/v1/:path*",
      "destination": "https://conflicttracker-production-90d1.up.railway.app/api/v1/:path*"
    }
  ]
}
```

## 4) Modificaciones realizadas (backend Spring + frontend Vue)

## Error inicial detectado

- Los conflictos no cargaban en producción (Vercel).
- El endpoint backend existía y respondía (`200`), pero desde navegador en dominio Vercel se bloqueaba por CORS (`403`).
- Además, el frontend estaba inicialmente preparado para `localhost` y no para entorno de producción.

## Cambios en Backend (Spring Boot)

### Problema

- `@CrossOrigin` estaba limitado a `http://localhost:5173`, por lo que no aceptaba el dominio de Vercel.

### Solución aplicada

- Ampliar `@CrossOrigin` para incluir:
  - `http://localhost:5173`
  - `https://TU-FRONTEND.vercel.app`

Ejemplo:

```java
@CrossOrigin(origins = {
    "http://localhost:5173",
    "https://TU-FRONTEND.vercel.app"
})
```

## Cambios en Frontend (Vue)

### Problema 1

- URL de API no parametrizada para producción (antes dependía de localhost o URL fija).

### Solución 1

- Configurar uso de `import.meta.env.VITE_API_BASE_URL` en el store.
- Fallback en producción a `/api/v1`.

### Problema 2

- Bloqueo CORS al llamar directamente de frontend a Railway.

### Solución 2

- Añadir `vercel.json` con rewrite de `/api/v1/*` hacia Railway.
- El navegador llama al mismo dominio del frontend y Vercel hace de proxy.

### Problema 3

- Gestión de errores poco clara en peticiones fetch.

### Solución 3

- Mejorar manejo de errores HTTP en store (`response.ok`) y mensajes de error legibles.
- Adaptar parseo para evitar dejar listas vacías silenciosamente.

## 5) Comandos útiles

```bash
npm install
npm run dev
npm run build
vercel
vercel --prod
```
