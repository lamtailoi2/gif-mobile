import { tva } from '@gluestack-ui/nativewind-utils/tva';
import React from 'react';
import { Pressable, Text } from 'react-native';

const buttonVariants = tva({
  base: 'rounded-lg py-2 items-center justify-center flex-row active:opacity-70',
  variants: {
    variant: {
      solid: 'bg-[#3C9FFE]',
      outline: 'border border-[#60646C]',
      link: 'py-0',
    },
  },
  defaultVariants: {
    variant: 'solid',
  },
});

const buttonTextVariants = tva({
  base: 'font-medium text-base',
  variants: {
    variant: {
      solid: 'text-white',
      outline: 'text-foreground',
      link: 'text-[#3C9FFE]',
    },
  },
  defaultVariants: {
    variant: 'solid',
  },
});

type ButtonVariant = 'solid' | 'outline' | 'link';

interface ButtonProps {
  onPress?: () => void;
  children: React.ReactNode;
  variant?: ButtonVariant;
  className?: string;
}

export function Button({ onPress, children, variant = 'solid', className }: ButtonProps) {
  return (
    <Pressable onPress={onPress} className={buttonVariants({ variant, class: className })}>
      {typeof children === 'string' ? (
        <Text className={buttonTextVariants({ variant })}>{children}</Text>
      ) : (
        children
      )}
    </Pressable>
  );
}
