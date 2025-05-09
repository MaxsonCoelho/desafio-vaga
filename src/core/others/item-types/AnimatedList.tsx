import React from "react";
import Animated, { SlideInRight, SlideOutLeft } from "react-native-reanimated";
import { MotionTarget, MotionType } from "@commons/core/motionStages";
import useShowMotion from "@commons/hooks/useShowMotion";

type Props<T> = {
  data: T[];
  renderItem: (props: { item: T; index: number }) => React.ReactNode;
  keyExtractor: (item: T, index: number) => string;
};

function AnimatedList<T>({ data, renderItem, keyExtractor }: Props<T>) {
  const show = useShowMotion(MotionTarget.AnimatedList, MotionType.SlideInRight, MotionType.SlideOutLeft);
  if (!show) {
    return null;
  }

  return data.map((data: T, index) => (
    <Animated.View
      entering={SlideInRight.delay((index + 1) * 33)}
      exiting={SlideOutLeft.delay(index * 33)}
      key={keyExtractor(data, index)}
    >
      {renderItem({ item: data as T, index })}
    </Animated.View>
  ));
}

export default AnimatedList;
