import React, { useCallback, useMemo } from "react";
import * as ImagePicker from "expo-image-picker";
import Modal from "../feedback/Modal";
import View from "../View";
import Typography from "../general/Typography";
import Button from "../general/Button";
import Separator from "./Separator";
import AvatarIcon from "../general/AvatarIcon";
import { IconNames } from "../general/Icon";
import { getTranslation } from "@locales";

type Props = {
  type: "microphone" | "camera" | "media_library";
  isOpen: boolean;
  onClose: () => void;
};

function RequestPermissionModal({ type, isOpen = false, onClose }: Props) {
  const permissionInfo = useMemo(() => {
    return {
      microphone: {
        title: "",
        subtitle: "",
        icon: "Microphone",
      },
      camera: {
        title: getTranslation("core.others.RequestPermissionModal.permissionInfo.camera.title"),
        subtitle: getTranslation("core.others.RequestPermissionModal.permissionInfo.camera.subtitle"),
        icon: "Camera",
      },
      media_library: {
        title: getTranslation("core.others.RequestPermissionModal.permissionInfo.media_library.title"),
        subtitle: getTranslation("core.others.RequestPermissionModal.permissionInfo.media_library.subtitle"),
        icon: "Images",
      },
    }[type];
  }, [type]);

  const handleAllowed = useCallback(async () => {
    let permissionStatus: ImagePicker.PermissionStatus = ImagePicker.PermissionStatus.UNDETERMINED;

    if (type === "camera") {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      permissionStatus = status;
    }
    if (type === "media_library") {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      permissionStatus = status;
    }

    if (permissionStatus === ImagePicker.PermissionStatus.GRANTED) {
      onClose();
    }
  }, [type]);

  return (
    <Modal onClose={onClose} isOpen={isOpen}>
      <View height={360} flex={1}>
        {permissionInfo && (
          <View alignItems="center">
            <AvatarIcon variant="primary" size="xl" name={permissionInfo.icon as IconNames} />
            <Separator size="md" />
            <Typography.Text size="lg" weight="semibold" variant="secondary" level={700} label={permissionInfo.title} />
            <Separator size="xs" />
            <Typography.Text align="center" variant="secondary" level={700} label={permissionInfo.subtitle} />
          </View>
        )}
        <View marginTop="auto">
          <Button
            size="md"
            onPress={handleAllowed}
            label={getTranslation("core.others.RequestPermissionModal.allow")}
            variant="accent"
          />
          <Separator size="md" />
          <Button
            size="md"
            onPress={onClose}
            type="ghost"
            label={getTranslation("core.others.RequestPermissionModal.cancel")}
            variant="secondary"
          />
        </View>
      </View>
    </Modal>
  );
}

export default RequestPermissionModal;
