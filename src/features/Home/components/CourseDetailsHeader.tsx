import React, { useMemo } from "react";
import { View as NativeView } from "react-native";
import { useStudent } from "student-front-commons/src/contexts/StudentContext";
import { SPACINGS } from "student-front-commons/src/consts/design-system/global/spacings";
import View from "@core/View";
import Typography from "@core/general/Typography";
import { COLORS } from "student-front-commons/src/consts/design-system/global/colors";
import { normalizeHorizontalSize, normalizeVerticalSize } from "@utils/sizeUtils";
import { getTranslation } from "@locales";
import ProgressBar from "@core/data-display/ProgressBar";
import useAppSelector from "@commons/hooks/useAppSelector";
import { getProgressByCourse } from "@commons/slices/entity";

function CourseDetailsHeader() {
  const { currentCourse } = useStudent();

  const progress = useAppSelector((state) => getProgressByCourse(state, currentCourse?.course.id ?? ""));

  const courseLevelDescription = useMemo(() => {
    if (!currentCourse) return "";
    return (
      {
        "Pre A1": "Beginner",
        A1: "Basic",
        "A1+": "Basic",
        A2: "Intermediate",
        "A2+": "Intermediate",
        B1: "Intermediate",
        "B1+": "Intermediate",
        B2: "Advanced",
        "B2+": "Advanced",
        C1: "Advanced",
        C2: "Advanced",
      }[currentCourse.course.name] ?? currentCourse.course.name
    );
  }, [currentCourse]);

  if (!currentCourse) return null;
  return (
    <View gap={SPACINGS.md}>
      <View flexDirection="row" alignItems="center" gap={SPACINGS.xs}>
        <NativeView
          style={{
            alignItems: "center",
            justifyContent: "center",
            borderRadius: SPACINGS["5xl"],
            backgroundColor: COLORS.primary[600],
            borderWidth: normalizeHorizontalSize(2),
            height: normalizeVerticalSize(40),
            width: normalizeVerticalSize(40),
            borderColor: COLORS.secondary[400],
          }}
        >
          <Typography.Text
            label={currentCourse.course.key === "PRE-A1" ? "PA1" : currentCourse.course.name}
            size="sm"
            weight="semibold"
          />
        </NativeView>
        <View>
          <Typography.Text
            label={getTranslation("features.Home.components.CourseDetailsHeader.title")}
            size="xs"
            variant="secondary"
            level={400}
          />
          <Typography.Text label={courseLevelDescription} size="lg" weight="semibold" />
        </View>
      </View>
      <ProgressBar progress={progress ?? 0} variant="success" theme="dark" />
    </View>
  );
}

export default CourseDetailsHeader;
