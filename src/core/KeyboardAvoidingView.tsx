import React, { ReactNode } from "react";
import { KeyboardAvoidingView as NativeKeyboardAvoidingView } from "react-native";
import { Platform } from "react-native";
import { ViewStyle } from "react-native/Libraries/StyleSheet/StyleSheetTypes";
import useNormalizeStyle from "../hooks/useNormalizeStyle";

function KeyboardAvoidingView({ children, ...rest }: { children?: ReactNode } & Partial<ViewStyle>) {
  const normalizeStyle = useNormalizeStyle(rest);
  return (
    <NativeKeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[{ flex: 1 }, normalizeStyle]}
    >
      {children}
    </NativeKeyboardAvoidingView>
  );
}

export default KeyboardAvoidingView;
