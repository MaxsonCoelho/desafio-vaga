import React, { useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import CourseNavigation, { CourseStackParamList } from "./CourseNavigation";
import { NavigatorScreenParams } from "@react-navigation/native";
import Icon from "../core/general/Icon";
import { getTranslation } from "@locales";
import { SPACINGS } from "@commons/consts/design-system/global/spacings";
import { COLORS } from "@commons/consts/design-system/global/colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TYPOGRAPHY } from "@commons/consts/design-system/global/typography";
import { useStudent } from "@commons/contexts/StudentContext";
import IconButton from "@core/general/IconButton";
import Typography from "@core/general/Typography";
import ConfigStore from "@commons/configStore";
import View from "@core/View";
import DefaultHeader from "@core/others/DefaultHeader";
import { To } from "@commons/core/navigation";

export type AppStackParamList = {
  homeStack: NavigatorScreenParams<CourseStackParamList>;
  rankingStack: NavigatorScreenParams<undefined>;
  profileScreen: undefined;
  messageScreen: undefined;
};

const Tab = createBottomTabNavigator<AppStackParamList>();

export default function AppNavigation() {
  const insets = useSafeAreaInsets();
  const [count, setCount] = React.useState(0);

  const { unreadChatsCount, profile } = useStudent();

  useEffect(() => {
    if (unreadChatsCount !== undefined) {
      if (unreadChatsCount > 9) {
        setCount(9);
      } else {
        setCount(unreadChatsCount);
      }
    }
  }, [unreadChatsCount]);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          height: insets.bottom + 60,
        },
        tabBarIconStyle: {
          marginTop: SPACINGS.sm,
        },
        tabBarLabelStyle: {
          marginBottom: SPACINGS.xs,
          fontWeight: 500,
          fontSize: TYPOGRAPHY.fontSize.normal.xs,
        },
        tabBarInactiveTintColor: COLORS.secondary[400],
        tabBarActiveTintColor: COLORS.primary[700],
        tabBarIcon: ({ focused }) => {
          const variant = focused ? "primary" : "secondary";
          const level = focused ? 700 : 400;
          return {
            homeStack: <Icon name="GraduationCap" variant={variant} level={level} size="lg" />,
            rankingStack: <Icon name="Trophy" variant={variant} level={level} size="lg" />,
            profileScreen: <Icon name="Cog" variant={variant} level={level} size="lg" />,
            messageScreen: (
              <View>
                <Icon name="MessageSquareText" variant={variant} level={level} size="lg" />
                {count > 0 && (
                  <View
                    position="absolute"
                    top={-SPACINGS["2xs"]}
                    right={-SPACINGS["xs"]}
                    backgroundColor={COLORS.danger[500]}
                    borderWidth={1}
                    borderColor="white"
                    borderRadius={"100%"}
                    width={20}
                    height={20}
                    justifyContent="flex-start"
                    alignItems="center"
                  >
                    <Typography.Text label={count.toString()} weight="semibold" size="xs" />
                  </View>
                )}
              </View>
            ),
          }[route.name];
        },
      })}
    >
      <Tab.Screen
        name="homeStack"
        options={{ tabBarLabel: getTranslation("navigators.AppNavigation.homeTabLabel") }}
        component={CourseNavigation}
      />
      {!!profile?.rankingParticipant && (
        <Tab.Screen
          name="rankingStack"
          options={{
            tabBarLabel: getTranslation("navigators.AppNavigation.rankingTabLabel"),
          }}
          component={View}
        />
      )}
      <Tab.Screen
        name="messageScreen"
        options={{
          headerShown: true,
          tabBarLabel: getTranslation("navigators.AppNavigation.messagesTabLabel"),
          header: () => (
            <DefaultHeader
              headerRight={
                <IconButton
                  icon="Plus"
                  variant="accent"
                  size="md"
                  onPress={() => {
                    ConfigStore.getNavigationInstance().navigate(To.NewMessage);
                  }}
                />
              }
              headerLeft={
                <Typography.Text
                  label={getTranslation("navigators.AppNavigation.messagesTitle")}
                  weight="semibold"
                  size="md"
                  ellipsize
                />
              }
            />
          ),
        }}
        component={View}
      />
      <Tab.Screen
        name="profileScreen"
        options={{ tabBarLabel: getTranslation("navigators.AppNavigation.profileTabLabel") }}
        component={View}
      />
    </Tab.Navigator>
  );
}
