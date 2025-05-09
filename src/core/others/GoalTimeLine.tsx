import { SPACINGS } from "@commons/consts/design-system/global/spacings";
import ProgressBar from "@core/data-display/ProgressBar";
import View from "@core/View";
import { useEffect, useMemo, useRef, useState } from "react";
import ObjectiveFlagSvg from "@features/UnitResult/assets/circle-objective-flag.svg";
import CompletedFireGoal from "@features/UnitResult/assets/completed-fire-goal.svg";
import Typography from "@core/general/Typography";
import LinearFireGoal from "@features/UnitResult/assets/linear-fire-goal.svg";
import FireGoal from "@features/UnitResult/assets/fire-goal.svg";
import { LEVELS, VARIANTS } from "@commons/consts/design-system/global/definitions";
import NextFireGoalSvg from "@features/UnitResult/assets/next-fire-goal.svg";
import LottieView from "lottie-react-native";
import useMotion from "@commons/hooks/useMotion";
import { MotionTarget, MotionType } from "@commons/core/motionStages";
import ConfigStore from "@commons/configStore";
import useShowMotion from "@commons/hooks/useShowMotion";

export const MILESTONE_DAYS = [7, 14, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330, 365];
const LOTTIE_DAY_SOURCE = {
  [7]: require("@features/UnitResult/assets/lotties/sprint-fire/day_7.json"),
  [14]: require("@features/UnitResult/assets/lotties/sprint-fire/day_14.json"),
  [28]: require("@features/UnitResult/assets/lotties/sprint-fire/day_28.json"),
  [64]: require("@features/UnitResult/assets/lotties/sprint-fire/day_64.json"),
};

function GapProgressBar({ progress, hide }: { progress: number; hide?: boolean }) {
  return (
    <View marginTop={SPACINGS.xl} flexGrow={1} opacity={hide ? 0 : 1}>
      <ProgressBar progress={progress} variant="danger" hideProgress size="2xs" />
    </View>
  );
}

function StartFlag() {
  return (
    <View>
      <ObjectiveFlagSvg />
    </View>
  );
}

function SideFireBucketText({ value, next = false }: { value: number; next?: boolean }) {
  const variant = next ? "secondary" : undefined;
  const level = next ? 400 : undefined;
  return (
    <View
      width="100%"
      alignItems="center"
      justifyContent="center"
      alignSelf="center"
      position="absolute"
      zIndex={2}
      height={80}
      paddingTop={SPACINGS.sm}
    >
      <Typography.Title italic label={value} variant={variant} level={level} size="xs" weight="bold" />
    </View>
  );
}

function CompletedGoal({ goal }: { goal: number }) {
  return (
    <View>
      <CompletedFireGoal />
      <SideFireBucketText value={goal} />
    </View>
  );
}

function FireBucketText({ value, variant, level }: { value: number; variant?: VARIANTS; level?: LEVELS }) {
  return (
    <View
      width="100%"
      alignItems="center"
      justifyContent="center"
      alignSelf="center"
      position="absolute"
      zIndex={2}
      height={90}
      paddingTop={SPACINGS.lg}
    >
      <Typography.Title italic label={value} variant={variant} level={level} size="sm" weight="semibold" />
    </View>
  );
}

function CurrentGoal({
  goal,
  achieved,
  showLottie,
  playLottie,
}: {
  goal: number;
  achieved: boolean;
  showLottie?: boolean;
  playLottie?: boolean;
}) {
  const lottieRef = useRef<LottieView>(null);
  const audioInstanceRef = useRef(ConfigStore.getAudioInstance().newInstance());

  const playAudio = async () => {
    await audioInstanceRef.current.prepare();
    await audioInstanceRef.current.load({
      fileUrl: require("../../features/UnitResult/assets/audios/fire.mp3"),
      isProjectFile: true,
    });
    await audioInstanceRef.current.play();
  };

  useEffect(() => {
    if (!!lottieRef.current && playLottie) {
      lottieRef.current.play();
      playAudio();
    }
  }, [playLottie, lottieRef.current]);

  if (showLottie && achieved && goal in LOTTIE_DAY_SOURCE) {
    return (
      <View width={91} height={91} alignItems="center">
        <LottieView
          style={{
            width: 91,
            height: 120,
            bottom: -9,
            position: "absolute",
          }}
          ref={lottieRef}
          loop={false}
          source={LOTTIE_DAY_SOURCE[goal as keyof typeof LOTTIE_DAY_SOURCE]}
        />
      </View>
    );
  }

  return (
    <View justifyContent="center">
      {!achieved && <LinearFireGoal />}
      {achieved && <FireGoal />}
      <FireBucketText value={goal} variant={achieved ? undefined : "danger"} level={achieved ? undefined : 600} />
    </View>
  );
}

function NextGoal({ goal }: { goal: number }) {
  return (
    <View justifyContent="center">
      <NextFireGoalSvg />
      <SideFireBucketText value={goal} next />
    </View>
  );
}

export default function GoalTimeline({
  studiedDays,
  goalAchieved,
  nextGoal,
  previousGoal,
  shouldAnimate,
  playLottie,
}: {
  studiedDays: number;
  goalAchieved: boolean;
  nextGoal: number;
  previousGoal: number;
  shouldAnimate?: boolean;
  playLottie?: boolean;
}) {
  const nextNextGoal = useMemo(
    () => MILESTONE_DAYS.find((goal) => goal > (goalAchieved ? studiedDays : nextGoal)) || 0,
    [nextGoal, goalAchieved],
  );

  const previousProgress = useMemo(() => {
    return ((studiedDays - 1 - previousGoal) / (nextGoal - previousGoal)) * 100;
  }, []);

  const currentProgress = useMemo(() => {
    return goalAchieved ? 100 : ((studiedDays - previousGoal) / (nextGoal - previousGoal)) * 100;
  }, []);

  const fillProgress = useShowMotion(MotionTarget.UnitResultSprintProgressBar, MotionType.Fill);

  return (
    <View
      width="100%"
      flexDirection="row"
      alignItems="center"
      justifyContent="space-between"
      gap={SPACINGS.sm}
      paddingTop={SPACINGS.md}
      height={120}
    >
      <GapProgressBar progress={100} hide={studiedDays <= 7} />
      {studiedDays <= 7 && <StartFlag />}
      {studiedDays > 7 && <CompletedGoal goal={previousGoal || 0} />}
      <GapProgressBar
        progress={shouldAnimate ? (fillProgress ? currentProgress : previousProgress) : currentProgress}
      />
      <CurrentGoal
        goal={goalAchieved ? studiedDays : nextGoal || 0}
        achieved={goalAchieved}
        showLottie={shouldAnimate}
        playLottie={playLottie}
      />
      <GapProgressBar progress={0} />
      <NextGoal goal={nextNextGoal} />
      <GapProgressBar progress={0} />
    </View>
  );
}
