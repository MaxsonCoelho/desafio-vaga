import React, { useCallback, useEffect, useState } from "react";
import { RADIUS } from "@commons/consts/design-system/global/radius";
import { SPACINGS } from "@commons/consts/design-system/global/spacings";
import useAppSelector from "@commons/hooks/useAppSelector";
import { COLORS } from "@commons/consts/design-system/global/colors";
import Typography from "@core/general/Typography";
import { ItemExecutionItemStatus } from "@commons/slices/types/itemExecutionTypes";
import ExecutionFeedbackLabel from "@core/others/item-types/ExecutionFeedbackLabel";
import Animated, {
  Easing,
  FadeIn,
  FadeInDown,
  FadeOutDown,
  LinearTransition,
  ReduceMotion,
  runOnJS,
  SlideInUp,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import useNormalizeStyle from "../../../hooks/useNormalizeStyle";
import View from "@core/View";
import useMotion from "@commons/hooks/useMotion";
import { normalizeVerticalSize } from "@utils/sizeUtils";
import {
  ExecutionHeaderChangeColor,
  ExecutionHeaderFadeIn,
  ExecutionHeaderGrow,
  ExecutionInstructionLabelFadeInDown,
  ExecutionInstructionLabelFadeOutDown,
  MotionTarget,
  MotionType,
} from "@commons/core/motionStages";
import useShowMotion from "@commons/hooks/useShowMotion";
import { getSelectedItemProp } from "@commons/slices/utils/itemExecutionUtils";
import { ItemTypeKey } from "@commons/models/itemTypeModel";
import { useScrollView } from "@core/others/ScrollView";

type Props = {
  instructionLabel: string;
  itemTypeQuestion?: React.ReactElement;
};

function ExecutionInstructionLabel({ label }: { label: string }) {
  const showInstructionLabelMotion = useShowMotion(
    MotionTarget.ExecutionInstructionLabel,
    MotionType.FadeInDown,
    MotionType.FadeOutDown
  );

  if (!showInstructionLabelMotion) {
    return null;
  }

  return (
    <Animated.View
      entering={FadeInDown.duration(ExecutionInstructionLabelFadeInDown.duration)}
      exiting={FadeOutDown.duration(ExecutionInstructionLabelFadeOutDown.duration)}
    >
      <Typography.Text variant="secondary" label={label} size="md" weight="medium" level={600} />
    </Animated.View>
  );
}

export function useUnitExecutionHeaderBgAnimatedStyles() {
  const headerBackground = useSharedValue(COLORS.white);
  const [changeHeaderBackgroundColorMotion] = useMotion(MotionTarget.ExecutionHeader, [MotionType.ChangeColor]);

  const executionStatus = useAppSelector((state) => getSelectedItemProp(state, "status")) as ItemExecutionItemStatus;
  const itemId = useAppSelector((state) => getSelectedItemProp(state, "item.id")) as string;
  const animatedStyles = useAnimatedStyle(() => ({
    backgroundColor: headerBackground.value,
  }));

  const handleBackgroundAnimation = useCallback(() => {
    if ([ItemExecutionItemStatus.VALIDATE_CORRECT, ItemExecutionItemStatus.CORRECT].includes(executionStatus)) {
      headerBackground.value = withTiming(COLORS.success[100]!, {
        duration: ExecutionHeaderChangeColor.duration,
        easing: Easing.bezier(0.33, 0.0, 0.67, 1.0),
        reduceMotion: ReduceMotion.System,
      });
    } else {
      headerBackground.value = withTiming(COLORS.white, {
        duration: ExecutionHeaderChangeColor.duration,
        easing: Easing.bezier(0.33, 0.0, 0.67, 1.0),
        reduceMotion: ReduceMotion.System,
      });
    }
  }, [executionStatus]);

  useEffect(() => {
    if (!!changeHeaderBackgroundColorMotion) handleBackgroundAnimation();
  }, [changeHeaderBackgroundColorMotion]);

  useEffect(() => {
    headerBackground.value = withTiming(COLORS.white, {
      duration: ExecutionHeaderChangeColor.duration,
      easing: Easing.bezier(0.33, 0.0, 0.67, 1.0),
      reduceMotion: ReduceMotion.System,
    });
  }, [itemId]);

  return animatedStyles;
}

function UnitExecutionHeader({ instructionLabel, itemTypeQuestion }: Props) {
  const { scrollToTop, setScrollEnabled } = useScrollView();
  const safeAreaInsets = useSafeAreaInsets();
  const animatedStyles = useUnitExecutionHeaderBgAnimatedStyles();
  const executionStatus = useAppSelector((state) => getSelectedItemProp(state, "status")) as ItemExecutionItemStatus;

  const [showGrowthHeader, setShowGrowthHeader] = useState(false);
  const [showFadeInHeader, setShowFadeInHeader] = useState(false);

  const itemId = useAppSelector((state) => getSelectedItemProp(state, "item.id")) as string;
  const itemTypeKey = useAppSelector((state) => getSelectedItemProp(state, "item.type.key")) as ItemTypeKey;

  const [growHeaderBackground, fadeInHeaderBackground] = useMotion(MotionTarget.ExecutionHeader, [
    MotionType.Grow,
    MotionType.FadeIn,
  ]);

  const headerBaseStyles = useNormalizeStyle({
    borderBottomLeftRadius: RADIUS.lg,
    borderBottomRightRadius: RADIUS.lg,
    paddingTop: safeAreaInsets.top + SPACINGS["3xl"] + 48,
    paddingHorizontal: SPACINGS.md,
    paddingBottom: SPACINGS.xl,
    width: "100%",
    zIndex: 2,
  });

  useEffect(() => {
    if (growHeaderBackground) setShowGrowthHeader(true);
    if (fadeInHeaderBackground) setShowFadeInHeader(true);
  }, [growHeaderBackground, fadeInHeaderBackground]);

  useEffect(() => {
    setShowGrowthHeader(false);
    setShowFadeInHeader(false);
    setScrollEnabled(true);
  }, [itemId]);

  return (
    <>
      {(itemTypeKey === ItemTypeKey.TRUE_FALSE || executionStatus !== ItemExecutionItemStatus.WRONG) && (
        <Animated.View layout={LinearTransition} style={[headerBaseStyles, animatedStyles]}>
          <View alignItems="center" justifyContent="center" gap={SPACINGS.md}>
            <View height={normalizeVerticalSize(20)} width="100%" flexDirection="row" justifyContent="center">
              <View position="absolute">
                <ExecutionFeedbackLabel />
              </View>
              <View position="absolute">
                <ExecutionInstructionLabel label={instructionLabel} />
              </View>
            </View>
            {itemTypeQuestion}
          </View>
        </Animated.View>
      )}
      {showGrowthHeader && (
        <Animated.View
          style={[
            {
              zIndex: 1,
              backgroundColor: COLORS.white,
              position: "absolute",
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
            },
          ]}
          entering={SlideInUp.duration(ExecutionHeaderGrow.duration)}
        />
      )}
      {showFadeInHeader && (
        <Animated.View
          style={[
            {
              zIndex: 1,
              backgroundColor: COLORS.white,
              position: "absolute",
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
            },
          ]}
          entering={FadeIn.duration(ExecutionHeaderFadeIn.duration).withCallback(() => {
            runOnJS(setScrollEnabled)(false);
            runOnJS(scrollToTop)();
          })}
        />
      )}
    </>
  );
}

export default UnitExecutionHeader;
