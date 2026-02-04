import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import multer from "multer";
import { GoogleGenAI } from "@google/genai";

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ storage: multer.memoryStorage() });

if (!process.env.GEMINI_API_KEY) {
  console.error("❌ GEMINI_API_KEY missing");
  process.exit(1);
}

const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

console.log("✅ Gemini ready");

app.post(
  "/calculate-risk",
  upload.single("image"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "Please upload an X-ray image" });
      }

      if (!req.file.mimetype.startsWith("image/")) {
        return res.status(400).json({ message: "Invalid file type" });
      }

      const { age, gender, bmi, side, modeOfInjuring } = req.body;

      if (!age || !gender || !bmi) {
        return res.status(400).json({
          message: "age, gender, bmi required",
        });
      }

      const imagePart = {
        inlineData: {
          data: req.file.buffer.toString("base64"),
          mimeType: req.file.mimetype,
        },
      };

      const prompt = `
You are an orthopedic AI.

1️⃣ First determine if the image is a diagnostic X-ray.
If NOT X-ray → return:
{ "error": "not_xray" }

2️⃣ If X-ray, calculate implant failure risk.

Return ONLY valid JSON:
{
  "risk": number
}

risk valid range: 0.01 - 99.99

Patient details:
Age: ${age}
Gender: ${gender}
BMI: ${bmi}
Side: ${side || "unknown"}
Mode Of Injuring: ${modeOfInjuring || "unknown"}
`;

      const result = await genAI.models.generateContent({
        model: "models/gemini-2.5-flash",
        contents: [
          {
            role: "user",
            parts: [
              { text: prompt },
              imagePart,
            ],
          },
        ],
      });

      const text =
        result.candidates?.[0]?.content?.parts
          ?.map(p => p.text || "")
          .join("")
          .trim();

      if (!text) {
        throw new Error("Empty Gemini response");
      }

      const cleaned = text.replace(/```json|```/g, "").trim();

      let parsed;
      try {
        parsed = JSON.parse(cleaned);
      } catch {
        return res.status(500).json({
          message: "Invalid Gemini JSON",
          raw: text,
        });
      }

      if (parsed.error === "not_xray") {
        return res.status(400).json({
          message: "Uploaded image is not a valid X-ray",
        });
      }

      let risk = Number(parsed.risk);
      if (isNaN(risk)) {
        return res.status(500).json({
          message: "Risk is not numeric",
        });
      }

      risk = Math.max(0.01, Math.min(99.99, risk));
      risk = Number(risk.toFixed(2));

      let riskLevel = "Low";
      if (risk >= 11 && risk <= 50) riskLevel = "Moderate";
      if (risk >= 51) riskLevel = "High";

      res.json({
        risk,
        riskLevel,
        provider: "gemini",
        createdAt: new Date(),
      });

      console.log("✅ RISK:", risk, riskLevel);

    } catch (err) {
      console.error("❌ GEMINI ERROR:", err);
      res.status(500).json({
        message: "Server busy. Please try again later",
      });
    }
  }
);

app.listen(5000, () => {
  console.log("🚀 Server running http://localhost:5000");
});
