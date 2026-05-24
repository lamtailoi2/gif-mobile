import { tva } from '@gluestack-ui/nativewind-utils/tva';
import React from 'react';
import { TextInput, type TextInputProps } from 'react-native';

const inputVariants = tva({
  base: 'rounded-lg px-4 py-3 text-base border border-transparent bg-[#F2F2F7] text-black placeholder:text-gray-400 data-[focus=true]:border-[#3C9FFE]',
  variants: {
    invalid: {
      true: 'border-[#FF3B30]',
    },
  },
});

interface InputProps extends TextInputProps {
  className?: string;
  isInvalid?: boolean;
}

export function Input({ className, isInvalid, style, ...props }: InputProps) {
  return (
    <TextInput
      className={inputVariants({ invalid: isInvalid, class: className })}
      placeholderTextColor="#8E8E93"
      style={style}
      {...props}
    />
  );
}
