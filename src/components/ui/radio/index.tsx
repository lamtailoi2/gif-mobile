'use client';
import { PrimitiveIcon, Svg } from '@gluestack-ui/core/icon/creator';
import { createRadio } from '@gluestack-ui/core/radio/creator';
import {
  tva,
  useStyleContext,
  withStyleContext,
  type VariantProps,
} from '@gluestack-ui/utils/nativewind-utils';
import { cssInterop } from 'nativewind';
import React from 'react';
import { Platform, Pressable, Text, View } from 'react-native';

const SCOPE = 'Radio';

const UIRadio = createRadio({
  Root: (Platform.OS === 'web'
    ? withStyleContext(View, SCOPE)
    : withStyleContext(Pressable, SCOPE)) as any,
  Group: View,
  Icon: PrimitiveIcon,
  Indicator: View,
  Label: Text,
});

cssInterop(UIRadio, { className: 'style' });
cssInterop(UIRadio.Group, { className: 'style' });
cssInterop(UIRadio.Label, { className: 'style' });
cssInterop(UIRadio.Indicator, { className: 'style' });
cssInterop(UIRadio.Icon, {
  className: {
    target: 'style',
    nativeStyleToProp: {
      height: true,
      width: true,
      fill: true,
      stroke: true,
    },
  },
});

const radioStyle = tva({
  base: 'group/radio flex-row justify-start items-center web:cursor-pointer data-[disabled=true]:opacity-40',
});

const radioGroupStyle = tva({ base: 'gap-2' });

const radioIndicatorStyle = tva({
  base: 'justify-center items-center w-5 h-5 rounded-full border-2 border-outline-variant bg-transparent data-[checked=true]:border-neon-green data-[disabled=true]:opacity-40',
});

const radioLabelStyle = tva({
  base: 'font-body text-base text-on-surface data-[checked=true]:text-on-surface',
});

const radioIconStyle = tva({ base: 'fill-neon-green text-neon-green' });

export const RadioGroup = React.forwardRef<
  React.ComponentRef<typeof UIRadio.Group>,
  React.ComponentProps<typeof UIRadio.Group> & { className?: string }
>(function RadioGroup({ className, ...props }, ref) {
  return (
    <UIRadio.Group ref={ref} className={radioGroupStyle({ class: className })} {...props} />
  );
});

type IRadioProps = React.ComponentProps<typeof UIRadio> & { className?: string };

export const Radio = React.forwardRef<React.ComponentRef<typeof UIRadio>, IRadioProps>(
  function Radio({ className, ...props }, ref) {
    return <UIRadio ref={ref} className={radioStyle({ class: className })} {...props} />;
  },
);

export const RadioIndicator = React.forwardRef<
  React.ComponentRef<typeof UIRadio.Indicator>,
  React.ComponentProps<typeof UIRadio.Indicator> & { className?: string }
>(function RadioIndicator({ className, ...props }, ref) {
  return (
    <UIRadio.Indicator
      ref={ref}
      className={radioIndicatorStyle({ class: className })}
      {...props}
    />
  );
});

export const RadioLabel = React.forwardRef<
  React.ComponentRef<typeof UIRadio.Label>,
  React.ComponentProps<typeof UIRadio.Label> & { className?: string }
>(function RadioLabel({ className, ...props }, ref) {
  return (
    <UIRadio.Label ref={ref} className={radioLabelStyle({ class: className })} {...props} />
  );
});

export const RadioIcon = React.forwardRef<
  React.ComponentRef<typeof UIRadio.Icon>,
  React.ComponentProps<typeof UIRadio.Icon> &
    VariantProps<typeof radioIconStyle> & { className?: string; height?: number; width?: number }
>(function RadioIcon({ className, size = 'sm', ...props }, ref) {
  return (
    <UIRadio.Icon
      ref={ref}
      size={size}
      className={radioIconStyle({ class: className })}
      {...props}
    />
  );
});

export { Svg };
