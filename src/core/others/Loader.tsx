import React, { useEffect, useMemo, useRef } from "react";
import { Animated, Easing, View } from "react-native";
import { COLORS } from "student-front-commons/src/consts/design-system/global/colors";
import { VARIANTS } from "student-front-commons/src/consts/design-system/global/definitions";
import { normalizeHorizontalSize } from "@utils/sizeUtils";
import { ICONGRAPHY } from "@commons/consts/design-system/global/icongraphy";

function Loader({ variant, size = "sm" }: { variant?: VARIANTS; size?: "xs" | "sm" | "md" | "lg" }) {
  const spinValue = useRef(new Animated.Value(0)).current;

  const iconSize = useMemo(() => normalizeHorizontalSize(ICONGRAPHY.size[size]), [size]);

  useEffect(() => {
    let animation: Animated.CompositeAnimation;

    animation = Animated.loop(
      Animated.sequence([
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 900,
          easing: Easing.quad,
          useNativeDriver: true,
        }),
        Animated.timing(spinValue, {
          toValue: 2,
          duration: 900,
          easing: Easing.quad,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();

    return () => {
      if (animation) {
        animation.stop();
      }
    };
  }, [spinValue]);

  const spinAnimation = spinValue.interpolate({
    inputRange: [0, 1, 2],
    outputRange: ["0deg", "180deg", "360deg"],
  });

  return (
    <View
      style={{
        width: iconSize,
        height: iconSize,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Animated.View
        style={{
          width: iconSize,
          height: iconSize,
          position: "absolute",
          transform: [{ rotate: spinAnimation }],
        }}
      >
        {Array.from([1, 2, 3, 4]).map((d, index) => (
          <View
            key={d}
            style={{
              width: 4,
              height: 4,
              borderRadius: 6,
              backgroundColor: variant ? COLORS[variant][500] : "white",
              position: "absolute",
              ...{
                0: {
                  top: iconSize / 2 - 2,
                  left: 0,
                },
                1: {
                  top: 0,
                  left: iconSize / 2 - 2,
                },
                2: {
                  top: iconSize / 2 - 2,
                  left: iconSize - 4,
                },
                3: {
                  bottom: 0,
                  left: iconSize / 2 - 2,
                },
              }[index],
            }}
          />
        ))}
      </Animated.View>
    </View>
  );
}

export default Loader;
