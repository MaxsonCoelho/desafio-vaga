import React from "react";
import { THEME } from "student-front-commons/src/consts/design-system/theme";
import { Badge as PaperBadge } from "react-native-paper";
import { COLORS } from "student-front-commons/src/consts/design-system/global/colors";
import { LEVELS, VARIANTS } from "student-front-commons/src/consts/design-system/global/definitions";

type BadgeProps = {
  /** The number to display in the badge */
  number: number;
};

function Badge({ number }: BadgeProps) {
  const badgeTheme = THEME.badge;
  const textColor = badgeTheme.state.default.text as { variant: VARIANTS; level: LEVELS };

  if (number <= 0) return null;
  return (
    <PaperBadge
      theme={{
        colors: { error: badgeTheme.state.default.backgroundColor },
      }}
      style={{ color: COLORS[textColor.variant][textColor.level], fontWeight: "500" }}
    >
      {number}
    </PaperBadge>
  );
}

export default Badge;
