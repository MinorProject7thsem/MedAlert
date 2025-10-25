import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai"; // ✅ new official SDK

dotenv.config();

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

/**
 * Run health analysis using Gemini (new SDK, no web search).
 * Tries to parse strict JSON from the model; falls back to safe structure.
 */
export const runLLMAnalysis = async ({ ocrResult, userNotes, healthSnapshot }) => {
  const prompt = `
You are a health analysis assistant. Use ONLY the OCR data, user notes, and health profile.
DO NOT use web search or any external sources — rely only on the provided OCR, user notes, and health profile.
STRICTLY return JSON in this format:

{
  "usefulIngredients": [
    { "name": "Protein", "rationale": "Helps muscle growth", "quantityLimit": "Max 200g/day" }
  ],
  "harmfulIngredients": [
    { "name": "Sugar", "rationale": "Raises blood sugar", "quantityLimit": "Avoid completely" }
  ],
  "consumptionGuidelines": "Do not exceed 2 scoops per day",
  "foodSuggestions": "Combine with vegetables for fiber",
  "summary": "This product is safe for moderate use but risky for diabetics"
}

OCR RESULT:
${JSON.stringify(ocrResult ?? {}, null, 2)}

USER NOTES:
${userNotes || "N/A"}

HEALTH PROFILE:
${JSON.stringify(healthSnapshot ?? {}, null, 2)}

Make sure you are suggesting the personalized result with reference to the health profile of the user and in summary mention a little about their health profile in a personalized manner.
Most important: Do not miss summary in the response. foodsuggestions in json response should always be string type only.
`;

  try {
    const modelId = "gemini-2.0-flash"; // ✅ Updated to supported model
    const result = await genAI.models.generateContent({
      model: modelId,
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    });

    // ✅ Extract text using new SDK's response format
    let rawText = result?.text ?? null;

    // ✅ Fallback for unexpected response shapes
    if (!rawText) {
      rawText =
        result?.output?.[0]?.content?.[0]?.text ??
        result?.candidates?.[0]?.content?.[0]?.text ??
        null;
    }

    // ✅ Attempt to parse JSON safely
    let parsed = null;
    if (rawText) {
      try {
        parsed = JSON.parse(rawText);
      } catch {
        const match = rawText.match(/\{[\s\S]*\}/);
        if (match) {
          try {
            parsed = JSON.parse(match[0]);
          } catch {
            parsed = null;
          }
        }
      }
    }

    // ✅ Fallback if parsing failed
    if (!parsed) {
      parsed = {
        usefulIngredients: [],
        harmfulIngredients: [],
        consumptionGuidelines: "",
        foodSuggestions: "",
        summary: "",
        _raw_model_output: rawText ?? "[no text returned]",
      };
    }

    return {
      ...parsed,
      model: modelId,
      usedWebSearch: false,
      groundingMetadata: null,
    };
  } catch (err) {
    console.error("Gemini request failed:", err?.message ?? err);
    return {
      usefulIngredients: [],
      harmfulIngredients: [],
      consumptionGuidelines: "",
      foodSuggestions: "",
      summary: "",
      model: "gemini-2.0-flash",
      usedWebSearch: false,
      groundingMetadata: null,
      error: err?.message ?? String(err),
    };
  }
};