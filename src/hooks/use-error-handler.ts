import { useUser } from '@clerk/expo';
import { useToast } from '@/context/toast-context';
import { analyticsService } from '@/lib/analytics';
import { useCallback } from 'react';

interface ErrorHandlerOptions {
  screen: string;
}

export function useErrorHandler(options: ErrorHandlerOptions) {
  const { user } = useUser();
  const { showToast } = useToast();

  const handleError = useCallback((error: Error | unknown, extra?: Record<string, unknown>) => {
    // 1. Log error to Firebase and console
    analyticsService.logError(error, {
      screen: options.screen,
      userId: user?.id,
      extra,
    });

    // 2. Show user-friendly toast message
    const errorMsg = error instanceof Error ? error.message : String(error);
    showToast({
      type: 'error',
      message: errorMsg || 'Đã xảy ra lỗi. Vui lòng thử lại sau.',
    });
  }, [options.screen, user?.id, showToast]);

  return { handleError };
}
