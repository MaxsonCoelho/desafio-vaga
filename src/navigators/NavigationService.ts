import { createNavigationContainerRef, ParamListBase } from "@react-navigation/native";

export const navigationRef = createNavigationContainerRef();

export function navigate(stack: string, screen: any, params?: any) {
  if (navigationRef.isReady()) {
    // @ts-ignore
    navigationRef.navigate(stack, { screen, params });
  }
}
