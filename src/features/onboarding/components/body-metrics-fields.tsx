import { Input } from '@/components/ui/input';
import { type Control, Controller, type FieldErrors } from 'react-hook-form';
import { Text, View } from 'react-native';
import { type ProfileForm } from '../libs/schema';

interface Props {
  control: Control<ProfileForm>;
  errors: FieldErrors<ProfileForm>;
  disabled?: boolean;
}

export function BodyMetricsFields({ control, errors, disabled }: Props) {
  return (
    <View className="flex-row gap-3 mt-4">
      <View className="flex-1 gap-1">
        <Text className="font-body text-sm text-on-surface-variant ml-1">Weight (kg)</Text>
        <Controller
          control={control}
          name="weightKg"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              placeholder="70"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              keyboardType="numeric"
              maxLength={5}
              editable={!disabled}
              isInvalid={!!errors.weightKg}
            />
          )}
        />
        {errors.weightKg && (
          <Text className="font-body text-xs text-error ml-1">{errors.weightKg.message}</Text>
        )}
      </View>
      <View className="flex-1 gap-1">
        <Text className="font-body text-sm text-on-surface-variant ml-1">Height (cm)</Text>
        <Controller
          control={control}
          name="heightCm"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              placeholder="175"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              keyboardType="numeric"
              maxLength={5}
              editable={!disabled}
              isInvalid={!!errors.heightCm}
            />
          )}
        />
        {errors.heightCm && (
          <Text className="font-body text-xs text-error ml-1">{errors.heightCm.message}</Text>
        )}
      </View>
    </View>
  );
}
