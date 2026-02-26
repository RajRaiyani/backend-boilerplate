# Backend Boilerplate

A modern Node.js backend boilerplate built with **Express 5**, **TypeScript**, **PostgreSQL**, and **Redis**.  
It provides a solid foundation for building production-ready REST APIs with JWT authentication, file uploads, real-time communication via Socket.io, structured logging, and database migrations using dbmate.

---

## Features

- **TypeScript + ES Modules** – Strongly typed, modern Node.js setup.
- **Express 5** – Minimal, extensible HTTP server.
- **PostgreSQL + dbmate** – Versioned migrations and schema management.
- **Redis** – Caching / pub-sub support.
- **Authentication** – JWT-based auth powered by `jose`.
- **Validation** – Centralized request validation using Zod-based schemas.
- **File uploads** – Handled via Multer + Sharp, with local file storage and static serving.
- **Socket.io** – Real-time communication layer with a dedicated socket module.
- **Structured logging** – Winston-based logger with configurable log levels.
- **Docker-ready** – Dockerfile and `docker-compose.yml` for local and production-like environments.

---

## Prerequisites

- **Node.js** 18+ (22+ recommended)
- **npm** (comes with Node)
- **PostgreSQL** 14+ (for local development without Docker)
- **Redis** (for local development without Docker)
- **Dbmate** (optional globally, used via `npx` in scripts)
- **Docker & Docker Compose** (optional, for containerized setup)

---

