import React, { useCallback, useState } from "react";
import ControlBarButton from "@core/others/control-bar/ControlBarButton";
import Modal from "@core/feedback/Modal";
import Typography from "@core/general/Typography";
import { SPACINGS } from "@commons/consts/design-system/global/spacings";
import PlayAudioCard from "@core/others/PlayAudioCard";
import Separator from "@core/others/Separator";
import SafeAreaView from "@core/SafeAreaView";
import Button from "@core/general/Button";
import { getTranslation } from "@locales";
import { useExecution } from "@commons/contexts/ExecutionContext";
import useAudio from "@commons/hooks/useAudio";
import View from "@core/View";

function PlayButton({ disabled }: { disabled?: boolean }) {
  const { chooseSpeed, playItemAudio } = useExecution();
  const [isOpen, setIsOpen] = useState(false);
  const { isPlaying } = useAudio();

  const handleToggle = useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen]);

  const handlePlay = useCallback(
    (isSlowPlayback: boolean) => {
      playItemAudio?.({
        isInitialPlay: false,
        isSlowPlayback,
      });
    },
    [playItemAudio],
  );

  return (
    <>
      <ControlBarButton
        disabled={disabled}
        type="solid"
        variant="secondary"
        icon="Play"
        labelKey="play"
        onPress={chooseSpeed ? handleToggle : () => handlePlay(false)}
      />
      <Modal isOpen={isOpen} onClose={handleToggle} showCloseButton={false}>
        <Typography.Text
          size="lg"
          align="center"
          label={getTranslation("core.others.control-bar.PlayButton.modalTitle")}
          variant="secondary"
          weight="semibold"
          level={700}
        />
        <Separator size="4xl" />
        <SafeAreaView edges={["bottom"]}>
          <View flexDirection="row" justifyContent="center" gap={SPACINGS["4xl"]}>
            <PlayAudioCard
              label="0.5x"
              variant="primary"
              onPress={() => handlePlay(true)}
              disabled={disabled || isPlaying}
            />
            <PlayAudioCard
              label="1x"
              variant="primary"
              onPress={() => handlePlay(false)}
              disabled={disabled || isPlaying}
            />
          </View>
          <Separator size="5xl" />
          <Button
            label={getTranslation("core.others.control-bar.PlayButton.closeButton")}
            variant="secondary"
            type="outlined"
            onPress={handleToggle}
            size="md"
          />
        </SafeAreaView>
      </Modal>
    </>
  );
}

export default PlayButton;
