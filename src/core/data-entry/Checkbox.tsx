import React from "react";
import View from "@core/View";
import { GestureResponderEvent, TouchableOpacity } from "react-native";
import { icons as LucideIcons } from "lucide-react-native";
import { THEME } from "@commons/consts/design-system/theme";

type CheckBoxVariant = "accent" | "success" | "danger" | "warning";

type Props = {
  key?: React.Key;
  checked?: boolean;
  disabled?: boolean;
  onCheck?: (e: GestureResponderEvent) => void;
  variant?: CheckBoxVariant;
};

function Checkbox({ checked, onCheck, disabled, key, variant = "accent" }: Props) {
  const CheckIcon = LucideIcons["Check"];

  return (
    <TouchableOpacity
      key={key}
      style={{
        flexDirection: "row",
        alignItems: "center",
      }}
      onPress={(e) => {
        if (onCheck) {
          onCheck(e);
        }
      }}
      disabled={disabled}
    >
      <View
        key={key}
        height={24}
        width={24}
        justifyContent="center"
        alignItems="center"
        borderRadius={4}
        backgroundColor={THEME.checkbox.state[checked ? variant : "default"].backgroundColor}
        borderColor={THEME.checkbox.state[checked ? variant : "default"].borderColor}
        borderWidth={2}
        opacity={disabled ? 0.6 : 1}
      >
        <CheckIcon
          size={20}
          color={THEME.checkbox.state[checked ? variant : "default"].checkBackgroundColor}
          strokeWidth={5}
        />
      </View>
    </TouchableOpacity>
  );
}

export default Checkbox;
