import { MUSCLE_GROUP_MAPPING } from "@/features/exercise-library/constants/muscle-group-mapping";
import { IWorkoutSession } from "@/interfaces/workout-session.interface";
import { ERecoveryState, IRecoveryMap, MuscleSlug } from "../types/dashboard";

/**
 * Xây dựng recovery map từ session gần nhất.
 *
 * Logic:
 * - Nhóm cơ nào được tập (muscleBreakdown[group] === true)
 *   và < 48h kể từ session đó → ERecoveryState.Fatigued
 * - Cùng nhóm cơ nhưng đã nghỉ >= 48h → ERecoveryState.Recovered
 * - Nhóm cơ không được tập trong session gần nhất → Recovered
 */
export const buildRecoveryMap = (
  lastSession: IWorkoutSession | undefined
): IRecoveryMap => {
  if (!lastSession) return { states: {} };

  const now = Date.now();
  const sessionMs = new Date(lastSession.completedAt).getTime();
  const hoursSinceLast = (now - sessionMs) / (1_000 * 60 * 60);

  const states: Partial<Record<MuscleSlug, ERecoveryState>> = {};

  Object.entries(lastSession.muscleBreakdown).forEach(([group, wasWorked]) => {
    if (!wasWorked) return;
    const slugs = MUSCLE_GROUP_MAPPING[group];
    if (!slugs) return;
    slugs.forEach((slug) => {
      states[slug] =
        hoursSinceLast < 48
          ? ERecoveryState.Fatigued
          : ERecoveryState.Recovered;
    });
  });

  return { states };
};
