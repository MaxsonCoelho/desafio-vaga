import React from "react";
import CardButton from "@core/others/CardButton";
import View from "@core/View";
import Typography from "@core/general/Typography";
import CheckpointIcon from "@assets/checkpoint-icon.svg";
import { SPACINGS } from "student-front-commons/src/consts/design-system/global/spacings";
import { getTranslation } from "@locales";
import { countAvailableCheckpoints } from "student-front-commons/src/slices/entity";
import useAppSelector from "student-front-commons/src/hooks/useAppSelector";
import Badge from "@core/data-display/Badge";

function CheckpointsCardButton() {
  const checkpointsCount = useAppSelector(countAvailableCheckpoints);

  return (
    <CardButton>
      <View width="100%" flexDirection="row" justifyContent="space-between" alignItems="center">
        <View flexDirection="row" alignItems="center" gap={SPACINGS.xs}>
          <CheckpointIcon />
          <Typography.Text
            label={getTranslation("features.Home.components.CheckpointsCardButton.label")}
            variant="secondary"
            level={600}
            weight="medium"
          />
        </View>
        <Badge number={checkpointsCount} />
      </View>
    </CardButton>
  );
}

export default CheckpointsCardButton;
