import React, { useMemo } from "react";
import { TouchableOpacity } from "react-native";
import { THEME } from "student-front-commons/src/consts/design-system/theme";
import Icon, { IconNames } from "./Icon";
import { normalizeHorizontalSize, normalizeVerticalSize } from "@utils/sizeUtils";
import { ButtonProps, ButtonTheme } from "./Button";
import Loader from "@core/others/Loader";
import Typography from "./Typography";
import View from "@core/View";
import { ICONGRAPHY } from "@commons/consts/design-system/global/icongraphy";

export type IconSpeed = "0.5x" | "1x" | "1.5x" | "2x";

export type IconButtonProps = Omit<ButtonProps, "label" | "iconPosition" | "size" | "icon"> & {
  icon: IconNames | IconSpeed;
  size?: "xs" | "sm" | "md" | "lg";
};

function IconButton({
  variant = "primary",
  type = "solid",
  size = "sm",
  theme = "light",
  disabled = false,
  icon,
  onPress,
  loading,
}: IconButtonProps) {
  const buttonSize = THEME.button.spacing[size];
  const iconSize = ["lg", "xs"].includes(size) ? size : "md";

  const changeableStyles = useMemo(() => {
    const buttonStateTheme = THEME.button.theme[theme][type][variant] as ButtonTheme;
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
        borderStyle: "solid",
        borderWidth: normalizeHorizontalSize(1),
        borderColor: changeableStyles.borderColor,
        paddingHorizontal: normalizeVerticalSize(buttonSize.circular),
        paddingVertical: normalizeVerticalSize(buttonSize.circular),
        borderRadius: normalizeHorizontalSize(buttonSize.circular * 2),
      }}
    >
      {loading && <Loader size="lg" />}
      {!loading &&
        (["0.5x", "1x", "1.5x", "2x"].includes(icon) ? (
          <View
            position="relative"
            width={ICONGRAPHY.size[size] + 6}
            height={ICONGRAPHY.size[size] + 6}
            justifyContent="center"
            alignItems="center"
          >
            <View position="absolute" width={32}>
              <Typography.Text
                align="center"
                size="md"
                variant={changeableStyles.text?.variant}
                level={changeableStyles.text?.level}
                label={icon}
                weight="medium"
              />
            </View>
          </View>
        ) : (
          <Icon
            size={iconSize}
            name={icon as IconNames}
            variant={changeableStyles.text?.variant}
            level={changeableStyles.text?.level}
          />
        ))}
    </TouchableOpacity>
  );
}

export default IconButton;
