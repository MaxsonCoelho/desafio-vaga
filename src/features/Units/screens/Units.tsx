import React, { useEffect, useRef } from "react";
import { Animated, Image, ScrollView, SectionList } from "react-native";
import type { RouteProp } from "@react-navigation/native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useStudent } from "@commons/contexts/StudentContext";
import useAppSelector from "student-front-commons/src/hooks/useAppSelector";
import useService from "@commons/hooks/useService";
import ModuleService from "@commons/services/moduleService";
import { getModuleById, getUnitSectionIdsByModuleId } from "student-front-commons/src/slices/entity";
import { COLORS } from "student-front-commons/src/consts/design-system/global/colors";
import { SPACINGS } from "student-front-commons/src/consts/design-system/global/spacings";
import View from "@core/View";
import Separator from "@core/others/Separator";
import Typography from "@core/general/Typography";
import MasteryTestListItem from "../components/MasteryTestListItem";
import { normalizeVerticalSize } from "@utils/sizeUtils";
import { getTranslation } from "@locales";
import { UnitStackParams } from "@navigators/UnitNavigation";
import IconButton from "@core/general/IconButton";
import ProgressBar from "@core/data-display/ProgressBar";
import ModuleStatsSection from "@features/Units/components/ModuleStatsSection";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { CourseStackParamList } from "@navigators/CourseNavigation";
import Icon from "@core/general/Icon";
import { RADIUS } from "@commons/consts/design-system/global/radius";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { UnitsList } from "../components/UnitList";
import Constants from "expo-constants";
import ConfigStore from "@commons/configStore";

export default function Units() {
  const { currentCourse } = useStudent();
  const route = useRoute<RouteProp<UnitStackParams, "unitListScreen">>();
  const navigation = useNavigation<NativeStackNavigationProp<CourseStackParamList>>();
  const [_, callSetModuleAccess] = useService(ModuleService.setModuleAccess, {
    autoStart: false,
  });
  const insets = useSafeAreaInsets();

  const module = useAppSelector((state) => getModuleById(state, route.params.moduleId));
  const sections = useAppSelector((state) => getUnitSectionIdsByModuleId(state, route.params.moduleId));

  const scrollY = useRef(new Animated.Value(0)).current;

  const opacityTransition = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [50, 120],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });
  const headerBackground = scrollY.interpolate({
    inputRange: [50, 120],
    outputRange: ["transparent", COLORS.primary[800]!],
    extrapolate: "clamp",
  });

  useEffect(() => {
    if (module && currentCourse?.course) {
      callSetModuleAccess({ course: currentCourse.course.id, module: module.id });
    }
  }, []);

  if (!module || !sections) return null;

  return (
    <>
      <Animated.View
        style={{
          backgroundColor: headerBackground,
          flexDirection: "row",
          alignItems: "center",
          padding: normalizeVerticalSize(SPACINGS.md),
          paddingTop: normalizeVerticalSize(SPACINGS.md + insets.top),
          columnGap: normalizeVerticalSize(SPACINGS.sm),
          width: "100%",
          zIndex: 1,
        }}
      >
        <IconButton onPress={navigation.goBack} icon="ChevronLeft" />
        <Animated.View
          style={{
            opacity: headerOpacity,
          }}
        >
          <Typography.Text
            weight="medium"
            label={getTranslation("features.Units.screens.Units.stickyHeaderTitle", { value: module.name })}
          />
        </Animated.View>
      </Animated.View>
      <Animated.View
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          height: normalizeVerticalSize(360),
          width: "100%",
        }}
      >
        <View flex={1} backgroundColor={COLORS.primary["800"]}>
          <Image
            source={module.iconUrl ? { uri: ConfigStore.getCacheInstance().getCacheKey({ url: module.iconUrl }) } : {}}
            defaultSource={{ uri: `${Constants.expoConfig?.extra?.assetsUrl}/${module.iconUrl}` }}
            resizeMode="cover"
            style={{
              flex: 1,
              height: null,
              width: null,
              opacity: 0.5,
            }}
          />
        </View>
      </Animated.View>
      <ScrollView
        bounces={false}
        scrollEventThrottle={16}
        onScroll={(e) => (e.nativeEvent.contentOffset.y >= 0 ? scrollY.setValue(e.nativeEvent.contentOffset.y) : null)}
        style={{
          width: "100%",
          height: "auto",
          flex: 1,
        }}
      >
        <Animated.View
          style={{
            opacity: opacityTransition,
          }}
        >
          <View paddingHorizontal={SPACINGS.lg} gap={SPACINGS["3xl"]}>
            <View alignItems="center" justifyContent="flex-start" gap={SPACINGS.xs}>
              <Typography.Text
                weight="medium"
                label={getTranslation("features.Units.screens.Units.headerTitle", { value: module.order })}
              />
              <Typography.Text weight="semibold" align="center" size="xl" label={module.name} />
              <View width={156}>
                <ProgressBar progress={Math.floor(module.percentageCompleted)} variant="success" theme="dark" />
              </View>
            </View>
            <ModuleStatsSection moduleId={module.id} />
          </View>
        </Animated.View>
        <View
          paddingBottom={insets.bottom}
          flex={1}
          width="100%"
          backgroundColor={COLORS.white}
          borderTopRightRadius={RADIUS.lg}
          borderTopLeftRadius={RADIUS.lg}
        >
          <SectionList
            stickySectionHeadersEnabled={false}
            scrollEnabled={false}
            sections={sections}
            contentContainerStyle={{
              marginHorizontal: SPACINGS.md,
              marginBottom: SPACINGS.md,
              marginTop: SPACINGS.xl,
            }}
            keyExtractor={(item) => item.title}
            renderItem={({ item }) => <UnitsList title={item.title} data={item.data} />}
            ItemSeparatorComponent={() => <Separator size="md" />}
            SectionSeparatorComponent={() => <Separator size="xs" />}
            renderSectionHeader={({ section }) => (
              <View flexDirection="row" alignItems="center" gap={SPACINGS.xs}>
                <Typography.Text
                  label={getTranslation("features.Units.screens.Units.sectionTitle", {
                    value: ["", "A", "B", "C", "D", "E", "F"].findIndex((x) => x === section.group),
                  })}
                  variant="secondary"
                  level={600}
                  size="lg"
                  weight="medium"
                />
                {!(module.unitGroupEnabled || ["A"]).includes(section.group) && (
                  <Icon name="Lock" variant="secondary" level={400} size="sm" />
                )}
              </View>
            )}
            renderSectionFooter={({ section }) => (
              <View marginBottom={SPACINGS.xl} marginTop={SPACINGS.lg}>
                <Typography.Text
                  label={getTranslation("features.Units.screens.Units.checkpointLabel")}
                  variant="secondary"
                  level={400}
                  size="xs"
                  weight="medium"
                />
                <Separator size="sm" />
                <MasteryTestListItem moduleId={route.params.moduleId} group={section.group} />
              </View>
            )}
          />
        </View>
      </ScrollView>
    </>
  );
}
