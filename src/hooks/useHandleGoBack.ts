import { getTranslation } from "@locales";
import { RootStackParamList } from "@navigators";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useCallback } from "react";
import { Alert, BackHandler } from "react-native";

export const useHandleGoBack = (
  props: { titleKey: string; descriptionKey: string; confirmButtonKey: string; dismissButtonKey: string },
  onGoBack?: () => void,
) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleBackButton = useCallback(() => {
    Alert.alert(
      getTranslation(props.titleKey),
      getTranslation(props.descriptionKey),
      [
        {
          text: getTranslation(props.dismissButtonKey),
        },
        {
          text: getTranslation(props.confirmButtonKey),
          onPress: () => {
            !!onGoBack ? onGoBack() : navigation.goBack();
          },
        },
      ],
      { cancelable: false },
    );
    return true;
  }, [onGoBack]);

  useFocusEffect(
    useCallback(() => {
      const backHandler = BackHandler.addEventListener("hardwareBackPress", handleBackButton);
      return () => backHandler.remove();
    }, []),
  );
  return handleBackButton;
};
