import React, { useEffect, useRef, useState } from "react";
import { Animated, LayoutChangeEvent, StyleSheet } from "react-native";
import { normalizeHorizontalSize, normalizeVerticalSize } from "@utils/sizeUtils";
import View from "@core/View";
import { SPACINGS } from "@commons/consts/design-system/global/spacings";

type Props = {
  isOpen?: boolean;
  content: React.ReactNode;
  children: React.ReactNode;
};

function Popover({ content, children, isOpen }: Props) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(normalizeVerticalSize(0))).current;
  const scale = useRef(new Animated.Value(0)).current;

  const [childrenLayout, setChildrenLayout] = useState({ x: 0, y: 0, width: 0, height: 0 });

  useEffect(() => {
    if (isOpen) {
      Animated.parallel([
        Animated.timing(opacity, {
          delay: 500,
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: (SPACINGS["sm"] + childrenLayout.height) * -1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          delay: 500,
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isOpen, childrenLayout.height]);

  const handleChildrenLayout = (event: LayoutChangeEvent) => {
    const { x, y, width, height } = event.nativeEvent.layout;
    setChildrenLayout({ x, y, width, height });
  };

  return (
    <View flexDirection="row" alignItems="center" justifyContent="center">
      {isOpen && (
        <Animated.View
          onLayout={handleChildrenLayout}
          style={{
            position: "absolute",
            opacity,
            transformOrigin: "center center",
            transform: [{ scale }, { translateY }],
            flexDirection: "row",
            paddingHorizontal: normalizeHorizontalSize(24),
            paddingVertical: normalizeVerticalSize(16),
            borderRadius: 8,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
            top: 0,
            maxWidth: normalizeHorizontalSize(224),
            width: "auto",
            backgroundColor: "#ffffff",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Animated.View style={{ ...styles.triangle, opacity }} />
          <View flex={-1} margin="auto" justifyContent="center" alignItems="center">
            {content}
          </View>
        </Animated.View>
      )}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  triangle: {
    position: "absolute",
    bottom: -6,
    left: "50%",
    marginLeft: 4,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    width: 0,
    height: 0,
    borderLeftWidth: 20,
    borderRightWidth: 20,
    borderTopWidth: 20,
    borderStyle: "solid",
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: "white",
  },
});

export default Popover;
