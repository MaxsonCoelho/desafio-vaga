import React, { useCallback, useEffect } from "react";
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withTiming } from "react-native-reanimated";
import LottieView from "lottie-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { View } from "react-native";
import { SPACINGS } from "@commons/consts/design-system/global/spacings";
import { RADIUS } from "@commons/consts/design-system/global/radius";
import { THEME } from "@commons/consts/design-system/theme";
import correctOptionLottie from "@commons/assets/lotties/correct-option.json";
import { COLORS } from "@commons/consts/design-system/global/colors";
import { normalizeHorizontalSize, normalizeVerticalSize } from "@utils/sizeUtils";
import useMotion from "@commons/hooks/useMotion";
import {
  ExerciseOptionFadeOut,
  ExerciseOptionPulse,
  ExerciseOptionScale,
  ExerciseOptionShake,
  MotionTarget,
  MotionType,
} from "@commons/core/motionStages";

const ROUNDED_SIZE = 120;

export type ExerciseOptionVariant = "accent" | "success" | "danger" | "warning";

type Props = {
  variant?: ExerciseOptionVariant;
  children: React.ReactNode;
  borderWidth?: "sm" | "md" | "lg";
  rounded?: boolean;
  disabled?: boolean;
};

function useAnimation() {
  const scaleAnim = useSharedValue(1);
  const pulseOpacityAnim = useSharedValue(1);
  const opacityAnim = useSharedValue(1);
  const pulseAnimX = useSharedValue(1);
  const pulseAnimY = useSharedValue(1);
  const shakeAnim = useSharedValue(0);

  const scaleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleAnim.value }, { translateX: shakeAnim.value }],
  }));

  const pulseStyle = useAnimatedStyle(() => ({
    opacity: pulseOpacityAnim.value,
    transform: [{ scaleX: pulseAnimX.value }, { scaleY: pulseAnimY.value }],
  }));

  const opacityStyle = useAnimatedStyle(() => ({
    opacity: opacityAnim.value,
  }));

  const scaleAnimation = useCallback(() => {
    scaleAnim.value = withSequence(
      withTiming(1.02, { duration: ExerciseOptionScale.duration / 3 }),
      withTiming(0.99, { duration: ExerciseOptionScale.duration / 3 }),
      withTiming(1, { duration: ExerciseOptionScale.duration / 3 })
    );
  }, []);

  const shakeAnimation = useCallback(() => {
    shakeAnim.value = withSequence(
      withTiming(10, { duration: ExerciseOptionShake.duration / 4 }),
      withTiming(-10, { duration: ExerciseOptionShake.duration / 4 }),
      withTiming(10, { duration: ExerciseOptionShake.duration / 4 }),
      withTiming(0, { duration: ExerciseOptionShake.duration / 4 })
    );
  }, []);

  const pulseAnimation = useCallback(() => {
    pulseOpacityAnim.value = withSequence(withTiming(1, { duration: 350 }), withTiming(0, { duration: 350 }));
    pulseAnimX.value = withSequence(
      withTiming(1.07, { duration: ExerciseOptionPulse.duration / 2 }),
      withTiming(1, { duration: ExerciseOptionPulse.duration / 2 })
    );
    pulseAnimY.value = withSequence(
      withTiming(1.15, { duration: ExerciseOptionPulse.duration / 2 }),
      withTiming(1, { duration: ExerciseOptionPulse.duration / 2 })
    );
  }, []);

  const opacityAnimation = useCallback(() => {
    opacityAnim.value = withTiming(0.5, { duration: ExerciseOptionFadeOut.duration });
  }, []);

  return { scaleStyle, pulseStyle, opacityStyle, scaleAnimation, shakeAnimation, pulseAnimation, opacityAnimation };
}

function ExerciseOption({ variant, children, disabled, borderWidth = "md", rounded }: Props) {
  const { scaleStyle, pulseStyle, opacityStyle, scaleAnimation, shakeAnimation, pulseAnimation, opacityAnimation } =
    useAnimation();

  const [pulseMotion, scaleMotion, lottieMotion, shakeMotion, fadeOutHalf] = useMotion(MotionTarget.ExerciseOption, [
    MotionType.Pulse,
    MotionType.Scale,
    MotionType.Lottie,
    MotionType.Shake,
    MotionType.FadeOutHalf,
  ]);

  useEffect(() => {
    if (["accent", "success"].includes(variant as string) && scaleMotion) {
      scaleAnimation();
    }

    if (variant === "accent" && pulseMotion) {
      pulseAnimation();
    }

    if (["warning", "danger"].includes(variant as string) && shakeMotion) {
      shakeAnimation();
    }

    if (disabled && fadeOutHalf) {
      opacityAnimation();
    }
  }, [pulseMotion, scaleMotion, shakeMotion, fadeOutHalf, disabled, variant]);

  return (
    <View style={{ position: "relative", width: "100%" }}>
      {!disabled && (
        <Animated.View
          style={[
            pulseStyle,
            {
              backgroundColor: variant === "accent" ? COLORS.accent[400] : undefined,
              position: "absolute",
              width: "100%",
              borderRadius: RADIUS.md,
              zIndex: -1,
              height: "100%",
            },
          ]}
        />
      )}
      <Animated.View
        style={[
          opacityStyle,
          scaleStyle,
          {
            zIndex: 0,
            borderWidth: variant ? { sm: 1, md: 2, lg: 4 }[borderWidth] : 0,
            backgroundColor: "#FFFFFF",
            position: "relative",
            ...(rounded
              ? {
                  height: normalizeVerticalSize(ROUNDED_SIZE),
                  width: normalizeVerticalSize(ROUNDED_SIZE),
                  borderRadius: ROUNDED_SIZE * 2,
                  alignItems: "center",
                  justifyContent: "center",
                }
              : {
                  width: "100%",
                  borderRadius: RADIUS.md,
                  paddingVertical: normalizeVerticalSize(SPACINGS.md),
                  paddingHorizontal: normalizeHorizontalSize(SPACINGS.xl),
                }),
            borderColor: THEME.exerciseOption.state[variant || "none"].borderColor,
          },
        ]}
      >
        <LinearGradient
          colors={[THEME.exerciseOption.state[variant || "none"].backgroundColor!, COLORS.white]}
          start={{ x: 0.1, y: 0.4 }}
          end={{ x: 0.4, y: 0 }}
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            ...(rounded
              ? {
                  height: normalizeVerticalSize(ROUNDED_SIZE) - 5,
                  width: normalizeVerticalSize(ROUNDED_SIZE) - 5,
                  borderRadius: ROUNDED_SIZE,
                }
              : {
                  width: "auto",
                  borderRadius: RADIUS.md - 3,
                }),
          }}
        />
        {children}
      </Animated.View>
      {variant === "success" && lottieMotion && (
        <LottieView
          source={correctOptionLottie}
          autoPlay
          duration={1337}
          loop={false}
          style={{
            padding: 0,
            margin: 0,
            width: "100%",
            height: normalizeVerticalSize(100),
            position: "absolute",
            zIndex: 10,
            bottom: 0,
          }}
        />
      )}
    </View>
  );
}

export default ExerciseOption;
