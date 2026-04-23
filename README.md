# Hackathon React + Node.js Boilerplate

A robust, production-ready MERN stack boilerplate template tailored specifically for hackathons. It provides plain JavaScript implementations with modern UI/UX practices and pre-configured backend utilities.

![MERN Boilerplate Preview](https://via.placeholder.com/800x400?text=Hackathon+Boilerplate)

## 📖 Table of Contents
- [Features](#features)
- [Requirements](#requirements)
- [Quick Start](#quick-start)
- [Project Architecture](#project-architecture)
- [Frontend AI Guidelines (Responsive Design)](#frontend-ai-guidelines-responsive-design)
- [Environment Variables Setup](#environment-variables-setup)
- [Available Scripts](#available-scripts)
- [Pre-configured Dependencies](#pre-configured-dependencies)

## ⚡ Features
- **Frontend**: React (Vite), PrimeReact UI Components, Tailwind CSS, Redux Toolkit, React-Router, Chart.js.
- **Backend**: Express, MongoDB (Mongoose), JWT Authentication, Uploadthing, Nodemailer.
- **Tools**: Responsive Component Library, Modular API Routes, Centralized Error Handling, Concurrently execution.

## 📋 Requirements
- Node.js (v18+)
- MongoDB instance (local or Atlas)
- Configuration secrets for email and tokens.

## 🚀 Quick Start
1. **Clone the repository** (if applicable).
2. **Setup Envs**: Copy `.env.example` in both `/frontend` and `/backend` and configure them.
3. **Install Dependencies**:
   ```bash
   npm run install:all
   ```
4. **Start Development Servers (Ports 3000 & 4000)**:
   ```bash
   npm run dev
   ```

## 🏗 Project Architecture
The project follows a standard monorepo-style structure keeping client and server code separated but executable together.

### `frontend/`
- `src/components/`: Pre-built reusable layout elements (Sidebar, Topbar, Forms, PrimeReact UI integrations).
- `src/pages/`: Main application views (Dashboard, Login, Register).
- `src/store/`: Redux configuration with `authSlice` to manage global state.
- `src/utils/`: Custom hooks and tools like `api.js` (Axios interceptors for tokens).

### `backend/`
- `src/controllers/`: Route request handlers containing the core business logic.
- `src/middlewares/`: Validation, Error Handling, and JWT verification layers.
- `src/models/`: Mongoose Entity schemas.
- `src/routes/`: Express modular route definitions.
- `src/utils/`: Generic helpers for DB, Email, and Cloud Storage.

## 🤖 Frontend AI Guidelines (Responsive Design)
For developers auto-generating code using AI, adhere to the following principles directly injected into this template:
- **Responsive-First Approach**: All frontend components strictly use Tailwind utility classes (e.g., `md:flex-row`, `lg:w-1/2`) to ensure compatibility across mobile, tablet, and desktop views.
- **Library Preferences**: Uses `PrimeReact` for interactive components (dropdowns, dialogs, sidebars). Style overrides are minimal but handled via Tailwind.
- **Icons**: Relies on `primeicons` or customized SVG utilities.

## ⚙️ Environment Variables Setup

### Backend (`backend/.env`)
Create `.env` file based on `backend/.env.example`.
- `PORT`: (Default 4000)
- `MONGO_URI`: Your MongoDB Connection String.
- `ACCESS_TOKEN_SECRET` / `REFRESH_TOKEN_SECRET`: Used for JWT authentication.
- Email configuration (`SMTP_*`) logic is stubbed for sending standard verifications/alerts.

### Frontend (`frontend/.env`)
Create `.env` file based on `frontend/.env.example`.
- `VITE_API_BASE_URL`: Must match your backend's URL (e.g., `http://localhost:4000`).

## 🛠 Available Scripts

In the **root** folder:
- `npm run dev`: Starts the Vite React app and the Express backend simultaneously.
- `npm run install:all`: Installs modules in the root, `/frontend` and `/backend` directories.

## 📦 Pre-configured Dependencies

### Backend Utilities included:
- `express`, `mongoose`, `jsonwebtoken`, `bcryptjs`, `cors`, `helmet`, `morgan`
- `uploadthing` (File/Asset uploading alternative to S3)
- `nodemailer` (SMTP Email handling)
- `zod` (Validation parsing schema)
- `lodash`, `md5`

### Frontend Utilities included:
- `react`, `vite`, `react-router-dom`
- `primereact` & `primeicons` (UI Toolkit)
- `tailwindcss` (Utility Styling)
- `redux`, `@reduxjs/toolkit` (State Management)
- `formik`, `yup` (Form and validation schemas)
- `chart.js` (Data visualizations)
- `axios` (API fetching)
