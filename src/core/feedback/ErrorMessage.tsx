import React, { memo } from "react";
import View from "@core/View";
import Typography from "@core/general/Typography";
import { COLORS } from "@commons/consts/design-system/global/colors";
import { RADIUS } from "@commons/consts/design-system/global/radius";
import { SPACINGS } from "@commons/consts/design-system/global/spacings";

interface ErrorMessageProps {
  message: string;
}

function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <View
      justifyContent="center"
      alignItems="center"
      width="100%"
      backgroundColor={COLORS.danger[50]}
      borderRadius={RADIUS.md}
      borderColor={COLORS.danger[200]}
      borderWidth={1}
      padding={SPACINGS.sm}
    >
      <Typography.Text label={message} variant="secondary" level={600} />
    </View>
  );
}

export default memo(ErrorMessage);
