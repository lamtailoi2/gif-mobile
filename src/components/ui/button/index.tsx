import { tva } from '@gluestack-ui/nativewind-utils/tva';
import React from 'react';
import { Pressable, Text } from 'react-native';

// solid  → neon green (primary action)
// outline → electric blue ghost (secondary action)
// link   → plain text link
const buttonVariants = tva({
  base: 'rounded-full py-3 px-6 items-center justify-center flex-row active:opacity-70',
  variants: {
    variant: {
      solid: 'bg-[#abd600]',
      outline: 'border border-[#4b8eff] bg-transparent',
      link: 'py-0',
    },
  },
  defaultVariants: {
    variant: 'solid',
  },
});

const buttonTextVariants = tva({
  base: 'font-semibold text-base',
  variants: {
    variant: {
      solid: 'text-[#283500]',
      outline: 'text-[#4b8eff]',
      link: 'text-[#4b8eff]',
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
  disabled?: boolean;
}

export function Button({ onPress, children, variant = 'solid', className, disabled }: ButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={buttonVariants({ variant, class: className })}
      style={disabled ? { opacity: 0.5 } : undefined}
    >
      {typeof children === 'string' ? (
        <Text className={buttonTextVariants({ variant })}>{children}</Text>
      ) : (
        children
      )}
    </Pressable>
  );
}
