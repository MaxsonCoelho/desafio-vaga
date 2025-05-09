import React from "react";
import CardButton from "../../../core/others/CardButton";
import View from "../../../core/View";
import BonusTestIcon from "../assets/bonus-test-icon.svg";
import BonusTestPointsIcon from "../assets/bonus-test-points-icon.svg";
import { COLORS } from "student-front-commons/src/consts/design-system/global/colors";
import { SPACINGS } from "student-front-commons/src/consts/design-system/global/spacings";
import Typography from "../../../core/general/Typography";
import { getTranslation } from "@locales";

function BonusTestCardButton() {
  return (
    <CardButton
      linearGradientProps={{
        colors: [COLORS.warning[100]!, COLORS.warning[50]!],
        start: { x: 0, y: 0 },
        end: { x: 0.7, y: 0 },
        style: { width: "auto" },
      }}
    >
      <View flexDirection="row" width="100%" justifyContent="space-between" alignItems="center">
        <View flexDirection="row" gap={SPACINGS.xs} alignItems="center">
          <BonusTestIcon />
          <Typography.Text
            label={getTranslation("features.Home.components.BonusTestCardButton.title")}
            variant="secondary"
            level={600}
            weight="medium"
          />
        </View>
        <View
          flexDirection="row"
          backgroundColor={COLORS.warning[200]}
          borderRadius={SPACINGS["4xl"]}
          alignItems="center"
        >
          <View alignSelf="flex-start">
            <BonusTestPointsIcon />
          </View>
          <View paddingHorizontal={SPACINGS.md}>
            <Typography.Text size="xs" label="100 Pts" variant="warning" level={600} weight="semibold" />
          </View>
        </View>
      </View>
    </CardButton>
  );
}

export default BonusTestCardButton;
