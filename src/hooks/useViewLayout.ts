import { useCallback, useState } from "react";
import { LayoutChangeEvent } from "react-native";

export default function useViewLayout(): [
  { height: number | undefined; width: number | undefined },
  (event: LayoutChangeEvent) => void
] {
  const [height, setHeight] = useState<number | undefined>();
  const [width, setWidth] = useState<number | undefined>();

  const handleOnLayout = useCallback(
    (event: LayoutChangeEvent) => {
      const { width, height } = event.nativeEvent.layout;
      setHeight(height);
      setWidth(width);
    },
    [setWidth, setHeight]
  );

  return [
    {
      height,
      width,
    },
    handleOnLayout,
  ];
}
