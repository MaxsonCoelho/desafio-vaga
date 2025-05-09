import { useAnimatedStyle, useSharedValue, withSequence, withTiming } from "react-native-reanimated";
import { useCallback } from "react";

export default function useExerciseOptionAnimation() {
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
      withTiming(1.02, { duration: 200 }),
      withTiming(0.99, { duration: 200 }),
      withTiming(1, { duration: 200 })
    );
  }, []);

  const shakeAnimation = useCallback(() => {
    shakeAnim.value = withSequence(
      withTiming(10, { duration: 80 }),
      withTiming(-10, { duration: 80 }),
      withTiming(10, { duration: 80 }),
      withTiming(0, { duration: 80 })
    );
  }, []);

  const pulseAnimation = useCallback(() => {
    pulseOpacityAnim.value = withSequence(withTiming(1, { duration: 350 }), withTiming(0, { duration: 350 }));
    pulseAnimX.value = withSequence(withTiming(1.07, { duration: 500 }), withTiming(1, { duration: 500 }));
    pulseAnimY.value = withSequence(withTiming(1.15, { duration: 500 }), withTiming(1, { duration: 500 }));
  }, []);

  const opacityAnimation = useCallback(() => {
    opacityAnim.value = withTiming(0.5, { duration: 417 });
  }, []);

  return { scaleStyle, pulseStyle, opacityStyle, scaleAnimation, shakeAnimation, pulseAnimation, opacityAnimation };
}
