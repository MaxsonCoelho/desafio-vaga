import React, { useMemo } from "react";
import View from "../../../core/View";
import Typography from "../../../core/general/Typography";
import { getTranslation } from "@locales";
import useAppSelector from "student-front-commons/src/hooks/useAppSelector";
import { getMasteryTestById, getMasteryTestIdsByModule } from "student-front-commons/src/slices/entity";
import { MasteryTestStatus } from "student-front-commons/src/models/masteryTestModel";
import { COLORS } from "student-front-commons/src/consts/design-system/global/colors";
import { SPACINGS } from "student-front-commons/src/consts/design-system/global/spacings";
import Icon, { IconNames } from "../../../core/general/Icon";

function CheckpointItem({ masteryTestId }: { masteryTestId: string }) {
  const masteryTest = useAppSelector((state) => getMasteryTestById(state, masteryTestId));

  const checkpointContent = useMemo((): { backgroundColor: string; icon: IconNames } | null => {
    if (!masteryTest || !masteryTest.status) {
      return null;
    }
    return {
      [MasteryTestStatus.BLOCKED]: {
        icon: "Lock" as IconNames,
        backgroundColor: COLORS.primary[500]!,
      },
      [MasteryTestStatus.APPROVED]: {
        icon: "Check" as IconNames,
        backgroundColor: COLORS.pink[500]!,
      },
      [MasteryTestStatus.FAILED]: {
        icon: "X" as IconNames,
        backgroundColor: COLORS.danger[500]!,
      },
      [MasteryTestStatus.AVAILABLE]: {
        icon: "Flag" as IconNames,
        backgroundColor: COLORS.pink[500]!,
      },
    }[masteryTest.status];
  }, [masteryTest]);

  if (!masteryTest) return null;
  return (
    <View
      alignItems="center"
      justifyContent="center"
      borderRadius={SPACINGS.lg}
      width={SPACINGS.lg}
      height={SPACINGS.lg}
      flexShrink={0}
      backgroundColor={checkpointContent?.backgroundColor}
    >
      <Icon name={checkpointContent?.icon as IconNames} size="xs" />
    </View>
  );
}

function CheckpointsStats({ moduleId }: { moduleId: string }) {
  const masteryTestsByModule = useAppSelector((state) => getMasteryTestIdsByModule(state, moduleId));

  if (!masteryTestsByModule) return null;
  return (
    <View gap={SPACINGS["2xs"]} alignItems="center">
      <View flexDirection="row" gap={SPACINGS["2xs"]} alignItems="center" justifyContent="center">
        {masteryTestsByModule.map((masteryTestId) => (
          <CheckpointItem key={masteryTestId} masteryTestId={masteryTestId} />
        ))}
      </View>
      <Typography.Text size="xs" label={getTranslation("features.Units.components.CheckpointsStats.label")} />
    </View>
  );
}

export default CheckpointsStats;
