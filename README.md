# Proyecto Final Vue.js + ASP.NET Core

Proyecto desarrollado para la asignatura de **Desarrollo Web en Entorno Cliente**.

## 🚀 Cómo ejecutar la aplicación

Para levantar toda la infraestructura (Base de Datos, Backend y Frontend), sigue estos pasos:

1. Asegúrate de tener **Docker Desktop** instalado y funcionando.
2. Desde la carpeta `Front_Vueapp`, ejecuta el siguiente comando:

```bash
docker-compose build && docker compose up
```

## 🔐 Credenciales de Prueba

| Rol                | Usuario    | Contraseña |
| ------------------ | ---------- | ---------- |
| **Administrador**  | `admin`    | `admin123` |
| **Usuario Normal** | `testuser` | `user123`  |

## 🔗 Enlaces de interés

- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Documentación API (Swagger)**: [http://localhost:8080/swagger/index.html](http://localhost:8080/swagger/index.html)

## 🛠️ Tecnologías utilizadas

- **Frontend**: Vue 3 (Composition API), Vite, TypeScript, Pinia, Vuetify 3, Vue Router, Vue i18n, VeeValidate + Yup, Chart.js.
- **Backend**: ASP.NET Core 8 Web API, Entity Framework Core.
- **Base de Datos**: SQL Server 2022.
- **Despliegue**: Docker & Docker Compose.

## 📁 Estructura del repositorio

Este repositorio utiliza el flujo de trabajo **Gitflow**. Por favor, no borres las ramas de desarrollo.

---

© 2026 - Proyecto de Prácticas
