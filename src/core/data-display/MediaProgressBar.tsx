import { COLORS } from "@commons/consts/design-system/global/colors";
import { SPACINGS } from "@commons/consts/design-system/global/spacings";
import Icon from "@core/general/Icon";
import IconButton from "@core/general/IconButton";
import Typography from "@core/general/Typography";
import View from "@core/View";
import { normalizeHorizontalSize, normalizeVerticalSize } from "@utils/sizeUtils";
import dayjs from "dayjs";
import React, { useMemo, useRef } from "react";
import { DimensionValue } from "react-native";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

export interface MediaProgressBarProps {
  /** Total time of the media in seconds */
  totalTime: number;
  /** Current time of the media in seconds */
  currentTime?: number;
  onFullScreenPress?: () => void;
  onUndoDotPress?: () => void;
}
export const MediaProgressBar: React.FC<MediaProgressBarProps> = ({
  totalTime = 0,
  currentTime = 0,
  onFullScreenPress,
  onUndoDotPress,
}) => {
  const oldTime = useRef(currentTime);
  const progress = useMemo(() => {
    const progressResult = currentTime / totalTime;
    if (progressResult < 0) return 0;
    if (progressResult > 1) return 1;
    return progressResult;
  }, [currentTime, totalTime]);

  const animatedProgress = useSharedValue(progress);
  const animatedStyle = useAnimatedStyle(() => ({
    left: `${animatedProgress.value * 100}%` as DimensionValue,
  }));

  React.useEffect(() => {
    animatedProgress.value = withTiming(progress, {
      duration: (currentTime - oldTime.current) * 1000,
      easing: Easing.linear,
    });
    oldTime.current = currentTime;
  }, [progress]);

  return (
    <View flexDirection="row" alignItems="center" width="100%" gap={SPACINGS.md}>
      <View flexDirection="row" alignItems="center" flex={1} gap={!!onUndoDotPress ? SPACINGS.xs : SPACINGS.md}>
        <TimeDisplay time={currentTime} />
        {!!onUndoDotPress && <IconButton icon="UndoDot" variant="accent" type="ghost" onPress={onUndoDotPress} />}
        <View flex={1} backgroundColor={COLORS.accent[200]} height={4} borderRadius={4} justifyContent="center">
          <Animated.View
            style={[
              {
                backgroundColor: COLORS.accent[600],
                width: normalizeHorizontalSize(12),
                height: normalizeHorizontalSize(12),
                marginLeft: normalizeHorizontalSize(-4),
                borderRadius: normalizeHorizontalSize(12),
              },
              animatedStyle,
            ]}
          />
        </View>
        <TimeDisplay time={totalTime} />
      </View>
      <IconButton icon="Expand" onPress={onFullScreenPress} variant="accent" type="ghost" />
    </View>
  );
};

export default MediaProgressBar;

const TimeDisplay = ({ time }: { time: number }) => (
  <Typography.Text
    label={dayjs({ seconds: time }).format("mm:ss")}
    weight="semibold"
    size="xs"
    align="center"
    variant="secondary"
    level={500}
  />
);
