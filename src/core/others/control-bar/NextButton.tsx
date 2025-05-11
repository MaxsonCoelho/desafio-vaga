import React, { useCallback } from "react";
import ControlBarButton from "@core/others/control-bar/ControlBarButton";
import { useExecution } from "@commons/contexts/ExecutionContext";

type NextButtonProps = {
  disabled?: boolean;
  loading?: boolean;
};

function NextButton({ disabled = false, loading = false }: NextButtonProps) {
  const { next } = useExecution();

  const handlePress = useCallback(() => {
    if (loading || disabled) return;

    if (typeof next === "function") {
      next();
    } else {
      console.warn("⚠️ 'next' function is not defined in ExecutionContext.");
    }
  }, [next, disabled, loading]);

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
