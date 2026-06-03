import { Pressable, Text } from "react-native";

interface IFilterTagProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export function FilterTag({
  label,
  checked,
  onChange,
  disabled,
}: IFilterTagProps) {
  return (
    <Pressable
      onPress={() => !disabled && onChange(!checked)}
      disabled={disabled}
      // Thay đổi active:opacity thành hiệu ứng scale nhẹ để trông mượt mà hơn
      className={`w-full px-4 py-2.5 rounded-full border items-center justify-center flex-row transition-all duration-150 active:scale-95 active:opacity-80 ${
        checked
          ? "bg-[#759A04] border-[#abd600]/30" // Thêm chút viền sáng cho tag đang chọn
          : "bg-surface-container border-outline/40"
      }`}
      style={disabled ? { opacity: 0.4 } : undefined}
    >
      {checked && (
        <Text className="mr-1.5 text-sm font-bold text-white">✓</Text>
      )}

      <Text
        className={`font-medium text-base tracking-wide capitalize ${
          checked ? "text-white font-bold" : "text-on-surface/80"
        }`}
      >
        {label}
      </Text>
    </Pressable>
  );
}
