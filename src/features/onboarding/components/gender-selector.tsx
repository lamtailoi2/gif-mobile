import { CircleIcon } from '@/components/ui/icon';
import { Radio, RadioGroup, RadioIcon, RadioIndicator, RadioLabel } from '@/components/ui/radio';
import { EGender } from '@/constants/profile.constant';
import { GENDER_OPTIONS } from '@/lib/profile';
import { type Control, Controller, type FieldErrors } from 'react-hook-form';
import { Text, View } from 'react-native';
import { type ProfileForm } from '../libs/schema';

interface Props {
  control: Control<ProfileForm>;
  errors: FieldErrors<ProfileForm>;
}

export function GenderSelector({ control, errors }: Props) {
  return (
    <View>
      <Text className="font-body text-sm text-on-surface-variant ml-1 mb-2">Gender</Text>
      <Controller
        control={control}
        name="gender"
        render={({ field: { onChange, value } }) => (
          <RadioGroup
            value={value ?? ''}
            onChange={(v: string) => onChange(v as EGender)}
            className="flex-row gap-6 mb-1"
          >
            {GENDER_OPTIONS.map((opt) => (
              <Radio key={opt.value} value={opt.value}>
                <RadioIndicator>
                  <RadioIcon as={CircleIcon} />
                </RadioIndicator>
                <RadioLabel className="ml-2 text-sm">{opt.label}</RadioLabel>
              </Radio>
            ))}
          </RadioGroup>
        )}
      />
      {errors.gender && (
        <Text className="font-body text-xs text-error ml-1">{errors.gender.message}</Text>
      )}
    </View>
  );
}
