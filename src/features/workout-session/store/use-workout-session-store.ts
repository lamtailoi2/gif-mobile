import { IExercise } from "@/features/exercise-library/types/exercise";
import { IExerciseLog, ISetLog } from "@/interfaces/workout-session.interface";
import { IWorkoutRoutine } from "@/interfaces/workout-routine.interface";
import { create } from "zustand";

interface IWorkoutSessionState {
  routine: IWorkoutRoutine | null;
  exercises: IExercise[];
  currentExerciseIndex: number;
  currentSetIndex: number;
  exerciseLogs: IExerciseLog[];
  /** ISO string — dùng để tính durationSec khi lưu session */
  sessionStartedAt: string | null;
}

interface IWorkoutSessionActions {
  startSession: (routine: IWorkoutRoutine, exercises: IExercise[]) => void;
  /**
   * Ghi nhận một set hoàn thành.
   * @returns true nếu đây là set cuối của exercise cuối (session done).
   */
  completeSet: (weight: number, reps: number) => boolean;
  resetSession: () => void;
}

type IWorkoutSessionStore = IWorkoutSessionState & IWorkoutSessionActions;

const initialState: IWorkoutSessionState = {
  routine: null,
  exercises: [],
  currentExerciseIndex: 0,
  currentSetIndex: 0,
  exerciseLogs: [],
  sessionStartedAt: null,
};

export const useWorkoutSessionStore = create<IWorkoutSessionStore>(
  (set, get) => ({
    ...initialState,

    startSession: (routine, exercises) => {
      set({
        routine,
        exercises,
        currentExerciseIndex: 0,
        currentSetIndex: 0,
        exerciseLogs: [],
        sessionStartedAt: new Date().toISOString(),
      });
    },

    completeSet: (weight, reps) => {
      const {
        exercises,
        currentExerciseIndex,
        currentSetIndex,
        exerciseLogs,
      } = get();

      const currentExercise = exercises[currentExerciseIndex];
      if (!currentExercise) return false;

      const setLog: ISetLog = {
        setIndex: currentSetIndex,
        weight,
        reps,
        completedAt: new Date().toISOString(),
      };

      // Upsert log của exercise hiện tại
      const updatedLogs = [...exerciseLogs];
      const existingIdx = updatedLogs.findIndex(
        (l) => l.exerciseId === currentExercise.id
      );
      if (existingIdx >= 0) {
        updatedLogs[existingIdx] = {
          ...updatedLogs[existingIdx],
          sets: [...updatedLogs[existingIdx].sets, setLog],
        };
      } else {
        updatedLogs.push({
          exerciseId: currentExercise.id,
          exerciseName: currentExercise.name,
          sets: [setLog],
        });
      }

      const totalSets = currentExercise.defaultSets;
      const isLastSet = currentSetIndex >= totalSets - 1;
      const isLastExercise = currentExerciseIndex >= exercises.length - 1;

      if (isLastSet && isLastExercise) {
        // Buổi tập hoàn thành
        set({ exerciseLogs: updatedLogs });
        return true;
      } else if (isLastSet) {
        // Chuyển sang exercise tiếp theo
        set({
          exerciseLogs: updatedLogs,
          currentExerciseIndex: currentExerciseIndex + 1,
          currentSetIndex: 0,
        });
      } else {
        // Set tiếp theo của exercise hiện tại
        set({
          exerciseLogs: updatedLogs,
          currentSetIndex: currentSetIndex + 1,
        });
      }

      return false;
    },

    resetSession: () => set(initialState),
  })
);
