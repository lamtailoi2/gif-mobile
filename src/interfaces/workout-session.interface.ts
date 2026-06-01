/** Mức năng lượng user cảm nhận sau buổi tập. */
export type EnergyLevel = "drained" | "steady" | "charged";

/** Dữ liệu một buổi tập được lưu lên Firestore. */
export interface IWorkoutSession {
  /** Clerk user ID */
  userId: string;
  /** Timestamp khi bấm Finish & Save (ISO string) */
  completedAt: string;
  /** Mức năng lượng user chọn */
  energyLevel: EnergyLevel;
  /** Cường độ tập (1-10) */
  intensityRating: number;
  /** Các nhóm cơ được chọn (key = tên nhóm cơ, value = true/false) */
  muscleBreakdown: Record<string, boolean>;
}

/** Payload truyền vào hàm save (chưa có userId – sẽ inject ở hook). */
export type IWorkoutSessionPayload = Omit<IWorkoutSession, "userId">;
