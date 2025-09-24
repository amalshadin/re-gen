// import { GEMINI_API_KEY } from '@env';
import Constants from 'expo-constants';
const GEMINI_API_KEY = Constants.expoConfig.extra.geminiApiKey;

import { GoogleGenerativeAI } from '@google/generative-ai';
import * as FileSystem from 'expo-file-system/legacy';

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export const testGeminiConnection = async () => {
  try {
    console.log("Running Gemini connection test with model: gemini-1.5-flash");
    // Using the same reliable model as the main function
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); 
    const prompt = "Hello, world. If you can see this, respond with a single word: success.";
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log("Gemini Test Response:", text);
    return text;
  } catch (error) {
    console.error("Gemini connection test FAILED:", error);
    throw error;
  }
};

const imageToGenerativePart = async (uri, mimeType) => {
  const base64ImageData = await FileSystem.readAsStringAsync(uri, {
    encoding: 'base64',
  });
  return {
    inlineData: {
      data: base64ImageData,
      mimeType,
    },
  };
};

export const analyzeItemWithGemini = async (imageUri) => {
  console.log("Connecting to real Gemini API...");
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `
      Analyze the item in this image and provide a JSON response with the following structure:
      {
        "id": "scan_CURRENT_TIMESTAMP",
        "itemName": "The common name of the main item",
        "disposalMethod": "A concise, actionable instruction on how to properly dispose of this item (e.g., 'Recycle in blue bin', 'Dispose in general waste', 'Take to e-waste facility').",
        "alternative": "A practical, sustainable alternative to this item.",
        "upcyclingIdea": "A creative and simple idea to upcycle or reuse this item.",
        "ecoTip": "A short, encouraging environmental tip related to this item or its material.",
        "ecoPoints": 10,
        "timestamp": "CURRENT_ISO_8601_TIMESTAMP"
      }
      Be accurate and concise. If you cannot identify the item, return a JSON object with an "error" key.
    `;
    const imagePart = await imageToGenerativePart(imageUri, 'image/jpeg');
    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const text = response.text();
    const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const jsonResponse = JSON.parse(cleanedText);
    jsonResponse.id = `scan_${Date.now()}`;
    jsonResponse.timestamp = new Date().toISOString();
    console.log("Gemini Analysis Successful:", jsonResponse);
    return jsonResponse;
  } catch (error) {
    console.error("Error analyzing with Gemini:", error);
    throw new Error("Failed to get a valid response from the AI.");
  }
};