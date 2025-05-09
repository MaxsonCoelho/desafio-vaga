import { Image, Linking, Pressable } from "react-native";
import React, { useCallback } from "react";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import ConfigStore from "@commons/configStore";
import { COLORS } from "@commons/consts/design-system/global/colors";
import { RADIUS } from "@commons/consts/design-system/global/radius";
import { SPACINGS } from "@commons/consts/design-system/global/spacings";
import RNModal from "react-native-modal";
import View from "@core/View";
import Button from "@core/general/Button";
import Separator from "@core/others/Separator";
import Typography from "@core/general/Typography";
import { RootStackParamList } from "@navigators";
import { getTranslation } from "@locales";
import KidsCharacter from "@features/Login/assets/kids-character.png";
import { THEME } from "@commons/consts/design-system/theme";
import IconButton from "@core/general/IconButton";

function KidsModal() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleAccessFlexgeKids = useCallback(async () => {
    await Linking.openURL("https://kids.flexge.com/");
    await ConfigStore.onLogout();
  }, []);

  const handleClose = useCallback(() => {
    navigation.goBack();
  }, []);

  return (
    <RNModal
      isVisible
      onBackButtonPress={handleClose}
      onBackdropPress={handleClose}
      style={{ margin: 0, justifyContent: "flex-end" }}
    >
      <View
        borderTopLeftRadius={THEME.modal.border.radius}
        borderTopRightRadius={THEME.modal.border.radius}
        width="100%"
        backgroundColor={COLORS.white}
        overflow="hidden"
      >
        <View
          height={180}
          backgroundColor={COLORS.success[50]}
          borderTopLeftRadius={RADIUS.lg}
          borderTopRightRadius={RADIUS.lg}
          alignItems="center"
          position="relative"
        >
          <Image
            source={KidsCharacter}
            style={{ height: "95%", bottom: 0, position: "absolute", objectFit: "contain" }}
          />
          <View position="absolute" right={SPACINGS.xl} top={SPACINGS.xl}>
            <IconButton onPress={handleClose} size="sm" icon="X" variant="secondary" />
          </View>
        </View>
        <View paddingTop={SPACINGS.lg} paddingHorizontal={SPACINGS.xl} paddingBottom={SPACINGS.xl} alignItems="center">
          <Typography.Text
            label={getTranslation("features.Login.screens.KidsModal.title")}
            weight="semibold"
            size="lg"
            variant="secondary"
            level={700}
          />
          <Separator size="xs" />
          <Typography.Text
            label={getTranslation("features.Login.screens.KidsModal.description")}
            variant="secondary"
            level={700}
            align="center"
          />
          <Separator size="xl" />
          <Pressable onPress={handleAccessFlexgeKids}>
            <Typography.Text
              label="kids.flexge.com"
              size="md"
              weight="medium"
              variant="primary"
              level={600}
              align="center"
            />
          </Pressable>
          <Separator size="4xl" />
          <View width="100%" marginTop="auto">
            <Button
              variant="primary"
              label={getTranslation("features.Login.screens.KidsModal.buttonLabel")}
              size="md"
              onPress={handleAccessFlexgeKids}
            />
          </View>
        </View>
      </View>
    </RNModal>
  );
}

export default KidsModal;
