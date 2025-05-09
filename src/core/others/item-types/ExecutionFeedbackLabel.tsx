import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Animated, { FadeInDown, FadeOutDown } from "react-native-reanimated";
import LottieView from "lottie-react-native";
import { SPACINGS } from "@commons/consts/design-system/global/spacings";
import iconSuccessLottie from "@commons/assets/lotties/icon-correct.json";
import iconFailLottie from "@commons/assets/lotties/icon-fail.json";
import View from "@core/View";
import { COLORS } from "@commons/consts/design-system/global/colors";
import Icon from "@core/general/Icon";
import { ItemExecutionItemStatus } from "@commons/slices/types/itemExecutionTypes";
import Typography from "@core/general/Typography";
import useNormalizeStyle from "../../../hooks/useNormalizeStyle";
import {
  ExecutionFeedbackLabelFadeInDown,
  ExecutionFeedbackLabelFadeOutDown,
  MotionTarget,
  MotionType,
} from "@commons/core/motionStages";
import useMotion from "@commons/hooks/useMotion";
import correctOptionLottie from "@commons/assets/lotties/correct-option.json";
import { normalizeHorizontalSize, normalizeVerticalSize } from "@utils/sizeUtils";
import useShowMotion from "@commons/hooks/useShowMotion";
import { getTranslation } from "@locales";
import useAppSelector from "@commons/hooks/useAppSelector";
import { ItemTypeKey } from "@commons/models/itemTypeModel";
import { getSelectedItemProp } from "@commons/slices/utils/itemExecutionUtils";
import * as Haptics from "expo-haptics";

type FeedbackLabel = { label: string; variant: "danger" | "warning" | "success" };

enum AnimatedIconTypes {
  CORRECT = "CORRECT",
  WRONG = "WRONG",
}

function AnimatedIcon({ type }: { type: AnimatedIconTypes }) {
  const lottieRef = useRef<LottieView>(null);
  const [shouldStart, setShouldStart] = useState(false);

  const handleAnimation = useCallback(() => {
    const animation = lottieRef.current;
    if (animation) {
      animation.play(0, 24);
    }
  }, []);

  useEffect(() => {
    if (shouldStart) {
      handleAnimation();
    }
  }, [shouldStart]);

  useEffect(() => {
    setTimeout(() => {
      setShouldStart(true);
    }, 300);
  }, []);

  return (
    <View width={28} height={28}>
      <LottieView
        ref={lottieRef}
        source={type === AnimatedIconTypes.CORRECT ? iconSuccessLottie : iconFailLottie}
        autoPlay={false}
        loop={false}
        speed={0.5}
        style={{
          padding: 0,
          margin: 0,
          width: "100%",
          height: "100%",
        }}
      />
    </View>
  );
}

