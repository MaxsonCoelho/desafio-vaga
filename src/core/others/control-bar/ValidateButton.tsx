import React, { useCallback } from "react";
import ControlBarButton from "@core/others/control-bar/ControlBarButton";
import { useExecution } from "@commons/contexts/ExecutionContext";

function ValidateButton({ disabled }: { disabled?: boolean }) {
  const { validate } = useExecution();

  const handlePress = useCallback(() => {
    validate?.();
  }, []);

  return (
    <ControlBarButton
      icon="Check"
      variant="accent"
      type="solid"
      onPress={handlePress}
      labelKey="validate"
      disabled={disabled}
    />
  );
}

export default ValidateButton;
