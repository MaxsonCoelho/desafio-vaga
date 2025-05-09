import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Animated, TouchableOpacity, View } from "react-native";
import { SHADOWS } from "student-front-commons/src/consts/design-system/global/shadows";
import { THEME } from "student-front-commons/src/consts/design-system/theme";
import Icon, { IconNames } from "@core/general/Icon";

type SwitchProps = {
  /** If the switch is disabled */
  disabled?: boolean;
  /** The switch default value. True when active, false when not active */
  defaultValue?: boolean;
  /** Function to be called when the switch is pressed */
  onChange: (value: boolean) => void;
  /** Icon to be displayed inside the switch */
  icon?: IconNames;
};

function Switch({ disabled = false, defaultValue = false, icon, onChange }: SwitchProps) {
  const [switchValue, setSwitchValue] = useState(defaultValue);

  const animatedValue = useRef(new Animated.Value(switchValue ? 1 : 0));

  useEffect(() => {
    Animated.timing(animatedValue.current, {
      toValue: switchValue ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [switchValue]);

  const handlePress = useCallback(() => {
    if (!disabled) {
      setSwitchValue(!switchValue);
      onChange(!switchValue);
    }
  }, [disabled, switchValue]);

  const knobPosition = animatedValue.current.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 23],
  });

  const switchStyles = useMemo(() => {
    const switchStateTheme = THEME.switch.state;
    if (disabled) {
      return switchStateTheme.disabled(switchValue);
    }
    return switchStateTheme.default(switchValue);
  }, [switchValue, disabled]);

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={handlePress}
      style={{ position: "relative", backgroundColor: "transparent" }}
    >
      <View
        style={{
          width: 44,
          height: 24,
          borderRadius: THEME.switch.border.radius,
          justifyContent: "center",
          padding: THEME.switch.spacing.padding,
          backgroundColor: switchStyles.backgroundColor,
          opacity: switchStyles.opacity,
          ...SHADOWS.xs,
        }}
      />
      <Animated.View
        style={{
          height: THEME.switch.dimension.knob.height,
          width: THEME.switch.dimension.knob.width,
          borderRadius: THEME.switch.border.radius,
          position: "absolute",
          top: 4.3,
          left: 3,
          opacity: disabled ? 0.5 : 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: switchStyles.knobBackgroundColor,
          transform: [
            {
              translateX: knobPosition,
            },
          ],
        }}
      >
        {icon && <Icon name={icon} size="xs" variant="secondary" />}
      </Animated.View>
    </TouchableOpacity>
  );
}

export default Switch;
