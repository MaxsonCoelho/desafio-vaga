import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "../features/Login/screens/Login";
import LoginFromStorageContainer from "../features/Login/screens/LoginFromStorageContainer";
import KidsModal from "../features/Login/screens/KidsModal";
import IconButton from "../core/general/IconButton";
import View from "../core/View";
import { SPACINGS } from "student-front-commons/src/consts/design-system/global/spacings";

export type AuthStackParamList = {
  loginFromStorage: undefined;
  loginScreen: undefined;
  forgotPasswordScreen: undefined;
  loadInitialDataScreen: undefined;
  kidsModalScreen: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthNavigation() {
  return (
    <Stack.Navigator
      screenOptions={({ navigation }) => ({
        headerShadowVisible: false,
        headerTitle: "",
        headerLeft: () => (
          <View padding={SPACINGS.xs}>
            <IconButton onPress={navigation.goBack} icon="ArrowLeft" variant="secondary" />
          </View>
        ),
      })}
    >
      <Stack.Screen name="loginFromStorage" options={{ headerShown: false }} component={LoginFromStorageContainer} />
      <Stack.Screen name="loginScreen" options={{ headerShown: false }} component={Login} />
      <Stack.Screen
        name="kidsModalScreen"
        options={{ headerShown: false, presentation: "transparentModal" }}
        component={KidsModal}
      />
    </Stack.Navigator>
  );
}
