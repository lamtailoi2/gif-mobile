import React, { useState } from 'react';
import { StyleSheet, TextInput, type TextInputProps } from 'react-native';

interface InputProps extends TextInputProps {
  className?: string;
  isInvalid?: boolean;
}

export function Input({ className, isInvalid, style, onFocus, onBlur, ...props }: InputProps) {
  const [focused, setFocused] = useState(false);

  return (
    <TextInput
      style={[
        styles.base,
        focused && styles.focused,
        isInvalid && styles.invalid,
        style,
      ]}
      placeholderTextColor="#8e9379"
      onFocus={(e) => { setFocused(true); onFocus?.(e); }}
      onBlur={(e) => { setFocused(false); onBlur?.(e); }}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: '#201f1f',       // surface-container
    borderWidth: 1,
    borderColor: '#444933',           // outline-variant
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#e5e2e1',                 // on-surface
    fontFamily: 'Inter',
  },
  focused: {
    borderColor: '#4b8eff',           // electric blue
  },
  invalid: {
    borderColor: '#ffb4ab',           // error
  },
});
