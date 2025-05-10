import React, { useCallback, useMemo } from "react";
import { Pressable } from "react-native";
import View from "@core/View";
import Typography from "@core/general/Typography";
import useAppSelector from "@commons/hooks/useAppSelector";
import { getSelectedItemProp } from "@commons/slices/utils/itemExecutionUtils";
import { SPACINGS } from "@commons/consts/design-system/global/spacings";
import { ItemAnswer, LinkedAnswer } from "@commons/models/itemModel";
import ExerciseOption, { ExerciseOptionVariant } from "@core/others/item-types/ExerciseOption";
import { COLORS } from "@commons/consts/design-system/global/colors";
import Radio from "../../../../core/data-entry/Radio";
import WrongFeedbackContainer from "@core/others/item-types/WrongFeedbackContainer";
import AnimatedList from "@core/others/item-types/AnimatedList";
import { ItemExecutionItemStatus } from "@commons/slices/types/itemExecutionTypes";
import Animated, { FadeInDown, FadeOutDown } from "react-native-reanimated";
import useNormalizeStyle from "../../../../hooks/useNormalizeStyle";
import {
  ItemHeaderAnswerFadeInDown,
  ItemHeaderAnswerFadeOutDown,
  ItemHeaderQuestionFadeInDown,
  ItemHeaderQuestionFadeOutDown,
  MotionTarget,
  MotionType,
} from "@commons/core/motionStages";
import useShowMotion from "@commons/hooks/useShowMotion";
import { useExecution } from "@commons/contexts/ExecutionContext";
import QuestionAndAnswerContainer from "@core/others/item-types/QuestionAndAnswerContainer";

export function GapFillSelectHeader() {
  const itemText = useAppSelector((state) => getSelectedItemProp(state, "item.text")) as string;
  const executionStatus = useAppSelector((state) => getSelectedItemProp(state, "status")) as ItemExecutionItemStatus;
  const userAnswer = useAppSelector((state) => getSelectedItemProp(state, "answer")) as string;
  const itemAnswers = useAppSelector((state) => getSelectedItemProp(state, "item.answers")) as ItemAnswer[];
  const itemLinkedAnswers = useAppSelector((state) =>
    getSelectedItemProp(state, "item.linkedAnswers")
  ) as LinkedAnswer[];
  const selectedId = useAppSelector(state => state.itemExecutions.selectedId);
  console.log("🧠 selectedId in component:", selectedId);

  // DEBUG HEAD
  console.log("📌 [GapFillSelectHeader] itemText:", itemText);
  console.log("📌 [GapFillSelectHeader] itemAnswers:", itemAnswers);
  console.log("📌 [GapFillSelectHeader] itemLinkedAnswers:", itemLinkedAnswers);
  console.log("📌 [GapFillSelectHeader] userAnswer:", userAnswer);
  console.log("📌 [GapFillSelectHeader] status:", executionStatus);

  const showQuestionHeader = useShowMotion(
    MotionTarget.ItemHeaderQuestion,
    MotionType.FadeInDown,
    MotionType.FadeOutDown
  );
  const showQuestionAnswer = useShowMotion(
    MotionTarget.ItemHeaderAnswer,
    MotionType.FadeInDown,
    MotionType.FadeOutDown
  );

  const getVariantByStatus = useCallback((status: ItemExecutionItemStatus): ExerciseOptionVariant => {
    if (status === ItemExecutionItemStatus.VALIDATE_CORRECT) return "success";
    if (status === ItemExecutionItemStatus.VALIDATE_WRONG) return "danger";
    if (status === ItemExecutionItemStatus.VALIDATE_WARNING) return "warning";
    return "accent";
  }, []);

  const baseStylesExecution = useNormalizeStyle({
    flexDirection: "row",
    gap: SPACINGS["2xs"],
    flexWrap: "wrap",
    justifyContent: "center",
    rowGap: SPACINGS.xs,
    width: "100%",
  });

  return (
    <QuestionAndAnswerContainer
      question={
        showQuestionHeader && itemText ? (
          <Animated.View
            entering={FadeInDown.duration(ItemHeaderQuestionFadeInDown.duration)}
            exiting={FadeOutDown.duration(ItemHeaderQuestionFadeOutDown.duration)}
            style={baseStylesExecution}
          >
            {itemText.split(" ").map((slice, index) => {
              const foundAnswer = itemLinkedAnswers?.find((answer) => answer.index === index);

              if (foundAnswer && userAnswer) {
                return (
                  <Typography.Text
                    key={`${slice}-${index}`}
                    weight="semibold"
                    size="xl"
                    level={600}
                    label={userAnswer}
                    variant={getVariantByStatus(executionStatus)}
                    underlined
                  />
                );
              }
              if (foundAnswer && !userAnswer) {
                return (
                  <View
                    key={`${slice}-${index}`}
                    flexDirection="row"
                    alignItems="center"
                    height={SPACINGS["3xs"]}
                    alignSelf="flex-end"
                    backgroundColor={
                      [ItemExecutionItemStatus.INITIAL, ItemExecutionItemStatus.READY_FOR_VALIDATION].includes(
                        executionStatus
                      )
                        ? COLORS.accent["600"]
                        : COLORS.secondary["400"]
                    }
                    width={50}
                  />
                );
              }
              return (
                !itemAnswers.find((answer) => answer.index === index) && (
                  <Typography.Text
                    key={`${slice}-${index}`}
                    weight="semibold"
                    size="xl"
                    level={600}
                    label={slice}
                    variant="secondary"
                  />
                )
              );
            })}
          </Animated.View>
        ) : null
      }
      answer={
        showQuestionAnswer && itemText ? (
          <Animated.View
            entering={FadeInDown.duration(ItemHeaderAnswerFadeInDown.duration)}
            exiting={FadeOutDown.duration(ItemHeaderAnswerFadeOutDown.duration)}
            style={baseStylesExecution}
          >
            {itemText.split(" ").map((slice, index) => (
              <Typography.Text
                key={`${slice}-${index}`}
                weight="semibold"
                size="xl"
                level={600}
                label={slice}
                variant="secondary"
              />
            ))}
          </Animated.View>
        ) : null
      }
    />
  );
}

