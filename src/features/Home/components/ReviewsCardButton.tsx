import React from "react";
import CardButton from "@core/others/CardButton";
import View from "@core/View";
import Typography from "@core/general/Typography";
import ReviewsIcon from "@assets/reviews-icon.svg";
import { SPACINGS } from "student-front-commons/src/consts/design-system/global/spacings";
import { getTranslation } from "@locales";

function ReviewsCardButton() {
  return (
    <CardButton>
      <View width="100%" flexDirection="row">
        <View flexDirection="row" alignItems="center" gap={SPACINGS.xs}>
          <ReviewsIcon />
          <Typography.Text
            label={getTranslation("features.Home.components.ReviewsCardButton.label")}
            variant="secondary"
            level={600}
            weight="medium"
          />
        </View>
      </View>
    </CardButton>
  );
}

export default ReviewsCardButton;
