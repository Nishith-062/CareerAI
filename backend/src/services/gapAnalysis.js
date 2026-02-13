// ============================================================
// Gap Analysis Service — Normalized Skill Comparison Engine
// ============================================================
// This module compares user skills against role requirements
// using the normalization layer to prevent false gaps caused
// by naming inconsistencies.
//
// Flow:
// 1. Get role requirements from roleSkills.js
// 2. Normalize ALL user skill names to canonical forms
// 3. Normalize role requirement names
// 4. Compare using canonical names (not raw strings)
// 5. Return categorized results
// ============================================================

import { ROLE_SKILLS } from "../utils/roleSkills.js";
import {
  normalizeUserSkills,
  normalizeRoleSkill,
  levelToNumber,
} from "../utils/skillNormalizer.js";

/**
 * Calculate skill gap analysis for a user.
 *
 * @param {Object} user - The user document from MongoDB
 * @param {Array}  user.skills - Array of { name: string, level: string }
 * @param {string} user.targetRole - The target role name
 *
 * @returns {Object} Gap analysis result
 */
export function calculateSkillGap(user) {
  const targetRole = user.targetRole;

  // ── Guard: no target role set ──
  if (!targetRole) {
    return {
      targetRole: null,
      overallMatch: 0,
      analysis: [],
      missingSkills: [],
      gapSkills: [],
      masteredSkills: [],
      message: "No target role selected. Please set a target role first.",
    };
  }

  // ── Guard: unknown role ──
  const roleRequirements = ROLE_SKILLS[targetRole];
  if (!roleRequirements) {
    return {
      targetRole,
      overallMatch: 0,
      analysis: [],
      missingSkills: [],
      gapSkills: [],
      masteredSkills: [],
      message: `Role "${targetRole}" not found in skill database.`,
    };
  }

  // ══════════════════════════════════════════════════════════
  // STEP 1: Normalize user skills
  // Converts "React JS", "ReactJS", "MERN Stack" etc.
  // into a clean Map<canonicalName, numericLevel>
  // ══════════════════════════════════════════════════════════
  const userSkillMap = normalizeUserSkills(user.skills);

  // ══════════════════════════════════════════════════════════
  // STEP 2: Compare each role requirement against user skills
  // ══════════════════════════════════════════════════════════
  const analysis = [];
  let totalWeightedScore = 0;
  let totalWeight = 0;

  for (const req of roleRequirements) {
    const requiredLevel = req.level;
    const weight = req.weight || 1;
    totalWeight += weight;

    // Normalize the role requirement name
    // This handles multi-option requirements like "Node.js / Java / Go"
    const normalized = normalizeRoleSkill(req.name);

    // ── Find best user match from alternatives ──
    // For "Node.js / Java / Go", if user has ANY ONE of them, it counts
    let bestUserLevel = 0;
    let matchedAs = null;

    for (const alt of normalized.alternatives) {
      const level = userSkillMap.get(alt) || 0;
      if (level > bestUserLevel) {
        bestUserLevel = level;
        matchedAs = alt;
      }
    }

    // Also check if the exact canonical name matches
    if (!matchedAs) {
      const directLevel = userSkillMap.get(normalized.canonical) || 0;
      if (directLevel > bestUserLevel) {
        bestUserLevel = directLevel;
        matchedAs = normalized.canonical;
      }
    }

    // ── Calculate gap ──
    const gap = Math.max(0, requiredLevel - bestUserLevel);

    // ── Determine status ──
    let status;
    if (bestUserLevel === 0) {
      status = "missing";
    } else if (bestUserLevel < requiredLevel) {
      status = "gap";
    } else {
      status = "met";
    }

    // ── Weighted score contribution ──
    const matchRatio = Math.min(bestUserLevel / requiredLevel, 1);
    totalWeightedScore += matchRatio * weight;

    analysis.push({
      name: req.name, // Display name (original from role template)
      level: requiredLevel, // Required level
      userLevel: bestUserLevel, // User's normalized level
      gap, // Numeric gap
      status, // "missing" | "gap" | "met"
      weight, // Importance weight
      matchedAs, // What user skill matched (for debugging)
    });
  }

  // ══════════════════════════════════════════════════════════
  // STEP 3: Calculate overall match percentage
  // ══════════════════════════════════════════════════════════
  const overallMatch =
    totalWeight > 0 ? Math.round((totalWeightedScore / totalWeight) * 100) : 0;

  // ══════════════════════════════════════════════════════════
  // STEP 4: Categorize skills
  // ══════════════════════════════════════════════════════════
  const missingSkills = analysis.filter((s) => s.status === "missing");
  const gapSkills = analysis.filter((s) => s.status === "gap");
  const masteredSkills = analysis.filter((s) => s.status === "met");

  return {
    targetRole,
    overallMatch,
    analysis,
    missingSkills,
    gapSkills,
    masteredSkills,
  };
}
