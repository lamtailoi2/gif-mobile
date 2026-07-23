import { getUniqueCategories, getUniqueDifficulties } from '../use-exercises-filter';

describe('exercise filter helpers', () => {
  const exercises = [
    { id: '1', name: 'A', slug: 'a', category: 'strength', muscleGroups: ['chest'], equipment: [], difficulty: 'beginner', defaultSets: 3, defaultReps: 10 },
    { id: '2', name: 'B', slug: 'b', category: 'cardio', muscleGroups: ['legs'], equipment: [], difficulty: 'advanced', defaultSets: 3, defaultReps: 10 },
    { id: '3', name: 'C', slug: 'c', category: 'strength', muscleGroups: ['back'], equipment: [], difficulty: 'beginner', defaultSets: 3, defaultReps: 10 },
  ];

  it('returns sorted unique difficulties', () => {
    expect(getUniqueDifficulties(exercises)).toEqual(['advanced', 'beginner']);
  });

  it('returns sorted unique categories', () => {
    expect(getUniqueCategories(exercises)).toEqual(['cardio', 'strength']);
  });
});
