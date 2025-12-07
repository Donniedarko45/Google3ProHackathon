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
              description: "The inferred user goal (e.g. 'Build a Login Form', 'Debug CI Pipeline').",
            },
            friction_point: {
              type: Type.STRING,
              description: "The specific technical or UX flaw causing the issue.",
            },
            solution: {
              type: Type.STRING,
              description: "A strategic explanation of the fix (methodology, design choices, logic improvements).",
            },
            action_output: {
              type: Type.STRING,
              description: "The final, polished, and corrected artifact (Code, Text, or Data) ready for use.",
            },
            reason_map: {
              type: Type.STRING,
              description: "Short logic trace of how the issue was identified.",
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
