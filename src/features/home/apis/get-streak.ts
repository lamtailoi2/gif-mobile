import { collection, getDocs, query, where, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { IWorkoutSession } from "@/interfaces/workout-session.interface";
import { IStreak } from "../types/dashboard";
import { WORKOUT_SESSIONS_COLLECTION } from "@/constants/collections";
import { getLocalDateString } from "@/utils/date";

/**
 * Lấy ngày đầu tuần (Thứ Hai) của một ngày bất kỳ.
 * Trả về chuỗi "YYYY-WW" để dễ nhóm theo tuần.
 */
const getWeekKey = (dateStr: string): string => {
  const date = new Date(dateStr);
  // Tính ngày Thứ Hai của tuần chứa date này
  const day = date.getDay(); // 0=CN, 1=T2, ..., 6=T7
  const diff = (day === 0 ? -6 : 1 - day); // khoảng cách đến T2
  const monday = new Date(date.getTime() + diff * 86_400_000);
  // Format: "YYYY-WNN" ví dụ "2025-W24"
  const year = monday.getFullYear();
  const startOfYear = new Date(year, 0, 1);
  const weekNum = Math.ceil(
    ((monday.getTime() - startOfYear.getTime()) / 86_400_000 + startOfYear.getDay() + 1) / 7
  );
  return `${year}-W${String(weekNum).padStart(2, "0")}`;
};

/**
 * Lấy week key của tuần hiện tại và các tuần trước đó.
 * offset = 0 là tuần hiện tại, offset = -1 là tuần trước, v.v.
 */
const getOffsetWeekKey = (baseDate: Date, offset: number): string => {
  const shifted = new Date(baseDate.getTime() + offset * 7 * 86_400_000);
  return getWeekKey(getLocalDateString(shifted));
};

const weekStreakToPercentile = (weeks: number): number => {
  if (weeks >= 12) return 1;
  if (weeks >= 8) return 5;
  if (weeks >= 4) return 10;
  if (weeks >= 2) return 25;
  return 50;
};

export const getStreak = async (userId: string): Promise<IStreak> => {
  let sessions: IWorkoutSession[] = [];

  try {
    const sessionsRef = collection(db, WORKOUT_SESSIONS_COLLECTION);
    // Lấy tối đa 100 buổi gần nhất (đủ cho ~3 tháng dù tập 1 buổi/ngày)
    const q = query(
      sessionsRef,
      where("userId", "==", userId),
      orderBy("completedAt", "desc"),
      limit(100)
    );
    const snapshot = await getDocs(q);
    sessions = snapshot.docs.map((d) => d.data() as IWorkoutSession);
  } catch (e) {
    console.error("Error fetching streak data:", e);
    return { days: 0, percentile: 50 };
  }

  if (sessions.length === 0) {
    return { days: 0, percentile: 50 };
  }

  // Nhóm các buổi tập theo tuần (week key)
  const workoutWeeks = new Set(
    sessions.map((s) => getWeekKey(getLocalDateString(s.completedAt)))
  );

  const today = new Date();
  const currentWeekKey = getOffsetWeekKey(today, 0);
  const lastWeekKey = getOffsetWeekKey(today, -7);

  // Nếu cả tuần này lẫn tuần trước đều không có buổi tập → streak = 0
  if (!workoutWeeks.has(currentWeekKey) && !workoutWeeks.has(lastWeekKey)) {
    return { days: 0, percentile: 50 };
  }

  // Bắt đầu đếm từ tuần gần nhất có tập
  let weekOffset = workoutWeeks.has(currentWeekKey) ? 0 : -7;
  let streak = 0;

  while (true) {
    const weekKey = getOffsetWeekKey(today, weekOffset);
    if (!workoutWeeks.has(weekKey)) break;
    streak++;
    weekOffset -= 7; // lui về tuần trước
  }

  return { days: streak, percentile: weekStreakToPercentile(streak) };
};
