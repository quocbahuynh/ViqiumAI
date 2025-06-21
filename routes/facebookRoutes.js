import express from 'express';
import { handleMessage, messengerWebhook } from '../controllers/facebookWebhook.js';
const router = express.Router();

router.get("/webhook", messengerWebhook);
router.post("/webhook", handleMessage);

export default router;
