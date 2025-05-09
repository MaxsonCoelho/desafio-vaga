import React, { useCallback, useEffect, useRef } from "react";
import LottieView from "lottie-react-native";
import audioWaveLottie from "@commons/assets/lotties/audio-wave.json";
import { normalizeVerticalSize } from "@utils/sizeUtils";

type Props = {
  shouldStart: boolean;
};

function AudioWave({ shouldStart }: Props) {
  const lottieRef = useRef<LottieView>(null);
  const currentAnimationStep = useRef<string>();

  const handleAnimationSteps = useCallback((step: "none" | "start" | "loop" | "end") => {
    const animation = lottieRef.current;

    if (animation) {
      const { start, end } = {
        none: { start: 0, end: 0 },
        start: { start: 0, end: 23 },
        loop: { start: 24, end: 100 },
        end: { start: 101, end: 150 },
      }[step];

      currentAnimationStep.current = step;
      animation.play(start, end);
    }
  }, []);

  useEffect(() => {
    if (shouldStart) {
      handleAnimationSteps("start");
    } else {
      handleAnimationSteps("end");
    }
  }, [shouldStart]);

  return (
    <LottieView
      key="audio-wave"
      ref={lottieRef}
      source={audioWaveLottie}
      autoPlay={false}
      loop={false}
      renderMode="HARDWARE"
      useNativeLooping={true}
      onAnimationFinish={() => {
        switch (currentAnimationStep.current) {
          case "start":
            handleAnimationSteps("loop");
            return;
          case "loop":
            handleAnimationSteps("loop");
            return;
          case "end":
            handleAnimationSteps("none");
            return;
        }
      }}
      style={{
        padding: 0,
        margin: 0,
        width: normalizeVerticalSize(24),
        height: normalizeVerticalSize(24),
      }}
    />
  );
}

export default AudioWave;
