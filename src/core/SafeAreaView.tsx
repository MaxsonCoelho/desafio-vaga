import React, { ReactNode } from "react";
import { ViewStyle } from "react-native/Libraries/StyleSheet/StyleSheetTypes";
import { Edges, SafeAreaView as NativeSafeAreaView } from "react-native-safe-area-context";
import useNormalizeStyle from "../hooks/useNormalizeStyle";

export default function SafeAreaView({
  children,
  edges,
  ...rest
}: { children?: ReactNode; edges: Edges } & Partial<ViewStyle>) {
  const normalizeStyle = useNormalizeStyle(rest);
  return (
    <NativeSafeAreaView edges={edges} style={[normalizeStyle]}>
      {children}
    </NativeSafeAreaView>
  );
}
