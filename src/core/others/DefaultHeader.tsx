import { SPACINGS } from "@commons/consts/design-system/global/spacings";
import React, { memo } from "react";
import ConfigStore from "@commons/configStore";
import IconButton from "@core/general/IconButton";
import View from "@core/View";
import Typography from "@core/general/Typography";
import { COLORS } from "@commons/consts/design-system/global/colors";
import SafeAreaView from "@core/SafeAreaView";

export interface HeaderProps {
  title?: string;
  headerLeft?: React.ReactNode;
  headerRight?: React.ReactNode;
  headerTitle?: React.ReactNode;
  back?: boolean;
}

function DefaultHeader({ title, headerLeft, headerTitle, headerRight, back }: HeaderProps) {
  const navigation = ConfigStore.getNavigationInstance();
  return (
    <SafeAreaView backgroundColor={COLORS.primary[700]} edges={["top"]}>
      <View
        flexDirection="row"
        paddingHorizontal={SPACINGS.md}
        paddingVertical={SPACINGS.md}
        justifyContent="space-between"
        alignItems="center"
        width="100%"
      >
        {headerLeft && headerLeft}
        {!headerLeft && back && (
          <IconButton
            onPress={() => {
              navigation.goBack();
            }}
            icon="ChevronLeft"
            variant="primary"
            size="md"
          />
        )}
        {!headerLeft && !back && <View width={SPACINGS["4xl"]} height={SPACINGS["4xl"]} />}
        <View flex={1} justifyContent="center" alignItems="center">
          {headerTitle && headerTitle}
          {!headerTitle && title && <Typography.Text label={title} weight="semibold" size="md" ellipsize />}
        </View>
        {headerRight && headerRight}
        {!headerRight && !headerLeft && <View width={SPACINGS["4xl"]} height={SPACINGS["4xl"]} />}
      </View>
    </SafeAreaView>
  );
}

export default memo(DefaultHeader);