function GapFillSelectWrongFeedback() {
  const itemText = useAppSelector((state) => getSelectedItemProp(state, "item.text")) as string;
  const itemAnswers = useAppSelector((state) => getSelectedItemProp(state, "item.answers")) as ItemAnswer[];
  const userAttempts = useAppSelector((state) => getSelectedItemProp(state, "attempts")) as {
    answer: string;
    correct: boolean;
  }[];

  const answerIndex = useMemo(() => {
    return itemAnswers.find((answer) => answer.index)?.index as number;
  }, [itemAnswers]);

  return (
    <WrongFeedbackContainer
      userAttempts={userAttempts.map((attempt, attemptIndex) => (
        <View flexDirection="row" flexWrap="wrap" gap={SPACINGS["2xs"]} key={`${attempt.answer}-${attemptIndex}`}>
          {itemText.split(" ").map((slice, index) => (
            <Typography.Text
              key={`${attempt.answer}-${slice}`}
              label={index === answerIndex ? attempt.answer : slice}
              size="lg"
              variant={index === answerIndex ? "danger" : "secondary"}
              level={600}
              weight="semibold"
              underlined={index === answerIndex}
            />
          ))}
        </View>
      ))}
      correctOption={itemText.split(" ").map((slice, index) => (
        <Typography.Text
          key={`${slice}-${index}`}
          label={slice}
          size="lg"
          variant={index === answerIndex ? "accent" : "secondary"}
          level={600}
          weight="semibold"
          underlined={index === answerIndex}
        />
      ))}
    />
  );
}

function GapFillSelectExercise() {
  const { setItemAnswer, isValidating, isPlayingItemAudio } = useExecution();
  const itemText = useAppSelector((state) => getSelectedItemProp(state, "item.text")) as string;
  const executionStatus = useAppSelector((state) => getSelectedItemProp(state, "status")) as string;
  const linkedAnswers = useAppSelector((state) => getSelectedItemProp(state, "item.linkedAnswers")) as LinkedAnswer[];
  const userAnswer = useAppSelector((state) => getSelectedItemProp(state, "answer")) as string;

  // DEBUG OPTIONS
  console.log("📌 [GapFillSelectExercise] itemText:", itemText);
  console.log("📌 [GapFillSelectExercise] linkedAnswers:", linkedAnswers);
  console.log("📌 [GapFillSelectExercise] executionStatus:", executionStatus);

  const disabled = useMemo(() => {
    return (
      [
        ItemExecutionItemStatus.VALIDATE_WRONG,
        ItemExecutionItemStatus.VALIDATE_CORRECT,
        ItemExecutionItemStatus.VALIDATE_WARNING,
        ItemExecutionItemStatus.CORRECT,
      ].includes(executionStatus as ItemExecutionItemStatus) ||
      isPlayingItemAudio ||
      isValidating
    );
  }, [executionStatus, isPlayingItemAudio, isValidating]);

  const variant = useMemo(() => {
    return {
      [ItemExecutionItemStatus.READY_FOR_VALIDATION]: "accent",
      [ItemExecutionItemStatus.VALIDATE_CORRECT]: "success",
      [ItemExecutionItemStatus.VALIDATE_WRONG]: "danger",
      [ItemExecutionItemStatus.VALIDATE_WARNING]: "warning",
    }[executionStatus] as ExerciseOptionVariant;
  }, [executionStatus]);

  const getOptionVariantByStatusAndAnswer = useCallback(
    (answer?: string): ExerciseOptionVariant | undefined => {
      if (answer === userAnswer) {
        return variant;
      }
      return undefined;
    },
    [userAnswer, variant]
  );

  if (!itemText || !linkedAnswers?.length) {
    return <Typography.Text label="⚠️ Dados insuficientes para renderizar o exercício." />;
  }

  return (
    <View gap={SPACINGS.xs} margin={SPACINGS.md}>
      <AnimatedList
        data={linkedAnswers}
        keyExtractor={(answer) => answer?.id}
        renderItem={({ item: answer }) => (
          <Pressable key={answer.id} onPress={() => setItemAnswer?.({ answer: answer.text })} disabled={disabled}>
            <ExerciseOption variant={getOptionVariantByStatusAndAnswer(answer?.text)}>
              <View flexDirection="row" gap={SPACINGS["2xs"]} alignItems={"center"}>
                <Radio.Button
                  value={answer.text || ""}
                  checked={answer.text === userAnswer}
                  variant={variant}
                  onSelect={() => setItemAnswer?.({ answer: answer.text })}
                />
                <Typography.Text
                  key={answer.id}
                  size="lg"
                  weight={answer.text === userAnswer ? "bold" : "medium"}
                  level={600}
                  variant="secondary"
                  label={answer.text as string}
                />
              </View>
            </ExerciseOption>
          </Pressable>
        )}
      />
    </View>
  );
}

function GapFillSelect() {
  const executionStatus = useAppSelector((state) => getSelectedItemProp(state, "status"));

  if (executionStatus === ItemExecutionItemStatus.CORRECT) return null;
  if (executionStatus === ItemExecutionItemStatus.WRONG) {
    return <GapFillSelectWrongFeedback />;
  }

  return <GapFillSelectExercise />;
}

export default GapFillSelect;
