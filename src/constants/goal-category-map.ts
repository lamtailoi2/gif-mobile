/** Maps fitness goal → preferred exercise categories for AI prompt filtering. */
export const GOAL_CATEGORY_MAP: Record<string, string[]> = {
  build_muscle:       ["strength", "powerlifting"],
  lose_weight:        ["cardio", "hiit", "strength", "plyometrics"],
  improve_endurance:  ["cardio", "hiit", "plyometrics", "mobility"],
  maintain_health:    ["strength", "cardio", "mobility", "stretching"],
};
