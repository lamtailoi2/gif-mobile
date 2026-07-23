import { useCoachStore } from '../use-coach-store';

describe('useCoachStore', () => {
  beforeEach(() => {
    useCoachStore.getState().clearMessages();
    useCoachStore.setState({ isStreaming: false });
  });

  it('starts with a welcome message', () => {
    expect(useCoachStore.getState().messages).toHaveLength(1);
    expect(useCoachStore.getState().messages[0]).toMatchObject({ id: 'welcome', role: 'assistant' });
  });

  it('adds messages and appends tokens to the last message', () => {
    useCoachStore.getState().addMessage({ id: 'm1', role: 'assistant', content: 'Xin', timestamp: new Date() });
    useCoachStore.getState().appendToLastMessage(' chao');

    expect(useCoachStore.getState().messages.at(-1)?.content).toBe('Xin chao');
  });

  it('updates streaming flags', () => {
    useCoachStore.getState().addMessage({ id: 'm1', role: 'assistant', content: '', timestamp: new Date() });
    useCoachStore.getState().setLastMessageStreaming(true);
    useCoachStore.getState().setIsStreaming(true);

    expect(useCoachStore.getState().messages.at(-1)?.isStreaming).toBe(true);
    expect(useCoachStore.getState().isStreaming).toBe(true);
  });
});
