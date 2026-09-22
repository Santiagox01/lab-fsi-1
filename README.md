# Aerolínea Virtual ✈️

Aplicación web para la gestión de una **Aerolínea Virtual**, desarrollada como parte del laboratorio del curso **Fundamentos de Sistemas de Información** (Universidad de Antioquia). La solución está construida utilizando el framework **JHipster 9.4.0**, integrando un backend con **Spring Boot**, base de datos relacional **MySQL** gestionada con **Liquibase**, un frontend moderno con **Angular**, y contenedorización completa mediante **Docker**.

---

## 📋 Modelo de Dominio y Entidades

La aplicación modela las operaciones clave de reservas y gestión de vuelos para una aerolínea mediante las siguientes entidades y relaciones:

- **Pasajero**: Gestión de usuarios y clientes de la aerolínea (`nombre`, `apellido`, `email`, `telefono`, `fechaNacimiento`).
- **Vuelo**: Programación y control de vuelos (`numeroVuelo`, `origen`, `destino`, `fechaSalida`, `fechaLlegada`).
- **Asiento**: Asignación de plazas dentro de las aeronaves (`numero`, `clase`, `disponible`).
- **Reserva**: Registro y control del estado de las reservas (`codigo`, `fechaReserva`, `estado`).

### Relaciones:

- Un **Pasajero** puede tener múltiples **Reservas** (`OneToMany`).
- Una **Reserva** está asociada a un **Vuelo** y a un **Asiento** (`ManyToOne`).

---

## 🛠️ Tecnologías Utilizadas

- **Backend:** Java 17+, Spring Boot, Spring Security (JWT), Spring Data JPA, Maven.
- **Frontend:** Angular, TypeScript, HTML5, SCSS, Bootstrap.
- **Base de Datos:** MySQL 8.x con versionamiento de esquemas mediante Liquibase.
- **Contenedores:** Docker y Docker Compose.
- **Herramienta de Scaffolding:** JHipster 9.4.0.

---

## 📁 Estructura del Proyecto

- `src/main/java/`: Código fuente del backend (controladores REST, servicios, repositorios, entidades JPA y configuración de seguridad).
- `src/main/resources/`: Configuraciones de Spring (`application.yml`), migraciones de base de datos de Liquibase (`config/liquibase/`) y plantillas de correo.
- `src/main/webapp/`: Código fuente de la interfaz de usuario en Angular (componentes, servicios, modelos, rutas y estilos).
- `src/main/docker/`: Descriptores de Docker Compose (`app.yml`, `mysql.yml`, `sonar.yml`, etc.).
- `.jhipster/`: Definiciones JSON de las entidades generadas.

---

## 🚀 Puesta en Marcha (Entorno de Desarrollo)

### 1. Requisitos Previos

- **Java 17** o superior instalado.
- **Node.js** (LTS) y **npm**.
- **Docker Desktop** en ejecución.

---

### 2. Iniciar la Base de Datos con Docker

Para levantar la base de datos MySQL en segundo plano:

```bash
docker-compose -f src/main/docker/mysql.yml up -d
```

_(O con Docker Compose v2)_:

```bash
docker compose -f src/main/docker/mysql.yml up -d
```

---

### 3. Iniciar el Backend (Spring Boot)

Ejecuta el servidor backend con el wrapper de Maven:

- En Linux / macOS / Git Bash:
  ```bash
  ./mvnw
  ```
- En Windows (PowerShell o CMD):
  ```powershell
  .\mvnw.cmd
  ```

El servicio REST estará disponible en: [http://localhost:8080](http://localhost:8080)

---

### 4. Iniciar el Frontend (Angular)

En una terminal separada, instala las dependencias e inicia el servidor de desarrollo de Angular con recarga en caliente:

```bash
npm install
npm start
```

La aplicación web estará disponible en: [http://localhost:9000](http://localhost:9000) (con proxy configurado hacia el backend en el puerto 8080).

---

## 🐳 Despliegue Completo con Docker

Si deseas construir la imagen de producción de la aplicación y ejecutar todo el entorno (Aplicación + Base de Datos) mediante Docker Compose:

### 1. Construir la imagen Docker de la aplicación

```bash
./mvnw package -Pprod verify jib:dockerBuild
```

### 2. Levantar la aplicación y la base de datos

```bash
docker compose -f src/main/docker/app.yml up -d
```

### 3. Verificar el estado de los contenedores

```bash
docker compose -f src/main/docker/app.yml ps
```

Accede a la aplicación en: [http://localhost:8080](http://localhost:8080)

---

## 🧪 Ejecución de Pruebas

- **Pruebas del Backend (JUnit / Spring Boot):**

  ```bash
  ./mvnw clean test
  ```

- **Pruebas del Frontend (Vitest):**
  ```bash
  npm test
  ```

---

## 🔐 Usuarios por Defecto (Entorno de Desarrollo)

| Usuario | Contraseña | Rol / Permisos                                                |
| :------ | :--------- | :------------------------------------------------------------ |
| `admin` | `admin`    | Administrador (acceso total a métricas, usuarios y entidades) |
| `user`  | `user`     | Usuario estándar                                              |

---

## 📄 Licencia y Créditos

Proyecto desarrollado para la asignatura **Fundamentos de Sistemas de Información** de la **Universidad de Antioquia**.
Generado y adaptado con [JHipster](https://www.jhipster.tech/).
