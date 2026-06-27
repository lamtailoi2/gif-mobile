import { offlineQueue } from "@/lib/offline-queue";
import { isOnline } from "@/hooks/use-network";
import { db } from "@/lib/firebase";
import { IWorkoutSession } from "@/interfaces/workout-session.interface";
import { addDoc, collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { USER_AI_PLANS_COLLECTION, WORKOUT_SESSIONS_COLLECTION } from "@/constants/collections";
import { IWorkoutPlanResponse } from "@/features/profile/ai-service/types";
import { analyticsService } from "@/lib/analytics";

/**
 * Lưu một buổi tập hoàn chỉnh lên Firestore.
 * Collection: workout_sessions/{autoId}
 *
 * Validation guard: chặn lưu data rác có thể crash UI ở History/Progress.
 * Offline: queue mutation để sync sau.
 */
export const saveWorkoutSession = async (
  session: IWorkoutSession
): Promise<string> => {
  try {
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

    // Offline: queue for later sync
    if (!(await isOnline())) {
      await offlineQueue.enqueue({
        name: "saveWorkoutSession",
        payload: session,
      });

      analyticsService.logEvent("workout_save_queued_offline", {
        userId: session.userId,
        routineId: session.routineId,
        screen: "WorkoutSession",
      });

      return "offline-queued";
    }

    const ref = await addDoc(
      collection(db, WORKOUT_SESSIONS_COLLECTION),
      session
    );

    // Track successful completion event
    analyticsService.logEvent("complete_workout", {
      userId: session.userId,
      routineId: session.routineId,
      durationSec: session.durationSec,
      exerciseCount: session.exerciseLogs.length,
      screen: "WorkoutSession",
    });

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
  } catch (error) {
    analyticsService.logError(error, {
      screen: "WorkoutSession",
      userId: session?.userId,
      extra: { routineId: session?.routineId },
    });
    throw error;
  }
};

