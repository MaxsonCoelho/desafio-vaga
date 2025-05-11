import React, { useCallback } from "react";
import ControlBarButton from "@core/others/control-bar/ControlBarButton";
import { useExecution } from "@commons/contexts/ExecutionContext";

type ValidateButtonProps = {
  disabled?: boolean;
};

function ValidateButton({ disabled = false }: ValidateButtonProps) {
  const { validate } = useExecution();

  const handlePress = useCallback(() => {
    if (disabled) return;

    if (typeof validate === "function") {
      validate();
    } else {
      console.warn("⚠️ 'validate' function is not defined in ExecutionContext.");
    }
  }, [validate, disabled]);

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
