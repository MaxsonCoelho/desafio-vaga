import { enableScreens } from "react-native-screens";
import * as Sentry from "@sentry/react-native";
import Constants from "expo-constants";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import {
  Inter_100Thin,
  Inter_200ExtraLight,
  Inter_300Light,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
  Inter_900Black,
  useFonts,
} from "@expo-google-fonts/inter";
import {
  InterTight_400Regular_Italic,
  InterTight_600SemiBold_Italic,
  InterTight_700Bold_Italic,
  InterTight_900Black_Italic,
} from "@expo-google-fonts/inter-tight";
import Root from "./src/index";

enableScreens();

if (Constants.expoConfig?.extra?.sentryDsn) {
  Sentry.init({
    dsn: Constants.expoConfig.extra.sentryDsn,
    release: Constants.expoConfig.extra.sentryRelease,
    environment: Constants.expoConfig.extra.appEnvironment,
    attachStacktrace: true,
    normalizeDepth: 10,
    // tracesSampleRate: Constants.expoConfig.extra.appEnvironment === "production" ? 0.3 : 1.0,
    // integrations: [new Sentry.Native.ReactNativeTracing()],
    ignoreErrors: ["InvalidTokenError", "Execution blocked due time", "Invalid or expired token", "invalid_app_state"],
    beforeSend: (event, hint) => {
      const error = hint.originalException as { message: string };
      const exceptionsToFilterOut =
        /invalid password|invalid or expired token|execution blocked due time|invalid_app_state/i;
      if (error && error.message && error.message.match(exceptionsToFilterOut)) {
        return null;
      }
      return event;
    },
  });
}

export default function App() {
  const [fonstLoaded] = useFonts({
    Inter_100Thin,
    Inter_200ExtraLight,
    Inter_300Light,
    Inter_400Regular,
    InterTight_400Regular_Italic,
    Inter_500Medium,
    Inter_600SemiBold,
    InterTight_600SemiBold_Italic,
    Inter_700Bold,
    InterTight_700Bold_Italic,
    Inter_800ExtraBold,
    Inter_900Black,
    InterTight_900Black_Italic,
  });

  if (!fonstLoaded) {
    return null;
  }
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <Root />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
