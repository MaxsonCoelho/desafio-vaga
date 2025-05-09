import React, { useCallback } from "react";
import ControlBarButton from "@core/others/control-bar/ControlBarButton";
import { useExecution } from "@commons/contexts/ExecutionContext";

function TryAgainButton({ disabled, variant = "accent" }: { disabled?: boolean; variant?: "accent" | "secondary" }) {
  const { reset } = useExecution();

  const handlePress = useCallback(() => {
    reset?.();
  }, []);

  return (
    <ControlBarButton
      type="solid"
      variant={variant}
      icon="RotateCcw"
      labelKey="tryAgain"
      onPress={handlePress}
      disabled={disabled}
    />
  );

  // return (
  //   <Popover
  //     content={
  //       <View>
  //         <Typography.Text
  //           variant="secondary"
  //           level={600}
  //           align="center"
  //           size="md"
  //           weight="bold"
  //           label={getTranslation("core.others.control-bar.TryAgainButton.popoverTitle")}
  //         />
  //         <Typography.Text
  //           variant="secondary"
  //           level={600}
  //           align="center"
  //           weight="medium"
  //           label={getTranslation("core.others.control-bar.TryAgainButton.popoverDescription")}
  //         />
  //       </View>
  //     }
  //   >
  //     <ControlBarButton
  //       type="solid"
  //       variant={variant}
  //       icon="RotateCcw"
  //       labelKey="tryAgain"
  //       onPress={handlePress}
  //       disabled={disabled}
  //     />
  //   </Popover>
  // );
}

export default TryAgainButton;
