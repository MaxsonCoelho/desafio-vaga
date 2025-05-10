import React, { useCallback, useMemo } from "react";
import { Pressable } from "react-native";
import View from "@core/View";
import Typography from "@core/general/Typography";
import useAppSelector from "@commons/hooks/useAppSelector";
import { getSelectedItemProp } from "@commons/slices/utils/itemExecutionUtils";
import { ItemAnswer } from "@commons/models/itemModel";
import ExerciseOption, { ExerciseOptionVariant } from "@core/others/item-types/ExerciseOption";
import Radio from "@core/data-entry/Radio";
import { SPACINGS } from "@commons/consts/design-system/global/spacings";
import { ItemExecutionItemStatus } from "@commons/slices/types/itemExecutionTypes";
import { useExecution } from "@commons/contexts/ExecutionContext";
import AnimatedList from "@core/others/item-types/AnimatedList";

export default function SingleChoiceText() {
  const itemText = useAppSelector((state) => getSelectedItemProp(state, "item.text")) as string;
  const itemAnswers = useAppSelector((state) => getSelectedItemProp(state, "item.answers")) as ItemAnswer[];
  const userAnswer = useAppSelector((state) => getSelectedItemProp(state, "answer")) as string;
  const executionStatus = useAppSelector((state) => getSelectedItemProp(state, "status")) as ItemExecutionItemStatus;

  const { setItemAnswer, isValidating, isPlayingItemAudio } = useExecution();

  const disabled = useMemo(() => {
    return (
      [
        ItemExecutionItemStatus.VALIDATE_CORRECT,
        ItemExecutionItemStatus.VALIDATE_WRONG,
        ItemExecutionItemStatus.VALIDATE_WARNING,
        ItemExecutionItemStatus.CORRECT,
      ].includes(executionStatus) || isValidating || isPlayingItemAudio
    );
  }, [executionStatus, isValidating, isPlayingItemAudio]);

  const getVariant = useCallback((): ExerciseOptionVariant => {
    switch (executionStatus) {
      case ItemExecutionItemStatus.VALIDATE_CORRECT:
        return "success";
      case ItemExecutionItemStatus.VALIDATE_WRONG:
        return "danger";
      case ItemExecutionItemStatus.VALIDATE_WARNING:
        return "warning";
      default:
        return "accent";
    }
  }, [executionStatus]);

  const getOptionVariant = useCallback(
    (text: string): ExerciseOptionVariant | undefined => {
      return text === userAnswer ? getVariant() : undefined;
    },
    [userAnswer, getVariant]
  );

  if (!itemText || !itemAnswers?.length) {
    return <Typography.Text label="⚠️ Este exercício não tem conteúdo para exibir." />;
  }

  return (
    <View gap={SPACINGS.xs} margin={SPACINGS.md}>
      

      <AnimatedList
        data={itemAnswers}
        keyExtractor={(item) => item.id}
        renderItem={({ item: answer }) => (
          <Pressable
            key={answer.id}
            onPress={() => setItemAnswer?.({ answer: answer.text })}
            disabled={disabled}
          >
            <ExerciseOption variant={getOptionVariant(answer.text)}>
              <View flexDirection="row" alignItems="center" gap={SPACINGS["2xs"]}>
                <Radio.Button
                  value={answer.text}
                  checked={answer.text === userAnswer}
                  variant={getVariant()}
                  onSelect={() => setItemAnswer?.({ answer: answer.text })}
                />
                <Typography.Text
                  label={answer.text}
                  size="lg"
                  weight={answer.text === userAnswer ? "bold" : "medium"}
                  level={600}
                  variant="secondary"
                />
              </View>
            </ExerciseOption>
          </Pressable>
        )}
      />
    </View>
  );
}
