import express from "express";
import mongoose from "mongoose";
import passport from "passport";
import authRoutes from './routes/authLocalRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import professionRoutes from './routes/professionRoutes.js';
import productRoutes from './routes/productRoutes.js';
import promotionRoutes from './routes/promotionRoutes.js'
import classificationRoutes from './routes/classificationRoutes.js';
import photoRoute from './routes/photoRoutes.js';
import orderRoute from './routes/orderRoutes.js';
import statisticRoute from './routes/statisticRoutes.js';
import chatbotRoute from './routes/chatbotRoutes.js';
import facebookRoutes from './routes/facebookRoutes.js'
import chatboxRoute from './routes/chatBoxRoutes.js'
import setupSwagger from './config/swagger.js';
import dotenv from 'dotenv';
import cors from 'cors';
import { seedProfessions } from "./seed/professionSeeder.js";
import compression from "compression";
import { seedClassification } from "./seed/classificationSeeder.js";
import { seedValueClassification } from "./seed/valueClasificationSeeder.js";
import { seedPromote } from "./seed/promoteSeeder.js";
import { seedPlan } from "./seed/planSeeder.js";
import { analysistConverstation, cronMessageStatisticJob } from "./services/messageStatisticService.js";
import FacebookFanpage from "./models/FacebookFanpage.js";
import { answer } from "./controllers/chatBotController.js";
import { baseInformationCollection } from "./mongovector.js";
import crypto from "crypto";
import ImageEmbed from "./models/ImageEmbed.js";
import { getVectorEmbedPhoto } from "./ai/embedImage.js";
import { redisClient, connectRedis } from './config/redis.js';
import { errorHandler } from "./middleware/errorHandler.js";
dotenv.config();

const app = express();

// const corsOptions = {
//   origin: function (origin, callback) {
//     if (!origin) return callback(null, true); // Allow non-browser tools like curl

//     const allowed = [
//       'https://www.viqium.com'
//     ];

//     const isLocalhost = /^http:\/\/localhost:\d+$/.test(origin);

//     if (allowed.includes(origin) || isLocalhost) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   }
// };

app.use(cors());

const BACKEND_URL = process.env.BACKEND_URL;
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(passport.initialize());
app.use(
  compression({
    level: 9, // compression level (0-9)
    threshold: 1024, // only compress if response > 1kb
  })
);


async function startServer() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB Connected');

    // Seed data
    await seedPlan();
    await seedProfessions();
    await seedPromote();
    await seedClassification();
    await seedValueClassification();


    // Connect Redis
    await connectRedis();


    // Start cron jobs
    cronMessageStatisticJob.start();

  } catch (err) {
    console.error('❌ Server start error:', err);
    process.exit(1);
  }
}

startServer();
setupSwagger(app);




app.use("/api/auth", authRoutes);
app.use("/api/project", projectRoutes)
app.use("/api/profile", profileRoutes)
app.use("/api/product", productRoutes)
app.use("/api/promotion", promotionRoutes)
app.use("/api/profession", professionRoutes)
app.use("/api/chatbot", chatbotRoute);
app.use("/api/facebook", facebookRoutes)
app.use("/api/classification", classificationRoutes)
app.use("/api/photo", photoRoute)
app.use("/api/order", orderRoute)
app.use("/api/statistic", statisticRoute)
app.use("/api/chatbox", chatboxRoute)

app.use(errorHandler);

app.listen(5000, () => console.log("🚀 Server running on port 5000"));
