import { COLORS } from "@commons/consts/design-system/global/colors";
import { SPACINGS } from "@commons/consts/design-system/global/spacings";
import View from "@core/View";
import { ReactNode } from "react";

export default function Card({ children }: { children: ReactNode }) {
  return (
    <View backgroundColor={COLORS.white} borderRadius={SPACINGS.xs} width="100%" padding={SPACINGS.xl}>
      {children}
    </View>
  );
}
