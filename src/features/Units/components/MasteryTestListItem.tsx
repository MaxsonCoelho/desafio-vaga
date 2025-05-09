import React, { useMemo } from "react";
import { TouchableOpacity, View as NativeView } from "react-native";
import useAppSelector from "student-front-commons/src/hooks/useAppSelector";
import { getMasteryTestByModuleIdAndGroup } from "student-front-commons/src/slices/entity";
import View from "@core/View";
import Icon from "@core/general/Icon";
import Points from "@assets/points.svg";
import { getTranslation } from "@locales";
import Typography from "@core/general/Typography";
import { COLORS } from "@commons/consts/design-system/global/colors";
import { MasteryTestStatus } from "@commons/models/masteryTestModel";
import PointsUncolored from "@assets/points-uncolored.svg";
import { VARIANTS } from "@commons/consts/design-system/global/definitions";
import { SPACINGS } from "@commons/consts/design-system/global/spacings";

function MasteryTestListItem({ moduleId, group }: { moduleId: string; group: string }) {
  const masteryTest = useAppSelector((state) => getMasteryTestByModuleIdAndGroup(state, moduleId, group));

  const masteryTestStateContent = useMemo((): null | {
    variant: VARIANTS | "pink";
    icon: React.ReactNode;
    label: string;
  } => {
    if (!masteryTest) return null;

    return {
      [MasteryTestStatus.AVAILABLE]: {
        variant: "pink" as VARIANTS,
        icon: <Points width={20} height={20} />,
        label: getTranslation(`features.Units.components.MasteryTestListItem.pointsLabel`, { points: 800 }),
      },
      [MasteryTestStatus.BLOCKED]: {
        variant: "secondary" as VARIANTS,
        icon: <PointsUncolored width={20} height={20} />,
        label: getTranslation(`features.Units.components.MasteryTestListItem.pointsLabel`, { points: 800 }),
      },
      [MasteryTestStatus.APPROVED]: {
        variant: "success" as VARIANTS,
        icon: <Icon name="BadgeCheck" variant="success" level={400} size="lg" />,
        label: getTranslation("features.Units.components.MasteryTestListItem.doneLabel"),
      },
    }[masteryTest.status as MasteryTestStatus.AVAILABLE | MasteryTestStatus.BLOCKED | MasteryTestStatus.APPROVED];
  }, [masteryTest]);

  if (!masteryTest || !masteryTestStateContent) return null;
  return (
    <TouchableOpacity disabled={masteryTest.status === MasteryTestStatus.BLOCKED}>
      <View height={56} alignItems="center" flexDirection="row" gap={SPACINGS.xs} paddingLeft={SPACINGS["2xs"]}>
        <View position="relative">
          {masteryTest.status === MasteryTestStatus.APPROVED && (
            <NativeView
              style={{
                width: 54,
                height: 54,
                borderWidth: 2,
                borderColor: COLORS.success[500],
                borderRadius: 54,
                position: "absolute",
                top: -3,
                left: -2.75,
                right: 0,
              }}
            />
          )}
          <NativeView
            style={{
              backgroundColor: COLORS[masteryTestStateContent.variant][100],
              alignItems: "center",
              justifyContent: "center",
              width: 48,
              height: 48,
              borderRadius: 96,
            }}
          >
            <Icon name="Flag" level={500} variant={masteryTestStateContent.variant as VARIANTS} size="md" />
          </NativeView>
        </View>
        <View>
          <Typography.Text
            label={getTranslation("features.Units.components.MasteryTestListItem.itemLabel")}
            variant="secondary"
            level={600}
            weight="medium"
          />
          <Typography.Text label={"2-3 minutes"} variant="secondary" level={500} size="xs" />
        </View>
        <View alignItems="center" marginLeft="auto" width={48}>
          {masteryTestStateContent.icon}
          <Typography.Text
            label={masteryTestStateContent.label}
            variant="secondary"
            level={600}
            weight="medium"
            size="xs"
          />
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default MasteryTestListItem;
