import React from "react";
import { SPACING_SIZE, SPACINGS } from "student-front-commons/src/consts/design-system/global/spacings";
import { View } from "react-native";
import { normalizeHorizontalSize, normalizeVerticalSize } from "../../utils/sizeUtils";

type Props = {
  /** The size of the separator */
  size: SPACING_SIZE;
  /** the direction that the given size will affect */
  direction?: "vertical" | "horizontal";
};

function Separator({ size, direction = "vertical" }: Props) {
  const spacingDimension = SPACINGS[size];

  return (
    <View
      style={
        direction === "vertical"
          ? { height: normalizeVerticalSize(spacingDimension) }
          : { width: normalizeHorizontalSize(spacingDimension) }
      }
    />
  );
}

export default Separator;
