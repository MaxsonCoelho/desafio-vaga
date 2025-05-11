import { SPACINGS } from "@commons/consts/design-system/global/spacings";
import View from "@core/View";
import IconButton, { IconButtonProps } from "@core/general/IconButton";
import ControlBarButtonLabel from "@core/others/control-bar/ControlBarButtonLabel";
import React, { useCallback } from "react";
import { useExecution } from "@commons/contexts/ExecutionContext";

function ControlBarButton({
  type = "outlined",
  icon,
  variant = "accent",
  disabled,
  onPress,
  onLongPress, // 👈 adicionado aqui
  labelKey,
  loading,
}: {
  icon: IconButtonProps["icon"];
  variant?: "primary" | "secondary" | "accent";
  type?: "outlined" | "solid";
  theme?: "light" | "dark";
  disabled?: boolean;
  onPress: () => void;
  onLongPress?: () => void; // 👈 definido como opcional
  labelKey?: string;
  loading?: boolean;
}) {
  const { setControlBarActionWithTooltip } = useExecution();

  const handlePress = useCallback(() => {
    setControlBarActionWithTooltip?.(null);
    onPress();
  }, [onPress]);

  const handleLongPress = useCallback(() => {
    onLongPress?.();
  }, [onLongPress]);

  return (
    <View flexDirection="column" gap={SPACINGS.xs} alignItems="center">
      <IconButton
        variant={variant}
        theme="dark"
        icon={icon}
        type={type}
        size="lg"
        onPress={disabled ? undefined : handlePress}
        onLongPress={disabled ? undefined : handleLongPress} // 👈 suportando onLongPress
        loading={loading}
        disabled={disabled}
      />
      {labelKey && <ControlBarButtonLabel labelKey={labelKey} disabled={disabled || false} />}
    </View>
  );
}

export default ControlBarButton;
