import React from "react";

import CardButton from "@core/others/CardButton";
import View from "@core/View";
import Typography from "@core/general/Typography";
import Badge from "@core/data-display/Badge";

import { SPACINGS } from "@commons/consts/design-system/global/spacings";
import configStore from "@commons/configStore";
import { To } from "@commons/core/navigation";

import HomeworkIcon from "@assets/homework-icon.svg";

import { getTranslation } from "@locales";
import { useStudent } from "@commons/contexts/StudentContext";

function HomeworkCardButton() {
  const { homeworkStats } = useStudent();
  const navigation = configStore.getNavigationInstance();

  const handleHomework = () => {
    navigation.navigate(To.Homeworks);
  };

  return (
    <CardButton onPress={handleHomework}>
      <View width="100%" flexDirection="row" justifyContent="space-between" alignItems="center">
        <View flexDirection="row" alignItems="center" gap={SPACINGS.xs}>
          <HomeworkIcon />
          <Typography.Text
            label={getTranslation("features.Home.components.HomeworkCardButton.label")}
            variant="secondary"
            level={600}
            weight="medium"
          />
        </View>
        {!!homeworkStats && homeworkStats.totalAvailable + homeworkStats.totalLate > 0 && (
          <Badge number={homeworkStats.totalAvailable + homeworkStats.totalLate} />
        )}
      </View>
    </CardButton>
  );
}

export default HomeworkCardButton;
