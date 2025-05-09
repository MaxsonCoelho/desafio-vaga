import React, { useCallback, useEffect, useRef } from "react";
import LottieView from "lottie-react-native";
import gradientWaveLottie from "@commons/assets/lotties/gradient-wave.json";
import { normalizeVerticalSize } from "@utils/sizeUtils";

enum GradientWaveStep {
  None = "none",
  Start = "start",
  Loop = "loop",
  End = "end",
}

type Props = {
  shouldStart: boolean;
};

function GradientWave({ shouldStart }: Props) {
  const lottieRef = useRef<LottieView>(null);
  const startAudioPlayed = useRef(false);
  const hasAnimationFinished = useRef(false);

  const handleAnimationSteps = useCallback((step: GradientWaveStep) => {
    const animation = lottieRef.current;

    if (animation) {
      const { start, end } = {
        [GradientWaveStep.None]: { start: 0, end: 0 },
        [GradientWaveStep.Start]: { start: 0, end: 13 },
        [GradientWaveStep.Loop]: { start: 13, end: 143 },
        [GradientWaveStep.End]: { start: 144, end: 153 },
      }[step];

      animation.play(start, end);
    }
  }, []);

  const handleAnimationFinish = useCallback(() => {
    if (shouldStart) {
      handleAnimationSteps(GradientWaveStep.Loop);
    } else if (startAudioPlayed.current) {
      handleAnimationSteps(GradientWaveStep.End);
      startAudioPlayed.current = false;
      hasAnimationFinished.current = true;
    }
  }, [shouldStart]);

  useEffect(() => {
    if (shouldStart) {
      handleAnimationSteps(GradientWaveStep.Start);
      startAudioPlayed.current = true;
    }

    if (!shouldStart && hasAnimationFinished.current) {
      handleAnimationSteps(GradientWaveStep.None);
    }

    return () => {
      hasAnimationFinished.current = false;
      handleAnimationSteps(GradientWaveStep.None);
    };
  }, [shouldStart]);

  return (
    <LottieView
      ref={lottieRef}
      source={gradientWaveLottie}
      autoPlay={false}
      loop={false}
      onAnimationFinish={handleAnimationFinish}
      style={{
        padding: 0,
        margin: 0,
        width: normalizeVerticalSize(80),
        height: normalizeVerticalSize(90),
      }}
    />
  );
}

export default GradientWave;
