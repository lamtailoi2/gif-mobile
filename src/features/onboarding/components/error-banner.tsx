import { Text, View } from 'react-native';

/** Banner lỗi dùng chung; không render gì nếu không có message. */
export function ErrorBanner({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <View className="bg-error-container/25 border border-error rounded-md py-2.5 px-3.5 mb-4">
      <Text className="font-body text-sm text-error text-center">{message}</Text>
    </View>
  );
}
