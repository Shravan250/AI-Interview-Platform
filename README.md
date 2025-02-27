# AI Interview Platform

## Overview

The AI Interview Platform is a comprehensive solution designed to help developers prepare for coding interviews. It offers real-time collaboration, AI-driven feedback, and secure code execution to simulate a realistic interview environment.

## Features

- **AI-Powered Code Feedback**: Utilizes OpenAI's API to provide insightful feedback on code submissions.
- **Secure Code Execution**: Executes code in a sandboxed environment using Docker and WebAssembly to ensure safety.
- **Real-Time Collaboration**: Enables multiple users to code together simultaneously through WebSockets.
- **User Authentication**: Implements secure user authentication using Clerk.js.
- **Code Submission & Evaluation**: Allows users to submit code and receive automated evaluations.
- **Performance Metrics**: Tracks and displays coding performance over time.

## Tech Stack

### Frontend

- **Framework**: Next.js
- **Styling**: Tailwind CSS
- **Authentication**: Clerk.js

### Backend

- **Server**: Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Caching**: Redis
- **AI Integration**: OpenAI API
- **Real-Time Communication**: WebSockets
- **Secure Execution**: Docker and WebAssembly

### DevOps & Deployment

- **CI/CD**: GitHub Actions
- **Containerization**: Docker
- **Backend Hosting**: Railway
- **Frontend Hosting**: Vercel

## Project Structure

The repository is organized as follows:

```
ai-interview-platform/
├── frontend/         # Next.js + Tailwind CSS
├── backend/          # Express.js API
├── docs/             # Documentation
├── database/         # Prisma schema and migrations
├── tests/            # Automated tests
├── .github/          # GitHub Actions workflows
├── docker/           # Docker configurations
├── README.md         # Project overview
└── .gitignore        # Ignored files
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- PostgreSQL
- Docker
- Vercel CLI
- Railway CLI

### Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/Shravan250/AI-Interview-Platform.git
   cd AI-Interview-Platform
   ```

2. **Set up the backend**:

   ```bash
   cd backend
   npm install
   ```

   - Configure environment variables in `.env` file.
   - Initialize the database:

     ```bash
     npx prisma migrate dev --name init
     ```

3. **Set up the frontend**:

   ```bash
   cd ../frontend
   npx create-next-app@latest .
   npm install
   npm install @clerk/nextjs tailwindcss postcss autoprefixer
   npx tailwindcss init -p
   ```

   - Configure Clerk.js with your API keys.
   - Set up environment variables in `.env.local`.

4. **Run the application**:

   - **Backend**:

     ```bash
     cd ../backend
     npm run dev
     ```

   - **Frontend**:

     ```bash
     cd ../frontend
     npm run dev
     ```

   Access the frontend at `http://localhost:3000` and the backend API at `http://localhost:5001`.

## Deployment

### Frontend on Vercel

1. **Install Vercel CLI**:

   ```bash
   npm install -g vercel
   ```

2. **Deploy**:

   ```bash
   cd frontend
   vercel
   ```

   Follow the prompts to complete the deployment.

### Backend on Railway

1. **Install Railway CLI**:

   ```bash
   npm install -g @railway/cli
   ```

2. **Deploy**:

   ```bash
   cd backend
   railway up
   ```

   Follow the prompts to complete the deployment.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

## License

This project is licensed under the MIT License.

---

For detailed documentation, refer to the `docs/` directory.
