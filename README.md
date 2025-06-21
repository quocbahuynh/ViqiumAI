# ViqiumAI Backend Chatbot

Welcome to the ViqiumAI Backend Chatbot repository! This project serves as the backend for the AI chatbot application, integrating multiple AI services (OpenAI, Replicate, Jina) and managing user data via MongoDB and Redis.

## 🚀 Getting Started

To ensure a consistent development experience across our globally distributed team, we provide two ways to run the project: using Docker (Recommended) or Native Node.js.

### Option 1: Docker (Recommended)
You do not need MongoDB or Redis installed locally. Docker will spin up everything for you.

1. Ensure [Docker](https://www.docker.com/products/docker-desktop/) is installed and running.
2. Clone the repository: `git clone <repo-url>`
3. Copy `.env.example` to `.env` and fill in your API keys (OpenAI, etc.).
4. Run the application:
   ```bash
   docker-compose up --build
   ```
   The API will be available at `http://localhost:5000`.

### Option 2: Native Setup
1. Ensure Node.js (v20+), MongoDB, and Redis are running locally.
2. Run `npm install` to install dependencies.
3. Run `npm run prepare` to set up Git hooks (Husky).
4. Copy `.env.example` to `.env` and fill in your credentials.
5. Start the development server:
   ```bash
   npm run dev
   ```

## 🛠 Available Scripts
- `npm run dev` - Starts the development server with Nodemon.
- `npm run build` - Compiles TypeScript to JavaScript in the `/dist` folder.
- `npm start` - Runs the compiled application.
- `npm run lint` - Runs ESLint to check for code issues.
- `npm run format` - Runs Prettier to format the codebase.

## 🤝 Contributing
Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, branching strategy, and the process for submitting pull requests to us.
