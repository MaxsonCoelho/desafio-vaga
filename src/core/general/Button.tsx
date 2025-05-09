import React, { useMemo } from "react";
import { TouchableOpacity } from "react-native";
import { THEME } from "student-front-commons/src/consts/design-system/theme";
import { SPACINGS } from "student-front-commons/src/consts/design-system/global/spacings";
import {
  LEVELS,
  NORMAL_SIZES,
  TYPES,
  VARIANTS,
} from "student-front-commons/src/consts/design-system/global/definitions";
import View from "../View";
import Icon, { IconNames } from "./Icon";
import Typography from "./Typography";
import Loader from "../others/Loader";
import { normalizeHorizontalSize, normalizeVerticalSize } from "../../utils/sizeUtils";

type ButtonVariants = Extract<VARIANTS, "primary" | "secondary" | "success" | "accent" | "warning">;
export type ButtonTheme = {
  [key in "focus" | "default" | "hover" | "disabled"]: {
    backgroundColor?: string;
    text: { level?: LEVELS; variant: ButtonVariants };
    borderColor?: string;
    opacity?: number;
  };
};

export type ButtonProps = {
  /** The variant of the button */
  variant?: ButtonVariants;
  /** Set the size of button */
  size?: Extract<NORMAL_SIZES, "sm" | "md" | "lg">;
  /** Loading state of button */
  loading?: boolean;
  /** Disabled state of button */
  disabled?: boolean;
  /** Function to be called when button is pressed */
  onPress?: () => void;
  /** Button label */
  label: string;
  /** Icon to be displayed in button */
  icon?: IconNames;
  /** Position to show the icon */
  iconPosition?: "trailing" | "leading";
} & (
  | {
      /** Set the theme of button */
      theme?: "light";
      /** Set button type */
      type?: TYPES;
    }
  | {
      /** Set the theme of button */
      theme?: "dark";
      /** Set button type */
      type?: Exclude<TYPES, "flat">;
    }
);

function Button({
  variant = "primary",
  type = "solid",
  size = "sm",
  label,
  theme = "light",
  disabled = false,
  icon,
  iconPosition = "leading",
  onPress,
  loading,
}: ButtonProps) {
  const buttonSize = THEME.button.spacing[size];
  const iconSize = size === "lg" ? size : "md";

  const changeableStyles = useMemo(() => {
    const stateTheByTheme = {
      light: THEME.button.theme["light"][type as TYPES]?.[variant],
      dark: THEME.button.theme["dark"][type as Exclude<TYPES, "flat">]?.[variant],
    };

    const buttonStateTheme = stateTheByTheme[theme] as ButtonTheme;

    if (disabled || loading) {
      return buttonStateTheme.disabled;
    }

    return buttonStateTheme.default;
  }, [disabled, loading, theme, type, variant]);

  return (
    <TouchableOpacity
      disabled={disabled || loading}
      onPress={onPress}
      style={{
        opacity: changeableStyles.opacity,
        backgroundColor: changeableStyles.backgroundColor,
        ...(changeableStyles.borderColor
          ? {
              borderWidth: 1,
              borderStyle: "solid",
              borderColor: changeableStyles.borderColor,
            }
          : {}),

        width: "100%",
        borderRadius: normalizeHorizontalSize(40),
        paddingVertical: normalizeVerticalSize(buttonSize.vertical),
      }}
    >
      <View justifyContent="center" gap={SPACINGS["2xs"]} display="flex" flexDirection="row" alignItems="center">
        {icon && iconPosition === "leading" ? (
          <View marginTop={2}>
            <Icon
              size={iconSize}
              name={icon}
              variant={changeableStyles.text?.variant}
              level={changeableStyles.text?.level}
            />
          </View>
        ) : null}
        <Typography.Text
          variant={changeableStyles.text?.variant}
          level={changeableStyles.text?.level}
          label={label}
          weight="semibold"
          size="sm"
        />
        {icon && iconPosition === "trailing" ? (
          <View marginTop={2}>
            <Icon
              size={iconSize}
              name={icon}
              variant={changeableStyles.text?.variant}
              level={changeableStyles.text?.level}
            />
          </View>
        ) : null}
        {loading ? (
          <View marginLeft={SPACINGS.xs}>
            <Loader variant={variant} />
          </View>
        ) : null}
      </View>
    </TouchableOpacity>
  );
}

export default Button;
