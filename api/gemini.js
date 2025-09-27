// gemini.js
import Constants from "expo-constants";
import { GoogleGenerativeAI } from "@google/generative-ai";
import * as FileSystem from "expo-file-system/legacy";

// Load API key from app config (via eas.json secrets or app.config.js)
const GEMINI_API_KEY = Constants.expoConfig.extra.geminiApiKey;

// Initialize Gemini client
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// ✅ New v1 model IDs
const MODEL_PRIORITIES = ["gemini-2.5-flash", "gemini-2.5-pro"];

// 🔎 Test connection with fallback logic
export const testGeminiConnection = async () => {
  let lastError;
  for (const modelName of MODEL_PRIORITIES) {
    try {
      console.log("🔎 Trying Gemini model:", modelName);
      const model = genAI.getGenerativeModel({ model: modelName });
      const prompt = "Reply only with: success";
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      console.log("✅ Gemini Test Response:", text);
      return text;
    } catch (error) {
      console.warn(`❌ Model ${modelName} not available:`, error);
      lastError = error;
    }
  }
  console.error("Gemini connection test FAILED:", lastError);
  throw new Error("No available Gemini models could be used.");
};

// 🖼 Convert image to inlineData for Gemini
const imageToGenerativePart = async (uri, mimeType) => {
  const base64ImageData = await FileSystem.readAsStringAsync(uri, {
    encoding: "base64",
  });
  return {
    inlineData: {
      data: base64ImageData,
      mimeType,
    },
  };
};

// 📸 Main function: Analyze item with Gemini
export const analyzeItemWithGemini = async (imageUri) => {
  console.log("Connecting to real Gemini API...");
  let lastError;

  for (const modelName of MODEL_PRIORITIES) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });

      const prompt = `
        Analyze the item in this image and provide a JSON response with this structure:
        {
          "id": "scan_CURRENT_TIMESTAMP",
          "itemName": "The common name of the main item",
          "disposalMethod": "Concise disposal method (Recycle, Trash, Compost, E-Waste, etc.)",
          "alternative": "A sustainable alternative to this item",
          "upcyclingIdea": "A creative reuse or upcycle idea",
          "ecoTip": "A short eco-friendly tip related to this item",
          "ecoPoints": 10,
          "timestamp": "CURRENT_ISO_8601_TIMESTAMP"
        }
        If you cannot identify the item, return: { "error": "Item not recognized" }
      `;

      const imagePart = await imageToGenerativePart(imageUri, "image/jpeg");

      const result = await model.generateContent([prompt, imagePart]);
      const response = await result.response;
      const text = response.text();

      // Clean and parse JSON
      const cleanedText = text.replace(/```json/g, "").replace(/```/g, "").trim();
      const jsonResponse = JSON.parse(cleanedText);

      // Add safe ID + timestamp
      jsonResponse.id = `scan_${Date.now()}`;
      jsonResponse.timestamp = new Date().toISOString();

      console.log("✅ Gemini Analysis Successful:", jsonResponse);
      return jsonResponse;
    } catch (error) {
      console.warn(`❌ Error with model ${modelName}:`, error);
      lastError = error;
    }
  }

  console.error("Error analyzing with Gemini:", lastError);
  throw new Error("Failed to get a valid response from the AI.");
};

