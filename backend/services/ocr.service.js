import axios from "axios";
import FormData from "form-data";
import { GoogleGenAI } from "@google/genai";

const OCR_SPACE_API_URL = "https://api.ocr.space/parse/image";
const OCR_SPACE_API_KEY = process.env.OCR_SPACE_API_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Initialize Gemini via new SDK
const genAI = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

/**
 * Perform OCR using OCR.Space API
 */
export const getOcrText = async (imageBuffer, engineNumber = 2) => {
  try {
    const form = new FormData();
    form.append("apikey", OCR_SPACE_API_KEY);
    form.append("OCREngine", String(engineNumber));
    form.append("file", imageBuffer, {
      filename: "image.jpg",
      contentType: "image/jpeg",
    });

    const resp = await axios.post(OCR_SPACE_API_URL, form, {
      headers: form.getHeaders(),
      maxBodyLength: Infinity,
      timeout: 60_000,
    });

    const data = resp.data;
    if (data?.IsErroredOnProcessing) {
      console.warn("OCR.space error:", data.ErrorMessage);
      return "";
    }

    return data?.ParsedResults?.[0]?.ParsedText ?? "";
  } catch (err) {
    console.error("OCR request failed:", err?.message ?? err);
    return "";
  }
};

/**
 * Extract structured data (product name, description, ingredients) from OCR text
 */
export const extractStructuredData = async (textToAnalyze) => {
  if (!textToAnalyze || !String(textToAnalyze).trim()) return null;

  const basePrompt = () => `
You are an expert data extractor for packaged health / food products (e.g., dietary supplements, powders, breakfast cereals, health bars).
Return a SINGLE JSON object only (no commentary, no code fences, no extra text) with product identification and ingredients extracted from the text below.

IMPORTANT RULES:
1. Use only the given text. If unclear, infer productName and description.
2. If confident info missing, mark inferred flags as true.
3. Avoid hallucinations; never make up data not found or inferable.
4. Use concise, human-like tone for description.
5. Output strictly in JSON format with the following schema:

{
  "productName": string | null,
  "productNameInferred": boolean,
  "description": string | null,
  "descriptionInferred": boolean,
  "ingredients": [ "string", ... ] | [],
  "sources": [ "https://...", ... ],
  "confidence": number
}

TEXT IN IMAGE:
---
${textToAnalyze}
---
JSON:
`;

  const tryParseJson = (text) => {
    if (!text) return null;
    try {
      return JSON.parse(text);
    } catch {
      const match = text.match(/\{[\s\S]*\}/);
      if (match) {
        try {
          return JSON.parse(match[0]);
        } catch {
          return null;
        }
      }
      return null;
    }
  };

  try {
    const modelId = "gemini-2.5-flash";  // <– use a supported model
    const response1 = await genAI.models.generateContent({
      model: modelId,
      contents: [{ role: "user", parts: [{ text: basePrompt() }] }],
    });

    const rawText1 = response1?.text ?? "";
    if (!rawText1) {
      return { error: "No text returned from Gemini model." };
    }

    let parsed = tryParseJson(rawText1);

    if (!parsed) {
      const retryPrompt = `
The previous response did not return valid JSON. Below is your output:

---
${rawText1}
---

Please now return ONLY one strict JSON object that follows this schema:

{
  "productName": string | null,
  "productNameInferred": boolean,
  "description": string | null,
  "descriptionInferred": boolean,
  "ingredients": [ "string", ... ] | [],
  "sources": [ "https://...", ... ],
  "confidence": number
}

Return ONLY the JSON object, nothing else.
`;
      const response2 = await genAI.models.generateContent({
        model: modelId,
        contents: [{ role: "user", parts: [{ text: retryPrompt }] }],
      });

      const rawText2 = response2?.text ?? "";
      parsed = tryParseJson(rawText2);
      if (!parsed) {
        return {
          error: "Failed to parse JSON after retry.",
          _raw_model_output: rawText1,
        };
      }
    }

    const normalized = {
      productName: parsed.productName ?? null,
      productNameInferred: !!parsed.productNameInferred,
      description: parsed.description ?? null,
      descriptionInferred: !!parsed.descriptionInferred,
      ingredients:
        Array.isArray(parsed.ingredients) && parsed.ingredients.length
          ? parsed.ingredients.map((i) => String(i).trim())
          : [],
      sources: Array.isArray(parsed.sources)
        ? parsed.sources.filter((s) => typeof s === "string" && s.trim())
        : [],
      confidence:
        typeof parsed.confidence === "number"
          ? Math.max(0, Math.min(100, Math.round(parsed.confidence)))
          : 0,
    };

    return normalized;
  } catch (err) {
    console.error("AI Data Extraction Error:", err?.message ?? err);
    return { error: err?.message ?? String(err) };
  }
};