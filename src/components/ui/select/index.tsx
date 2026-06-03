import { CheckIcon, ChevronDownIcon, Icon } from '@/components/ui/icon';
import { useState } from 'react';
import { FlatList, Modal, Pressable, Text, View } from 'react-native';

export interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps {
  options: SelectOption[];
  value?: string;
  onValueChange: (value: string) => void;
  onClose?: () => void;
  placeholder?: string;
  title?: string;
  isInvalid?: boolean;
  disabled?: boolean;
}

export function Select({
  options,
  value,
  onValueChange,
  onClose,
  placeholder = 'Select',
  title,
  isInvalid,
  disabled,
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.value === value);

  const close = () => {
    setOpen(false);
    onClose?.();
  };

  return (
    <>
      <Pressable
        onPress={() => !disabled && setOpen(true)}
        className={`flex-row items-center justify-between rounded-xl border px-4 py-3.5 bg-[#201f1f] ${
          isInvalid ? 'border-error' : 'border-outline-variant'
        } ${disabled ? 'opacity-50' : ''}`}
      >
        <Text
          className={`font-body text-base ${
            selected ? 'text-on-surface' : 'text-on-surface-variant'
          }`}
        >
          {selected ? selected.label : placeholder}
        </Text>
        <Icon as={ChevronDownIcon} className="text-on-surface-variant" size="sm" />
      </Pressable>

      <Modal visible={open} transparent animationType="fade" onRequestClose={close}>
        <Pressable className="flex-1 bg-black/60 justify-end" onPress={close}>
          <Pressable
            className="bg-[#201f1f] rounded-t-3xl border-t border-x border-white/[0.07] max-h-[60%] pb-6"
            onPress={(e) => e.stopPropagation()}
          >
            <View className="items-center pt-3 pb-1">
              <View className="h-1 w-10 rounded-full bg-white/20" />
            </View>
            {title && (
              <Text className="font-display text-base font-bold text-on-surface text-center py-2">
                {title}
              </Text>
            )}
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => {
                const isSelected = item.value === value;
                return (
                  <Pressable
                    onPress={() => {
                      onValueChange(item.value);
                      close();
                    }}
                    className="flex-row items-center justify-between px-5 py-3.5"
                  >
                    <Text
                      className={`font-body text-base ${
                        isSelected ? 'text-neon-green font-semibold' : 'text-on-surface'
                      }`}
                    >
                      {item.label}
                    </Text>
                    {isSelected && (
                      <Icon as={CheckIcon} className="text-neon-green" size="sm" />
                    )}
                  </Pressable>
                );
              }}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}
