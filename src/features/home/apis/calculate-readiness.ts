import { IWorkoutSession } from "@/interfaces/workout-session.interface";
import { IReadiness } from "../types/dashboard";

/**
 * Tính readiness score (0-100) dựa trên:
 * - Số giờ/ngày kể từ lần tập cuối
 * - Intensity rating buổi trước (1-10)
 * - Energy level tự báo cáo
 *
 * Logic tham khảo từ các app không dùng wearable (Fitbod, Freeletics):
 * - Tập trong vòng 24h → 60 (cần recovery)
 * - Nghỉ 1 ngày → 80 (sweet spot)
 * - Nghỉ 2 ngày → 90
 * - Nghỉ 3+ ngày → 95
 * - Intensity cao (8-10) → trừ thêm tối đa ~7 điểm
 * - Energy "drained" → -10, "charged" → +5
 */
export const calculateReadiness = (
  lastSession: IWorkoutSession | undefined
): IReadiness => {
  if (!lastSession) {
    return { score: 80, label: "Ready" };
  }

  const now = Date.now();
  const lastSessionMs = new Date(lastSession.completedAt).getTime();
  const daysSinceLast = (now - lastSessionMs) / (1_000 * 60 * 60 * 24);

  // Base score from rest days
  let score: number;
  if (daysSinceLast < 1) score = 60;
  else if (daysSinceLast < 2) score = 80;
  else if (daysSinceLast < 3) score = 90;
  else score = 95;

  // Penalty for high intensity (scale: rating 5 = neutral, 10 = -7.5)
  const intensityPenalty = Math.round(Math.max(0, lastSession.intensityRating - 5) * 1.5);
  score -= intensityPenalty;

  // Energy level adjustment
  if (lastSession.energyLevel === "drained") score -= 10;
  else if (lastSession.energyLevel === "charged") score += 5;

  score = Math.min(100, Math.max(30, score));

  let label: string;
  if (score >= 85) label = "Optimal";
  else if (score >= 70) label = "Ready";
  else if (score >= 55) label = "Moderate";
  else label = "Recovering";

  return { score, label };
};
