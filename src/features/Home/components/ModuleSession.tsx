import React from "react";
import View from "../../../core/View";
import Typography from "../../../core/general/Typography";
import { getTranslation } from "@locales";
import Button from "../../../core/general/Button";
import { SPACINGS } from "student-front-commons/src/consts/design-system/global/spacings";
import useAppSelector from "student-front-commons/src/hooks/useAppSelector";
import { getLastStudiedModule } from "student-front-commons/src/slices/entity";
import ModuleCardButton from "../../../core/others/ModuleCardButton";
import ConfigStore from "@commons/configStore";
import { To } from "@commons/core/navigation";

function ModuleSession() {
  const lastStudiedModule = useAppSelector(getLastStudiedModule);
  const navigation = ConfigStore.getNavigationInstance();

  return (
    <View gap={SPACINGS.sm}>
      <View flexDirection="row" justifyContent="space-between" alignItems="center">
        <Typography.Text
          label={getTranslation(
            lastStudiedModule?.lastStudied
              ? "features.Home.components.ModuleSession.continueLabel"
              : "features.Home.components.ModuleSession.startLabel",
          )}
          weight="medium"
        />
        <View alignSelf="flex-end">
          <Button
            theme="dark"
            label={getTranslation("features.Home.components.ModuleSession.allModulesLabel")}
            type="ghost"
            onPress={() => navigation.navigate(To.ModuleList)}
            variant="secondary"
            iconPosition="trailing"
            icon="ChevronRight"
          />
        </View>
      </View>
      <ModuleCardButton
        onPress={(moduleId) =>
          navigation.navigate(To.UnitList, {
            moduleId,
          })
        }
        moduleId={lastStudiedModule.id}
      />
    </View>
  );
}

export default ModuleSession;
