import { DateTime } from "luxon";
import { TouchableOpacity, View as NativeView } from "react-native";
import React, { useMemo, useState } from "react";
import { UnitStepStatus } from "student-front-commons/src/models/unitModel";
import useAppSelector from "student-front-commons/src/hooks/useAppSelector";
import { useStudent } from "student-front-commons/src/contexts/StudentContext";
import { COLORS } from "student-front-commons/src/consts/design-system/global/colors";
import { getUnitById, getUnitTypeById } from "student-front-commons/src/slices/entity";
import { SPACINGS } from "student-front-commons/src/consts/design-system/global/spacings";
import { useWhitelabelConfig } from "student-front-commons/src/contexts/WhitelabelConfigContext";
import { getTranslation } from "@locales";
import View from "../../../core/View";
import Icon from "../../../core/general/Icon";
import Typography from "../../../core/general/Typography";
import Points from "../../../assets/points.svg";
import PointsUncolored from "../../../assets/points-uncolored.svg";
import { normalizeHorizontalSize, normalizeVerticalSize } from "@utils/sizeUtils";
import UnitContinueCountdown from "@features/Units/components/UnitContinueCountdown";
import ConfigStore from "@commons/configStore";
import UnitIcon from "./UnitIcon";
import { To } from "@commons/core/navigation";

function UnitListItem({ unitId, isReviewStep }: { unitId: string; isReviewStep: boolean }) {
  const { configuration } = useWhitelabelConfig();
  const { company } = useStudent();
  const navigation = ConfigStore.getNavigationInstance();

  const [isContinueAllowed, setIsContinueAllowed] = useState(false);

  const unit = useAppSelector((state) => getUnitById(state, unitId));
  const unitType = useAppSelector((state) => getUnitTypeById(state, (unit?.type || "") as string));

  const unitStatus = useMemo(() => {
    return isReviewStep ? unit?.reviewStepStatus : unit?.exerciseStepStatus;
  }, [isReviewStep, unit?.exerciseStepStatus, unit?.reviewStepStatus]);

  const timeToAllowContinueUnit = useMemo(
    () => company?.timeToAllowContinueUnit ?? configuration?.timeToAllowContinueUnit,
    [company, configuration],
  );

  const statusBorderColor = useMemo(() => {
    if (isContinueAllowed) {
      return COLORS.primary[500];
    }
    if (unitStatus === UnitStepStatus.DONE) {
      return COLORS.success[500];
    }
  }, [isContinueAllowed, unitStatus]);

  const remainingTimeToContinue = useMemo(() => {
    if (
      unitStatus === UnitStepStatus.AVAILABLE &&
      unit &&
      unit.lastExecutionLastActionAt &&
      !unit.lastExecutionCompletedAt
    ) {
      const now = DateTime.now();
      const lastActionTime = DateTime.fromISO(unit.lastExecutionLastActionAt);
      const diff = now.diff(lastActionTime, "minutes").as("minutes");

      if (!timeToAllowContinueUnit || diff <= timeToAllowContinueUnit) {
        setIsContinueAllowed(true);
        return (timeToAllowContinueUnit || 0) - diff;
      }
    }
    return 0;
  }, [unit?.lastExecutionLastActionAt, unitStatus, timeToAllowContinueUnit]);

  const handleNavigateToUnitDetailModal = () => {
    navigation.navigate(To.UnitDetail, {
      unitId,
      moduleId: unit?.module,
      unitTypeName: unitType?.name,
      isContinueAllowed,
    });
  };

  if (!unit) return null;

  return (
    <TouchableOpacity
      style={{
        pointerEvents: unitStatus === UnitStepStatus.DONE ? "none" : "auto",
      }}
      disabled={unitStatus === UnitStepStatus.LOCKED}
      onPress={handleNavigateToUnitDetailModal}
    >
      <View height={56} alignItems="center" flexDirection="row" gap={8} paddingLeft={SPACINGS["2xs"]}>
        <View position="relative" justifyContent="center" alignItems="center">
          {(unitStatus === UnitStepStatus.DONE || isContinueAllowed) && (
            <NativeView
              style={{
                width: normalizeVerticalSize(52),
                height: normalizeVerticalSize(52),
                borderWidth: normalizeVerticalSize(2),
                borderColor: statusBorderColor,
                borderRadius: normalizeVerticalSize(52),
                position: "absolute",
              }}
            />
          )}
          {unitType?.name && (
            <View
              backgroundColor={COLORS.white}
              overflow="hidden"
              justifyContent="center"
              alignItems="center"
              width={50}
              height={50}
              borderRadius={50}
              opacity={unitStatus === UnitStepStatus.LOCKED ? 0.5 : 1}
              flexShrink={0}
            >
              <UnitIcon size={48} unitTypeName={unitType.name} />
            </View>
          )}
          {unitType?.abilities.includes("SPEAKING") && (
            <NativeView
              style={{
                width: 16,
                height: 16,
                position: "absolute",
                top: -4,
                right: 2,
                borderRadius: 16,
                backgroundColor: COLORS.white,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon name="Mic" size="sm" variant={unitStatus === UnitStepStatus.LOCKED ? "secondary" : "primary"} />
            </NativeView>
          )}
        </View>
        <View flexDirection="row" justifyContent="space-between" gap={SPACINGS.xs} flex={1}>
          <View maxWidth={230}>
            <Typography.Text label={unit.name} variant="secondary" level={600} weight="medium" />
            <Typography.Text
              label={`${getTranslation("features.Units.components.UnitListItem.timeLabel", { value: unit.averageExecutionTimeLabel ?? "" })}${isReviewStep && unit.isOptionalReview ? " - " + getTranslation("features.Units.components.UnitListItem.optionalReviewLabel") : ""}`}
              variant="secondary"
              level={500}
              weight="medium"
              size="xs"
            />
          </View>
          <View width={48} alignItems="center" gap={SPACINGS["2xs"]}>
            {
              {
                [UnitStepStatus.LOCKED]: (
                  <PointsUncolored width={normalizeHorizontalSize(20)} height={normalizeVerticalSize(20)} />
                ),
                [UnitStepStatus.AVAILABLE]: (
                  <Points width={normalizeHorizontalSize(20)} height={normalizeVerticalSize(20)} />
                ),
                [UnitStepStatus.DONE]: <Icon name="BadgeCheck" variant="success" level={400} size="lg" />,
              }[unitStatus || UnitStepStatus.LOCKED]
            }
            <Typography.Text
              label={getTranslation(
                unitStatus === UnitStepStatus.DONE
                  ? "features.Units.components.UnitListItem.doneLabel"
                  : "features.Units.components.UnitListItem.pointsLabel",
                {
                  points: isReviewStep ? unit.reviewStepPoints : unit.defaultPoints,
                },
              )}
              variant="secondary"
              level={unitStatus === UnitStepStatus.LOCKED ? 400 : 600}
              weight="medium"
              size="xs"
            />
          </View>
        </View>
      </View>
      {isContinueAllowed && (
        <UnitContinueCountdown
          onCountdownEnd={() => setIsContinueAllowed(false)}
          remainingTimeToContinue={remainingTimeToContinue}
        />
      )}
    </TouchableOpacity>
  );
}

export default UnitListItem;
