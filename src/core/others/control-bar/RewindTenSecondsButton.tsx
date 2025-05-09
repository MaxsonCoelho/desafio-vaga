import configStore from "@commons/configStore";
import { ItemTypeKey } from "@commons/models/itemTypeModel";
import { getItemExecutionType } from "@commons/slices/selectors/itemExecutionSelectors";
import ControlBarButton from "@core/others/control-bar/ControlBarButton";
import React from "react";
import { useSelector } from "react-redux";

function RewindTenSecondsButton({ disabled }: { disabled?: boolean }) {
  const itemType = useSelector(getItemExecutionType);

  const VideoMedia = configStore.getVideoInstance();
  const AudioMedia = configStore.getAudioInstance();

  const handlePress = () => {
    if (itemType && [ItemTypeKey.AUDIO_LONG].includes(itemType)) {
      AudioMedia.rewind();
    }
    if (itemType && [ItemTypeKey.VIDEO, ItemTypeKey.VIDEO_LONG].includes(itemType)) {
      VideoMedia.rewindTenSeconds();
    }
  };

  return (
    <ControlBarButton
      icon="UndoDot"
      onPress={handlePress}
      labelKey="rewindTenSeconds"
      type="solid"
      variant="secondary"
      disabled={disabled}
    />
  );
}

export default RewindTenSecondsButton;
