import React from "react";
import View from "@core/View";
import { SPACINGS } from "@commons/consts/design-system/global/spacings";
import useAppSelector from "@commons/hooks/useAppSelector";
import { getAllExecutionItems, getExecutionHeaderVariant } from "@commons/slices/execution";
import { RADIUS } from "@commons/consts/design-system/global/radius";
import IconButton from "@core/general/IconButton";
import { THEME } from "@commons/consts/design-system/theme";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHandleGoBack } from "../../../hooks/useHandleGoBack";
import AudioWave from "@core/others/AudioWave";
import useAudio from "@commons/hooks/useAudio";
import { useExecution } from "@commons/contexts/ExecutionContext";
import Animated from "react-native-reanimated";
import { useUnitExecutionHeaderBgAnimatedStyles } from "@features/UnitExecution/components/UnitExecutionHeader";

function ExecutionProgressItem({ itemId }: { itemId: string }) {
  const variant = useAppSelector((state) => getExecutionHeaderVariant(state, itemId));

  return (
    <View
      flex={1}
      flexGrow={1}
      maxWidth={24}
      height={4}
      borderRadius={RADIUS.md}
      backgroundColor={THEME.executionProgress.state[variant].backgroundColor}
    />
  );
}

function ExecutionProgress({ transparent }: { transparent?: boolean }) {
  const { closeExecution } = useExecution();
  const animatedStyles = useUnitExecutionHeaderBgAnimatedStyles();
  const safeAreaInsets = useSafeAreaInsets();

  const { isPlaying: isAudioPlaying } = useAudio();

  const executionItems = useAppSelector(getAllExecutionItems);

  const handleBack = useHandleGoBack(
    {
      titleKey: "core.others.itemTypes.ExecutionProgress.alertTitleLabel",
      descriptionKey: "core.others.itemTypes.ExecutionProgress.alertDescriptionLabel",
      confirmButtonKey: "core.others.itemTypes.ExecutionProgress.alertYesButtonLabel",
      dismissButtonKey: "core.others.itemTypes.ExecutionProgress.alertNoButtonLabel",
    },
    closeExecution,
  );

  return (
    <View zIndex={1}>
      <Animated.View
        style={[
          {
            flexDirection: "row",
            zIndex: 3,
            position: "absolute",
            width: "100%",
            paddingHorizontal: SPACINGS.md,
            shadowOffset: { width: 0, height: 12 },
            shadowRadius: RADIUS.lg,
            shadowOpacity: 0.08,
            shadowColor: "#101828",
            alignItems: "center",
            elevation: transparent ? 0 : 8,
            minHeight: 48,
            paddingTop: safeAreaInsets.top + 1,
          },
          animatedStyles,
          {
            ...(transparent && {
              backgroundColor: "transparent",
              shadowOpacity: 0,
            }),
          },
        ]}
      >
        <View height={48} width="100%">
          <View position="absolute" top={0} height="100%" justifyContent="center">
            <IconButton onPress={handleBack} icon="X" type="ghost" variant="secondary" />
          </View>
          <View position="absolute" top={0} right={0} height="100%" justifyContent="center">
            <AudioWave shouldStart={isAudioPlaying} />
          </View>
          <View
            flexDirection="row"
            flex={1}
            gap={SPACINGS.xs}
            paddingHorizontal={SPACINGS["3xl"]}
            width="100%"
            justifyContent="center"
            alignItems="center"
          >
            {(executionItems || [])?.map((executionItem) => (
              <ExecutionProgressItem itemId={executionItem.item.id} key={executionItem.item.id} />
            ))}
          </View>
        </View>
      </Animated.View>
    </View>
  );
}

export default ExecutionProgress;
