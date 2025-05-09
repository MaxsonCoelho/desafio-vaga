import React from "react";
import View from "../View";
import Icon, { IconNames } from "../general/Icon";
import { THEME } from "student-front-commons/src/consts/design-system/theme";
import { LEVELS } from "student-front-commons/src/consts/design-system/global/definitions";
import Typography from "../general/Typography";

type TagTheme = {
  backgroundColor?: string;
  text: { level?: LEVELS; variant: "primary" | "accent" };
  borderColor?: string;
};

type Props = {
  /** The label displayed inside the tag */
  label: string;
  /** Name of the icon to be displayed inside the tag */
  icon?: IconNames;
  /** Size of the tag, affecting padding and text size */
  size?: "sm" | "md" | "lg";
  /** Position of the icon inside the tag */
  iconPosition?: "trailing" | "leading";
} & (
  | {
      /** Visual style variant of the tag */
      variant?: "primary" | "secondary" | "success" | "accent" | "warning";
      /** Type of the tag, affecting the overall style */
      type?: "solid" | "outlined";
    }
  | {
      /** Visual style variant of the tag */
      variant?: "primary" | "secondary" | "success" | "accent" | "warning" | "danger";
      /** Type of the tag, affecting the overall style */
      type?: "flat";
    }
);

function Tag({ label, icon, iconPosition = "trailing", size = "sm", type = "solid", variant = "primary" }: Props) {
  const tagPadding = THEME.tag.spacing[size];
  const tagTheme = (THEME.tag.state[type] as Record<string, TagTheme>)[variant];

  return (
    <View
      flexDirection="row"
      alignItems="center"
      paddingVertical={tagPadding.vertical}
      paddingHorizontal={tagPadding.horizontal}
      backgroundColor={tagTheme.backgroundColor}
      borderRadius={40}
      gap={size === "sm" ? 2 : 4}
      {...(tagTheme.borderColor ? { borderColor: tagTheme.borderColor, borderWidth: 1 } : {})}
    >
      {icon && iconPosition === "leading" && (
        <Icon name={icon} variant={tagTheme.text?.variant} level={tagTheme.text?.level} size={size} />
      )}
      <Typography.Text
        label={label}
        size={size === "sm" ? "xs" : "sm"}
        variant={tagTheme.text?.variant}
        level={tagTheme.text?.level}
      />
      {icon && iconPosition === "trailing" && (
        <Icon name={icon} variant={tagTheme.text?.variant} level={tagTheme.text?.level} size={size} />
      )}
    </View>
  );
}

export default Tag;
