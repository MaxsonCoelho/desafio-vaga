import React from "react";
import { icons } from "lucide-react-native";
import { COLORS } from "student-front-commons/src/consts/design-system/global/colors";
import { LEVELS, VARIANTS } from "student-front-commons/src/consts/design-system/global/definitions";
import { ICONGRAPHY } from "student-front-commons/src/consts/design-system/global/icongraphy";
import { normalizeHorizontalSize } from "@utils/sizeUtils";

export type IconNames = keyof typeof icons;

export type GeneralIconProps = {
  /** The lucid icon name to be displayed. */
  name: IconNames;
  /** The size of the icon. This corresponds to height and width defined in the design system. */
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  strokeWidth?: number;
};

export type VariantIconProps = GeneralIconProps & {
  /** The color variant of the icon. This determines the color of the icon based on the design system. */
  variant?: VARIANTS;
  /** The level of the icon within a specific variant. This is used for colored icon variants with shades. Only relevant when using a `variant`.*/
  level?: LEVELS;
};

export type PinkIconProps = GeneralIconProps & {
  /** The color variant of the icon. This determines the color of the icon based on the design system. */
  variant?: "pink";
  /** The level of the icon within a specific variant. This is used for colored icon variants with shades. Only relevant when using a `variant`.*/
  level?: 500 | 100;
};

function Icon(props: VariantIconProps): JSX.Element;
function Icon(props: PinkIconProps): JSX.Element;
function Icon(props: VariantIconProps | PinkIconProps): JSX.Element {
  const { size = "sm", name, variant, level = 500, strokeWidth } = props;
  const LucideIcon = icons[name];

  let color = COLORS.white;
  const iconSize = normalizeHorizontalSize(ICONGRAPHY.size[size]);

  if (variant) {
    if (variant === "pink") {
      color = COLORS[variant][level as 500 | 100] as string;
    } else {
      color = COLORS[variant][level as LEVELS] as string;
    }
  }

  return <LucideIcon size={iconSize} color={color} strokeWidth={strokeWidth} />;
}

export default Icon;
