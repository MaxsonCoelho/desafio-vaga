import React, { useState } from "react";
import { FlatList, NativeScrollEvent, NativeSyntheticEvent, ScrollView } from "react-native";
import View from "../../../core/View";
import { LinearGradient } from "expo-linear-gradient";
import useAppSelector from "student-front-commons/src/hooks/useAppSelector";
import { useStudent } from "student-front-commons/src/contexts/StudentContext";
import { getModuleIdsByCourse } from "student-front-commons/src/slices/entity";
import { COLORS } from "student-front-commons/src/consts/design-system/global/colors";
import { SPACINGS } from "student-front-commons/src/consts/design-system/global/spacings";
import { normalizeHorizontalSize, normalizeVerticalSize } from "@utils/sizeUtils";
import ModuleCardButton from "@core/others/ModuleCardButton";
import ConfigStore from "@commons/configStore";
import { To } from "@commons/core/navigation";

const HEADER_HEIGHT = 80;

export default function Modules() {
  const navigation = ConfigStore.getNavigationInstance();
  const { currentCourse } = useStudent();
  const moduleIds = useAppSelector((state) => getModuleIdsByCourse(state, currentCourse?.course.id ?? ""));
  const [scrollOffset, setScrollOffset] = useState(0);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const yOffset = event.nativeEvent.contentOffset.y;
    if (yOffset >= HEADER_HEIGHT) {
      return setScrollOffset(HEADER_HEIGHT - 1);
    }
    setScrollOffset(yOffset);
  };

  return (
    <View>
      <LinearGradient
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        colors={[COLORS.primary[800]!, COLORS.primary[500]!]}
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          height: normalizeVerticalSize(HEADER_HEIGHT - scrollOffset),
          bottom: 0,
          borderBottomLeftRadius: normalizeHorizontalSize(SPACINGS.lg),
          borderBottomRightRadius: normalizeHorizontalSize(SPACINGS.lg),
        }}
      />
      <ScrollView onScroll={handleScroll}>
        <FlatList
          data={moduleIds}
          keyExtractor={(item) => item}
          scrollEnabled={false}
          contentContainerStyle={{ gap: normalizeVerticalSize(SPACINGS.xs), margin: SPACINGS.md }}
          renderItem={({ item }) => (
            <ModuleCardButton moduleId={item} onPress={(moduleId) => navigation.navigate(To.UnitList, { moduleId })} />
          )}
        />
      </ScrollView>
    </View>
  );
}
