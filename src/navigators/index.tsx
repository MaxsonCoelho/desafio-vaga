import * as React from "react";
import { useCallback } from "react";
import { NavigationContainer, NavigatorScreenParams } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AuthNavigation, { AuthStackParamList } from "./AuthNavigation";
import AppNavigation, { AppStackParamList } from "./AppNavigation";
import { navigationRef } from "@implementations/mobileNavigation";
import StudentContextProvider from "student-front-commons/src/contexts/StudentContext";
import Profile from "student-front-commons/src/models/profileModel";
import UnitNavigation, { UnitStackParams } from "./UnitNavigation";
import ConfigStore from "@commons/configStore";
import { To } from "@commons/core/navigation";
import OrientationContextProvider from "../contexts/OrientationContext";
import useService from "@commons/hooks/useService";
import LocalizationService from "@commons/services/localizationService";
import locales, { updateLanguageContent } from "@locales";
import dayjs from "dayjs";
import UnitExecutionProvider from "@commons/contexts/UnitExecutionProvider";

export type RootStackParamList = {
  authStack: NavigatorScreenParams<AuthStackParamList>;
  appStack: NavigatorScreenParams<AppStackParamList>;
  unitStack: NavigatorScreenParams<UnitStackParams>;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function Navigator() {
  const [, callGetLabels] = useService(LocalizationService.getLabelsByType, {
    autoStart: false,
    onData: (labels) => {
      updateLanguageContent(labels);
    },
  });

  const handleLoaded = useCallback((profile: Profile | undefined) => {
    if (!profile) {
      return;
    }

    callGetLabels({ type: "NEW_STUDENT_MOBILE" });

    if ((profile.currentEnglishLevel || 0) >= 1.5) {
      locales.setLanguage("en");
      dayjs.locale("en");
    } else {
      locales.setLanguage(profile.locale);
      dayjs.locale({ en: "en", pt: "pt-br", es: "es" }[profile.locale] || "en");
    }

    const navigation = ConfigStore.getNavigationInstance();
    navigation.replace(To.Home);
  }, []);

  return (
    <StudentContextProvider onLoaded={handleLoaded}>
      <NavigationContainer ref={navigationRef}>
        <OrientationContextProvider>
          <UnitExecutionProvider>
              <Stack.Navigator screenOptions={{ gestureEnabled: false, headerShown: false }}>
              <Stack.Screen name="authStack" component={AuthNavigation} />
              <Stack.Screen name="appStack" component={AppNavigation} />
              <Stack.Screen name="unitStack" component={UnitNavigation} />
              </Stack.Navigator>
          </UnitExecutionProvider>
        </OrientationContextProvider>
      </NavigationContainer>
    </StudentContextProvider>
  );
}
