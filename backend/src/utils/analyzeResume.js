import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();

const ai = new GoogleGenAI({apiKey: process.env.GOOGLE_API_KEY });

export async function analyzeResume(text) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Analyze this resume and provide feedback on its strengths and weaknesses. Also suggest improvements to make it more ATS-friendly. The resume text is: ${text}
    give me the output strictly in this json format:
{
  "skills": [{"name":string,"level":string}],
  "atsScore":number,
  "feedback":string
}
    `,
  });
  // console.log(response.text);
  return response.text;
}
