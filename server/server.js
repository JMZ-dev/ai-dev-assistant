import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(helmet());
app.use(express.json({ limit: "1mb" }));
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
  })
);

app.use(
  "/api/",
  rateLimit({
    windowMs: 60 * 1000,
    limit: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "Too many requests. Please try again in a moment." },
  })
);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "AI Dev Assistant API" });
});

app.post("/api/ask", async (req, res) => {
  try {
    const { prompt, mode } = req.body;

    if (!prompt || typeof prompt !== "string" || prompt.trim().length < 3) {
      return res.status(400).json({ error: "Please enter a valid prompt." });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: "OPENAI_API_KEY is missing on the server." });
    }

    const systemPrompt = buildSystemPrompt(mode);

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        temperature: 0.3,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt.trim() },
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data?.error?.message || "AI provider error.",
      });
    }

    res.json({
      reply: data.choices?.[0]?.message?.content || "No response generated.",
      model: MODEL,
    });
  } catch (error) {
    res.status(500).json({ error: "Server error. Please try again later." });
  }
});

function buildSystemPrompt(mode = "assistant") {
  const base =
    "You are a professional AI developer assistant. Give clear, practical, beginner-friendly answers. Prefer clean code, security, maintainability, and concise explanations.";

  const modes = {
    debug: "Focus on debugging. Identify the likely cause, explain it simply, and propose a corrected solution.",
    code: "Focus on generating clean production-ready code with useful comments.",
    explain: "Focus on explaining the concept step by step in simple terms.",
    resume: "Focus on improving technical resume wording in a professional ATS-friendly style.",
    assistant: "Help with programming, architecture, API design, and productivity.",
  };

  return `${base} ${modes[mode] || modes.assistant}`;
}

// Serve the React build in production when copied/deployed with the server.
const clientBuildPath = path.join(__dirname, "..", "client", "dist");
app.use(express.static(clientBuildPath));
app.get("*", (req, res) => {
  res.sendFile(path.join(clientBuildPath, "index.html"));
});

app.listen(PORT, () => {
  console.log(`AI Dev Assistant server running on port ${PORT}`);
});
