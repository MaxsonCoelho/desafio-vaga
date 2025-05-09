import React from "react";
import { TouchableOpacity } from "react-native";
import { THEME } from "@commons/consts/design-system/theme";
import View from "@core/View";
import Typography from "@core/general/Typography";

type OptionsVariant = "accent" | "success" | "danger" | "warning";

type Option = {
  value: string | number;
  label?: string;
};

type Props = {
  options: Option[];
  onSelect: (value: unknown) => void;
  variant?: OptionsVariant;
};

export type ButtonProps = {
  onSelect?: (value: unknown) => void;
  key?: string;
  value: string | number;
  label?: string;
  checked?: boolean;
  variant?: OptionsVariant;
  flexDirection?: "row" | "column";
};

function Button({ onSelect, checked, key, value, label, variant = "accent", flexDirection = "row" }: ButtonProps) {
  return (
    <TouchableOpacity
      key={key}
      style={{
        flexDirection: flexDirection,
        alignItems: flexDirection === "row" ? "center" : "flex-start",
      }}
      onPress={() => {
        if (onSelect) {
          onSelect(value);
        }
      }}
    >
      <View
        height={24}
        width={24}
        borderRadius={24}
        borderWidth={2}
        alignItems="center"
        justifyContent="center"
        marginRight={10}
        backgroundColor={THEME.radio.state[checked ? variant : "default"].backgroundColor}
        borderColor={THEME.radio.state[checked ? variant : "default"].borderColor}
      >
        {checked && (
          <View
            height={12}
            width={12}
            borderRadius={12}
            backgroundColor={THEME.radio.state[variant].dotBackgroundColor}
          />
        )}
      </View>
      {label && <Typography.Text label={label} variant="secondary" size="md" weight="medium" level={600} />}
    </TouchableOpacity>
  );
}

function Radio({ options, onSelect, variant }: Props) {
  return (
    <View flexDirection="column" alignItems="flex-start">
      {options.map(({ value, label }, index) => (
        <Button onSelect={onSelect} value={value} label={label} key={`${value}-${index}`} variant={variant} />
      ))}
    </View>
  );
}

Radio.Button = Button;

export default Radio;
