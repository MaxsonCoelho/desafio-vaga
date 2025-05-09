import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
import { Dimensions, Image, Platform } from "react-native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import ApiError from "@commons/exceptions/apiError";
import useForm from "@commons/hooks/useForm";
import useService from "@commons/hooks/useService";
import { isEmail, isRequired } from "@commons/validators";
import { AcademicPlanKey } from "@commons/models/academicPlanTypes";
import { COLORS } from "@commons/consts/design-system/global/colors";
import { SPACINGS } from "@commons/consts/design-system/global/spacings";
import AuthenticationService from "@commons/services/authenticationService";
import { RootStackParamList } from "@navigators";
import View from "@core/View";
import Button from "@core/general/Button";
import SafeAreaView from "@core/SafeAreaView";
import Separator from "@core/others/Separator";
import ErrorModal from "@core/others/ErrorModal";
import Typography from "@core/general/Typography";
import BottomSheet from "@core/others/BottomSheet";
import TextField from "@core/data-entry/TextField";
import LogoImage from "@assets/logo.png";
import Constants from "expo-constants";
import { getTranslation } from "@locales";
import { useStudent } from "@commons/contexts/StudentContext";
import ConfigStore from "@commons/configStore";
import CharactersImage from "@features/Login/assets/characters.png";
import KeyboardAvoidingView from "@core/KeyboardAvoidingView";
import { normalizeVerticalSize, SCREEN_WIDTH } from "@utils/sizeUtils";
import { useKeyboardHeight } from "src/hooks/useKeyboardHeight";

