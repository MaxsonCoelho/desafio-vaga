import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import dayjs from "dayjs";
import View from "@core/View";
import { useExecution } from "@commons/contexts/ExecutionContext";
import { SPACINGS } from "@commons/consts/design-system/global/spacings";
import { COLORS } from "@commons/consts/design-system/global/colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { interpolate, useAnimatedStyle, useSharedValue } from "react-native-reanimated";
import Tag from "@core/data-display/Tag";
import Svg, { Circle } from "react-native-svg";
import Typography from "@core/general/Typography";
import useAppSelector from "@commons/hooks/useAppSelector";
import { normalizeVerticalSize } from "@utils/sizeUtils";
import { getCurrentExecutionItems } from "@commons/slices/execution";
import useFlow from "@commons/hooks/useFlow";
import { FlowType } from "@commons/slices/flow";
import { getSelectedItemProp } from "@commons/slices/utils/itemExecutionUtils";
import SafeAreaView from "@core/SafeAreaView";
import { useFocusEffect } from "@react-navigation/native";
import AudioWave from "./AudioWave";
import useAudio from "@commons/hooks/useAudio";

const RUNNING_OUT_OF_TIME_SECONDS = 5;

const CircularTimer = ({
  seconds = 60,
  backgroundStrokeColor,
  strokeColor,
  onComplete,
}: {
  seconds?: number;
  backgroundStrokeColor: string;
  strokeColor: string;
  onComplete?: () => void;
}) => {
  const size = normalizeVerticalSize(16);
  const strokeWidth = normalizeVerticalSize(4);
  const timerInterval = useRef<NodeJS.Timeout | null>(null);

  const [remainingTime, setRemainingTime] = useState(seconds);
  const isRunningOutOfTime = remainingTime <= RUNNING_OUT_OF_TIME_SECONDS;

  const [isPending] = useFlow(FlowType.PAUSE_PLACEMENT_TEST_ITEM_EXECUTION_FLOW);
  const [isPendingAudio] = useFlow(FlowType.PLAY_ITEM_AUDIO_FLOW);
  const [isPendingGetNextTest] = useFlow(FlowType.GET_NEXT_PLACEMENT_TEST_ITEM_FLOW);
  const repeatCount = useAppSelector((state) => getSelectedItemProp(state, "repeatCount")) as number;

  const pauseTimer = useMemo(() => {
    return (isPendingAudio && repeatCount < 1) || isPendingGetNextTest;
  }, [isPendingAudio, isPendingGetNextTest, repeatCount]);

  useEffect(() => {
    setRemainingTime(seconds);
  }, [seconds]);

  useEffect(() => {
    if (isPending) {
      clearInterval(timerInterval.current!);
    }
  }, [isPending]);

  useEffect(() => {
    if (remainingTime < 1) {
      clearInterval(timerInterval.current!);
      onComplete?.();
      setRemainingTime(seconds);
    }
  }, [remainingTime]);

  useFocusEffect(
    useCallback(() => {
      timerInterval.current = setInterval(() => {
        if (pauseTimer) return;
        setRemainingTime((prevState) => {
          return prevState - 1;
        });
      }, 1000);

      return () => clearInterval(timerInterval.current!);
    }, [pauseTimer]),
  );

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <View
      flexDirection="row"
      gap={SPACINGS.xs}
      alignItems="center"
      borderRadius={SPACINGS["2xs"]}
      paddingHorizontal={SPACINGS["2xs"]}
      paddingVertical={SPACINGS["3xs"]}
      {...(isRunningOutOfTime ? { backgroundColor: COLORS.danger[50] } : {})}
    >
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          transform: [{ rotate: "-90deg" }],
        }}
      >
        <Svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          style={{
            transform: [{ rotate: "-90deg" }],
          }}
        >
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={isRunningOutOfTime ? COLORS.danger[500]! : backgroundStrokeColor}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={circumference + (circumference * remainingTime) / seconds}
          />
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (remainingTime / seconds)}
          />
        </Svg>
      </View>
      <View minWidth={24}>
        <Typography.Text
          size="sm"
          label={dayjs.duration(remainingTime, "seconds").format("m:ss")}
          variant={isRunningOutOfTime ? "danger" : "secondary"}
          level={500}
        />
      </View>
    </View>
  );
};

function ExecutionHeader({
  sticky,
  variant,
  label,
}: {
  label: string;
  sticky?: boolean;
  variant: "secondary" | "accent";
}) {
  const { next } = useExecution();
  const safeAreaInsets = useSafeAreaInsets();
  const stickyValue = useSharedValue(sticky ? 1 : 0);
  const [time, setTime] = useState<number>();
  const [executionItem] = useAppSelector(getCurrentExecutionItems);
  const itemId = useAppSelector((state) => getSelectedItemProp(state, "item.id")) as string;

  const animatedStyle = useAnimatedStyle(() => ({
    height: interpolate(stickyValue.value, [0, 1], [0, safeAreaInsets.top]),
  }));

  useEffect(() => {
    if (executionItem && executionItem.item) {
      setTime(executionItem.item.type.defaultPlacementTestTime);
    }
  }, [executionItem?.id]);

  const { isPlaying: isAudioPlaying } = useAudio();

  return (
    <View zIndex={1}>
      {sticky && (
        <Animated.View
          style={[
            {
              backgroundColor: COLORS.white,
            },
            animatedStyle,
          ]}
        />
      )}
      <SafeAreaView
        edges={["top"]}
        flexDirection="row"
        zIndex={3}
        position="absolute"
        width="100%"
        paddingHorizontal={SPACINGS.md}
        backgroundColor={COLORS.white}
        shadowOffset={{ width: 0, height: 12 }}
        shadowRadius={16}
        elevation={sticky ? 8 : 0}
        shadowOpacity={sticky ? 0.08 : undefined}
        shadowColor="#101828"
        alignItems="center"
      >
        <View
          height="auto"
          width="100%"
          paddingTop={SPACINGS.xs}
          alignItems="center"
          gap={SPACINGS.xs}
          justifyContent="center"
        >
          <Tag label={label} variant={variant} type="flat" size="md" />
          {executionItem && (
            <CircularTimer
              key={itemId}
              {...(time && { seconds: time })}
              backgroundStrokeColor={{ secondary: COLORS.primary["500"], accent: COLORS.accent["600"] }[variant]!}
              strokeColor={{ secondary: COLORS.secondary["200"], accent: COLORS.accent["200"] }[variant]!}
              onComplete={() => {
                next?.();
              }}
            />
          )}
          <View position="absolute" top={0} right={0} height="100%" justifyContent="center">
            <AudioWave shouldStart={isAudioPlaying} />
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

export default ExecutionHeader;
