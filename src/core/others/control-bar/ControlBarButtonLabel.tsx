import React from "react";
import View from "@core/View";
import { SPACINGS } from "@commons/consts/design-system/global/spacings";
import { RADIUS } from "@commons/consts/design-system/global/radius";
import Typography from "@core/general/Typography";
import { getTranslation } from "@locales";

function ControlBarButtonLabel({ labelKey, disabled }: { labelKey: string; disabled: boolean }) {
  return (
    <View
      backgroundColor="white"
      paddingVertical={SPACINGS["3xs"]}
      paddingHorizontal={SPACINGS.xs}
      borderRadius={RADIUS.xl}
      opacity={disabled ? 0.5 : 1}
    >
      <Typography.Text
        label={getTranslation(`core.others.control-bar.ControlBarButtonLabel.${labelKey}`)}
        variant="secondary"
        size="xs"
        level={600}
        weight="medium"
      />
    </View>
  );
}

export default ControlBarButtonLabel;
