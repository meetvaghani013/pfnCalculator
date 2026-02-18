import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import multer from "multer";
import { GoogleGenerativeAI } from "@google/generative-ai";

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ storage: multer.memoryStorage() });


if (!process.env.GEMINI_API_KEY) {
  console.error("❌ GEMINI_API_KEY missing");
  process.exit(1);
}


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "models/gemini-2.5-flash",
});

console.log(process.env.GEMINI_API_KEY ? "✅ Gemini ready" : "❌ Gemini not ready");


app.post(
  "/calculate-risk",
  upload.single("image"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          message: "Please upload an X-ray image",
        });
      }

      if (!req.file.mimetype.startsWith("image/")) {
        return res.status(400).json({
          message: "Invalid file type",
        });
      }

      console.log("BODY:", req.body);
      console.log("FILE:", req.file.originalname);

      const {
        age,
        gender,
        bmi,
        side,
        modeOfInjuring,
        // aoota,
        // stability,
        // calcar,
        // lateralWall,
        // reduction,
        // tad,
        // neckShaftAngle,
        // nailLength,
        // legScrew,
      } = req.body;

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




      // AO / OTA: ${ aoota }
      // Stability: ${ stability }
      // Calcar: ${ calcar }
      // Lateral Wall: ${ lateralWall }
      // Reduction: ${ reduction }
      // TAD: ${ tad }
      // Neck Shaft Angle: ${ neckShaftAngle }
      // Nail Length: ${ nailLength }
      // Screw Position: ${ legScrew }


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
Side: ${side}
Mode Of Injuring: ${modeOfInjuring}
`;

      const result = await model.generateContent([
        prompt,
        imagePart,
      ]);

      const text = result.response.text();
      const cleaned = text.replace(/```json|```/g, "").trim();

      let parsed;
      try {
        parsed = JSON.parse(cleaned);
      } catch {
        return res.status(500).json({
          message: "Invalid Gemini JSON",
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
      console.error("GEMINI ERROR:", err.message);
      res.status(500).json({
        message: "Server busy. Please try again later",
      });
    }
  }
);

app.listen(5000, () => {
  console.log("🚀 Server running http://localhost:5000");
});




