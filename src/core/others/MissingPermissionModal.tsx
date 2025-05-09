import React, { useCallback } from "react";
import Modal from "../feedback/Modal";
import * as Linking from "expo-linking";
import Typography from "../general/Typography";
import Button from "../general/Button";
import Separator from "./Separator";
import AvatarIcon from "../general/AvatarIcon";
import View from "../View";
import { getTranslation } from "@locales";

type Props = {
  type: "microphone" | "camera" | "media_library";
  isOpen: boolean;
  backdrop?: boolean;
  onClose: () => void;
};

function MissingPermissionModal({ type, isOpen = false, onClose, backdrop = false }: Props) {
  const handleOpenSettings = useCallback(async () => {
    await Linking.openSettings();
    onClose();
  }, []);

  return (
    <Modal onClose={onClose} isOpen={isOpen} backdrop={backdrop}>
      <Separator size="md" />
      <View height={360} flex={1}>
        <View alignItems="center">
          <AvatarIcon variant="danger" size="xl" name="TriangleAlert" />
          <Separator size="md" />
          <Typography.Text
            size="lg"
            weight="semibold"
            variant="secondary"
            level={700}
            label={getTranslation("core.others.MissingPermissionModal.title")}
          />
          <Separator size="xs" />
          <Typography.Text
            align="center"
            variant="secondary"
            level={700}
            label={getTranslation(`core.others.MissingPermissionModal.${type}.description`)}
          />
        </View>
        <View marginTop="auto">
          <Button
            size="md"
            onPress={handleOpenSettings}
            label={getTranslation("core.others.MissingPermissionModal.button.openSettings")}
            variant="accent"
          />
          <Separator size="md" />
          <Button
            size="md"
            onPress={onClose}
            type="ghost"
            label={getTranslation("core.others.MissingPermissionModal.cancel")}
            variant="secondary"
          />
        </View>
      </View>
    </Modal>
  );
}

export default MissingPermissionModal;
