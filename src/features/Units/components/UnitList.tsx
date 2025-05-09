import React from "react";
import UnitListItem from "./UnitListItem";
import View from "@core/View";
import { SPACINGS } from "@commons/consts/design-system/global/spacings";
import Typography from "@core/general/Typography";
import { getTranslation } from "@locales";

export function UnitsList({ title, data }: { title: string; data: string[] }) {
  if (!data.length) return;
  return (
    <View gap={SPACINGS.lg}>
      <Typography.Text
        label={getTranslation(`features.Units.components.UnitsList.${title}`)}
        variant="secondary"
        level={400}
        size="xs"
        weight="medium"
      />
      {data.map((item) => (
        <UnitListItem key={item} unitId={item} isReviewStep={title === "reviews"} />
      ))}
    </View>
  );
}
