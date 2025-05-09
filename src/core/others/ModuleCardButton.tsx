import React from "react";
import CardButton from "./CardButton";
import { COLORS } from "student-front-commons/src/consts/design-system/global/colors";
import { normalizeHorizontalSize, normalizeVerticalSize } from "@utils/sizeUtils";
import View from "../View";
import { SPACINGS } from "student-front-commons/src/consts/design-system/global/spacings";
import Typography from "../general/Typography";
import { getTranslation } from "@locales";
import ProgressBar from "../data-display/ProgressBar";
import useAppSelector from "student-front-commons/src/hooks/useAppSelector";
import { getModuleById } from "student-front-commons/src/slices/entity";
import Icon from "../general/Icon";
import Svg, { FeColorMatrix, Filter, Image } from "react-native-svg";
import Constants from "expo-constants";

function ModuleCardButton({ moduleId, onPress }: { moduleId: string; onPress: (moduleId: string) => void }) {
  const module = useAppSelector((state) => getModuleById(state, moduleId));

  if (!module) return null;
  return (
    <CardButton disabled={module.disabled} onPress={() => onPress(moduleId)} fullWidthContent>
      <View flexDirection="row" justifyContent="space-between" width="100%">
        {module.iconUrl ? (
          <Svg
            height={normalizeVerticalSize(120)}
            width={normalizeHorizontalSize(112)}
            viewBox={`0 0 ${normalizeHorizontalSize(112)} ${normalizeVerticalSize(120)}`}
          >
            <Filter id="grayScaleFilter">
              <FeColorMatrix type="saturate" values="0" />
            </Filter>
            <Image
              href={`${Constants.expoConfig?.extra?.assetsUrl}/${module.iconUrl}`}
              preserveAspectRatio="xMinYMin slice"
              height="100%"
              width="100%"
              filter={module.disabled ? "url(#grayScaleFilter)" : undefined}
              opacity={module.disabled ? 0.5 : 1}
            />
          </Svg>
        ) : (
          <View width={112} height={120} justifyContent="center" alignItems="center">
            <Icon name="Image" size="2xl" level={500} variant="secondary" />
          </View>
        )}
        <View
          flex={1}
          justifyContent="space-between"
          gap={SPACINGS["xs"]}
          padding={SPACINGS["md"]}
          paddingLeft={SPACINGS.sm}
        >
          <View gap={SPACINGS["2xs"]}>
            <Typography.Text
              label={getTranslation("core.others.ModuleCardButton.moduleLabel", { value: module.order })}
              variant="secondary"
              weight="medium"
              level={module.disabled ? 400 : undefined}
              size="xs"
            />
            <Typography.Text
              label={module.name}
              variant="secondary"
              level={module.disabled ? 400 : 600}
              weight="medium"
            />
          </View>
          {!module.moduleCompleted && !module.disabled ? (
            <ProgressBar progress={Math.floor(module.percentageCompleted)} variant="success" theme="light" />
          ) : null}
          {module.moduleCompleted && !module.disabled && (
            <View flexDirection="row" alignItems="center" gap={SPACINGS["2xs"]}>
              <Icon name="CircleCheckBig" size="md" variant="success" level={500} />
              <Typography.Text
                label={getTranslation("core.others.ModuleCardButton.finishedLabel")}
                variant="success"
                level={500}
                weight="semibold"
              />
            </View>
          )}
        </View>
      </View>
      {module.disabled && (
        <View
          backgroundColor={COLORS.secondary["50"]}
          flexDirection="row"
          alignItems="center"
          width="100%"
          paddingVertical={12}
          paddingHorizontal={14}
          gap={SPACINGS.xs}
          borderBottomLeftRadius={8}
          borderBottomRightRadius={8}
        >
          <Icon name="Lock" size="sm" variant="secondary" level={400} />
          <Typography.Text
            label={getTranslation("core.others.ModuleCardButton.unlockLabel", { value: module.order - 1 })}
            variant="secondary"
            level={400}
            weight="semibold"
            size="xs"
          />
        </View>
      )}
    </CardButton>
  );
}

export default ModuleCardButton;
