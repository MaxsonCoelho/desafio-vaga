import React from "react";
import ControlBarButton from "@core/others/control-bar/ControlBarButton";
import { useExecution } from "@commons/contexts/ExecutionContext";

function NextButton({ disabled, loading }: { disabled?: boolean; loading?: boolean }) {
  const { next } = useExecution();

  const handlePress = () => {
    next?.();
  };

  return (
    <ControlBarButton
      icon="ArrowRight"
      onPress={handlePress}
      labelKey="next"
      type="solid"
      disabled={disabled || loading}
      loading={loading}
    />
  );
}

export default NextButton;
