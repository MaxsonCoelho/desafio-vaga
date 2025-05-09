import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Units from "../features/Units/screens/Units";
import UnitDetailModal from "@features/Units/screens/UnitDetailModal";
import UnitExecution from "@features/UnitExecution/screens/UnitExecution";
import { COLORS } from "@commons/consts/design-system/global/colors";
import View from "@core/View";
import Typography from "@core/general/Typography";

export type UnitStackParams = {
  unitListScreen: { moduleId: string };
  unitDetailModal: {
    unitId: string;
    moduleId: string;
    isContinueAllowed: boolean;
    unitTypeName: string;
  };
  unitExecutionScreen: { unitId: string; moduleId: string };
  unitResultScreen: { unitId: string; moduleId: string; executionId: string; homeworkId: undefined };
};

function UnitResultScreen() {
  return (
    <View width="100%" height="100%" justifyContent="center" alignItems="center">
      <Typography.Text label="Unit completed" variant="secondary" level={800} />
    </View>
  );
}

const Stack = createNativeStackNavigator<UnitStackParams>();

export default function UnitNavigation() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="unitListScreen" options={{ headerShown: false }} component={Units} />
      <Stack.Screen
        name="unitDetailModal"
        options={{ headerShown: false, presentation: "transparentModal", animation: "fade" }}
        component={UnitDetailModal}
      />
      <Stack.Screen
        name="unitExecutionScreen"
        options={{
          headerShown: false,
          contentStyle: { backgroundColor: COLORS.secondary[200] },
          gestureEnabled: false,
        }}
        component={UnitExecution}
      />
      <Stack.Screen name="unitResultScreen" options={{ headerShown: false }} component={UnitResultScreen} />
    </Stack.Navigator>
  );
}