function Login() {
  const { handleLoadData } = useStudent();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [error, setError] = useState<ApiError | undefined>();
  const [isLoadingLoginAndProfile, setIsLoadingLoginAndProfile] = useState(false);

  const [, call] = useService(AuthenticationService.login, {
    autoStart: false,
    onData: async ({ academicPlanKey }) => {
      if (academicPlanKey === AcademicPlanKey.KIDS) {
        setIsLoadingLoginAndProfile(false);
        navigation.navigate("authStack", { screen: "kidsModalScreen" });
      } else {
        await ConfigStore.setLoginData(form.getValue("email"), form.getValue("password"));
        handleLoadData();
      }
    },
    onError: (e) => {
      setError(e);
      setIsLoadingLoginAndProfile(false);
    },
  });

  const form = useForm<{ email: string; password: string }>({
    initialValues: { email: "", password: "" },
    validations: {
      email: [
        isRequired({ errorMessage: getTranslation("validations.required") }),
        isEmail({ errorMessage: getTranslation("validations.email") }),
      ],
      password: [isRequired({ errorMessage: getTranslation("validations.required") })],
    },
    onSubmit: (values) => {
      if (values.email && values.password) {
        setIsLoadingLoginAndProfile(true);
        call({
          email: values.email as string,
          password: values.password as string,
          browser: Platform.Version.toString(),
          internetSpeed: "-",
          distributor: Constants?.expoConfig?.extra?.distributor,
          company: Constants?.expoConfig?.extra?.company,
          os: Platform.OS,
          screenSize: `${Dimensions.get("window").width}_${Dimensions.get("window").height}`,
        });
      }
    },
  });

  const handleChange = useCallback((path: "email" | "password", value: string) => {
    setError(undefined);
    form.setValue(path, value.trim());
  }, []);

  const handleCloseErrorModal = useCallback(() => {
    setError(undefined);
  }, []);
  const keyboardHeight = useKeyboardHeight();

  useEffect(() => {
    return () => {
      setIsLoadingLoginAndProfile(false);
    };
  }, []);

  return (
    <SafeAreaView
      edges={["top"]}
      width="100%"
      height="100%"
      flex={1}
      justifyContent="space-between"
      backgroundColor={COLORS.white}
    >
      <LinearGradient
        start={{ x: 0, y: 0.2 }}
        end={{ x: 0, y: 0.7 }}
        colors={[COLORS.primary[800]!, COLORS.primary[500]!]}
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          height: Dimensions.get("window").height - keyboardHeight,
        }}
      />
      <KeyboardAvoidingView>
        <Separator size="lg" />
        <View position="relative" flex={1} alignItems="center" justifyContent="space-between">
          <View height={40} width={84}>
            <Image
              style={{
                resizeMode: "contain",
                flex: 1,
                height: null,
                width: null,
              }}
              source={LogoImage}
            />
          </View>
          <View bottom={0} gap={SPACINGS.xs} alignItems="center" paddingBottom={SPACINGS.xl}>
            <Image
              source={CharactersImage}
              style={{
                resizeMode: "contain",
                flex: 1,
                bottom: normalizeVerticalSize(-16),
                position: "absolute",
                width: SCREEN_WIDTH,
              }}
            />
            <LinearGradient
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1.1 }}
              colors={["transparent", COLORS.primary[800]!]}
              style={{
                position: "absolute",
                height: 144,
                width: "100%",
                bottom: -10,
                opacity: 0.7,
              }}
            />
            <Typography.Title
              label={getTranslation("features.Login.screens.title")}
              size="sm"
              weight="semibold"
              align="center"
            />
            <View width="100%" flexDirection="row" gap={SPACINGS["2xs"]}>
              <Typography.Text label={getTranslation("features.Login.screens.subTitle")} size="sm" />
              <Typography.Text label={getTranslation("features.Login.screens.subTitleBold")} size="sm" weight="bold" />
            </View>
          </View>
        </View>
        <BottomSheet>
          <View flex={1} justifyContent="space-between">
            <View width="100%">
              <Typography.Text
                weight="semibold"
                variant="secondary"
                align="center"
                level={700}
                size="lg"
                label={getTranslation("features.Login.screens.cardTitle")}
              />
              <Separator size="lg" />
              <TextField
                value={form.getValue("email")}
                placeholder={getTranslation("features.Login.screens.emailPlaceholder")}
                label={getTranslation("features.Login.screens.emailLabel")}
                type="email"
                disabled={isLoadingLoginAndProfile}
                onChange={(value) => handleChange("email", value)}
                errorMessage={
                  (error &&
                    error.name === "email_not_found" &&
                    getTranslation("features.Login.screens.emailNotFoundError")) ||
                  (error &&
                    error.name === "invalid_fields" &&
                    JSON.parse(error.message).some((e: any) => e.context.key === "email") &&
                    getTranslation("features.Login.screens.emailInvalidError")) ||
                  form.getError("email")?.toString()
                }
              />
              <Separator size="3xl" />
              <TextField
                value={form.getValue("password")}
                label={getTranslation("features.Login.screens.passwordLabel")}
                disabled={isLoadingLoginAndProfile}
                type="password"
                onChange={(value) => handleChange("password", value)}
                errorMessage={
                  (error &&
                    error.name === "invalid_password" &&
                    getTranslation("features.Login.screens.passwordError")) ||
                  form.getError("password")?.toString()
                }
              />
            </View>
            <Separator size="3xl" />
            <View width="100%">
              <Button
                label={getTranslation("features.Login.screens.enter")}
                variant="accent"
                size="md"
                disabled={isLoadingLoginAndProfile}
                onPress={form.submit}
                loading={isLoadingLoginAndProfile}
              />
              <Separator size="md" />
              <Button
                size="md"
                label={getTranslation("features.Login.screens.recoverPassword")}
                onPress={() => navigation.navigate("authStack", { screen: "forgotPasswordScreen" })}
                type="ghost"
                variant="secondary"
                disabled={isLoadingLoginAndProfile}
              />
            </View>
          </View>
        </BottomSheet>
        {error && !["email_not_found", "invalid_password", "invalid_fields"].includes(error.name) && (
          <ErrorModal error={error.name} onClose={handleCloseErrorModal} />
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export default Login;
