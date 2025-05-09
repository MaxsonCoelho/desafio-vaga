import ConfigStore from "@commons/configStore";
import { ItemTypeKey } from "@commons/models/itemTypeModel";
import { getItemExecutionType } from "@commons/slices/selectors/itemExecutionSelectors";
import { IconSpeed } from "@core/general/IconButton";
import ControlBarButton from "@core/others/control-bar/ControlBarButton";
import React, { useState } from "react";
import { useSelector } from "react-redux";

interface Speed {
  icon: IconSpeed;
  speedRate: number;
}

const SPEEDS: Speed[] = [
  {
    icon: "1x",
    speedRate: 1,
  },
  {
    icon: "1.5x",
    speedRate: 1.5,
  },
  {
    icon: "2x",
    speedRate: 2,
  },
];

function ChangeSpeedButton({ disabled }: { disabled?: boolean }) {
  const itemType = useSelector(getItemExecutionType);
  const audioMediaInstance = ConfigStore.getAudioInstance();
  const videoMediaInstance = ConfigStore.getVideoInstance();
  const [speedIndex, setSpeedIndex] = useState(0);

  const handlePress = () => {
    const nextSpeed = speedIndex >= SPEEDS.length - 1 ? 0 : speedIndex + 1;

    if (itemType && [ItemTypeKey.AUDIO_LONG].includes(itemType)) {
      audioMediaInstance.setSpeedRate(SPEEDS[nextSpeed].speedRate);
    }
    if (itemType && [ItemTypeKey.VIDEO, ItemTypeKey.VIDEO_LONG].includes(itemType)) {
      videoMediaInstance.setPlaybackRate(SPEEDS[nextSpeed].speedRate);
    }

    setSpeedIndex(nextSpeed);
  };

  return (
    <ControlBarButton
      icon={SPEEDS[speedIndex].icon}
      onPress={handlePress}
      labelKey="speed"
      type="solid"
      variant="secondary"
      disabled={disabled}
    />
  );
}

export default ChangeSpeedButton;
