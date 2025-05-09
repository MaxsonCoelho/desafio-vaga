import ControlBarButton from "@core/others/control-bar/ControlBarButton";
import React, { useCallback } from "react";
import { useExecution } from "@commons/contexts/ExecutionContext";

function RepeatButton({ disabled }: { disabled?: boolean }) {
  const { reset } = useExecution();
  const handleReset = useCallback(() => {
    reset?.();
  }, [reset]);

  return (
    <ControlBarButton
      icon="RotateCcw"
      onPress={handleReset}
      labelKey="repeat"
      type="solid"
      variant="secondary"
      disabled={disabled}
    />
  );
}

export default RepeatButton;
