import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';
import axios from 'axios';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Put your PDF inside /public so Render includes it
const pdfPath = path.join(process.cwd(), 'public', 'VISTAS.pdf');

const router = express.Router();

let docText = '';

// 🔹 Load and parse PDF once at startup
export async function loadPdf() {
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
}

// Load immediately at startup
await loadPdf();

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
        messages: [
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

    const answer = completion.data.choices?.[0]?.message?.content || "No answer";
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