## Getting Started (Local Development)

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd backend-boilerplate
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   Use the provided example file as a starting point:

   ```bash
   cp .env.example .env
   # Edit .env and adjust values for your environment
   ```

   At minimum, you must set **`DATABASE_URL`** and **`JWT_SECRET`**.  
   See [Environment Variables](#environment-variables) for details.

4. **Run database migrations**

   ```bash
   npx dbmate up
   ```

5. **Start the development server**

   ```bash
   npm run dev
   # or with file watching:
   npm run dev:watch
   ```

   The server will start on `http://localhost:3007` by default.

---

## NPM Scripts

- **`npm run dev`** – Start the server in development mode with `tsx`.
- **`npm run dev:watch`** – Start the server in watch mode (auto-restarts on changes).
- **`npm run build`** – Compile TypeScript to JavaScript into the `dist` folder and fix path aliases.
- **`npm run start`** – Run the built server from `dist/index.js`.
- **`npm run lint`** – Run ESLint over all `.ts` files under `src`.
- **`npm run lint:fix`** – Run ESLint and automatically fix fixable issues.

---

## Database & Migrations

This project uses **dbmate** for database migrations. Migrations live in:

- `db/migrations/`
- `db/schema.sql` (schema dump)

Common commands (using `npx`):

- **Run migrations**:

  ```bash
  npx dbmate up
  ```

- **Rollback last migration**:

  ```bash
  npx dbmate down
  ```

- **Create new migration**:

  ```bash
  npx dbmate new <migration_name>
  ```

- **Show migration status**:

  ```bash
  npx dbmate status
  ```

`DATABASE_URL` is used by dbmate and the application to connect to PostgreSQL.

---

## Docker Usage

### Build and run with Docker only

1. **Build the image**

   ```bash
   docker build -t backend-boilerplate .
   ```

2. **Prepare environment**

   ```bash
   cp .env.example .env
   # Adjust DATABASE_URL so that it points to your PostgreSQL instance
   ```

3. **Run migrations and start the server**

   ```bash
   docker run --env-file .env -p 3007:3007 backend-boilerplate
   ```

   The Docker image runs the compiled app and exposes port `3007`.

### Run full stack with Docker Compose

`docker-compose.yml` provisions:

- `postgres-18` – PostgreSQL 18
- `redis` – Redis
- `backend-boilerplate` – The application container based on `rajraiyani/backend-boilerplate:latest`

Steps:

1. **Create `.env` file**

   ```bash
   cp .env.example .env
   # Adjust values as needed
   ```

2. **Start all services**

   ```bash
   docker compose up -d
   ```

   The backend container will:

   - Run `npx dbmate up` (migrations)
   - Start the server via `npm run start`

3. **Volumes**

   The following directories are persisted on the host:

   - `./files` – Uploaded files
   - `./logs` – Log files
   - `./tmp` – Temporary files

---

## API Overview

### Health & Status

- `GET /` – Service status and metadata.
- `GET /ping` – Simple health check.

### Authentication

Base path: `/auth`

- `POST /auth/register` – Register a new user.
- `POST /auth/verify-registration` – Verify registration using OTP/verification code.
- `POST /auth/login` – Login with credentials and receive a JWT.

### File Uploads

Base path: `/files`

- `POST /files/upload` – Upload a single file (`file` field in `multipart/form-data`).
- `POST /files/upload-multiple` – Upload multiple files (`files` field in `multipart/form-data`).
- `GET /files/<path>` – Serve uploaded files from local storage.

Authentication, validation, and error handling are applied via middleware and controller patterns using `withDatabase`, request validators, and typed services.

---

## Authentication

This boilerplate uses **JWT** implemented via the [`jose`](https://github.com/panva/jose) library.

- Tokens are signed using a secret derived from `JWT_SECRET`.
- Helper utilities in `src/utility/token.ts` provide:
  - `createJWTToken` / `decodeJWTToken`
  - `createEncryptedToken` / `decryptEncryptedToken`
- Clients should send the token in the `Authorization` header:

  ```http
  Authorization: Bearer <your-jwt-token>
  ```

---

## Environment Variables

Main variables (see `.env.example` for full list):

- **Server**
  - `NODE_ENV` – Environment (`dev`, `prod`, etc.).
  - `SERVICE_NAME` – Service identifier (used in logs/status).
  - `SERVER_PORT` – Port to run the HTTP server (default: `3007`).

- **Authentication**
  - `JWT_SECRET` – Secret key used for signing JWTs (**required**).

- **Database**
  - `DATABASE_URL` – PostgreSQL connection string (**required**).  
    Example (for local development):

    ```env
    DATABASE_URL="postgres://postgres:1234567890@localhost:5432/voosto?sslmode=disable"
    ```

- **Logging**
  - `CONSOLE_LOG_LEVEL` – Console log level (`block`, `error`, `warn`, `info`, `http`, `verbose`, `debug`, `silly`).
  - `FILE_LOG_LEVEL` – File log level or `false` to disable file logging.

- **File Storage**
  - `FILE_STORAGE_ENDPOINT` – Public base URL for served files (default: `http://localhost:3007/files`).
  - `FILE_STORAGE_PATH` – Local path for file storage (default: `./files`).

- **Redis**
  - `REDIS_URL` – Redis connection URL (default: `redis://localhost:6379`).

- **SMTP / Email**
  - `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD` – SMTP configuration for email sending.

- **AWS (optional)**
  - `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`
  - `AWS_S3_BUCKET`, `AWS_S3_BACKUP_BUCKET`

- **Razorpay (optional)**
  - `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`

> **Note:** Never commit your `.env` file to version control. Only commit `.env.example` as a template.

---

## Project Structure (High-Level)

```text
src/
  index.ts               # HTTP server bootstrap
  app.ts                 # Express app, middleware, health routes
  app.route.ts           # Root router (auth, files, etc.)
  config/
    env.ts               # Environment variable loading & parsing
    validationSchema.ts  # Centralized Zod/Joi-like validation schemas
    errorCode.ts         # Error code registry
  core/
    ServerError.class.ts # Custom error type
    withDatabase.ts      # DB helper wrapper for controllers
  middleware/
    errorHandler.ts
    requestId.ts
    requestValidator.ts
    multer/              # File upload middleware
  modules/
    auth/                # Auth controllers & routes
    file/                # File upload controllers, routes, scripts, cron
  service/
    database/            # Database pool & parameter helpers
    redis/               # Redis client
    logger/              # Winston logger
    socket/              # Socket.io setup
    mail/                # Email service
  socket/                # Socket.io handlers & types
  utility/               # Helper utilities (tokens, email templates, etc.)
db/
  migrations/            # Dbmate migrations
  schema.sql             # Schema dump
files/                   # Runtime: uploaded files (gitignored)
logs/                    # Runtime: logs (gitignored)
tmp/                     # Runtime: temp files (gitignored)
```

---

## Logging

Logging is handled by **Winston** with console and file transports configured via environment variables.

- Log levels (in ascending verbosity):  
  `block` (-1), `error` (0), `warn` (1), `info` (2), `http` (3), `verbose` (4), `debug` (5), `silly` (6)
- Use `CONSOLE_LOG_LEVEL` and `FILE_LOG_LEVEL` to control output.

---

## License

ISC

---

## Author

**R.P. Raiyani**  
Website: `https://rajraiyani.com`

---

## Contributing

Contributions are welcome!  
Feel free to open issues or submit pull requests to improve this boilerplate.

