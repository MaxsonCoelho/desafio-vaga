import React from "react";
import { SPACINGS } from "@commons/consts/design-system/global/spacings";
import { COLORS } from "@commons/consts/design-system/global/colors";
import { RADIUS } from "@commons/consts/design-system/global/radius";
import View from "@core/View";
import Typography from "@core/general/Typography";
import IconButton from "@core/general/IconButton";
import { LinearGradient } from "expo-linear-gradient";
import { normalizeHorizontalSize } from "@utils/sizeUtils";

function PlayAudioCard({
  label,
  variant,
  onPress,
  disabled,
}: {
  label: string;
  variant: "primary" | "accent" | "success" | "warning";
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <View
      borderWidth={1}
      borderColor={COLORS[variant]["200"]}
      borderRadius={RADIUS.md}
      overflow="visible"
      alignItems="center"
    >
      <View
        position="absolute"
        height={SPACINGS.xl}
        top={-SPACINGS.sm}
        width={normalizeHorizontalSize(100)}
        alignItems="center"
        justifyContent="center"
        zIndex={1}
      >
        <View
          position="absolute"
          paddingHorizontal={SPACINGS.sm}
          width="auto"
          backgroundColor={COLORS[variant]["200"]}
          paddingVertical={SPACINGS["2xs"]}
          borderRadius={RADIUS.md}
        >
          <Typography.Text label={label} variant="secondary" weight="medium" />
        </View>
      </View>
      <LinearGradient
        colors={[COLORS[variant]["50"] || "primary", "white"]}
        start={{
          x: 0,
          y: 0.1,
        }}
        end={{
          x: 0.5,
          y: 0,
        }}
        style={{
          paddingVertical: SPACINGS.xl,
          paddingHorizontal: SPACINGS["4xl"],
          borderRadius: RADIUS.md,
        }}
      >
        <IconButton icon="Play" size="lg" variant={variant} onPress={onPress} disabled={disabled} />
      </LinearGradient>
    </View>
  );
}

export default PlayAudioCard;
