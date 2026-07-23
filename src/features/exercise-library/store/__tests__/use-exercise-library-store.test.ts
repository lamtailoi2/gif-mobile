import { useExerciseLibraryStore } from '../use-exercise-library-store';

describe('useExerciseLibraryStore', () => {
  beforeEach(() => {
    useExerciseLibraryStore.setState({ filters: {}, selectedExerciseId: null });
  });

  it('sets filters and selected exercise id', () => {
    useExerciseLibraryStore.getState().setFilters({ category: 'strength', difficulty: 'beginner' });
    useExerciseLibraryStore.getState().setSelectedExerciseId('exercise-1');

    expect(useExerciseLibraryStore.getState().filters).toEqual({ category: 'strength', difficulty: 'beginner' });
    expect(useExerciseLibraryStore.getState().selectedExerciseId).toBe('exercise-1');
  });

  it('clears filters and selected exercise id', () => {
    useExerciseLibraryStore.setState({ filters: { category: 'strength' }, selectedExerciseId: 'exercise-1' });

    useExerciseLibraryStore.getState().clearFilters();

    expect(useExerciseLibraryStore.getState().filters).toEqual({});
    expect(useExerciseLibraryStore.getState().selectedExerciseId).toBeNull();
  });
});
