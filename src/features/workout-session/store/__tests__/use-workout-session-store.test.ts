import type { IExercise } from '@/features/exercise-library/types/exercise';
import type { IWorkoutRoutine } from '@/interfaces/workout-routine.interface';
import { useWorkoutSessionStore } from '../use-workout-session-store';

const routine: IWorkoutRoutine = {
  id: 'routine-1',
  name: 'Push Day',
  focus: 'Chest',
  durationMin: 45,
  intensity: 'Medium',
  load: 'Progressive',
  exerciseIds: ['ex-1', 'ex-2'],
  muscleGroups: ['chest'],
  dayOfWeek: [1],
  createdAt: '2026-07-23T00:00:00.000Z',
};

const exercises: IExercise[] = [
  { id: 'ex-1', name: 'Bench Press', slug: 'bench-press', category: 'strength', muscleGroups: ['chest'], equipment: ['barbell'], difficulty: 'beginner', defaultSets: 2, defaultReps: 8 },
  { id: 'ex-2', name: 'Push Up', slug: 'push-up', category: 'bodyweight', muscleGroups: ['chest'], equipment: [], difficulty: 'beginner', defaultSets: 1, defaultReps: 12 },
];

describe('useWorkoutSessionStore', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-07-23T10:00:00.000Z'));
    useWorkoutSessionStore.getState().resetSession();
  });

  it('starts a session with defaults and previous logs', () => {
    useWorkoutSessionStore.getState().startSession(routine, exercises, [
      {
        exerciseId: 'ex-1',
        exerciseName: 'Bench Press',
        sets: [{ setIndex: 0, weight: 80, reps: 5, completedAt: '2026-07-20T10:00:00.000Z' }],
      },
    ]);

    const state = useWorkoutSessionStore.getState();
    expect(state.sessionStartedAt).toBe('2026-07-23T10:00:00.000Z');
    expect(state.sessionState).toBe('PREPARING');
    expect(state.uiExercises[0].sets[0]).toMatchObject({ weight: 80, reps: 5, previousWeight: 80, previousReps: 5 });
    expect(state.uiExercises[0].sets[1]).toMatchObject({ weight: 45, reps: 8, isCompleted: false });
  });

  it('updates set values without allowing negatives', () => {
    useWorkoutSessionStore.getState().startSession(routine, exercises);
    const setId = useWorkoutSessionStore.getState().uiExercises[0].sets[0].id;

    useWorkoutSessionStore.getState().updateSet('ex-1', setId, 'weight', -10);
    useWorkoutSessionStore.getState().updateSet('ex-1', setId, 'reps', 6);

    expect(useWorkoutSessionStore.getState().uiExercises[0].sets[0]).toMatchObject({ weight: 0, reps: 6 });
  });

  it('advances through sets and completes the session', () => {
    useWorkoutSessionStore.getState().startSession(routine, exercises);
    useWorkoutSessionStore.getState().startWorkout();
    expect(useWorkoutSessionStore.getState().sessionState).toBe('ACTIVE');

    useWorkoutSessionStore.getState().completeCurrentSet();
    expect(useWorkoutSessionStore.getState()).toMatchObject({ sessionState: 'RESTING', currentExerciseIndex: 0, currentSetIndex: 1 });

    useWorkoutSessionStore.getState().skipRest();
    useWorkoutSessionStore.getState().completeCurrentSet();
    expect(useWorkoutSessionStore.getState()).toMatchObject({ sessionState: 'RESTING', currentExerciseIndex: 1, currentSetIndex: 0 });

    useWorkoutSessionStore.getState().skipRest();
    useWorkoutSessionStore.getState().completeCurrentSet();
    expect(useWorkoutSessionStore.getState().sessionState).toBe('COMPLETED');
  });

  it('returns payload logs for completed sets only', () => {
    useWorkoutSessionStore.getState().startSession(routine, exercises);
    useWorkoutSessionStore.getState().completeCurrentSet();

    expect(useWorkoutSessionStore.getState().getPayloadLogs()).toEqual([
      {
        exerciseId: 'ex-1',
        exerciseName: 'Bench Press',
        sets: [{ setIndex: 0, weight: 45, reps: 8, completedAt: '2026-07-23T10:00:00.000Z' }],
      },
    ]);
  });

  it('tracks session saved flag and resets session', () => {
    useWorkoutSessionStore.getState().markSessionSaved();
    expect(useWorkoutSessionStore.getState().sessionSaved).toBe(true);

    useWorkoutSessionStore.getState().resetSessionSaved();
    expect(useWorkoutSessionStore.getState().sessionSaved).toBe(false);

    useWorkoutSessionStore.getState().startSession(routine, exercises);
    useWorkoutSessionStore.getState().resetSession();
    expect(useWorkoutSessionStore.getState()).toMatchObject({ routine: null, uiExercises: [], sessionState: 'PREPARING' });
  });
});
