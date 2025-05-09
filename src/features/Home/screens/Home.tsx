import View from "../../../core/View";
import { COLORS } from "student-front-commons/src/consts/design-system/global/colors";
import { LinearGradient } from "expo-linear-gradient";
import { SPACINGS } from "student-front-commons/src/consts/design-system/global/spacings";
import CourseDetailsHeader from "../components/CourseDetailsHeader";
import { normalizeVerticalSize } from "@utils/sizeUtils";
import Separator from "../../../core/others/Separator";
import Typography from "../../../core/general/Typography";
import CheckpointsCardButton from "../components/CheckpointsCardButton";
import ReviewsCardButton from "../components/ReviewsCardButton";
import RecordedClassesCardButton from "../components/RecordedClassesCardButton";
import { getTranslation } from "@locales";
import ModuleSession from "../components/ModuleSession";
import HomeworkCardButton from "../components/HomeworkCardButton";

export default function Home() {
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
          height: normalizeVerticalSize(248),
          bottom: 0,
          borderBottomLeftRadius: SPACINGS.md,
          borderBottomRightRadius: SPACINGS.md,
        }}
      />
      <View margin={SPACINGS.md}>
        <CourseDetailsHeader />
        <Separator size="xl" />
        {/*<BonusTestCardButton />*/}
        {/*<Separator size="md" />*/}
        <ModuleSession />
        <Separator size="md" />
        <View gap={SPACINGS.sm}>
          <Typography.Text
            label={getTranslation("features.Home.screens.Home.journeySegmentTitle")}
            variant="secondary"
            weight="medium"
          />
          <CheckpointsCardButton />
          <ReviewsCardButton />
          <HomeworkCardButton />
          <RecordedClassesCardButton />
        </View>
      </View>
    </View>
  );
}
