import { IExercise } from "@/features/exercise-library/types/exercise";
import { IExerciseLog } from "@/interfaces/workout-session.interface";
import { IWorkoutRoutine } from "@/interfaces/workout-routine.interface";
import { create } from "zustand";

export interface IUISet {
  id: string;
  weight: number;
  reps: number;
  isCompleted: boolean;
  completedAt?: string;
  previousWeight?: number;
  previousReps?: number;
}

export interface IUIExercise {
  exerciseId: string;
  exerciseName: string;
  sets: IUISet[];
}

interface IWorkoutSessionState {
  routine: IWorkoutRoutine | null;
  exercises: IExercise[];
  uiExercises: IUIExercise[];
  /** ISO string — dùng để tính durationSec khi lưu session */
  sessionStartedAt: string | null;
  /** Flag ngăn double-save (persist qua remount) */
  sessionSaved: boolean;
}

interface IWorkoutSessionActions {
  startSession: (routine: IWorkoutRoutine, exercises: IExercise[], historyLogs?: IExerciseLog[]) => void;
  toggleSetComplete: (exerciseId: string, setId: string) => void;
  updateSet: (exerciseId: string, setId: string, field: "weight" | "reps", value: number) => void;
  addSet: (exerciseId: string) => void;
  removeSet: (exerciseId: string, setId: string) => void;
  getPayloadLogs: () => IExerciseLog[];
  markSessionSaved: () => void;
  resetSessionSaved: () => void;
  resetSession: () => void;
}

type IWorkoutSessionStore = IWorkoutSessionState & IWorkoutSessionActions;

const generateId = () => Math.random().toString(36).substring(2, 9);

const initialState: IWorkoutSessionState = {
  routine: null,
  exercises: [],
  uiExercises: [],
  sessionStartedAt: null,
  sessionSaved: false,
};

export const useWorkoutSessionStore = create<IWorkoutSessionStore>((set, get) => ({
  ...initialState,

  startSession: (routine, exercises, historyLogs = []) => {
    const uiExercises: IUIExercise[] = exercises.map((ex) => {
      // Tìm lịch sử của bài tập này
      const historyLog = historyLogs.find((l) => l.exerciseId === ex.id);

      const sets: IUISet[] = Array.from({ length: ex.defaultSets }).map((_, idx) => {
        const histSet = historyLog?.sets[idx];
        return {
          id: generateId(),
          weight: histSet ? histSet.weight : 45,
          reps: histSet ? histSet.reps : ex.defaultReps,
          isCompleted: false,
          previousWeight: histSet ? histSet.weight : undefined,
          previousReps: histSet ? histSet.reps : undefined,
        };
      });

      return {
        exerciseId: ex.id,
        exerciseName: ex.name,
        sets,
      };
    });

    set({
      routine,
      exercises,
      uiExercises,
      sessionStartedAt: new Date().toISOString(),
      sessionSaved: false,
    });
  },

  toggleSetComplete: (exerciseId, setId) => {
    set((state) => {
      const uiExercises = state.uiExercises.map((ex) => {
        if (ex.exerciseId !== exerciseId) return ex;
        return {
          ...ex,
          sets: ex.sets.map((s) => {
            if (s.id !== setId) return s;
            const isCompleted = !s.isCompleted;
            return {
              ...s,
              isCompleted,
              completedAt: isCompleted ? new Date().toISOString() : undefined,
            };
          }),
        };
      });
      return { uiExercises };
    });
  },

  updateSet: (exerciseId, setId, field, value) => {
    set((state) => {
      const uiExercises = state.uiExercises.map((ex) => {
        if (ex.exerciseId !== exerciseId) return ex;
        return {
          ...ex,
          sets: ex.sets.map((s) => (s.id === setId ? { ...s, [field]: Math.max(0, value) } : s)),
        };
      });
      return { uiExercises };
    });
  },

  addSet: (exerciseId) => {
    set((state) => {
      const uiExercises = state.uiExercises.map((ex) => {
        if (ex.exerciseId !== exerciseId) return ex;
        const lastSet = ex.sets[ex.sets.length - 1];
        const newSet: IUISet = {
          id: generateId(),
          weight: lastSet ? lastSet.weight : 45,
          reps: lastSet ? lastSet.reps : 10,
          isCompleted: false,
        };
        return { ...ex, sets: [...ex.sets, newSet] };
      });
      return { uiExercises };
    });
  },

  removeSet: (exerciseId, setId) => {
    set((state) => {
      const uiExercises = state.uiExercises.map((ex) => {
        if (ex.exerciseId !== exerciseId) return ex;
        return { ...ex, sets: ex.sets.filter((s) => s.id !== setId) };
      });
      return { uiExercises };
    });
  },

  getPayloadLogs: () => {
    const state = get();
    const logs: IExerciseLog[] = [];

    state.uiExercises.forEach((uiEx) => {
      const completedSets = uiEx.sets.filter((s) => s.isCompleted);
      if (completedSets.length > 0) {
        logs.push({
          exerciseId: uiEx.exerciseId,
          exerciseName: uiEx.exerciseName,
          sets: completedSets.map((s, index) => ({
            setIndex: index,
            weight: s.weight,
            reps: s.reps,
            completedAt: s.completedAt || new Date().toISOString(),
          })),
        });
      }
    });

    return logs;
  },

  markSessionSaved: () => set({ sessionSaved: true }),
  resetSessionSaved: () => set({ sessionSaved: false }),
  resetSession: () => set(initialState),
}));
