import React, { useCallback, useEffect, useRef, useState } from "react";
import LottieView from "lottie-react-native";
import { camelCase, get } from "lodash";
import { Alert } from "react-native";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { Audio } from "expo-av";

import View from "@core/View";
import Typography from "@core/general/Typography";
import Popover from "@core/others/item-types/Popover";
import MissingPermissionModal from "@core/others/MissingPermissionModal";
import useAppSelector from "@commons/hooks/useAppSelector";
import useAppDispatch from "@commons/hooks/useAppDispatch";
import useRecord from "@commons/hooks/useRecord";
import { useStudent } from "@commons/contexts/StudentContext";
import { useExecution } from "@commons/contexts/ExecutionContext";

import { SPACINGS } from "@commons/consts/design-system/global/spacings";
import { normalizeVerticalSize } from "@utils/sizeUtils";
import { getItemExecutionType } from "@commons/slices/selectors/itemExecutionSelectors";
import { submitRecordItem } from "@commons/slices/actions/itemExecutionActions";
import { getTranslation } from "@locales";

import recordButtonLottie from "@commons/assets/lotties/record-button.json";

enum AnimationStep {
  Initial = "initial",
  StartRecord = "startRecord",
  Recording = "recording",
  EndRecord = "endRecord",
  LoadingRecord = "loadingRecord",
}

function RecordButton({ disabled }: { disabled?: boolean }) {
  const { profile } = useStudent();
  const dispatch = useAppDispatch();
  const mobileRecordMedia = useRecord();
  const itemTypeKey = useAppSelector(getItemExecutionType);

  const {
    checkSpeechRecognition,
    isCheckingSR,
    flowError,
    clearFlowError,
    setControlBarActionWithTooltip,
  } = useExecution();

  const [showPopOver, setShowPopOver] = useState(false);
  const [isMicrophonePermissionModalOpen, setIsMicrophonePermissionModalOpen] = useState(false);

  const lottieRef = useRef<LottieView>(null);
  const soundEffectRef = useRef<Audio.Sound>();
  const awayTimeoutRef = useRef<NodeJS.Timeout>();

  // Define quais frames tocar por etapa
  const handleAnimationSteps = useCallback((step: AnimationStep) => {
    const animation = lottieRef.current;
    if (!animation) return;

    const { start, end } = {
      initial: { start: 0, end: 9 },
      startRecord: { start: 10, end: 53 },
      recording: { start: 54, end: 189 },
      endRecord: { start: 190, end: 217 },
      loadingRecord: { start: 218, end: 257 },
    }[step];

    animation.play(start, end);
  }, []);

  const handleTogglePermissionModal = useCallback(() => {
    setIsMicrophonePermissionModalOpen((prev) => !prev);
  }, []);

  const handleToggleRecord = useCallback(async () => {
    if (awayTimeoutRef.current) clearTimeout(awayTimeoutRef.current);
    setShowPopOver(false);
    setControlBarActionWithTooltip?.(null);

    soundEffectRef.current?.playFromPositionAsync(0);

    if (mobileRecordMedia.isRecording) {
      handleAnimationSteps(AnimationStep.EndRecord);
      mobileRecordMedia.stopRecord();
      return;
    }

    try {
      await mobileRecordMedia.startRecord();
      handleAnimationSteps(AnimationStep.StartRecord);
    } catch (error) {
      if (get(error, "message") === "Microphone permission not granted") {
        handleTogglePermissionModal();
      }
      handleAnimationSteps(AnimationStep.Initial);
    }
  }, [
    mobileRecordMedia,
    handleAnimationSteps,
    handleTogglePermissionModal,
    setControlBarActionWithTooltip,
  ]);

  // Carrega som e inicializa animação
  useEffect(() => {
    Audio.Sound.createAsync(require("@commons/assets/audios/record-button-click.wav"))
      .then(({ sound }) => {
        soundEffectRef.current = sound;
      })
      .catch(() => {
        soundEffectRef.current = undefined;
      });

    handleAnimationSteps(AnimationStep.Initial);

    return () => {
      soundEffectRef.current?.unloadAsync();
      if (awayTimeoutRef.current) clearTimeout(awayTimeoutRef.current);
    };
  }, [handleAnimationSteps]);

  useEffect(() => {
    if (mobileRecordMedia.isRecording) {
      handleAnimationSteps(AnimationStep.Recording);
    }
  }, [mobileRecordMedia.isRecording, handleAnimationSteps]);

  useEffect(() => {
    if (isCheckingSR) {
      handleAnimationSteps(AnimationStep.LoadingRecord);
    }
  }, [isCheckingSR, handleAnimationSteps]);

  useEffect(() => {
    if (mobileRecordMedia.record) {
      checkSpeechRecognition?.({
        record: mobileRecordMedia.record,
        isDemoStudent: profile?.demoStudent,
        studentId: profile?.id || "",
      });

      dispatch(submitRecordItem({ recordFile: mobileRecordMedia.record }));
    }
  }, [mobileRecordMedia.record, checkSpeechRecognition, dispatch, profile]);

  useEffect(() => {
    if (flowError === "error_no_speech") {
      Alert.alert("", getTranslation("core.others.control-bar.RecordButton.noSpeechError"));
      clearFlowError?.();
      handleAnimationSteps(AnimationStep.Initial);
    }
  }, [flowError, clearFlowError, handleAnimationSteps]);

  return (
    <>
      <Popover
        isOpen={!disabled && showPopOver}
        content={
          <Typography.Text
            variant="secondary"
            level={600}
            align="center"
            weight="medium"
            label={getTranslation(
              `core.others.control-bar.RecordButton.${camelCase(itemTypeKey?.toLowerCase())}.description`,
            )}
          />
        }
      >
        <View flexDirection="column" gap={SPACINGS.xs} alignItems="center">
          <TouchableWithoutFeedback
            disabled={disabled || isCheckingSR}
            onPress={handleToggleRecord}
            style={{
              width: normalizeVerticalSize(53),
              height: normalizeVerticalSize(53),
              borderRadius: normalizeVerticalSize(84),
              alignItems: "center",
            }}
          >
            <LottieView
              ref={lottieRef}
              source={recordButtonLottie}
              autoPlay={false}
              loop
              renderMode="HARDWARE"
              style={{
                marginTop: normalizeVerticalSize(-15),
                width: normalizeVerticalSize(84),
                height: normalizeVerticalSize(84),
                borderRadius: normalizeVerticalSize(84),
              }}
            />
          </TouchableWithoutFeedback>
        </View>
      </Popover>

      <MissingPermissionModal
        isOpen={isMicrophonePermissionModalOpen}
        onClose={handleTogglePermissionModal}
        type="microphone"
        backdrop
      />
    </>
  );
}

export default RecordButton;
