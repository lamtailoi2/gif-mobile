import { IWorkoutSession } from "@/interfaces/workout-session.interface";

/**
 * Tính số ngày tập liên tiếp tính đến hôm nay (hoặc hôm qua).
 * Mỗi ngày chỉ tính 1 lần dù user tập nhiều buổi trong ngày.
 *
 * @param sessions - Danh sách sessions đã sort theo completedAt desc.
 */
export const calculateStreak = (sessions: IWorkoutSession[]): number => {
  if (sessions.length === 0) return 0;

  // Collect unique workout dates (YYYY-MM-DD)
  const workoutDates = new Set(
    sessions.map((s) => s.completedAt.slice(0, 10))
  );

  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10);
  const yesterdayStr = new Date(today.getTime() - 86_400_000)
    .toISOString()
    .slice(0, 10);

  // If neither today nor yesterday has a workout, streak is broken
  if (!workoutDates.has(todayStr) && !workoutDates.has(yesterdayStr)) {
    return 0;
  }

  // Start checking from today or yesterday
  let checkDate = workoutDates.has(todayStr)
    ? new Date(today)
    : new Date(today.getTime() - 86_400_000);

  let streak = 0;
  while (true) {
    const dateStr = checkDate.toISOString().slice(0, 10);
    if (!workoutDates.has(dateStr)) break;
    streak++;
    checkDate = new Date(checkDate.getTime() - 86_400_000);
  }

  return streak;
};
