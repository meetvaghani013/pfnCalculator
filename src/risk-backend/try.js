import dotenv from "dotenv";
dotenv.config();

import { GoogleGenAI } from "@google/genai";

const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function checkKey() {
  try {
    const models = await genAI.models.listModels();
    console.log("✅ API Key is active! Models you can access:");
    models.forEach((m) => console.log("-", m.name));
  } catch (err) {
    console.error("❌ API Key problem:", err);
  }
}

checkKey();
