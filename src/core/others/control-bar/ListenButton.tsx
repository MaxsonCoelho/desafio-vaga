import React, { useCallback } from "react";
import ControlBarButton from "@core/others/control-bar/ControlBarButton";
import { useExecution } from "@commons/contexts/ExecutionContext";

function ListenButton({ disabled }: { disabled?: boolean }) {
  const { listen } = useExecution();

  const handlePress = useCallback(() => {
    listen?.();
  }, [listen]);
  return (
    <ControlBarButton
      icon="AudioLines"
      onPress={handlePress}
      variant="secondary"
      type="solid"
      disabled={disabled}
      labelKey="listen"
    />
  );
}

export default ListenButton;
