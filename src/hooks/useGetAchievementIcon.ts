import { useEffect, useState } from "react";

import useService from "@commons/hooks/useService";
import Achievement, { AchievementLevel, AchievementType } from "@commons/models/achievement";
import { SelectedRanking } from "@commons/models/rankingModel";
import achievementsService from "@commons/services/achievementsService";

function getIcon(
  achievements: Achievement[],
  selectedRanking: SelectedRanking,
  position: number | null,
): string | undefined {
  return achievements
    ?.find((val) => val.level == convertSelectedRankingToAchievementLevel(selectedRanking))
    ?.iconByPosition.find((icon) => icon.position == position)?.icon;
}

function convertSelectedRankingToAchievementLevel(selectedRanking: SelectedRanking): AchievementLevel | null {
  switch (selectedRanking) {
    case SelectedRanking.INSTITUTIONAL:
      return AchievementLevel.SCHOOL;
    case SelectedRanking.NATIONAL:
      return AchievementLevel.NATIONAL;
    case SelectedRanking.REGIONAL:
      return AchievementLevel.REGIONAL;
    default:
      return null;
  }
}

export type IconByPosition = Record<number, string | undefined>;

export default function useGetAchievementIcon({
  selectedRanking,
  positions,
  type,
}: {
  selectedRanking: SelectedRanking;
  positions: (number | null)[];
  type: AchievementType;
}) {
  const [achievements, setAchievements] = useState<Achievement[]>();

  const [isFetchingAchievements, getAchievements] = useService(achievementsService.getAchievements, {
    onData(data) {
      setAchievements(data);
    },
  });

  useEffect(() => {
    getAchievements({ type });
  }, [type]);

  const iconsByPositions = positions.reduce<IconByPosition>((acc, position) => {
    if (!position) return acc;
    acc[position] = getIcon(achievements as Achievement[], selectedRanking, position);
    return acc;
  }, {});

  return {
    isFetchingAchievements,
    iconsByPositions,
  };
}
