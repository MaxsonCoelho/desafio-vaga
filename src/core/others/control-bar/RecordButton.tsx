import React, { useCallback, useEffect, useRef, useState } from "react";
import LottieView from "lottie-react-native";
import { camelCase, get } from "lodash";
import View from "@core/View";
import useRecord from "@commons/hooks/useRecord";
import { useStudent } from "@commons/contexts/StudentContext";
import { SPACINGS } from "@commons/consts/design-system/global/spacings";
import recordButtonLottie from "@commons/assets/lotties/record-button.json";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { normalizeVerticalSize } from "@utils/sizeUtils";
import useAppDispatch from "@commons/hooks/useAppDispatch";
import Typography from "@core/general/Typography";
import { getTranslation } from "@locales";
import Popover from "@core/others/item-types/Popover";
import MissingPermissionModal from "@core/others/MissingPermissionModal";
import { Audio } from "expo-av";
import { Alert } from "react-native";
import useAppSelector from "@commons/hooks/useAppSelector";
import { getItemExecutionType } from "@commons/slices/selectors/itemExecutionSelectors";
import { submitRecordItem } from "@commons/slices/actions/itemExecutionActions";
import { useExecution } from "@commons/contexts/ExecutionContext";

enum AnimationStep {
  Initial = "initial",
  StartRecord = "startRecord",
  Recording = "recording",
  EndRecord = "endRecord",
  LoadingRecord = "loadingRecord",
}

function RecordButton({ disabled }: { disabled?: boolean }) {
  const { profile } = useStudent();
  const mobileRecordMedia = useRecord();
  const { checkSpeechRecognition, isCheckingSR, flowError, clearFlowError, setControlBarActionWithTooltip } =
    useExecution();

  const [showPopOver, setShowPopOver] = useState(false);
  const [isMicrophonePermissionModalOpen, setIsMicrophonePermissionModalOpen] = useState(false);

  const itemTypeKey = useAppSelector(getItemExecutionType);

  const soundEffectRef = useRef<Audio.Sound | undefined>(undefined);
  const lottieRef = useRef<LottieView>(null);
  const awayTimeoutRef = useRef<NodeJS.Timeout>();

  const dispatch = useAppDispatch();

  const handleAnimationSteps = useCallback((step: AnimationStep) => {
    const animation = lottieRef.current;
    if (animation) {
      const { start, end } = {
        initial: { start: 0, end: 9 },
        startRecord: { start: 10, end: 53 },
        recording: { start: 54, end: 189 },
        endRecord: { start: 190, end: 217 },
        loadingRecord: { start: 218, end: 257 },
      }[step];
      animation.play(start, end);
    }
  }, []);

  const handleTogglePermissionModal = useCallback(() => {
    setIsMicrophonePermissionModalOpen(!isMicrophonePermissionModalOpen);
  }, [isMicrophonePermissionModalOpen]);

  const handleToggleRecord = useCallback(async () => {
    if (awayTimeoutRef.current) clearTimeout(awayTimeoutRef.current);
    setShowPopOver(false);
    setControlBarActionWithTooltip?.(null);

    if (soundEffectRef.current) {
      soundEffectRef.current.playFromPositionAsync(0);
    }

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
  }, [mobileRecordMedia.isRecording, handleTogglePermissionModal]);

  useEffect(() => {
    Audio.Sound.createAsync(require("@commons/assets/audios/record-button-click.wav"))
      .then(({ sound }) => {
        soundEffectRef.current = sound;
      })
      .catch(() => {
        soundEffectRef.current = undefined;
      });

    setTimeout(() => {
      handleAnimationSteps(AnimationStep.Initial);
    }, 0);

    // awayTimeoutRef.current = setTimeout(() => setShowPopOver(true), 8000);

    return () => {
      if (soundEffectRef.current) {
        soundEffectRef.current.unloadAsync();
      }
      if (awayTimeoutRef.current) {
        clearTimeout(awayTimeoutRef.current);
      }
    };
  }, []);

  // useEffect(() => {
  //   if (controlBarActionWithTooltip === ControlBarAction.RECORD) {
  //     if (awayTimeoutRef.current) clearTimeout(awayTimeoutRef.current);
  //     setTimeout(() => setShowPopOver(true), ControlBarSlideInDown.duration);
  //   }
  // }, [controlBarActionWithTooltip]);

  useEffect(() => {
    if (mobileRecordMedia.isRecording) {
      handleAnimationSteps(AnimationStep.Recording);
    }
  }, [mobileRecordMedia.isRecording]);

  useEffect(() => {
    if (isCheckingSR) {
      handleAnimationSteps(AnimationStep.LoadingRecord);
    }
  }, [isCheckingSR]);

  useEffect(() => {
    if (mobileRecordMedia.record) {
      checkSpeechRecognition?.({
        record: mobileRecordMedia.record,
        isDemoStudent: profile?.demoStudent,
        studentId: profile?.id || "",
      });
      dispatch(submitRecordItem({ recordFile: mobileRecordMedia.record }));
    }
  }, [mobileRecordMedia.record]);

  useEffect(() => {
    if (flowError) {
      if (flowError === "error_no_speech") {
        Alert.alert("", getTranslation("core.others.control-bar.RecordButton.noSpeechError"));
      }
      clearFlowError?.();
      handleAnimationSteps(AnimationStep.Initial);
    }
  }, [flowError, clearFlowError]);

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
              loop={true}
              renderMode="HARDWARE"
              style={{
                padding: 0,
                margin: 0,
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
