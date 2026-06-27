import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text } from 'react-native';
import { analyticsService } from '@/lib/analytics';
import { Button } from './ui/button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    analyticsService.logError(error, {
      screen: "ErrorBoundary",
      extra: {
        componentStack: errorInfo.componentStack,
      }
    });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <View className="flex-1 bg-[#131313] justify-center items-center px-6">
          <View className="items-center w-full max-w-[320px]">
            <Text className="text-4xl mb-4">⚠️</Text>
            <Text className="text-white text-2xl font-bold mb-2 text-center">
              Đã xảy ra lỗi bất ngờ
            </Text>
            <Text className="text-gray-400 text-sm text-center mb-6 font-semibold">
              Ứng dụng vừa gặp sự cố. Thông tin lỗi đã được tự động báo về hệ thống quản trị để khắc phục.
            </Text>
            
            {this.state.error && (
              <View className="bg-white/5 border border-white/10 rounded-xl p-3 w-full mb-6">
                <Text className="text-red-400 text-xs font-mono" numberOfLines={5}>
                  {this.state.error.message}
                </Text>
              </View>
            )}

            <Button variant="solid" onPress={this.handleReset} className="w-full">
              Thử lại
            </Button>
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}