function ExecutionFeedbackLabel() {
  const executionStatus = useAppSelector((state) => getSelectedItemProp(state, "status")) as ItemExecutionItemStatus;
  const answer = useAppSelector((state) => getSelectedItemProp(state, "answer"));
  const itemTypeKey = useAppSelector((state) => getSelectedItemProp(state, "item.type.key"));
  const itemId = useAppSelector((state) => getSelectedItemProp(state, "item.id")) as string;
  const [showLottieCorrectOption, setShowLottieCorrectOption] = useState(false);

  const [correctOptionLottieMotion] = useMotion(MotionTarget.ExecutionFeedbackLabel, [MotionType.Lottie]);

  const showFeedbackLabelMotion = useShowMotion(
    MotionTarget.ExecutionFeedbackLabel,
    MotionType.FadeInDown,
    MotionType.FadeOutDown,
  );

  const feedbackLabel: FeedbackLabel = useMemo(() => {
    if (itemTypeKey === ItemTypeKey.TRUE_FALSE && executionStatus === ItemExecutionItemStatus.WRONG) {
      return {
        label: getTranslation("features.UnitExecution.components.ExecutionFeedbackLabel.trueFalseWrongLabel"),
        variant: "danger",
      };
    }

    return {
      [ItemExecutionItemStatus.VALIDATE_CORRECT]: {
        label: getTranslation("features.UnitExecution.components.ExecutionFeedbackLabel.correctLabel"),
        variant: "success",
      },
      [ItemExecutionItemStatus.CORRECT]: {
        label: getTranslation(
          answer && typeof answer === "number"
            ? "features.UnitExecution.components.ExecutionFeedbackLabel.veryWellLabel"
            : "features.UnitExecution.components.ExecutionFeedbackLabel.correctLabel",
        ),
        variant: "success",
      },
      [ItemExecutionItemStatus.VALIDATE_WARNING]: {
        label:
          answer && typeof answer === "number"
            ? getTranslation("features.UnitExecution.components.ExecutionFeedbackLabel.tryImproveLabel")
            : getTranslation("features.UnitExecution.components.ExecutionFeedbackLabel.warningLabel"),
        variant: "warning",
      },
      [ItemExecutionItemStatus.VALIDATE_WRONG]: {
        label: getTranslation("features.UnitExecution.components.ExecutionFeedbackLabel.wrongLabel"),
        variant: "danger",
      },
    }[
      executionStatus as
        | ItemExecutionItemStatus.VALIDATE_CORRECT
        | ItemExecutionItemStatus.CORRECT
        | ItemExecutionItemStatus.VALIDATE_WARNING
        | ItemExecutionItemStatus.VALIDATE_WRONG
    ] as FeedbackLabel;
  }, [executionStatus, answer, itemTypeKey]);

  const baseStyles = useNormalizeStyle({
    flexDirection: "row",
    gap: SPACINGS.xs,
    alignItems: "center",
    justifyContent: "center",
  });

  useEffect(() => {
    if (correctOptionLottieMotion) setShowLottieCorrectOption(true);
  }, [correctOptionLottieMotion]);

  useEffect(() => {
    setShowLottieCorrectOption(false);
  }, [itemId]);

  useEffect(() => {
    if (showFeedbackLabelMotion) {
      if (executionStatus === ItemExecutionItemStatus.VALIDATE_WARNING) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      }
      if (executionStatus === ItemExecutionItemStatus.VALIDATE_WRONG) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    }
  }, [executionStatus, showFeedbackLabelMotion]);

  if (!showFeedbackLabelMotion) {
    return null;
  }

  return (
    <Animated.View
      style={baseStyles}
      entering={FadeInDown.duration(ExecutionFeedbackLabelFadeInDown.duration)}
      exiting={FadeOutDown.duration(ExecutionFeedbackLabelFadeOutDown.duration)}
    >
      {!!feedbackLabel && (
        <>
          {ItemExecutionItemStatus.VALIDATE_WARNING === executionStatus && (
            <View
              alignItems="center"
              justifyContent="center"
              backgroundColor={COLORS[feedbackLabel.variant]["200"]}
              width={24}
              height={24}
              borderRadius={24}
            >
              <Icon name="X" variant="warning" size="md" strokeWidth={3} />
            </View>
          )}
          {[
            ItemExecutionItemStatus.VALIDATE_CORRECT,
            ItemExecutionItemStatus.CORRECT,
            ItemExecutionItemStatus.VALIDATE_WRONG,
            ItemExecutionItemStatus.WRONG,
          ].includes(executionStatus) && (
            <AnimatedIcon
              type={
                [ItemExecutionItemStatus.VALIDATE_CORRECT, ItemExecutionItemStatus.CORRECT].includes(executionStatus)
                  ? AnimatedIconTypes.CORRECT
                  : AnimatedIconTypes.WRONG
              }
            />
          )}
          {showLottieCorrectOption && (
            <LottieView
              source={correctOptionLottie}
              autoPlay
              duration={1337}
              loop={false}
              style={{
                padding: 0,
                margin: 0,
                width: normalizeHorizontalSize(198),
                height: normalizeVerticalSize(60),
                position: "absolute",
                zIndex: 10,
              }}
            />
          )}
          <Typography.Text
            variant={feedbackLabel.variant}
            label={feedbackLabel.label}
            size="md"
            weight="semibold"
            level={600}
          />
        </>
      )}
    </Animated.View>
  );
}

export default ExecutionFeedbackLabel;
