// ============================================================
// Roadmap Generator — AI-Powered Personalized Career Roadmap
// ============================================================
// Uses Gemini AI to generate a structured learning roadmap
// based on the user's skill gap analysis, target role,
// and resume feedback.
//
// Input:  gap analysis result + user feedback
// Output: phased roadmap with milestones, timelines, resources
// ============================================================

import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

/**
 * Generate a personalized career roadmap using Gemini AI.
 *
 * @param {Object} params
 * @param {string} params.targetRole - The user's target career role
 * @param {Array}  params.masteredSkills - Skills the user has met requirements for
 * @param {Array}  params.gapSkills - Skills the user has but needs to improve
 * @param {Array}  params.missingSkills - Skills the user doesn't have at all
 * @param {Object} params.feedback - Resume feedback (strengths, weaknesses, improvements)
 * @param {Array}  params.userSkills - User's current skills with levels
 *
 * @returns {Object} Parsed roadmap object with phases and milestones
 */
export async function generateRoadmap({
  targetRole,
  masteredSkills,
  gapSkills,
  missingSkills,
  feedback,
  userSkills,
}) {
  // ── Build context strings for the prompt ──
  const masteredStr =
    masteredSkills.length > 0
      ? masteredSkills
          .map(
            (s) =>
              `${s.name} (required: level ${s.level}, user: level ${s.userLevel})`,
          )
          .join(", ")
      : "None";

  const gapStr =
    gapSkills.length > 0
      ? gapSkills
          .map(
            (s) =>
              `${s.name} (required: level ${s.level}, current: level ${s.userLevel}, gap: ${s.gap})`,
          )
          .join(", ")
      : "None";

  const missingStr =
    missingSkills.length > 0
      ? missingSkills
          .map(
            (s) =>
              `${s.name} (required: level ${s.level}, weight: ${s.weight})`,
          )
          .join(", ")
      : "None";

  const currentSkillsStr =
    userSkills && userSkills.length > 0
      ? userSkills.map((s) => `${s.name} (${s.level})`).join(", ")
      : "None listed";

  const weaknessesStr =
    feedback?.weaknesses?.length > 0
      ? feedback.weaknesses.join("; ")
      : "No specific weaknesses identified";

  const improvementsStr =
    feedback?.improvements?.length > 0
      ? feedback.improvements.join("; ")
      : "No specific improvements suggested";

  const strengthsStr =
    feedback?.strengths?.length > 0
      ? feedback.strengths.join("; ")
      : "No specific strengths identified";

  // ── Gemini AI call with structured output ──
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `You are an expert career coach and learning path designer.

Generate a detailed, personalized career roadmap for a student targeting the role of "${targetRole}".

=== STUDENT PROFILE ===
Current Skills: ${currentSkillsStr}
Strengths: ${strengthsStr}
Weaknesses: ${weaknessesStr}
Suggested Improvements: ${improvementsStr}

=== SKILL GAP ANALYSIS ===
Mastered Skills (already met requirements): ${masteredStr}
Skills Needing Improvement: ${gapStr}
Missing Skills (not learned yet): ${missingStr}

=== INSTRUCTIONS ===
1. Create 3-5 learning phases, ordered from foundational to advanced.
2. Prioritize missing skills with higher weight first, then gap skills.
3. Skills already mastered should appear in early phases marked as "completed".
4. Each phase should have 2-4 milestones with actionable, specific tasks.
5. Provide realistic time estimates based on skill complexity.
6. Suggest real, helpful resources (courses from Udemy, Coursera, YouTube channels, documentation, project ideas).
7. The final phase should always focus on job readiness (portfolio, resume, interview prep).
8. Make the roadmap practical and achievable for a college student.`,

    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: "object",
        properties: {
          phases: {
            type: "array",
            items: {
              type: "object",
              properties: {
                phaseNumber: { type: "number" },
                title: { type: "string" },
                description: { type: "string" },
                estimatedWeeks: { type: "number" },
                milestones: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      id: { type: "number" },
                      title: { type: "string" },
                      description: { type: "string" },
                      skills: {
                        type: "array",
                        items: { type: "string" },
                      },
                      estimatedDays: { type: "number" },
                      resources: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            title: { type: "string" },
                            url: { type: "string" },
                            type: {
                              type: "string",
                              enum: [
                                "course",
                                "project",
                                "article",
                                "video",
                                "certification",
                              ],
                            },
                          },
                          required: ["title", "url", "type"],
                        },
                      },
                      status: {
                        type: "string",
                        enum: ["completed", "in-progress", "upcoming"],
                      },
                    },
                    required: [
                      "id",
                      "title",
                      "description",
                      "skills",
                      "estimatedDays",
                      "resources",
                      "status",
                    ],
                  },
                },
              },
              required: [
                "phaseNumber",
                "title",
                "description",
                "estimatedWeeks",
                "milestones",
              ],
            },
          },
        },
        required: ["phases"],
      },
    },
  });

  // ── Parse the response ──
  const candidate = response.candidates?.[0];
  const textResponse = candidate?.content?.parts?.[0]?.text;

  if (!textResponse) {
    console.error("AI Response Error:", JSON.stringify(response, null, 2));
    throw new Error("Failed to generate roadmap content");
  }

  let parsedRoadmap;
  try {
    parsedRoadmap = JSON.parse(textResponse);
  } catch (parseError) {
    console.error("JSON parse failed:", parseError.message);

    // Attempt to extract JSON if wrapped in text
    const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        parsedRoadmap = JSON.parse(jsonMatch[0]);
      } catch (innerError) {
        throw new Error("Failed to extract valid JSON from roadmap response");
      }
    } else {
      throw new Error("No JSON object found in roadmap response");
    }
  }

  // ── Auto-set statuses based on gap analysis ──
  // Mastered skill names for quick lookup
  const masteredNames = new Set(
    masteredSkills.map((s) => s.name.toLowerCase()),
  );
  const gapNames = new Set(gapSkills.map((s) => s.name.toLowerCase()));

  if (parsedRoadmap.phases) {
    for (const phase of parsedRoadmap.phases) {
      if (phase.milestones) {
        for (const milestone of phase.milestones) {
          // Check if ALL skills in this milestone are mastered
          const milestoneSkills = milestone.skills || [];
          const allMastered =
            milestoneSkills.length > 0 &&
            milestoneSkills.every((s) => masteredNames.has(s.toLowerCase()));
          const someInProgress = milestoneSkills.some((s) =>
            gapNames.has(s.toLowerCase()),
          );

          if (allMastered) {
            milestone.status = "completed";
          } else if (someInProgress) {
            milestone.status = "in-progress";
          } else {
            milestone.status = milestone.status || "upcoming";
          }
        }
      }
    }
  }

  return parsedRoadmap;
}
