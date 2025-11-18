# AI Interview Platform

Final year project — a web application to help candidates prepare for technical interviews using AI-powered question generation, interactive practice sessions, scoring, and feedback.

> NOTE: This README is written to be framework-agnostic. If your repo uses a specific structure (frontend/backend, Next.js, NestJS, etc.), update the sections below to match your project layout and scripts.

## Table of contents
- [Features](#features)
- [Tech stack](#tech-stack)
- [Repository structure (example)](#repository-structure-example)
- [Getting started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Install](#install)
  - [Environment variables](#environment-variables)
  - [Run (development)](#run-development)
  - [Build & run (production)](#build--run-production)
- [Testing & linting](#testing--linting)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)
- [Maintainer & contact](#maintainer--contact)
- [Acknowledgements](#acknowledgements)
- [FAQ](#faq)

## Features
- AI-generated interview questions (multiple difficulty levels)
- Interactive practice sessions with timed questions
- Automatic or manual answer evaluation and feedback
- Candidate progress tracking and session history
- Admin interface to manage question banks, categories, and difficulty
- Extensible AI provider integration (OpenAI, other APIs, or local models)

## Tech stack
- Primary language: TypeScript
- Styling: CSS
- Possible frontend frameworks: React / Next.js
- Possible backend frameworks: Node.js (Express) / NestJS
- AI integration: OpenAI or another provider (configurable via env)
- Database: PostgreSQL / SQLite / MongoDB (configurable)

## Repository structure (example)
Adjust this to match the actual layout in your repo.

- /frontend — client application (React / Next.js)
- /backend — API server (Node / Express / NestJS)
- /packages — (monorepo style, optional)
- /scripts — build / maintenance scripts
- /docs — documentation and design notes
- /migrations — DB migrations
- README.md — this file
- .env.example — example environment variables

## Getting started

### Prerequisites
- Node.js (>= 16)
- npm (>= 8) or yarn
- A database if the project persists data (Postgres, SQLite, etc.)
- AI provider API key (if using an external AI service)

### Install
Clone the repository and install dependencies:

```bash
git clone https://github.com/Shravan250/AI-Interview-Platform.git
cd AI-Interview-Platform
# If project is monorepo or has frontend/backend:
# cd frontend && npm install
# cd ../backend && npm install

npm install
# or
yarn install
```

If you have separate apps (frontend/backend), run install inside each folder.

### Environment variables
Create a `.env` file (or `.env.local`) at project root or inside each app folder and add required variables. Example:

```env
# Example .env
PORT=4000
DATABASE_URL=postgres://user:pass@localhost:5432/ai_interview
OPENAI_API_KEY=sk-...
JWT_SECRET=supersecret
NODE_ENV=development
```

Keep secrets out of version control. Commit an `.env.example` with placeholders instead.

### Run (development)
If single-app:

```bash
npm run dev
```

If separate apps:

```bash
# frontend
cd frontend
npm run dev

# backend
cd backend
npm run dev
```

Common scripts (adjust if your repo uses different names):
- npm run dev — start dev server (frontend/backend)
- npm run build — build for production
- npm start — run production server
- npm test — run tests
- npm run lint — run linter

### Build & run (production)

```bash
npm run build
npm start
```

For separate apps run the build/start commands inside each directory.

## Testing & linting
Run tests and linters if they exist:

```bash
npm test
npm run lint
```

Add or update tests to cover core flows: question generation, evaluation, user auth, and API endpoints.

## Deployment
Deploy the frontend to Vercel, Netlify, or similar. Deploy the backend to Heroku, Render, Railway, or any container platform.

- Ensure environment variables are set in the provider
- Ensure production build commands match the provider settings
- Configure database and migrations in deployment environment

## Contributing
Contributions are welcome.

Suggested workflow:
- Fork the repository
- Create a feature branch: `git checkout -b feat/some-feature`
- Commit changes with clear messages
- Open a Pull Request describing the change and any migration or environment updates

Please add tests for new functionality and follow existing code styles.

## License
This project currently has no explicit license file. If you want to open source it, consider adding an MIT or Apache-2.0 LICENSE file.

## Maintainer & contact
Maintainer: Shravan250 (GitHub profile: https://github.com/Shravan250)

## Acknowledgements
- Final year project
- AI and open-source communities

## FAQ
Q: How do I change the AI provider?
A: Replace the AI integration module in the codebase (search for files that call the provider client) and update environment variables to match the new provider.

Q: Where do I add new interview questions?
A: If there is an admin UI or a data folder, add them there. Otherwise, check backend routes/endpoints for question management (e.g., `/api/questions`).
