/** Mức năng lượng user cảm nhận sau buổi tập. */
export type EnergyLevel = "drained" | "steady" | "charged";

/** Log một set đơn lẻ trong buổi tập. */
export interface ISetLog {
  /** 0-indexed */
  setIndex: number;
  /** Cân nặng (lbs) */
  weight: number;
  /** Số reps thực hiện */
  reps: number;
  /** Thời điểm hoàn thành set (ISO string) */
  completedAt: string;
}

/** Log một bài tập trong buổi tập. */
export interface IExerciseLog {
  exerciseId: string;
  exerciseName: string;
  sets: ISetLog[];
}

/** Dữ liệu một buổi tập được lưu lên Firestore (workout_sessions). */
export interface IWorkoutSession {
  /** Clerk user ID */
  userId: string;
  /** ID của routine (ref đến workoutRoutines) */
  routineId: string;
  /** Tên routine — denormalized để hiển thị nhanh */
  routineName: string;
  /** Timestamp khi bấm Finish & Save (ISO string) */
  completedAt: string;
  /** Thời gian thực tế của buổi tập (giây) */
  durationSec: number;
  /** Mức năng lượng user chọn */
  energyLevel: EnergyLevel;
  /** Cường độ tập (1-10) */
  intensityRating: number;
  /** Nhóm cơ high-level (key = group name, value = true/false) */
  muscleBreakdown: Record<string, boolean>;
  /** Log chi tiết từng bài tập */
  exerciseLogs: IExerciseLog[];
  /** Tổng volume = Σ (weight × reps) trên toàn session */
  totalVolume: number;
}

/** Payload truyền vào hàm save (chưa có userId – sẽ inject ở hook). */
export type IWorkoutSessionPayload = Omit<IWorkoutSession, "userId">;
