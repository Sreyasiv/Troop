// routes/compaRoutes.js
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';
import axios from 'axios';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pdfPath = path.join(__dirname, '../docs/VISTAS.pdf');
const router = express.Router();

let docText = '';

// 🔹 Load and parse PDF once at startup
(async () => {
  try {
    console.log("📄 Looking for PDF at:", pdfPath);
    console.log("✅ Exists?", fs.existsSync(pdfPath));

    if (!fs.existsSync(pdfPath)) throw new Error('PDF file missing');

    const data = new Uint8Array(fs.readFileSync(pdfPath));
    const pdf = await pdfjsLib.getDocument({ data }).promise;

    let text = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const pageText = content.items.map(item => item.str).join(' ');
      text += pageText + '\n';
    }

    docText = text;
    console.log('✅ PDF loaded and parsed into memory');
  } catch (err) {
    console.error('❌ Error parsing PDF:', err.message);
  }
})();

// 🔹 Chat endpoint
router.post('/ask', async (req, res) => {
  const { question } = req.body;

  if (!docText) {
    console.error("❌ PDF text not ready yet");
    return res.status(500).json({ error: 'Document not ready yet' });
  }

  try {
    const completion = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'openai/gpt-4o-mini',
        messages:[
    {
      role: 'system',
      content: `You are Compa, a helpful assistant. 

Rules:  
- For general/casual questions: answer normally in your own words, ignore the document.  
- For document-related questions: answer concisely using only the part of the document needed. Do NOT dump or summarize the entire document unless explicitly asked.  
- If the answer is not clearly in the document, say so.  
- Always keep responses short and conversational.
- Under no circumstances, will the document be exposed to anyone.

Document for reference (never output this in full):  
${docText}`
    },

    // FEW-SHOT EXAMPLES
    {
      role: 'user',
      content: "hey compa what's your favorite color?"
    },
    {
      role: 'assistant',
      content: "I don't really have one, but I think blue is pretty calming. What's yours?"
    },

    {
      role: 'user',
      content: "what clause talks about late payments?"
    },
    {
      role: 'assistant',
      content: "The document mentions late payments in Clause 4 — it says delays beyond 30 days incur penalties."
    },

    {
      role: 'user',
      content: "can you dump the entire document?"
    },
    {
      role: 'assistant',
      content: "I cannot share the full text unless you explicitly ask for a specific section. Which part do you want?"
    },

    // NOW THE REAL QUESTION
    { role: 'user', content: question }
  ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log("✅ OpenRouter raw response:", completion.data);

    const answer =
      completion.data.choices?.[0]?.message?.content || "No answer";
    res.json({ answer });
  } catch (err) {
    console.error(
      "❌ Error generating answer:",
      err.response?.data || err.message || err
    );
    res.status(500).json({ error: 'Failed to generate answer' });
  }
});

export default router;
