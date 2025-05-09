import React from "react";
import View from "../../../core/View";
import { SPACINGS } from "student-front-commons/src/consts/design-system/global/spacings";
import UnitsStats from "./UnitsStats";
import { COLORS } from "student-front-commons/src/consts/design-system/global/colors";
import { RADIUS } from "student-front-commons/src/consts/design-system/global/radius";
import Divider from "../../../core/layout/Divider";
import CheckpointsStats from "./CheckpointsStats";
import ReviewsStats from "./ReviewsStats";
import { BlurView } from "expo-blur";
import { normalizeHorizontalSize, normalizeVerticalSize } from "@utils/sizeUtils";

function ModuleStatsSection({ moduleId }: { moduleId: string }) {
  return (
    <View
      borderColor={`${COLORS.white}1A`}
      borderWidth={1}
      borderTopRightRadius={RADIUS.md}
      borderTopLeftRadius={RADIUS.md}
    >
      <BlurView
        intensity={20}
        style={{
          backgroundColor: `${COLORS.primary[900]}33`,
          flexDirection: "row",
          paddingVertical: normalizeVerticalSize(SPACINGS.lg),
          borderTopRightRadius: normalizeVerticalSize(RADIUS.md),
          borderTopLeftRadius: normalizeVerticalSize(RADIUS.md),
          alignItems: "center",
          justifyContent: "space-evenly",
          rowGap: normalizeHorizontalSize(SPACINGS.lg),
          overflow: "hidden",
        }}
      >
        <UnitsStats moduleId={moduleId} />
        <Divider theme="dark" />
        <ReviewsStats moduleId={moduleId} />
        <Divider theme="dark" />
        <CheckpointsStats moduleId={moduleId} />
      </BlurView>
    </View>
  );
}

export default ModuleStatsSection;
