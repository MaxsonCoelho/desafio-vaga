import React from "react";
import { THEME } from "student-front-commons/src/consts/design-system/theme";
import { COLORS } from "student-front-commons/src/consts/design-system/global/colors";
import View from "../View";
import Icon, { GeneralIconProps, PinkIconProps, VariantIconProps } from "./Icon";
import { VARIANTS } from "@commons/consts/design-system/global/definitions";

type GeneralAvatarIconProps = Required<Omit<GeneralIconProps, "size" | "strokeWidth">> & {
  /** Size of the avatar icon */
  size?: Extract<GeneralIconProps["size"], "sm" | "md" | "lg" | "xl">;
};

type VariantAvatarIconProps = GeneralAvatarIconProps & VariantIconProps;

type PinkAvatarIconProps = GeneralAvatarIconProps & PinkIconProps;

function AvatarIcon(props: VariantAvatarIconProps): JSX.Element;
function AvatarIcon(props: PinkAvatarIconProps): JSX.Element;
function AvatarIcon(props: VariantAvatarIconProps | PinkAvatarIconProps): JSX.Element {
  const { size = "sm", variant, level = 500, name } = props;
  const padding = size ? THEME.avatarIcon.spacing?.[size]?.padding : 0;

  return (
    <View
      backgroundColor={COLORS[variant][100]}
      alignItems="center"
      aspectRatio={1}
      padding={padding}
      borderRadius="100%"
    >
      <Icon name={name} size={size !== "xl" ? size : "2xl"} variant={variant as VARIANTS} level={level} />
    </View>
  );
}

export default AvatarIcon;
