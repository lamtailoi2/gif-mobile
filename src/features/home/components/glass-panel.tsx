import { ReactNode } from "react";
import { View, ViewProps } from "react-native";

interface IGlassPanelProps extends ViewProps {
  children: ReactNode;
  className?: string;
}

export default function GlassPanel({
  children,
  className = "",
  style,
  ...rest
}: IGlassPanelProps) {
  return (
    <View
      className={`rounded-md border border-white/10 bg-white/5 overflow-hidden ${className}`}
      style={style}
      {...rest}
    >
      {children}
    </View>
  );
}
