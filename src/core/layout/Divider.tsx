import React from "react";
import { Divider as PaperDivider } from "react-native-paper";
import { COLORS } from "student-front-commons/src/consts/design-system/global/colors";

type Props = {
  /** the direction that the given size will affect */
  direction?: "horizontal" | "vertical";
  /** the theme of the divider. Whether it is going to be displayed in light or dark mode */
  theme?: "light" | "dark";
};

function Divider({ direction = "vertical", theme = "light" }: Props) {
  return (
    <PaperDivider
      bold
      style={[
        {
          borderWidth: 1,
          ...(direction === "vertical" ? { height: "100%" } : { width: "100%" }),
        },
        theme === "dark" ? { borderColor: COLORS.white, opacity: 0.1 } : { borderColor: COLORS.secondary[200] },
      ]}
      horizontalInset={direction === "horizontal"}
    />
  );
}

export default Divider;
