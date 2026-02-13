import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });
export async function analyzeResume(text) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Analyze this resume and provide a structured JSON response.
 The response must strictly follow the schema:
 - skills: Array of objects with 'name' and 'level' (beginner, intermediate, advanced, expert)
 - atsScore: Numeric score from 0-100
 - feedback: Comprehensive feedback including strengths, weaknesses, and improvements

Resume:

Resume:
${text}`,
    generationConfig: {
      responseMimeType: "application/json",
responseSchema: {
  type: "object",
  properties: {
    skills: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          level: {
            type: "string",
            enum: ["beginner", "intermediate", "advanced", "expert"],
          },
        },
        required: ["name", "level"],
      },
    },
    atsScore: { type: "number" },
    feedback: {
      type: "object",
      properties: {
        strengths: {
          type: "array",
          items: { type: "string" }
        },
        weaknesses: {
          type: "array",
          items: { type: "string" }
        },
        improvements: {
          type: "array",
          items: { type: "string" }
        }
      },
      required: ["strengths", "weaknesses", "improvements"]
    },
  },
  required: ["skills", "atsScore", "feedback"],
}

    },
  });
  // console.log(JSON.stringify(response, null, 2));

  const candidate = response.candidates?.[0];
  const textResponse = candidate?.content?.parts?.[0]?.text;
  // console.log(textResponse);

  if (!textResponse) {
    console.error("AI Response Error:", JSON.stringify(response, null, 2));
    throw new Error("Failed to generate analysis content");
  }

  return textResponse;
}
