import { GoogleGenAI, Type } from "@google/genai";
import { SYSTEM_INSTRUCTION, MODEL_NAME } from "../constants";
import { NeuroLensResponse, FileData } from "../types";

// Initialize Gemini client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeContent = async (
  files: FileData[]
): Promise<NeuroLensResponse> => {
  try {
    // map all files to inlineData parts
    const fileParts = files.map((file) => ({
      inlineData: {
        mimeType: file.mimeType,
        data: file.base64,
      },
    }));

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        parts: [
          ...fileParts,
          {
            text: "Analyze this input. Detect the friction. Provide the solution. Return strictly JSON.",
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
              description: "The inferred user goal.",
            },
            friction_point: {
              type: Type.STRING,
              description: "The source of frustration or the problem to solve.",
            },
            solution: {
              type: Type.STRING,
              description: "The strategy used to solve the problem.",
            },
            action_output: {
              type: Type.STRING,
              description: "The final usable result (Code, Text, or Data).",
            },
            reason_map: {
              type: Type.STRING,
              description: "Logic trace of the reasoning.",
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
