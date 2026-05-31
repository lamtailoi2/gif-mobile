import { Input } from '@/components/ui/input';
import { type Control, Controller, type FieldErrors } from 'react-hook-form';
import { Text, View } from 'react-native';
import { type ProfileForm } from '../libs/schema';

interface Props {
  control: Control<ProfileForm>;
  errors: FieldErrors<ProfileForm>;
  disabled?: boolean;
}

export function NameFields({ control, errors, disabled }: Props) {
  return (
    <View className="flex-row gap-3 mb-4">
      <View className="flex-1 gap-1">
        <Text className="font-body text-sm text-on-surface-variant ml-1">First name</Text>
        <Controller
          control={control}
          name="firstName"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              placeholder="First name"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              editable={!disabled}
              isInvalid={!!errors.firstName}
            />
          )}
        />
        {errors.firstName && (
          <Text className="font-body text-xs text-error ml-1">{errors.firstName.message}</Text>
        )}
      </View>
      <View className="flex-1 gap-1">
        <Text className="font-body text-sm text-on-surface-variant ml-1">Last name</Text>
        <Controller
          control={control}
          name="lastName"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              placeholder="Last name"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              editable={!disabled}
              isInvalid={!!errors.lastName}
            />
          )}
        />
        {errors.lastName && (
          <Text className="font-body text-xs text-error ml-1">{errors.lastName.message}</Text>
        )}
      </View>
    </View>
  );
}
