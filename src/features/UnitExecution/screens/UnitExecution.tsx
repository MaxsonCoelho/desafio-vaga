import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import View from "@core/View";
import GapFillSelect, { GapFillSelectHeader } from "@core/others/item-types/gap-fill-select";
import ExecutionProgress from "@core/others/item-types/ExecutionProgress";
import { ScrollView as RNScrollView, StatusBar } from "react-native";
import UnitExecutionHeader from "@features/UnitExecution/components/UnitExecutionHeader";
import useAppSelector from "@commons/hooks/useAppSelector";
import { getItemExecutionType } from "@commons/slices/selectors/itemExecutionSelectors";
import { ItemTypeKey } from "@commons/models/itemTypeModel";
import { normalizeVerticalSize } from "@utils/sizeUtils";
import { COLORS } from "@commons/consts/design-system/global/colors";
import ControlBar from "@core/others/ControlBar";
import useAppDispatch from "@commons/hooks/useAppDispatch";
import useService from "@commons/hooks/useService";
import ReportsService from "@commons/services/reportsService";
import { RankingPosition } from "@commons/models/rankingModel";
import { setPositionWhenUnitStarted } from "@commons/slices/execution";
import UnitExecutionProvider from "@commons/contexts/UnitExecutionProvider";
import { getTranslation } from "@locales";
import { getSelectedItemProp } from "@commons/slices/utils/itemExecutionUtils";
import { NativeSyntheticEvent } from "react-native/Libraries/Types/CoreEventTypes";
import { NativeScrollEvent } from "react-native/Libraries/Components/ScrollView/ScrollView";
import { ItemExecutionItemStatus } from "@commons/slices/types/itemExecutionTypes";
import ScrollView from "@core/others/ScrollView";

function ItemHeaderExecution() {
  const itemTypeKey = useAppSelector(getItemExecutionType);

  const { instructionLabel, ItemTypeQuestion } = useMemo<{
    instructionLabel: string;
    ItemTypeQuestion: React.ReactElement;
  }>(() => {
    return (
      {
        [ItemTypeKey.GAP_FILL_SELECT]: {
          instructionLabel: getTranslation(
            "features.UnitExecution.screens.UnitExecution.ItemHeaderExecution.gapFillSelectInstructionLabel",
          ),
          ItemTypeQuestion: <GapFillSelectHeader />,
        },
      }[itemTypeKey as ItemTypeKey.GAP_FILL_SELECT] || {
        instructionLabel: "",
        ItemTypeQuestion: null,
      }
    );
  }, [itemTypeKey]);

  return <UnitExecutionHeader instructionLabel={instructionLabel} itemTypeQuestion={ItemTypeQuestion} />;
}

function ItemExecution() {
  const itemTypeKey = useAppSelector(getItemExecutionType);

  return <View flex={1}>{itemTypeKey === ItemTypeKey.GAP_FILL_SELECT && <GapFillSelect />}</View>;
}

export default function UnitExecution() {
  const dispatch = useAppDispatch();

  const [transparentExecutionProgress, setTransparentExecutionProgress] = useState(true);

  const scrollViewRef = useRef<RNScrollView>(null);
  const executionStatus = useAppSelector((state) => getSelectedItemProp(state, "status")) as ItemExecutionItemStatus;

  useService(ReportsService.getCurrentPositions, {
    autoStart: true,
    onData: (value: RankingPosition) => {
      dispatch(setPositionWhenUnitStarted(value));
    },
  });

  const handleScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    setTransparentExecutionProgress(event.nativeEvent.contentOffset.y === 0);
  }, []);

  useEffect(() => {
    if ([ItemExecutionItemStatus.VALIDATE_CORRECT, ItemExecutionItemStatus.CORRECT].includes(executionStatus)) {
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    }
  }, [executionStatus]);

  return (
    <View flex={1} backgroundColor={COLORS.secondary[200]}>
      <StatusBar barStyle="dark-content" />
      <UnitExecutionProvider>
        <ExecutionProgress transparent={transparentExecutionProgress} />
        <ScrollView
          ref={scrollViewRef}
          bounces={false}
          contentContainerStyle={{ flexGrow: 1, paddingBottom: normalizeVerticalSize(160) }}
          onScroll={handleScroll}
        >
          <ItemHeaderExecution />
          <ItemExecution />
        </ScrollView>
        <ControlBar />
      </UnitExecutionProvider>
    </View>
  );
}
