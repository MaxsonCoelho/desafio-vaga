import React from "react";
import Animated, { SlideInDown, SlideOutDown } from "react-native-reanimated";
import View from "@core/View";
import { ControlBarAction } from "@commons/core/itemBehavior";
import RecordButton from "@core/others/control-bar/RecordButton";
import ValidateButton from "@core/others/control-bar/ValidateButton";
import TryAgainButton from "@core/others/control-bar/TryAgainButton";
import { SPACINGS } from "@commons/consts/design-system/global/spacings";
import NextButton from "@core/others/control-bar/NextButton";
import TranslateButton from "@core/others/control-bar/TranslateButton";
import ReadButton from "@core/others/control-bar/ReadButton";
import PlayButton from "@core/others/control-bar/PlayButton";
import ListenButton from "@core/others/control-bar/ListenButton";
import { COLORS } from "@commons/consts/design-system/global/colors";
import { LinearGradient } from "expo-linear-gradient";
import useRecord from "@commons/hooks/useRecord";
import ControlBarLastImageItemButton from "@core/others/ControlBarLastImageItemButton";
import ControlBarLastTextItemButton from "@core/others/ControlBarLastTextItemButton";
import RecordAgainButton from "@core/others/control-bar/RecordAgainButton";
import { range } from "lodash";
import { ControlBarSlideInDown, ControlBarSlideOutDown, MotionTarget, MotionType } from "@commons/core/motionStages";
import useShowMotion from "@commons/hooks/useShowMotion";
import ChangeSpeedButton from "./control-bar/ChangeSpeedButton";
import RepeatButton from "./control-bar/RepeatButton";
import RewindTenSecondsButton from "./control-bar/RewindTenSecondsButton";
import { useExecution } from "@commons/contexts/ExecutionContext";

function ControlBar() {
  const { actions } = useExecution();
  const { isRecording } = useRecord();

  const showControlBar = useShowMotion(MotionTarget.ControlBar, MotionType.SlideInDown, MotionType.SlideOutDown);

  return (
    <>
      <ControlBarLastImageItemButton />
      <ControlBarLastTextItemButton />
      <View position="absolute" bottom={0} width="100%" height={160}>
        {isRecording && (
          <Animated.View
            entering={SlideInDown.duration(417)}
            exiting={SlideOutDown.duration(417)}
            style={[
              {
                position: "absolute",
                top: 0,
                bottom: 0,
                right: 0,
                left: 0,
              },
            ]}
          >
            <LinearGradient
              colors={["rgba(255,255,255,0)", COLORS.accent[300]!]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={{ width: "100%", height: "100%" }}
            />
          </Animated.View>
        )}
        <LinearGradient
          colors={["rgba(255,255,255,0)", COLORS.secondary[400]!]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={{
            position: "absolute",
            height: "100%",
            top: 0,
            bottom: 0,
            right: 0,
            left: 0,
            opacity: isRecording ? 0 : 1,
          }}
        />
        {showControlBar && (
          <View
            flexDirection="row"
            width="100%"
            justifyContent="center"
            gap={SPACINGS["4xl"]}
            position="absolute"
            bottom={SPACINGS.md}
            height={100}
            alignItems="flex-start"
          >
            {actions.map((action, index) => {
              const isLoading = action.includes("LOADING");
              const isDisabled = action.includes("DISABLED");
              const actionKey = action.replace("_DISABLED", "").replace("_LOADING", "");
              return (
                <Animated.View
                  key={`container-${actionKey}`}
                  entering={SlideInDown.delay(
                    range({ 1: 0, 2: 67, 3: 134 }[actions.length] || 0, -1, -67)[index],
                  ).duration(ControlBarSlideInDown.duration)}
                  exiting={SlideOutDown.delay(
                    range({ 1: 0, 2: 67, 3: 134 }[actions.length] || 0, -1, -67)[index],
                  ).duration(ControlBarSlideOutDown.duration)}
                >
                  {[ControlBarAction.RECORD, ControlBarAction.RECORD_DISABLED].includes(action) && (
                    <RecordButton key={actionKey} disabled={isDisabled} />
                  )}
                  {[ControlBarAction.RECORD_AGAIN, ControlBarAction.RECORD_AGAIN_DISABLED].includes(action) && (
                    <RecordAgainButton key={actionKey} disabled={isDisabled} />
                  )}
                  {[ControlBarAction.VALIDATE, ControlBarAction.VALIDATE_DISABLED].includes(action) && (
                    <ValidateButton key={actionKey} disabled={isDisabled} />
                  )}
                  {[
                    ControlBarAction.TRY_AGAIN,
                    ControlBarAction.TRY_AGAIN_WHITE,
                    ControlBarAction.TRY_AGAIN_DISABLED,
                    ControlBarAction.TRY_AGAIN_WHITE_DISABLED,
                  ].includes(action) && (
                    <TryAgainButton
                      key={actionKey}
                      variant={ControlBarAction.TRY_AGAIN_WHITE === action ? "secondary" : "accent"}
                      disabled={isDisabled}
                    />
                  )}
                  {[ControlBarAction.NEXT, ControlBarAction.NEXT_DISABLED, ControlBarAction.NEXT_LOADING].includes(
                    action,
                  ) && <NextButton key={actionKey} disabled={isDisabled} loading={isLoading} />}
                  {[
                    ControlBarAction.TRANSLATE,
                    ControlBarAction.TRANSLATE_DISABLED,
                    ControlBarAction.TRANSLATE_ONLY,
                    ControlBarAction.TRANSLATE_ONLY_DISABLED,
                  ].includes(action) && (
                    <TranslateButton
                      key={actionKey}
                      isTranslationOnly={action.includes("ONLY")}
                      disabled={isDisabled}
                    />
                  )}
                  {[ControlBarAction.PLAY, ControlBarAction.PLAY_DISABLED].includes(action) && (
                    <PlayButton key={actionKey} disabled={isDisabled} />
                  )}
                  {[ControlBarAction.READ, ControlBarAction.READ_DISABLED].includes(action) && (
                    <ReadButton key={actionKey} disabled={isDisabled} />
                  )}
                  {[ControlBarAction.LISTEN, ControlBarAction.LISTEN_DISABLED].includes(action) && (
                    <ListenButton key={actionKey} disabled={isDisabled} />
                  )}
                  {[ControlBarAction.CHANGE_SPEED, ControlBarAction.CHANGE_SPEED_DISABLED].includes(action) && (
                    <ChangeSpeedButton key={actionKey} disabled={isDisabled} />
                  )}
                  {[ControlBarAction.REPEAT, ControlBarAction.REPEAT_DISABLED].includes(action) && (
                    <RepeatButton key={actionKey} disabled={isDisabled} />
                  )}
                  {[ControlBarAction.REWIND_TEN_SECONDS, ControlBarAction.REWIND_TEN_SECONDS_DISABLED].includes(
                    action,
                  ) && <RewindTenSecondsButton key={actionKey} disabled={isDisabled} />}
                </Animated.View>
              );
            })}
          </View>
        )}
      </View>
    </>
  );
}

export default ControlBar;
