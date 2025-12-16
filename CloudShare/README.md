## CloudShare

CloudShare is a full‑stack web application for uploading, managing, and securely sharing files in the cloud.  
It provides authenticated dashboards, public share links, download support, and a credits / payments system.

- **Frontend**: React 18 + Vite, React Router, Tailwind CSS, Clerk authentication, Axios, React Hot Toast  
- **Backend**: Spring Boot 3 (Java 21), MongoDB, JWT‑based security, Razorpay integration  

---

## Features

- **Secure authentication**
  - Uses **Clerk** on the frontend for sign‑in/sign‑up and session management.
  - Backend validates requests using JWT and a custom security configuration.

- **File management**
  - Upload multiple files.
  - See a list of **"My Files"** for the current user.
  - Download files securely.
  - Delete files you own.
  - Toggle file visibility between **private** and **public**; public files get a shareable link.

- **Public file sharing**
  - Public files can be viewed via a unique URL (e.g. `/file/:fileId`).
  - Backend exposes `/files/public/{id}` to fetch metadata for public files.

- **Credits & payments**
  - Each user has a **credits balance** stored on the backend.
  - Uploading/using the service can consume credits.
  - Integration with **Razorpay** to purchase credits.
  - Transaction history and subscription/credits pages in the dashboard.

- **Dashboard experience**
  - Auth‑protected routes for dashboard, upload, my files, subscriptions, and transactions.
  - Toast notifications and a modern UI built with Tailwind and reusable components.

---

## Project structure

```text
CloudShare/
  cloudsharewebapp/   # React + Vite frontend
  cloudshareapi/      # Spring Boot backend API
```

### Frontend (`cloudsharewebapp`)

Key technologies:
- React 18
- Vite 5
- React Router v7
- Tailwind CSS
- Clerk (`@clerk/clerk-react`)
- Axios, React Hot Toast, Lucide Icons

Main routes (`src/App.jsx`):
- `/` – Landing page
- `/dashboard` – Main dashboard (Signed‑in only)
- `/upload` – Upload files (Signed‑in only)
- `/my-files` – List & manage your files (Signed‑in only)
- `/subscriptions` – Buy credits / plans (Signed‑in only)
- `/transactions` – Payment history (Signed‑in only)
- `/file/:fileId` – Public file view (no auth required)

API endpoints are configured centrally in `src/util/apiEndpoints.js` and point to:
- `http://localhost:8081/api/v1.0` in development
- `https://cloud-share-api-render.onrender.com/api/v1.0` in production

### Backend (`cloudshareapi`)

Key technologies:
- Spring Boot 3.5
- Java 21
- Spring Web
- Spring Security
- Spring Data MongoDB
- JWT (`jjwt` library)
- Razorpay Java SDK

Important packages:
- `controller` – REST APIs (`FileController`, `PaymentController`, `ProfileController`, `UserCreditsController`, etc.)
- `service` – Business logic for files, payments, profiles, and user credits.
- `document` – MongoDB documents (`FileMetadataDocument`, `UserCredits`, `PaymentTransaction`, `ProfileDocument`, etc.)
- `dto` – Data transfer objects for REST communication.
- `repository` – Spring Data MongoDB repositories.
- `security` – Custom JWT auth filter and JWKS provider.
- `config` – Security & static resource configuration.

Example file operations (from `FileController`):
- `POST /files/upload` – Upload files and return metadata + remaining credits.
- `GET /files/my` – Get all files for the current authenticated user.
- `GET /files/public/{id}` – Get metadata for a public file.
- `GET /files/download/{id}` – Download a file.
- `DELETE /files/{id}` – Delete a file.
- `PATCH /files/{id}/toggle-public` – Toggle public/private.

The backend exposes its API under the base path:  
`/api/v1.0`

---

## Getting started

You can run the frontend and backend separately in development.

### Prerequisites

- **Node.js** (recommended LTS, e.g. 18+)
- **npm** (comes with Node)
- **Java 21**
- **Maven 3.9+**
- **MongoDB** running locally or accessible via connection string
- Razorpay test keys (for payment flows)
- Clerk project + keys (for authentication)

---

## Backend setup (`cloudshareapi`)

1. **Configure environment**
   - Open `src/main/resources/application.properties`.
   - Set your MongoDB connection string and database name.
   - Configure any required JWT, Clerk, and Razorpay properties (API keys, secrets, webhook secrets, etc.).

2. **Run with Maven**

   ```bash
   cd cloudshareapi
   mvn spring-boot:run
   ```

   By default the app runs on **`http://localhost:8081`** (matching the frontend configuration for `BASE_URL` with `/api/v1.0`).

3. **Docker (optional)**
   - There is a `Dockerfile` in `cloudshareapi/` if you want to build and run the API in a container:

   ```bash
   cd cloudshareapi
   docker build -t cloudshare-api .
   docker run -p 8081:8081 --env-file .env cloudshare-api
   ```

   (Adjust port and env configuration as needed.)

---

## Frontend setup (`cloudsharewebapp`)

1. **Install dependencies**

   ```bash
   cd cloudsharewebapp
   npm install
   ```

2. **Configure environment**
   - Create a `.env` file in `cloudsharewebapp/` with your Clerk keys and any required public variables, for example:

   ```bash
   VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   ```

   - Make sure `BASE_URL` logic in `src/util/apiEndpoints.js` matches your backend URL if you change ports or paths.

3. **Run in development**

   ```bash
   npm run dev
   ```

   Vite will start the dev server (commonly on `http://localhost:5173`).  
   The app will call the backend on `http://localhost:8081/api/v1.0` when `import.meta.env.DEV` is `true`.

4. **Build for production**

   ```bash
   npm run build
   npm run preview   # optional: preview the production build locally
   ```

---

## Deployment notes

- **Backend**
  - Can be deployed to any JVM‑compatible host (Render, Heroku‑like platforms, VPS, Kubernetes, etc.).
  - Ensure environment variables / config for MongoDB, JWT, Clerk, and Razorpay are set in production.

- **Frontend**
  - Vite build outputs static files that can be hosted on any static host (Netlify, Vercel, Render static site, S3 + CloudFront, etc.).
  - In production, the frontend uses the hosted API URL configured in `apiEndpoints.js` (currently `https://cloud-share-api-render.onrender.com/api/v1.0`).

---

## Running the full stack locally

1. Start MongoDB.
2. Run the **backend**:

   ```bash
   cd cloudshareapi
   mvn spring-boot:run
   ```

3. In a separate terminal, run the **frontend**:

   ```bash
   cd cloudsharewebapp
   npm run dev
   ```

4. Open the frontend URL printed by Vite (e.g. `http://localhost:5173`) in your browser, sign in with Clerk, and start uploading/sharing files.

---

## Scripts reference

### Frontend (`cloudsharewebapp`)

- **`npm run dev`** – Start Vite dev server.
- **`npm run build`** – Create production build.
- **`npm run preview`** – Preview production build locally.
- **`npm run lint`** – Run ESLint.

### Backend (`cloudshareapi`)

- **`mvn spring-boot:run`** – Run the API in dev mode.
- **`mvn clean package`** – Build the jar (`target/cloudshareapi-0.0.1-SNAPSHOT.jar`).

---

## Contributing

1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Commit and push your changes.
4. Open a Pull Request with a clear description of what you changed.

---

## License

This project is available under a license of your choice (MIT, Apache‑2.0, etc.).  
If you plan to open‑source it, update this section and add a `LICENSE` file at the root of the repository.


