import React, { useCallback, useState } from "react";
import { TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { StyleProp } from "react-native/Libraries/StyleSheet/StyleSheet";
import { ViewStyle } from "react-native/Libraries/StyleSheet/StyleSheetTypes";
import { THEME } from "student-front-commons/src/consts/design-system/theme";
import { RADIUS } from "student-front-commons/src/consts/design-system/global/radius";
import { SHADOWS } from "student-front-commons/src/consts/design-system/global/shadows";
import View from "../View";
import { COLORS } from "student-front-commons/src/consts/design-system/global/colors";
import Icon from "../general/Icon";
import { SPACINGS } from "student-front-commons/src/consts/design-system/global/spacings";

type CardProps = {
  children: React.ReactNode;
  disabled?: boolean;
  onPress?: () => void;
  /** Determines if the padding is applied to modal or not */
  fullWidthContent?: boolean;
  /** The linear gradient props to be shown inside the component */
  linearGradientProps?: {
    colors: string[];
    start: { x: number; y: number };
    end: { x: number; y: number };
    style?: StyleProp<ViewStyle>;
  };
};

function CardButton({ children, disabled = false, onPress, fullWidthContent, linearGradientProps }: CardProps) {
  const [pressed, setPressed] = useState(false);

  const cardButtonStates = THEME.cardButton.state;

  const handlePressIn = useCallback(() => {
    if (!disabled) {
      setPressed(true);
    }
  }, []);

  const handlePressOut = useCallback(() => {
    if (!disabled) {
      setPressed(false);
    }
  }, []);

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      style={{
        width: "100%",
        borderRadius: RADIUS.md,
      }}
    >
      <View
        borderRadius={RADIUS.md}
        backgroundColor={COLORS.white}
        padding={fullWidthContent ? 0 : THEME.cardButton.spacing.padding}
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        width="100%"
        overflow="hidden"
        {...SHADOWS.xs}
        {...(pressed && cardButtonStates.pressed)}
        {...(disabled && cardButtonStates.disabled)}
      >
        {linearGradientProps ? (
          <LinearGradient
            colors={[linearGradientProps.colors[0], linearGradientProps.colors[1]]}
            start={linearGradientProps.start}
            end={linearGradientProps.end}
            style={[
              linearGradientProps?.style,
              {
                position: "absolute",
                borderBottomLeftRadius: RADIUS.md,
                borderTopLeftRadius: RADIUS.md,
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
              },
            ]}
          />
        ) : null}
        <View flex={1}>{children}</View>
        {!disabled && (
          <View marginLeft={SPACINGS.xs} marginRight={fullWidthContent ? THEME.cardButton.spacing.padding : 0}>
            <Icon name="ChevronRight" variant="secondary" level={400} strokeWidth={SPACINGS["2xs"]} />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

export default CardButton;
