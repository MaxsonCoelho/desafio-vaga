import React, { useCallback, useEffect } from "react";
import Animated, {
  Easing,
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { SPACINGS } from "@commons/consts/design-system/global/spacings";
import Typography from "@core/general/Typography";
import { getTranslation } from "@locales";
import View from "@core/View";
import SafeAreaView from "@core/SafeAreaView";
import Separator from "@core/others/Separator";
import useMotion from "@commons/hooks/useMotion";
import { MotionTarget, MotionType } from "@commons/core/motionStages";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { isNil } from "lodash";

function AnimatedWrongFeedbackItem({ children, position }: { children: React.ReactNode; position?: number }) {
  const scale = useSharedValue(1.26);
  const opacity = useSharedValue(0);

  const [cascadeMotion] = useMotion(MotionTarget.AnimatedWrongFeedbackItem, [MotionType.Cascade]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const handleAnimation = useCallback(() => {
    if (!isNil(position)) {
      scale.value = withDelay(
        position * 50,
        withTiming(1, {
          duration: 380,
          easing: Easing.bezier(0, 0, 0.17, 1),
          reduceMotion: ReduceMotion.System,
        }),
      );
      opacity.value = withDelay(
        position * 50,
        withTiming(1, {
          duration: 370,
          easing: Easing.bezier(0.33, 0, 0.67, 1),
          reduceMotion: ReduceMotion.System,
        }),
      );
    } else {
      scale.value = withTiming(1, {
        duration: 380,
        easing: Easing.bezier(0, 0, 0.17, 1),
        reduceMotion: ReduceMotion.System,
      });
      opacity.value = withTiming(1, {
        duration: 370,
        easing: Easing.bezier(0.33, 0, 0.67, 1),
        reduceMotion: ReduceMotion.System,
      });
    }
  }, [position]);

  useEffect(() => {
    if (cascadeMotion) {
      handleAnimation();
    }
  }, [cascadeMotion]);

  return <Animated.View style={[animatedStyle]}>{children}</Animated.View>;
}

type Props = {
  userAttempts: React.ReactNode[];
  correctOption: React.ReactNode;
  itemText?: React.ReactNode;
  itemAudioUrl?: string;
  align?: "left" | "center";
  attemptsFlexDirection?: "column" | "row";
};

function WrongFeedbackContainer({
  userAttempts,
  correctOption,
  itemText,
  align = "left",
  attemptsFlexDirection = "column",
}: Props) {
  const safeAreaInsets = useSafeAreaInsets();

  return (
    <SafeAreaView
      edges={["top"]}
      flexDirection="column"
      marginTop={safeAreaInsets.top + 48}
      paddingVertical={SPACINGS.lg}
      paddingHorizontal={SPACINGS.xl}
      zIndex={2}
    >
      {itemText && (
        <>
          <AnimatedWrongFeedbackItem position={0}>{itemText}</AnimatedWrongFeedbackItem>
          <Separator size="3xl" />
        </>
      )}
      <AnimatedWrongFeedbackItem position={itemText ? 1 : 0}>
        <Typography.Text
          label={getTranslation("core.others.itemType.WrongFeedbackContainer.correctTitle")}
          size="md"
          variant="accent"
          weight="bold"
          align={align}
        />
      </AnimatedWrongFeedbackItem>
      <Separator size="md" />
      <AnimatedWrongFeedbackItem position={itemText ? 2 : 1}>
        <View
          flexDirection="row"
          gap={SPACINGS["2xs"]}
          flexWrap="wrap"
          flex={1}
          justifyContent={align === "center" ? "center" : "flex-start"}
        >
          {correctOption}
        </View>
      </AnimatedWrongFeedbackItem>
      <Separator size="xl" />
      <View backgroundColor="#E2E8F0" width={align === "center" ? "70%" : "100%"} alignSelf="center" height={3} />
      <Separator size="xl" />
      <AnimatedWrongFeedbackItem position={itemText ? 3 : 2}>
        <Typography.Text
          label={getTranslation("core.others.itemType.WrongFeedbackContainer.yourAttemptsTitle")}
          size="md"
          variant="danger"
          weight="bold"
          align={align}
        />
      </AnimatedWrongFeedbackItem>
      <Separator size="md" />
      <View gap={SPACINGS.md} flexDirection={attemptsFlexDirection}>
        {userAttempts.map((attempt, index) => (
          <AnimatedWrongFeedbackItem position={itemText ? index + 4 : index + 3} key={index}>
            {attempt}
          </AnimatedWrongFeedbackItem>
        ))}
      </View>
    </SafeAreaView>
  );
}

export default WrongFeedbackContainer;
