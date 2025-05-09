import React from "react";
import { Image } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Modules from "../features/Modules/screens/Modules";
import Home from "../features/Home/screens/Home";
import IconButton from "../core/general/IconButton";
import FlexgeBalloon from "../assets/flexge_balloon.png";
import { COLORS } from "student-front-commons/src/consts/design-system/global/colors";
import Typography from "../core/general/Typography";
import { getTranslation } from "@locales";
import { normalizeVerticalSize } from "@utils/sizeUtils";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useStudent } from "@commons/contexts/StudentContext";
import View from "@core/View";
import { SPACINGS } from "@commons/consts/design-system/global/spacings";

export type CourseStackParamList = {
  homeScreen: undefined;
  moduleListScreen: undefined;
};

const Stack = createNativeStackNavigator<CourseStackParamList>();

export default function CourseNavigation() {
  const { handleCleanData } = useStudent();

  return (
    <Stack.Navigator
      screenOptions={() => ({
        contentStyle: {
          backgroundColor: COLORS.secondary[200],
        },
        headerTitle: "",
        headerBackVisible: false,
        headerShadowVisible: false,
        headerStyle: { backgroundColor: COLORS.primary[800] },
      })}
    >
      <Stack.Screen
        name="homeScreen"
        options={({ navigation }) => ({
          headerLeft: () => (
            <Image
              source={FlexgeBalloon}
              style={{ width: normalizeVerticalSize(32), height: normalizeVerticalSize(32) }}
            />
          ),
          headerRight: () => (
            <View flexDirection="row" alignItems="center" gap={SPACINGS["2xs"]}>
              <IconButton
                theme="dark"
                icon="LogOut"
                variant="secondary"
                type="ghost"
                onPress={() => {
                  AsyncStorage.clear().then(() => {
                    navigation.replace("authStack");
                    handleCleanData();
                  });
                }}
              />
            </View>
          ),
        })}
        component={Home}
      />
      <Stack.Screen
        name="moduleListScreen"
        options={({ navigation }) => ({
          headerLeft: () => <IconButton onPress={navigation.goBack} icon="ChevronLeft" variant="primary" />,
          headerTitleAlign: "center",
          headerTitle: () => (
            <Typography.Text
              align="center"
              size="md"
              weight="semibold"
              label={getTranslation("navigators.CourseNavigation.moduleTitle")}
            />
          ),
        })}
        component={Modules}
      />
    </Stack.Navigator>
  );
}
