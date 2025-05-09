import React, { useCallback } from "react";
import { Pressable, useWindowDimensions } from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import Animated, { Easing, SlideInDown, SlideOutDown } from "react-native-reanimated";
import { SPACINGS } from "@commons/consts/design-system/global/spacings";
import View from "@core/View";
import Separator from "@core/others/Separator";
import Typography from "@core/general/Typography";
import useAppSelector from "@commons/hooks/useAppSelector";
import { getUnitById, getUnitTypeById } from "@commons/slices/entity";
import { UnitStackParams } from "@navigators/UnitNavigation";
import PerformanceIcon from "@assets/performance.svg";
import PointsIcon from "@assets/points.svg";
import { getTranslation } from "@locales";
import Button from "@core/general/Button";
import Tag from "@core/data-display/Tag";
import ConfigStore from "@commons/configStore";
import useFlow from "@commons/hooks/useFlow";
import { FlowType } from "@commons/slices/flow";
import { COLORS } from "@commons/consts/design-system/global/colors";
import { RADIUS } from "@commons/consts/design-system/global/radius";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import IconButton from "@core/general/IconButton";
import useNormalizeStyle from "../../../hooks/useNormalizeStyle";
import UnitIcon from "../components/UnitIcon";

type ParamsFromUnitList = Pick<RouteProp<UnitStackParams, "unitDetailModal">, "params">;

function UnitDetailModal() {
  const route = useRoute<RouteProp<ParamsFromUnitList>>();

  const navigation = ConfigStore.getNavigationInstance();
  const unit = useAppSelector((state) => getUnitById(state, route.params.unitId));
  const unitType = useAppSelector((state) => getUnitTypeById(state, (unit?.type || "") as string));
  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const baseStyles = useNormalizeStyle({
    backgroundColor: COLORS.white,
    borderTopLeftRadius: RADIUS.lg,
    borderTopRightRadius: RADIUS.lg,
    paddingTop: SPACINGS.xl,
    paddingBottom: insets.bottom + SPACINGS.xl,
    paddingHorizontal: SPACINGS.xl,
  });

  const [isLoading, , startUnitExecutionFlow, error] = useFlow(FlowType.START_UNIT_EXECUTION_FLOW);

  const handleButtonPress = useCallback(() => {
    startUnitExecutionFlow({
      module: route.params.moduleId,
      unit: route.params.unitId,
      isOptionalReview: !!(unit?.isReviewStep && unit?.isOptionalReview),
    });
  }, [unit, route.params]);

  if (!unit) return null;

  return (
    <View width="100%" height="100%">
      <Pressable style={{ flexGrow: 1, flex: 1 }} onPress={navigation.goBack}>
        <View width="100%" height={height} backgroundColor={COLORS.secondary["950"]} opacity={0.6} />
      </Pressable>
      <Animated.View entering={SlideInDown.easing(Easing.linear).delay(50)} exiting={SlideOutDown} style={baseStyles}>
        <View alignItems="center" gap={SPACINGS.xs}>
          <View right={0} position="absolute">
            <IconButton onPress={navigation.goBack} icon="X" type="solid" variant="secondary" />
          </View>
          <UnitIcon unitTypeName={route.params.unitTypeName || ""} size={96} />
          <Typography.Text
            label={unit.name}
            weight="semibold"
            size="lg"
            variant="secondary"
            align="center"
            level={600}
          />
          <Typography.Text
            label={getTranslation("features.Units.screens.UnitDetailModal.timeLabel", {
              value: unit.averageExecutionTimeLabel ?? "",
            })}
            variant="secondary"
            level={700}
            align="center"
          />
          {unitType?.abilities.includes("SPEAKING") && (
            <Tag
              size="lg"
              label={getTranslation("features.Units.screens.UnitDetailModal.requiredMicLabel")}
              variant="secondary"
              icon="Mic"
              iconPosition="leading"
            />
          )}
        </View>
        <Separator size="lg" />
        <View flexDirection="row" justifyContent="space-between">
          <View alignItems="center" gap={SPACINGS["2xs"]} paddingHorizontal={SPACINGS["xs"]}>
            <PerformanceIcon width={24} height={24} />
            <Typography.Text
              align="center"
              label={getTranslation("features.Units.screens.UnitDetailModal.abilitiesTitle")}
              weight="medium"
              variant="secondary"
              level={500}
            />
            <Typography.Text
              label={(unitType?.abilities || [])
                .map((ability) =>
                  getTranslation(`features.Units.screens.UnitDetailModal.abilities.${ability.toLowerCase()}`),
                )
                .join(" • ")}
              variant="secondary"
              align="center"
              level={600}
              size="md"
              weight="semibold"
            />
          </View>
          <View alignItems="center" gap={SPACINGS["2xs"]} paddingHorizontal={SPACINGS["xs"]}>
            <PointsIcon width={24} height={24} />
            <Typography.Text
              align="center"
              label={getTranslation("features.Units.screens.UnitDetailModal.pointsTitle")}
              weight="medium"
              variant="secondary"
              level={500}
            />
            <Typography.Text
              label={getTranslation("features.Units.screens.UnitDetailModal.pointsLabel", {
                points: unit.isReviewStep ? unit.reviewStepPoints : unit.defaultPoints,
              })}
              variant="secondary"
              level={600}
              size="md"
              weight="semibold"
            />
          </View>
        </View>
        <View marginTop={SPACINGS["4xl"]}>
          <Button
            size="md"
            variant="accent"
            iconPosition="trailing"
            label={
              error
                ? getTranslation(`features.Units.screens.UnitDetailModal.${error}.description`)
                : getTranslation(
                    route.params.isContinueAllowed
                      ? "features.Units.screens.UnitDetailModal.continueLabel"
                      : "features.Units.screens.UnitDetailModal.startLabel",
                  )
            }
            icon={!error ? "ChevronRight" : undefined}
            onPress={handleButtonPress}
            loading={isLoading}
            disabled={isLoading || !!error}
          />
        </View>
      </Animated.View>
    </View>
  );
}

export default UnitDetailModal;
