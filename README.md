# Viqium AI - E-Commerce Chatbot Platform

![Viqium AI Overview](https://tuananhdo0308.github.io/TuananhDo_Portfolio/images/Viqium.png)

An automated AI Chatbot Platform designed specifically for e-commerce sellers, especially fashion shops, to handle customer inquiries, recommend products, execute sales strategies, and manage orders across multiple platforms.

Viqium AI empowers sellers to automate their sales processes, dramatically reduce response times, and seamlessly integrate intelligent chatbots into third-party websites and Facebook fan pages.

## Key Features

### Omnichannel Integration
- **Integrate Chatbot with Fanpages:** Automatically connect and manage conversations from your Facebook Fanpages 24/7.
- **Integrate Chatbot with Websites:** Comes with a custom JavaScript embed code, allowing users to inject the chatbot into any third-party website with a single line of code.

### Advanced AI Sales Skills & Upselling
Train your chatbot with specific sales and upselling skills to maximize revenue:
- **Discount Campaigns:** Create and deploy product discount campaigns.
- **Gift Promotions:** Offer automated gifts to customers when they purchase specific products.
- **Wholesale Pricing:** Handle B2B inquiries and offer bulk/wholesale pricing.
- **Combo Deals:** Recommend and execute savings combos to increase the average order value.

### Data & Product Management
- **Product Uploads:** Easily upload and manage your product catalog.
- **RAG Data (Retrieval-Augmented Generation):** Train the AI on your specific business knowledge base, documents, and product data so it answers questions accurately based on your rules.

### Order Tracking & Analytics
- **Dashboard Analytics:** A comprehensive dashboard to monitor and track the number of successfully closed orders by the AI.
- **Automated Email Notifications:** Automatically send email notifications to the seller/customer as soon as an order is successfully closed.

## Tech Stack

Our platform is built with modern web technologies, ensuring performance, scalability, and an excellent developer experience.

### Frontend
- Framework: Next.js, React 19
- Styling: Tailwind CSS, Framer Motion
- State Management: Redux Toolkit
- Authentication: NextAuth.js

### Backend & AI Infrastructure
- Server: Node.js, Express, TypeScript
- Database: MongoDB (with Vector Search) & Redis (Caching/Sessions)
- AI Models: 
  - OpenAI (Generative & Embeddings)
  - Jina AI (CLIP models for visual search)
  - Replicate
- Media & Storage: Bunny.net, Cloudinary


## Available Scripts

From the root directory, you can run:
- `npm run dev` - Starts the development servers (frontend and backend) concurrently.
- `npm run build` - Compiles the backend TypeScript and builds the Next.js frontend for production.
- `npm start` - Starts the compiled production versions of both applications concurrently.
- `npm run lint` - Runs ESLint across the codebase.
- `npm run format` - Formats code using Prettier.

## Contributing
Please read CONTRIBUTING.md for details on our code of conduct and the process for submitting pull requests.
