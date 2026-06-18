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
  thumbnailUrl?: string;
  sets: IUISet[];
}

export type SessionState = "PREPARING" | "ACTIVE" | "RESTING" | "COMPLETED";

interface IWorkoutSessionState {
  routine: IWorkoutRoutine | null;
  exercises: IExercise[];
  uiExercises: IUIExercise[];
  /** ISO string — dùng để tính durationSec khi lưu session */
  sessionStartedAt: string | null;
  /** Flag ngăn double-save (persist qua remount) */
  sessionSaved: boolean;

  sessionState: SessionState;
  currentExerciseIndex: number;
  currentSetIndex: number;
}

interface IWorkoutSessionActions {
  startSession: (routine: IWorkoutRoutine, exercises: IExercise[], historyLogs?: IExerciseLog[]) => void;
  updateSet: (exerciseId: string, setId: string, field: "weight" | "reps", value: number) => void;
  
  // State machine actions
  startWorkout: () => void; 
  completeCurrentSet: () => void; 
  skipRest: () => void; 

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
  
  sessionState: "PREPARING",
  currentExerciseIndex: 0,
  currentSetIndex: 0,
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
        thumbnailUrl: ex.thumbnailUrl,
        sets,
      };
    });

    set({
      routine,
      exercises,
      uiExercises,
      sessionStartedAt: new Date().toISOString(),
      sessionSaved: false,
      sessionState: "PREPARING",
      currentExerciseIndex: 0,
      currentSetIndex: 0,
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

  startWorkout: () => {
    set({ sessionState: "ACTIVE" });
  },

  completeCurrentSet: () => {
    const state = get();
    const { currentExerciseIndex, currentSetIndex, uiExercises } = state;
    
    // Prevent out of bounds
    if (currentExerciseIndex >= uiExercises.length) return;
    
    const exercise = uiExercises[currentExerciseIndex];
    if (currentSetIndex >= exercise.sets.length) return;

    // 1. Mark current set as completed
    const updatedExercises = uiExercises.map((ex, exIdx) => {
      if (exIdx !== currentExerciseIndex) return ex;
      return {
        ...ex,
        sets: ex.sets.map((s, sIdx) => {
          if (sIdx !== currentSetIndex) return s;
          return { ...s, isCompleted: true, completedAt: new Date().toISOString() };
        })
      };
    });

    // 2. Determine next state
    let nextState: SessionState = "RESTING";
    let nextExIndex = currentExerciseIndex;
    let nextSetIndex = currentSetIndex + 1;

    if (nextSetIndex >= exercise.sets.length) {
      // Move to next exercise
      nextExIndex++;
      nextSetIndex = 0;
      
      if (nextExIndex >= uiExercises.length) {
        // Workout finished!
        nextState = "COMPLETED";
      }
    }

    set({
      uiExercises: updatedExercises,
      sessionState: nextState,
      currentExerciseIndex: nextState === "COMPLETED" ? currentExerciseIndex : nextExIndex,
      currentSetIndex: nextState === "COMPLETED" ? currentSetIndex : nextSetIndex,
    });
  },

  skipRest: () => {
    set({ sessionState: "ACTIVE" });
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
