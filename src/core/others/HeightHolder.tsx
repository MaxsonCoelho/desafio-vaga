import React, { useCallback, useState } from "react";
import View from "@core/View";
import { LayoutChangeEvent } from "react-native";

export default function HeightHolder({ children }: { children?: React.ReactNode }) {
  const [holderHeight, setHolderHeight] = useState(0);

  const handleOnLayout = useCallback(
    (event: LayoutChangeEvent) => {
      if (!holderHeight) {
        setHolderHeight(event.nativeEvent.layout.height);
      }
    },
    [holderHeight]
  );
  return (
    <>
      <View position="absolute" minHeight={holderHeight} onLayout={handleOnLayout}>
        {children}
      </View>
      <View width="100%" height={holderHeight} />
    </>
  );
}
