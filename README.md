# 🤖 Viqium AI - E-Commerce Chatbot Platform

![Viqium AI Overview](https://tuananhdo0308.github.io/TuananhDo_Portfolio/images/Viqium.png)

> An automated AI Chatbot Platform designed specifically for e-commerce sellers to handle customer inquiries, product recommendations, and order tracking across multiple platforms.

Viqium AI is a unified system that empowers e-commerce sellers to automate their sales processes, dramatically reduce response times, and seamlessly integrate intelligent chatbots into third-party websites, Facebook, and more.

## ✨ Key Features

- **Omnichannel Integration:** Connects effortlessly across custom websites, Facebook fan pages, and more.
- **Embeddable Widget:** Comes with a custom JavaScript embed code, allowing non-technical users to inject the chatbot into any third-party website with a single line of code.
- **Smart Product Recommendations:** Leverages AI (OpenAI, Replicate, Jina AI) to understand customer intent and suggest products dynamically.
- **Automated Order Tracking:** Customers can query their order status directly through the chat interface.
- **Comprehensive Dashboard:** A fully responsive admin panel for sellers to manage products, promotions, AI knowledge base (memory), and view conversation analytics.

## 🛠 Tech Stack

Our platform is built with modern web technologies, ensuring performance, scalability, and an excellent developer experience.

### Frontend
- **Framework:** Next.js, React 19
- **Styling:** Tailwind CSS, Framer Motion (Animations)
- **State Management:** Redux Toolkit, React-Redux
- **Authentication:** NextAuth.js

### Backend & AI Infrastructure
- **Server:** Node.js, Express, TypeScript
- **Database:** MongoDB (with Vector Search) & Redis (Caching/Sessions)
- **AI Models:** 
  - OpenAI (Generative & Embeddings)
  - Jina AI (CLIP models for visual search)
  - Replicate
- **Media & Storage:** Bunny.net, Cloudinary

## 🚀 Getting Started

We provide two ways to run the project locally. Using Docker is the recommended approach for the simplest setup.

### Option 1: Docker (Recommended)
You do not need MongoDB or Redis installed locally. Docker will spin up the entire Full-stack application for you.

1. Ensure [Docker Desktop](https://www.docker.com/products/docker-desktop/) is installed.
2. Clone the repository: 
   ```bash
   git clone https://github.com/quocbahuynh/ViqiumAI.git
   ```
3. Copy `.env.example` to `.env` and fill in your API keys (OpenAI, etc.).
4. Run the application:
   ```bash
   docker-compose up --build -d
   ```
   - **Frontend** will be available at `http://localhost:3000`
   - **Backend API** will be available at `http://localhost:5000`

### Option 2: Native Setup
1. Ensure Node.js (v20+), MongoDB, and Redis are running locally.
2. Run `npm install` at the root directory to install all dependencies.
3. Copy `.env.example` to `.env` and configure your credentials.
4. Start both the frontend and backend concurrently:
   ```bash
   npm run dev
   ```

## 📜 Available Scripts

From the root directory, you can run:
- `npm run dev` - Starts the development servers (frontend and backend) concurrently.
- `npm run build` - Compiles the backend TypeScript and builds the Next.js frontend for production.
- `npm start` - Starts the compiled production versions of both applications concurrently.
- `npm run lint` - Runs ESLint across the codebase.
- `npm run format` - Formats code using Prettier.

## 🤝 Contributing
Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.
