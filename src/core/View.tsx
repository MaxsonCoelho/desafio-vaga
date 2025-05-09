import React, { ReactNode } from "react";
import { View as RNView, ViewProps } from "react-native";
import { ViewStyle } from "react-native/Libraries/StyleSheet/StyleSheetTypes";
import useNormalizeStyle from "../hooks/useNormalizeStyle";

export default function View({
  children,
  onLayout,
  ...rest
}: ViewProps & { children?: ReactNode } & Partial<ViewStyle>) {
  const normalizeStyle = useNormalizeStyle(rest);
  return (
    <RNView style={normalizeStyle} onLayout={onLayout}>
      {children}
    </RNView>
  );
}
