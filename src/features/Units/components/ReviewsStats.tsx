import React from "react";
import View from "../../../core/View";
import useAppSelector from "student-front-commons/src/hooks/useAppSelector";
import Typography from "../../../core/general/Typography";
import { getTranslation } from "@locales";
import { getCompletedUnitReviewIdsByModule, getUnitReviewIdsByModule } from "student-front-commons/src/slices/entity";

function ReviewsStats({ moduleId }: { moduleId: string }) {
  const unitsCount = useAppSelector((state) => getUnitReviewIdsByModule(state, moduleId)).length;
  const finishedUnits = useAppSelector((state) => getCompletedUnitReviewIdsByModule(state, moduleId)).length;

  return (
    <View alignItems="center">
      <Typography.Text weight="semibold" size="lg" label={`${finishedUnits}/${unitsCount}`} />
      <Typography.Text size="xs" label={getTranslation("features.Units.components.ReviewsStats.label")} />
    </View>
  );
}

export default ReviewsStats;
