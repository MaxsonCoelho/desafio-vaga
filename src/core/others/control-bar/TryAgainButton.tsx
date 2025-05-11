import React, { useCallback, useState } from "react";
import ControlBarButton from "@core/others/control-bar/ControlBarButton";
import { useExecution } from "@commons/contexts/ExecutionContext";
import Popover from "@core/others/item-types/Popover";
import Typography from "@core/general/Typography";
import View from "@core/View";
import { getTranslation } from "@locales";

type TryAgainButtonProps = {
  disabled?: boolean;
  variant?: "accent" | "secondary";
};

function TryAgainButton({ disabled, variant = "accent" }: TryAgainButtonProps) {
  const { reset } = useExecution();
  const [showPopover, setShowPopover] = useState(false);

  const handlePress = useCallback(() => {
    setShowPopover(false); // fecha popover ao clicar
    reset?.();
  }, [reset]);

  const handleLongPress = useCallback(() => {
    setShowPopover(true);
    setTimeout(() => setShowPopover(false), 4000); // fecha automaticamente após 4s
  }, []);

  return (
    <Popover
      isOpen={!disabled && showPopover}
      content={
        <View>
          <Typography.Text
            variant="secondary"
            level={600}
            align="center"
            size="md"
            weight="bold"
            label={getTranslation("core.others.control-bar.TryAgainButton.popoverTitle")}
          />
          <Typography.Text
            variant="secondary"
            level={600}
            align="center"
            weight="medium"
            label={getTranslation("core.others.control-bar.TryAgainButton.popoverDescription")}
          />
        </View>
      }
    >
      <ControlBarButton
        type="solid"
        variant={variant}
        icon="RotateCcw"
        labelKey="tryAgain"
        onPress={handlePress}
        onLongPress={handleLongPress}
        disabled={disabled}
      />
    </Popover>
  );
}

export default TryAgainButton;
