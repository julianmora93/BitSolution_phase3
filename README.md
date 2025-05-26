# BitSolution Phase 2 Project

## Table of Contents
- [Overview](#overview)
- [Project Structure](#project-structure)
- [Endpoints](#endpoints)
- [Key Components](#key-components)
  - [Plugins](#plugins)
  - [Database](#database)
- [Deployment](#deployment)
- [Getting Started](#getting-started)
- [Problem Solved](#problem-solved)

## Overview

The BitSolution Phase 2 project is designed to provide a robust backend solution using Fastify, Prisma, and BullMQ. It integrates various services and plugins to handle tasks such as user management, email notifications, and scheduled jobs.

## Project Structure

- **src/plugins**: Contains Fastify plugins for integrating various services like Redis, Prisma, and Cron jobs.
- **src/repositories**: Houses database interaction logic using Prisma for managing user data.
- **src/services**: Includes business logic services such as enqueueing tasks and sending notifications.
- **src/interfaces**: Defines TypeScript interfaces for data structures used across the project.
- **src/schemas**: Contains JSON schemas for request and response validation.
- **test**: Contains test cases to ensure the functionality of the application.

## Endpoints

- **Notifications**
    - **POST /posts/published-notification**: Simulate publishing posts and enqueue notifications for users.

- **QueueManager**
    - **GET /queue-manager**: Retrieve all queued messages.
    - **POST /queue-manager-clear**: Remove all messages from the postNotification queue.

- **User**
    - **GET /users**: 
        Retrieves the list of users stored in the database.
        The following parameters can be used to apply filters.
        - **name**: Filter messages by name. **Not required**.
        - **username**: Filter messages by name. **Not required**.
        - **email**: Filter messages by name. **Not required**.
        - **phone**: Filter messages by name. **Not required**.
        - **website**: Filter messages by name. **Not required**.

    - **POST /users/load**: Loads users from an external API and saves them to the database.


## Key Components

### Plugins

- **[Axios Plugin](src/plugins/axios.ts)**: Proporciona una instancia de Axios para realizar solicitudes HTTP y maneja errores específicos de Axios.

- **[BullMQ Plugin](src/plugins/bullmq.ts)**: Configura y gestiona las colas de tareas utilizando BullMQ. Permite la ejecución de trabajos en segundo plano con opciones de reintento y eliminación automática de trabajos completados o fallidos.

- **[BullMQ Plugin](src/plugins/bull-worker.ts)**: This plugin registers a BullMQ Worker that listens for incoming notification jobs from the configured Redis queue.
Each job contains information about a post and the target user. When a job is received, the worker retrieves the user's email address from the database and sends them an email notification about the new post using the configured mailer.

- **[Error Handler Plugin](src/plugins/error-handler.ts)**: Implementa un manejador de errores personalizado que gestiona errores comunes de Prisma y Axios, proporcionando mensajes de error claros y códigos de estado HTTP.

- **[jwtAuth Plugin](src/plugins/jwt-auth.ts)**: This plugin integrates [Fastify JWT](https://github.com/fastify/fastify-jwt) into the application to provide secure authentication and scope-based authorization for protected routes.

- **[Mailer Plugin](src/plugins/mailer.ts)**: This plugin integrates FastifyMailer with the application to enable email delivery using a configured SMTP transport, such as [MailHog](https://github.com/mailhog/MailHog?tab=readme-ov-file) for local development.

- **[Redis Plugin](src/plugins/redis.ts)**: Manages caching and session storage using Redis. Utiliza `Keyv` y `KeyvRedis` para manejar la conexión y almacenamiento en Redis.

- **[Prisma Plugin](src/plugins/prisma.ts)**: Maneja las conexiones y operaciones de base de datos utilizando Prisma ORM. Configura el cliente de Prisma para conectarse a la base de datos PostgreSQL.

- **[Swagger Plugin](src/plugins/swagger.ts)**: Integra Swagger para la documentación de la API, permitiendo la visualización y prueba de los endpoints a través de una interfaz gráfica.

### Database

- **Prisma**: Used for database schema management and query execution. The schema is defined in `prisma/schema.prisma`.

## Deployment

The project is containerized using Docker, with configurations provided in `Dockerfile` and `docker-compose.yml`. Kubernetes deployment configurations are available in `kubernetes/deployment.yaml`.

The [docker-compose.yml](docker-compose.yml) file is provided to facilitate the setup of the `PostgreSQL` database, `MailHog` service, and `Redis` in a local development environment.

**Contents of `docker-compose.yml`:**
```yaml
version: '3.8'

services:
  postgres:
    image: postgres
    restart: always
    container_name: db-phase-2
    environment:
      POSTGRES_USER: bitsolution
      POSTGRES_PASSWORD: bitsolution
      POSTGRES_DB: db_test
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:alpine
    restart: always
    container_name: redis-phase-2
    ports:
      - "6379:6379"

  mailhog:
    image: mailhog/mailhog
    restart: always
    container_name: mailhog-phase-2
    ports:
      - "8025:8025"
      - "1025:1025"

volumes:
  postgres_data:
```

To start the PostgreSQL database with Docker Compose, run:
```bash
docker-compose up -d
```

To stop the PostgreSQL database with Docker Compose, run:
```bash
docker-compose down
```

To rebuild in case of changes to the DockerFile or dependencies, you can run:
```bash
docker-compose up -d --build
```

To see the running containers:
```bash
docker ps
```

Access the PostgreSQL container:
```bash
docker exec -it db-bitsolution bash
```

## Getting Started

1. **Install Dependencies**: Run `npm install` to install all necessary packages.
2. **Build the Project**: Use `npm run build` to compile the TypeScript code.
3. **Run the Application**: Start the server with `npm start`.
4. **Run the Application in Dev**: Execute dev mode using `npm run dev`.
4. **Run the complete Test**: Execute complete test mode using `npm run test`.
4. **Run the Test Coverga**: Execute test covergae `npm run test:coverage`.
4. **Run the User Test**: Execute only user test `npm run test:users`.
4. **Run the Notification Test**: Execute only notification test `npm run test:notification`.


## Deployment

The authentication microservice has been fully implemented and integrated into the project. The key features delivered include:

- ✅ **JWT Token Signing**: Implemented using Core Plugin `@fastify/jwt`. The token includes scope data and is used for authorizing access to endpoints.
- ✅ **Scope-Based Authorization**: A Fastify decorator (`fastify.authenticate`) validates JWTs and checks for required scopes per endpoint (`read` or `write`).
- ✅ **Pagination and Filtering**: The `GET /users` endpoint now accepts pagination (`page`, `limit`) and filtering parameters (`name`, `username`, `email`, `phone`, `website`).
- ✅ **Comprehensive Unit Tests**: All endpoints and core functionalities are covered with unit tests using Jest, achieving **over 85% test coverage**.
- ✅ **Mock Plugins for Testing**: Custom Fastify plugin mocks are used to simulate external services like Redis, Prisma, and Axios during tests.
- ✅ **Containerized Development**: The authentication service is included in the Docker-based development environment, making it easily deployable and reproducible.

The final result demonstrates effective use of TDD (Test-Driven Development), solid project structure, proper use of third-party libraries, and adherence to the OAuth principles for secured and scoped access.