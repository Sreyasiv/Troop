const express = require("express");
const router = express.Router();
const axios = require("axios");

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
console.log("OPENROUTER_API_KEY is set:", !!OPENROUTER_API_KEY);

// Helper to call Gemma via OpenRouter
const callGemma = async (prompt) => {
  try {
    console.log("🔁 Sending prompt to Gemma:", prompt);

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "google/gemma-2-9b-it:free",
        messages: [
          {
            role: "system",
            content:
              "You are Compa, a helpful college senior bot. For autocomplete, only return a short user question completion.Make sure your answer is related to college. Don't ask questions back.",
          },
          { role: "user", content: prompt },
        ],
        max_tokens: 30,
        temperature: 0.5,
      },
      {
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Gemma raw response:", JSON.stringify(response.data));
    let raw = response.data.choices[0]?.message?.content || '';
    let cleaned = raw.trim().replace(/^[:\n" ]+/, ""); // remove leading colons, quotes, newlines, spaces
    return cleaned;
  } catch (err) {
    console.error("❌ Gemma API error:", err.response?.data || err.message);
    if (err.response) {
      console.error("❌ Gemma API error response data:", err.response.data);
  }
    throw err;
  }
};

// 🔹 Route for main chat
router.post("/", async (req, res) => {
  const { prompt } = req.body;

  try {
    const response = await callGemma(prompt);
    res.json({ suggestion: response });
  } catch (err) {
    let message = "Gemma failed to respond 😓";

    if (err.response?.data?.error?.message?.includes("quota")) {
      message = "Your token quota is over for today 💔";
    } else if (err.response?.data?.error?.message?.includes("context_length_exceeded")) {
      message = "Your message is too long 💬✂️";
    } else if (err.code === "ECONNABORTED" || err.message.includes("timeout")) {
      message = "Gemma took too long to respond ⏱️";
    }

    res.status(500).json({ suggestion: `Gemma: ${message}` });
  }
});

// 🔹 Route for autocomplete
router.post("/autocomplete", async (req, res) => {
  const { prompt } = req.body;

  console.log("💬 Autocomplete request received:", prompt);

  if (!prompt || prompt.trim() === "") {
    return res.json({ suggestion: "" });
  }

  try {
    const autoPrompt = `User started typing: "${prompt}"\nPredict their full question. ONLY return a possible continuation (no quotes, no intro, no explanation).`;
    console.log("🟡 About to callGemma");
    const suggestion = await callGemma(autoPrompt);
    console.log("🟢 callGemma returned:", suggestion);

    res.json({ suggestion });
  } catch (err) {
    console.error("🔴 Error in autocomplete route:", err);
    let message = "Failed to get autocomplete from Gemma";

    if (err.response?.data?.error?.message?.includes("quota")) {
      message = "Your token quota is over for today 💔";
    } else if (err.response?.data?.error?.message?.includes("context_length_exceeded")) {
      message = "Your message is too long 💬✂️";
    } else if (err.code === "ECONNABORTED" || err.message.includes("timeout")) {
      message = "Gemma took too long to respond ⏱️";
    }

    res.status(500).json({ suggestion: `Gemma: ${message}` });
  }
});

module.exports = router;
