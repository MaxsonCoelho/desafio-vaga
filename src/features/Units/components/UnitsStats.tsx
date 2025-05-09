import React from "react";
import View from "../../../core/View";
import useAppSelector from "student-front-commons/src/hooks/useAppSelector";
import Typography from "../../../core/general/Typography";
import { getTranslation } from "@locales";
import { getCompletedUnitIdsByModule, getUnitIdsByModule } from "student-front-commons/src/slices/entity";

function UnitsStats({ moduleId }: { moduleId: string }) {
  const unitsCount = useAppSelector((state) => getUnitIdsByModule(state, moduleId)).length;
  const finishedUnits = useAppSelector((state) => getCompletedUnitIdsByModule(state, moduleId)).length;

  return (
    <View alignItems="center">
      <Typography.Text weight="semibold" size="lg" label={`${finishedUnits}/${unitsCount}`} />
      <Typography.Text size="xs" label={getTranslation("features.Units.components.UnitsStats.label")} />
    </View>
  );
}

export default UnitsStats;
