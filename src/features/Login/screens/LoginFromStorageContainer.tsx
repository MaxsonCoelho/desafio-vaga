import React, { useCallback, useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Dimensions, Platform } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import Constants from "expo-constants";
import useService from "@commons/hooks/useService";
import ConfigStore from "@commons/configStore";
import AuthenticationService from "@commons/services/authenticationService";
import { RootStackParamList } from "@navigators";
import LogoImage from "@assets/logo.svg";
import { COLORS } from "@commons/consts/design-system/global/colors";
import View from "@core/View";
import { useStudent } from "@commons/contexts/StudentContext";
import { useWhitelabelConfig } from "@commons/contexts/WhitelabelConfigContext";
import Loader from "@core/others/Loader";
import { SPACINGS } from "@commons/consts/design-system/global/spacings";

SplashScreen.preventAutoHideAsync();

function LoginFromStorageContainer() {
  const { loading } = useWhitelabelConfig();
  const { handleLoadData, isLoading } = useStudent();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [isLogin, callAuth] = useService(AuthenticationService.login, {
    autoStart: false,
    onData: () => {
      handleLoadData();
    },
    onError: (error) => {
      navigation.navigate("authStack", { screen: "loginScreen" });
    },
  });

  const handleVerifyAndReAuth = useCallback(async () => {
    const loginData = await ConfigStore.getLoginData();
    if (loginData) {
      callAuth({
        email: loginData.email as string,
        password: loginData.password as string,
        browser: Platform.Version.toString(),
        internetSpeed: "-",
        distributor: Constants?.expoConfig?.extra?.distributor,
        company: Constants?.expoConfig?.extra?.company,
        os: Platform.OS,
        screenSize: `${Dimensions.get("window").width}_${Dimensions.get("window").height}`,
      });
    } else {
      navigation.navigate("authStack", { screen: "loginScreen" });
    }
  }, []);

  useEffect(() => {
    void handleVerifyAndReAuth();
  }, []);

  useEffect(() => {
    if (!loading && !isLoading && !isLogin) {
      SplashScreen.hideAsync();
    }
  }, [isLoading, loading, isLogin]);

  return (
    <View height="100%">
      <LinearGradient
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
        }}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        colors={[COLORS.primary[800]!, COLORS.primary[500]!]}
      >
        <View height="100%" width="100%" justifyContent="center" alignItems="center" marginLeft={10} gap={SPACINGS.sm}>
          <LogoImage />

          <View marginLeft={-10}>
            <Loader />
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}

export default LoginFromStorageContainer;
