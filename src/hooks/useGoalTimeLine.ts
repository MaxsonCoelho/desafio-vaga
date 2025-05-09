import StudentSprint from "@commons/models/studentSprintModel";
import { useMemo } from "react";
import { MILESTONE_DAYS } from "../core/others/GoalTimeLine";

export function useGoalTimeLine(studentSprint: StudentSprint) {
  const studiedDays: number = useMemo(() => studentSprint?.days, [studentSprint]);

  const goalAchieved = useMemo(() => MILESTONE_DAYS.includes(studiedDays), [studiedDays]);

  const nextGoal = useMemo(() => MILESTONE_DAYS.find((goal) => goal > studiedDays) || 0, [studiedDays]);

  const previousGoal = useMemo(() => MILESTONE_DAYS.find((goal) => goal < studiedDays) || 0, [studiedDays]);
  return {
    studiedDays,
    goalAchieved,
    nextGoal,
    previousGoal,
  };
}
