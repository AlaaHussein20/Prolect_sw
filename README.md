# Prolect_sw

![CI Status](https://github.com/YOUR_USERNAME/YOUR_REPO/workflows/CI/badge.svg)

## Project Summary
Prolect_sw is a full-stack application that helps manage medical appointments, users, and doctor/patient interactions. It provides simple workflows for scheduling and tracking appointments and exposes separate backend APIs and a React-based frontend for the user interfaces.

## Key Features
- User registration, login, and role-based flows (doctor / patient)
- Doctor appointment management
- Doctor dashboard page
- Modular backend with models for `User`, `Doctor`, and `Appointment`

## Tech Stack
- Backend: Node.js + Express
- Frontend: React
- Project structure: `backend/`, `frontend/`, `public/`, `src/`

Note: The exact database and auth mechanisms can be found in the backend source files under `backend/` (check `server.js` and `models/`).

## Quickstart
Prerequisites: Node.js (14+ recommended) and npm.

1. Clone the repository

```powershell
git clone <repository-url>
cd "//github.com/AlaaHussein20/Prolect_sw.git
   cd Prolect_sw"
```

2. Install top-level dependencies (optional)

```powershell
npm install
```

3. Backend setup and run

```powershell
cd backend
npm install
node server.js
```

By default the backend starts on the port configured in `backend/server.js` or the `PORT` environment variable. If the project uses a database, set the connection string in an environment variable (common names: `MONGO_URI`, `DATABASE_URL`) and any auth secret (e.g. `JWT_SECRET`).

4. Frontend setup and run

```powershell
cd frontend
npm install
npm start
```

The frontend runs with the scripts defined in `frontend/package.json`. If the root `package.json` contains workspace/config scripts you may also run them from the repository root.

## Project Structure (high level)
- `backend/` — Express server, route definitions in `routes/`, data models in `models/`.
- `frontend/` — React app and related packages.
- `public/` — static assets and `index.html` for the frontend.
- `src/` — shared or root-level frontend source (React pages and styles).

## Environment & Configuration
Look for environment variables or config usage in `backend/server.js` and route files. Typical variables you might need:
- `PORT` — backend server port
- `MONGO_URI` or `DATABASE_URL` — database connection string
- `JWT_SECRET` — JSON Web Token secret for auth

Create a `.env` file in `backend/` (if used) with the necessary values before starting the server.

## Tests
A comprehensive CI/CD pipeline runs automatically on every push and pull request to ensure code quality:

- **Backend Tests**: Syntax validation and integration tests
- **Frontend Tests**: React component tests with coverage reporting
- **Integration Tests**: Full-stack testing with MongoDB
- **Code Quality**: Security audits and dependency checks

### Running Tests Locally

Backend tests:
```powershell
cd backend
npm test
```

Frontend tests:
```powershell
cd frontend
npm test
```

For more details about the CI/CD setup, see [.github/workflows/README.md](.github/workflows/README.md).

## Contributing
- Fork the repo, create a feature branch, and submit a pull request.
- Open an issue to discuss larger changes before implementing.
- Follow existing code style and add tests where applicable.
