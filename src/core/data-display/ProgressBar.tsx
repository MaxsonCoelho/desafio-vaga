import React, { useEffect, useMemo } from "react";
import View from "../View";
import { THEME } from "student-front-commons/src/consts/design-system/theme";
import { LEVELS, VARIANTS } from "student-front-commons/src/consts/design-system/global/definitions";
import { SPACINGS } from "student-front-commons/src/consts/design-system/global/spacings";
import Typography from "../general/Typography";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { normalizeVerticalSize } from "@utils/sizeUtils";

type TextThemeProps = { variant: VARIANTS; level: LEVELS };

type ProgressBarThemeProps = {
  barBackgroundColor: string;
  text: TextThemeProps;
};

type Props = {
  variant?: "white" | "primary" | "success" | "danger";
  theme?: "light" | "dark";
  progress: number;
  hideProgress?: boolean;
  size?: "2xs" | "sm";
  previousProgress?: number;
};

//This gap exists so that even though the progress being low, the bar continues to have a rounded edge.
const GAP = 10;

function ProgressBar({ progress = 0, theme = "light", variant = "primary", hideProgress = false, size = "sm" }: Props) {
  const animatedProgress = useSharedValue(progress);

  const progressBarTheme = useMemo(() => {
    const progressBarProps = THEME.progressBar.theme[theme];
    return progressBarProps as ProgressBarThemeProps;
  }, [theme, variant]);

  const height = THEME.progressBar.dimension[size].height;

  useEffect(() => {
    if (progress) {
      animatedProgress.value = withTiming(progress, { duration: 375 });
    }
  }, [progress]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${animatedProgress.value + GAP}%`,
  }));

  return (
    <View width="100%" flexDirection="row" gap={SPACINGS.xs} alignItems="center">
      <View
        height={height}
        flex={1}
        borderRadius={THEME.progressBar.border.radius}
        overflow="hidden"
        backgroundColor={progressBarTheme.barBackgroundColor}
      >
        <Animated.View
          style={[
            animatedStyle,
            {
              position: "absolute",
              height: normalizeVerticalSize(height),
              borderRadius: THEME.progressBar.border.radius,
              left: `-${GAP}%`,
              backgroundColor: THEME.progressBar[variant].progressBackgroundColor,
            },
          ]}
        />
      </View>
      {!hideProgress && (
        <Typography.Text
          variant={(progressBarTheme as { text: TextThemeProps })?.text?.variant}
          level={(progressBarTheme as { text: TextThemeProps })?.text?.level}
          size="xs"
          weight="semibold"
          label={`${progress}%`}
        />
      )}
    </View>
  );
}

export default ProgressBar;
