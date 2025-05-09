import React from "react";
import CardButton from "@core/others/CardButton";
import View from "@core/View";
import Typography from "@core/general/Typography";
import RecordedClassesIcon from "@assets/recorded-classes-icon.svg";
import { SPACINGS } from "student-front-commons/src/consts/design-system/global/spacings";
import { getTranslation } from "@locales";
import useAppSelector from "student-front-commons/src/hooks/useAppSelector";
import { countAvailableContentVideoUnits } from "student-front-commons/src/slices/entity";
import Badge from "@core/data-display/Badge";

function RecordedClassesCardButton() {
  const availableRecordedClasses = useAppSelector(countAvailableContentVideoUnits);

  return (
    <CardButton>
      <View width="100%" flexDirection="row" justifyContent="space-between" alignItems="center">
        <View flexDirection="row" alignItems="center" gap={SPACINGS.xs}>
          <RecordedClassesIcon />
          <Typography.Text
            label={getTranslation("features.Home.components.RecordedClasses.label")}
            variant="secondary"
            level={600}
            weight="medium"
          />
        </View>
        <Badge number={availableRecordedClasses} />
      </View>
    </CardButton>
  );
}

export default RecordedClassesCardButton;
