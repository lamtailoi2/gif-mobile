import { getLocalDateString } from '@/utils/date';
import { useHistoryStore } from '../use-history-store';

describe('useHistoryStore', () => {
  beforeEach(() => {
    useHistoryStore.setState({
      timeView: 'Week',
      selectedDate: getLocalDateString(),
      searchQuery: '',
      selectedFilter: 'ALL',
    });
  });

  it('keeps local-date initial state', () => {
    expect(useHistoryStore.getState().selectedDate).toBe(getLocalDateString());
  });

  it('updates filters and search state', () => {
    useHistoryStore.getState().setTimeView('Month');
    useHistoryStore.getState().setSelectedDate('2026-07-23');
    useHistoryStore.getState().setSearchQuery('push');
    useHistoryStore.getState().setSelectedFilter('PUSH');

    expect(useHistoryStore.getState()).toMatchObject({
      timeView: 'Month',
      selectedDate: '2026-07-23',
      searchQuery: 'push',
      selectedFilter: 'PUSH',
    });
  });
});
