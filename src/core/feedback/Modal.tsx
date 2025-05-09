import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Animated, Dimensions } from "react-native";
import RNModal from "react-native-modal";
import View from "../View";
import { THEME } from "student-front-commons/src/consts/design-system/theme";
import { COLORS } from "student-front-commons/src/consts/design-system/global/colors";
import IconButton from "../general/IconButton";
import { SHADOWS } from "@commons/consts/design-system/global/shadows";
import { normalizeHorizontalSize, normalizeVerticalSize } from "@utils/sizeUtils";
import useViewLayout from "../../hooks/useViewLayout";
import { LinearGradient } from "expo-linear-gradient";
import { NativeSyntheticEvent } from "react-native/Libraries/Types/CoreEventTypes";
import { NativeScrollEvent } from "react-native/Libraries/Components/ScrollView/ScrollView";
import Typography from "@core/general/Typography";
import { ceil } from "lodash";
import { SPACINGS } from "@commons/consts/design-system/global/spacings";

export type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  showCloseButton?: boolean;
  title?: string;
};

function Modal({ title, isOpen, showCloseButton = true, children, onClose }: ModalProps) {
  const [showBottomGradient, setShowBottomGradient] = useState(false);

  const [layout, handleOnLayout] = useViewLayout();

  const maxHeight = useMemo(() => {
    return Dimensions.get("window").height * 0.8;
  }, []);

  useEffect(() => {
    setShowBottomGradient((layout?.height || 0) > maxHeight);
  }, [maxHeight, layout?.height]);

  const handleOnScroll = useCallback(
    ({ nativeEvent: { layoutMeasurement, contentOffset, contentSize } }: NativeSyntheticEvent<NativeScrollEvent>) => {
      setShowBottomGradient(ceil(layoutMeasurement.height + contentOffset.y) < contentSize.height);
    },
    [],
  );

  return (
    <RNModal
      isVisible={isOpen}
      onBackButtonPress={onClose}
      onBackdropPress={onClose}
      style={{ margin: 0, justifyContent: "flex-end" }}
    >
      <View
        borderTopLeftRadius={THEME.modal.border.radius}
        borderTopRightRadius={THEME.modal.border.radius}
        width="100%"
        maxHeight={maxHeight}
        backgroundColor={COLORS.white}
        overflow="hidden"
      >
        {showCloseButton && (
          <Animated.View
            style={[
              {
                width: "100%",
                backgroundColor: COLORS.white,
                borderTopLeftRadius: normalizeHorizontalSize(THEME.modal.border.radius),
                borderTopRightRadius: normalizeHorizontalSize(THEME.modal.border.radius),
                paddingHorizontal: normalizeHorizontalSize(THEME.modal.spacing.paddingHorizontal),
                paddingTop: normalizeVerticalSize(THEME.modal.spacing.paddingVertical),
                paddingBottom: normalizeVerticalSize(THEME.modal.spacing.paddingVertical / 2),
                flexDirection: "row",
                justifyContent: title ? "space-between" : "flex-end",
                alignItems: "center",
              },
              showBottomGradient && SHADOWS.md,
            ]}
          >
            {title && <View width={SPACINGS["2xl"]} height={SPACINGS["2xl"]} />}
            {title && (
              <Typography.Text size="lg" align="center" label={title} variant="secondary" weight="medium" level={600} />
            )}
            <View alignItems="flex-end">
              <IconButton onPress={onClose} size="sm" icon="X" variant="secondary" />
            </View>
          </Animated.View>
        )}
        <Animated.ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            ...(!showCloseButton && {
              paddingHorizontal: normalizeHorizontalSize(THEME.modal.spacing.paddingHorizontal),
              paddingVertical: normalizeVerticalSize(THEME.modal.spacing.paddingVertical),
            }),
          }}
          scrollEventThrottle={16}
          bounces={false}
          onScroll={handleOnScroll}
        >
          <View onLayout={handleOnLayout}>{children}</View>
        </Animated.ScrollView>
        {showBottomGradient && (
          <LinearGradient
            colors={["transparent", COLORS.secondary[300]!]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1.3 }}
            style={{ position: "absolute", height: 80, width: "100%", bottom: 0 }}
          />
        )}
      </View>
    </RNModal>
  );
}

export default Modal;
