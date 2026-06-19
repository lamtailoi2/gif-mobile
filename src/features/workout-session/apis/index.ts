import { db } from "@/lib/firebase";
import { IWorkoutSession } from "@/interfaces/workout-session.interface";
import { addDoc, collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { USER_AI_PLANS_COLLECTION, WORKOUT_SESSIONS_COLLECTION } from "@/constants/collections";
import { IWorkoutPlanResponse } from "@/features/profile/ai-service/types";

/**
 * Lưu một buổi tập hoàn chỉnh lên Firestore.
 * Collection: workout_sessions/{autoId}
 *
 * Validation guard: chặn lưu data rác có thể crash UI ở History/Progress.
 */
export const saveWorkoutSession = async (
  session: IWorkoutSession
): Promise<string> => {
  // Lỗi 4 fix: validate các field bắt buộc trước khi ghi lên Firebase
  if (!session.completedAt) {
    throw new Error("[saveWorkoutSession] Missing required field: completedAt");
  }
  if (!session.userId) {
    throw new Error("[saveWorkoutSession] Missing required field: userId");
  }
  if (!session.exerciseLogs || session.exerciseLogs.length === 0) {
    throw new Error("[saveWorkoutSession] Cannot save a session with no completed exercises.");
  }
  if (session.durationSec <= 0) {
    console.warn("[saveWorkoutSession] durationSec is 0 or negative. Session may have been saved immediately after start.");
  }

  const ref = await addDoc(
    collection(db, WORKOUT_SESSIONS_COLLECTION),
    session
  );

  // Phương án 1: Trượt tịnh tiến theo tiến độ thực tế (Queue-based)
  // Tự động tăng currentPlanIndex nếu đây là bài tập do AI tạo ra.
  if (session.routineId.startsWith("ai_plan_day_")) {
    try {
      const planRef = doc(db, USER_AI_PLANS_COLLECTION, session.userId);
      const planSnap = await getDoc(planRef);
      if (planSnap.exists()) {
        const planData = planSnap.data() as IWorkoutPlanResponse;
        const currentIndex = planData.currentPlanIndex || 0;
        const newIndex = (currentIndex + 1) % planData.schedule.length;
        await updateDoc(planRef, { currentPlanIndex: newIndex });
      }
    } catch (e) {
      console.error("Failed to increment AI plan index:", e);
    }
  }

  return ref.id;
};

