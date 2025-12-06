import { GoogleGenAI, Type } from "@google/genai";
import { SYSTEM_INSTRUCTION, MODEL_NAME } from "../constants";
import { NeuroLensResponse } from "../types";

// Initialize Gemini client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeContent = async (
  base64Data: string,
  mimeType: string
): Promise<NeuroLensResponse> => {
  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Data,
            },
          },
          {
            text: "Analyze this content. Detect the friction. Provide the solution.",
          },
        ],
      },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            detected_task: {
              type: Type.STRING,
              description: "What the user was trying to do",
            },
            friction_point: {
              type: Type.STRING,
              description: "The part causing frustration",
            },
            solution: {
              type: Type.STRING,
              description: "The full generated final solution",
            },
            action_output: {
              type: Type.STRING,
              description: "Copyable output for direct use",
            },
            reason_map: {
              type: Type.STRING,
              description: "Explain the thinking behind the friction detection",
            },
          },
          required: [
            "detected_task",
            "friction_point",
            "solution",
            "action_output",
            "reason_map",
          ],
        },
      },
    });

    if (!response.text) {
      throw new Error("No response text from Gemini");
    }

    const result = JSON.parse(response.text) as NeuroLensResponse;
    return result;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};
