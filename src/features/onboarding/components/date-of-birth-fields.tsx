import { Select, type SelectOption } from '@/components/ui/select';
import { useEffect, useMemo } from 'react';
import { type Control, type FieldErrors, useController } from 'react-hook-form';
import { Text, View } from 'react-native';
import { type ProfileForm } from '../libs/schema';

interface Props {
  control: Control<ProfileForm>;
  errors: FieldErrors<ProfileForm>;
  disabled?: boolean;
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const MONTH_OPTIONS: SelectOption[] = MONTHS.map((label, i) => ({
  label,
  value: String(i + 1),
}));

const CURRENT_YEAR = new Date().getFullYear();
const YEAR_OPTIONS: SelectOption[] = Array.from({ length: 91 }, (_, i) => {
  const year = CURRENT_YEAR - 10 - i; // ages 10–100
  return { label: String(year), value: String(year) };
});

/** Số ngày của tháng (1–12). Năm dùng để xử lý 29/2 năm nhuận; mặc định năm nhuận để cho phép tối đa khi chưa chọn năm. */
function daysInMonth(month: number, year: number): number {
  if (!month) return 31;
  return new Date(year || 2000, month, 0).getDate();
}

export function DateOfBirthFields({ control, errors, disabled }: Props) {
  const { field: day } = useController({ control, name: 'birthDay' });
  const { field: month } = useController({ control, name: 'birthMonth' });
  const { field: year } = useController({ control, name: 'birthYear' });

  const maxDays = daysInMonth(Number(month.value), Number(year.value));

  const dayOptions = useMemo<SelectOption[]>(
    () => Array.from({ length: maxDays }, (_, i) => ({ label: String(i + 1), value: String(i + 1) })),
    [maxDays],
  );

  // Khi đổi tháng/năm làm ngày đang chọn vượt quá số ngày (vd 31 -> tháng 2), xoá ngày để bắt chọn lại.
  useEffect(() => {
    if (day.value && Number(day.value) > maxDays) {
      day.onChange('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maxDays, day.value]);

  const hasError = !!errors.birthDay || !!errors.birthMonth || !!errors.birthYear;

  return (
    <>
      <Text className="font-body text-sm text-on-surface-variant ml-1 mb-2 mt-4">
        Date of birth
      </Text>
      <View className="flex-row gap-3">
        <View className="flex-1">
          <Select
            options={dayOptions}
            value={day.value}
            onValueChange={day.onChange}
            onClose={day.onBlur}
            placeholder="Day"
            title="Day"
            isInvalid={hasError}
            disabled={disabled}
          />
        </View>
        <View className="flex-[1.4]">
          <Select
            options={MONTH_OPTIONS}
            value={month.value}
            onValueChange={month.onChange}
            onClose={month.onBlur}
            placeholder="Month"
            title="Month"
            isInvalid={hasError}
            disabled={disabled}
          />
        </View>
        <View className="flex-1">
          <Select
            options={YEAR_OPTIONS}
            value={year.value}
            onValueChange={year.onChange}
            onClose={year.onBlur}
            placeholder="Year"
            title="Year"
            isInvalid={hasError}
            disabled={disabled}
          />
        </View>
      </View>
      {hasError && (
        <Text className="font-body text-xs text-error ml-1 mt-1">
          {errors.birthYear?.message ?? errors.birthDay?.message ?? errors.birthMonth?.message}
        </Text>
      )}
    </>
  );
}
