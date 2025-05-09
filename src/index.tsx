import React, { useEffect, useMemo } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Sentry from "@sentry/react-native";
import Constants from "expo-constants";
import { useLocales } from "expo-localization";
import * as Notifications from "expo-notifications";
import { Platform, StatusBar } from "react-native";
import { Provider } from "react-redux";
import StudentFrontCommons from "student-front-commons/src";
import WhitelabelProvider from "@commons/contexts/WhitelabelConfigContext";
import store from "@commons/store";
import MobileMediaCache from "@implementations/mobileMediaCache";
import MobileNavigation from "@implementations/mobileNavigation";
import MobileRecordMedia from "@implementations/mobileRecordMedia";
import locales from "@locales";
import AppNavigation from "@navigators";
import { PayloadAction } from "@reduxjs/toolkit";
import { FlowType } from "@commons/slices/flow";
import { To } from "@commons/core/navigation";
import MobileVideoMedia from "@implementations/mobileVideoMedia";
import { sagaMiddleware, storeCallbacks } from "@commons/store/middlewares";
import flows from "@commons/flows";
import "dayjs/locale/en";
import "dayjs/locale/es";
import "dayjs/locale/pt-br";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";
import MobileAudioMedia from "@implementations/MobileAudioMedia";

dayjs.extend(duration);
dayjs.extend(relativeTime);
dayjs.extend(utc);

storeCallbacks.onSagaError = (error, extra) => {
  Sentry.withScope((scope) => {
    scope.setTag("location", "generic-saga-error-handler");
    scope.setExtra("error", JSON.stringify(error));
    scope.setExtra("saga-stack", extra.sagaStack);
    Sentry.captureException(error);
  });
};

storeCallbacks.onFlowStart = (action: PayloadAction<{ id: FlowType; params: unknown }>) => {
  Sentry.addBreadcrumb({
    type: "info",
    category: "flow",
    level: "info",
    message: `start flow ${action.payload.id}`,
    data: {
      flowId: action.payload.id,
      flowStatus: "start",
      flowParams: action.payload.params || null,
    },
  });
};

storeCallbacks.onFlowEnd = (action: PayloadAction<{ id: FlowType; error: Error }>) => {
  Sentry.addBreadcrumb({
    type: "info",
    category: "flow",
    level: "info",
    message: `end flow ${action.payload.id}`,
    data: {
      flowId: action.payload.id,
      flowStatus: "end",
      flowError: action.payload.error ? JSON.stringify(action.payload.error) : null,
    },
  });
};

const defaultErrorHandler = ErrorUtils.getGlobalHandler();
ErrorUtils.setGlobalHandler((error: any, isFatal?: boolean) => {
  Sentry.withScope((scope) => {
    scope.setTag("location", "error-utils-handler");
    scope.setExtra("error", JSON.stringify(error));
    scope.setExtra("isFatal", isFatal);
    Sentry.captureException(error);
  });

  defaultErrorHandler(error, isFatal);
});

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const mobileNavigation = new MobileNavigation();

sagaMiddleware.run(flows);

export default function Root() {
  const phoneLocales = useLocales();

  const firstLocale = useMemo(() => {
    return phoneLocales.at(0)?.languageCode || "en";
  }, [phoneLocales]);

  useEffect(() => {
    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("flexge-notifications", {
        name: "Flexge Notifications",
        importance: Notifications.AndroidImportance.DEFAULT,
        vibrationPattern: [0, 250, 250, 250],
      });
    }
  }, []);

  useEffect(() => {
    locales.setLanguage(firstLocale);

    dayjs.locale({ en: "en", pt: "pt-br", es: "es" }[firstLocale] || "en");
  }, [firstLocale]);

  return (
    <StudentFrontCommons
      environment={Constants.expoConfig?.extra?.appEnvironment}
      domain={Constants.expoConfig?.extra?.domain}
      videoImplementation={new MobileVideoMedia()}
      cacheImplementation={new MobileMediaCache()}
      recordImplementation={new MobileRecordMedia()}
      audioImplementation={new MobileAudioMedia()}
      navigationImplementation={mobileNavigation}
      endpointUrl={Constants.expoConfig?.extra?.apiUrl}
      assetsUrl={Constants.expoConfig?.extra?.assetsUrl}
      speechRecognitionKey="AT1ZuvIgaS3qmmMWAUXf47XgbQIJiLUba6cAfYf5"
      speechRecognitionEndpointUrl="https://services.flexge.com/speech-recognition"
      setToken={async (token: string) => await AsyncStorage.setItem("accessToken", token)}
      getToken={async () => await AsyncStorage.getItem("accessToken")}
      onLogout={async () => {
        await AsyncStorage.removeItem("loginData");
        await AsyncStorage.removeItem("accessToken");
        mobileNavigation.navigate(To.Login);
      }}
      setLoginData={async (email: string, password: string) => {
        await AsyncStorage.setItem("loginData", JSON.stringify({ email, password }));
      }}
      getLoginData={async () => {
        const loginData = await AsyncStorage.getItem("loginData");
        if (loginData) {
          return JSON.parse(loginData);
        }
        return null;
      }}
    >
      <WhitelabelProvider>
        <Provider store={store}>
          <StatusBar barStyle="light-content" translucent={true} />
          <AppNavigation />
        </Provider>
      </WhitelabelProvider>
    </StudentFrontCommons>
  );
}
