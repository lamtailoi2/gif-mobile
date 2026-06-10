/** Một workout routine (chương trình tập luyện). */
export interface IWorkoutRoutine {
  id: string;
  /** Tên routine, e.g. "Push Day" */
  name: string;
  /** Focus cơ bắp, e.g. "Chest & Triceps" */
  focus: string;
  /** Ước tính thời gian (phút) */
  durationMin: number;
  /** Cường độ, e.g. "High" */
  intensity: string;
  /** Cách tăng tải, e.g. "Progressive" */
  load: string;
  /** Danh sách exerciseId refs đến exerciseLibrary */
  exerciseIds: string[];
  /** Nhóm cơ high-level, e.g. ["chest", "triceps", "shoulders"] */
  muscleGroups: string[];
  /**
   * Ngày trong tuần được suggest (0=Sun, 1=Mon, ..., 6=Sat).
   * Dùng để rotate routine theo ngày trên Home dashboard.
   */
  dayOfWeek: number[];
  createdAt: string;
}
