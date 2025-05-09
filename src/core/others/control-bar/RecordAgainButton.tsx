import React, { useCallback } from "react";
import useRecord from "@commons/hooks/useRecord";
import ControlBarButton from "@core/others/control-bar/ControlBarButton";
import { useExecution } from "@commons/contexts/ExecutionContext";

function RecordAgainButton({ disabled }: { disabled?: boolean }) {
  const { reset } = useExecution();
  const mobileRecordMedia = useRecord();

  const handleReRecord = useCallback(async () => {
    await mobileRecordMedia.startRecord();
    reset?.();
  }, [reset]);

  return (
    <ControlBarButton
      disabled={disabled}
      icon="Mic"
      onPress={handleReRecord}
      variant="secondary"
      type="solid"
      labelKey="recordAgain"
    />
  );
}

export default RecordAgainButton;
