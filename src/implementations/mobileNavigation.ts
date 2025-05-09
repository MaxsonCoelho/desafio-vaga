import Navigation, { To } from "@commons/core/navigation";

import { createNavigationContainerRef, StackActions } from "@react-navigation/native";

export const navigationRef = createNavigationContainerRef();

export const TO_STACK_SCREEN_MAPPING: { [k in To]: string | undefined } = {
  [To.PlacementTestCompleteProfile]: "placementTestStack.placementCompleteProfileScreen",
  [To.CompleteProfile]: "completeProfileStack.completeProfileScreen",
  [To.Home]: "appStack.homeScreen",
  [To.Notifications]: "homeStack.notificationsScreen",
  [To.NewMessage]: "messageStack.newMessageScreen",
  [To.UnitExecution]: "unitStack.unitExecutionScreen",
  [To.UnitDetail]: "unitStack.unitDetailModal",
  [To.UnitList]: "unitStack.unitListScreen",
  [To.Image]: "imageStack.imageScreen",
  [To.Chat]: "messageStack.chatScreen",
  [To.Login]: "authStack.loginScreen",
  [To.KidsModal]: "authStack.kidsModalScreen",
  [To.ForgotPassword]: "authStack.forgotPasswordScreen",
  [To.ModuleList]: "homeStack.moduleListScreen",
  [To.AvatarSelection]: "completeProfileStack.avatarSelectionScreen",
  [To.UnitResult]: "unitStack.unitResultScreen",
  [To.Profile]: "appStack.profileScreen",
  [To.ClosedRanking]: "closedRankingStack.closedRankingScreen",
  [To.ExerciseHistory]: "profileStack.exerciseHistoryScreen",
  [To.Settings]: "profileStack.profileSettingsScreen",
  [To.Studies]: undefined,
  [To.RecordedClasses]: undefined,
  [To.Checkpoints]: undefined,
  [To.Reviews]: undefined,
  [To.GrammarImprovement]: undefined,
  [To.Ranking]: undefined,
  [To.LevelSelection]: "placementTestStack.LevelSelection",
  [To.Onboarding]: "placementTestStack.onboarding",
  [To.PracticeExecution]: "placementTestStack.practice",
  [To.PracticeResult]: "placementTestStack.practiceResult",
  [To.PlacementTest]: "placementTestStack.placementTest",
  [To.PlacementTestResult]: "placementTestStack.placementTestResult",
  [To.Homeworks]: "homeworkStack.homeworkListScreen",
  [To.HomeworkDetail]: "homeworkStack.homeworkDetailScreen",
  [To.UnitHomeworkDetailModal]: "homeworkStack.unitHomeworkDetailModal",
  [To.UnitHomeworkExecution]: "homeworkStack.unitHomeworkExecutionScreen",
  [To.UnitHomeworkResult]: "homeworkStack.unitHomeworkResultScreen",
};

class MobileNavigation implements Navigation {
  navigate(to: To, params?: object): void {
    if (navigationRef.isReady() && TO_STACK_SCREEN_MAPPING[to]) {
      const [stack, screen] = TO_STACK_SCREEN_MAPPING[to].split(".");
      const args = [stack, { screen, params }];
      navigationRef.navigate(...(args as never));
    }
  }

  replace(to: To, params?: object): void {
    if (navigationRef.isReady() && TO_STACK_SCREEN_MAPPING[to]) {
      const [stack, screen] = TO_STACK_SCREEN_MAPPING[to].split(".");
      navigationRef.dispatch(StackActions.replace(stack, { screen, params }));
    }
  }

  goBack(): void {
    if (navigationRef.isReady()) {
      navigationRef.dispatch(StackActions.pop());
    }
  }
}

export default MobileNavigation;
