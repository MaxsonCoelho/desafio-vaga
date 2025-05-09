import React, { useState } from "react";
import View from "@core/View";
import { LayoutChangeEvent } from "react-native";

export default function QuestionAndAnswerContainer({
  question,
  answer,
}: {
  question: React.ReactElement | null;
  answer: React.ReactElement | null;
}) {
  const [holderHeight, setHolderHeight] = useState(0);

  return (
    <View width="100%" position="relative">
      {!!question &&
        React.cloneElement(question, {
          ...question.props,
          style: {
            ...question.props.style,
            position: "absolute",
          },
          onLayout: (e: LayoutChangeEvent) => setHolderHeight(e.nativeEvent.layout.height),
        })}
      {answer &&
        React.cloneElement(answer, {
          ...answer.props,
          style: {
            ...answer.props.style,
            position: "absolute",
          },
          onLayout: (e: LayoutChangeEvent) => setHolderHeight(e.nativeEvent.layout.height),
        })}
      <View width="100%" height={holderHeight} />
    </View>
  );
}
