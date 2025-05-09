import React, { useCallback, useEffect, useState } from "react";
import { TouchableOpacity } from "react-native";
import { IconNames } from "../general/Icon";
import View from "../View";
import { THEME } from "student-front-commons/src/consts/design-system/theme";
import { VARIANTS } from "student-front-commons/src/consts/design-system/global/definitions";
import Typography from "../general/Typography";
import { SPACINGS } from "student-front-commons/src/consts/design-system/global/spacings";

type SegmentButtonTheme = {
  [key in "default" | "selected"]: {
    button: {
      backgroundColor?: string;
      borderColor?: string;
      textVariant?: string;
    };
    box: {
      backgroundColor?: string;
    };
  };
};

type SharedProps = {
  type?: "solid" | "flat";
  variant?: "primary" | "accent";
  disabled?: boolean;
};

type SegmentButtonOptionProps<ValueType> = {
  label: string;
  value: ValueType;
  icon?: IconNames;
  hasNotification: boolean;
};

type SegmentButtonProps<ValueType> = SharedProps & {
  options: SegmentButtonOptionProps<ValueType>[];
  onChange: (value: ValueType) => void;
  defaultValue?: ValueType;
};

function SegmentButton<ValueType>({
  options,
  onChange,
  defaultValue,
  type = "solid",
  variant = "primary",
}: SegmentButtonProps<ValueType>) {
  const [selectedOption, setSelectedOption] = useState<ValueType>();

  useEffect(() => {
    if (defaultValue) {
      setSelectedOption(defaultValue);
      onChange?.(defaultValue);
    }
  }, [defaultValue]);

  const handleOptionSelection = useCallback(
    (value: ValueType) => {
      if (value !== selectedOption) {
        setSelectedOption(value);
        onChange?.(value);
      }
    },
    [selectedOption],
  );
  const theme = THEME.segmentButton.theme[type][variant] as SegmentButtonTheme;
  const notificationTheme = THEME.segmentButton.notification;

  return (
    <View
      backgroundColor={theme.default.box.backgroundColor}
      borderRadius={SPACINGS["5xl"]}
      padding={SPACINGS.xs}
      flexDirection="row"
      alignItems="center"
      justifyContent="space-between"
    >
      {options.map((option, key) => {
        const currentTheme = theme[option.value == selectedOption ? "selected" : "default"];
        return (
          <View key={key} flex={1}>
            <TouchableOpacity
              onPressIn={() => handleOptionSelection(option.value)}
              style={[
                option.value == selectedOption
                  ? {
                      backgroundColor: currentTheme.button.backgroundColor,
                      borderRadius: SPACINGS["4xl"],
                      height: SPACINGS["3xl"],
                      justifyContent: "center",
                    }
                  : {},
              ]}
            >
              {option.hasNotification ? (
                <View
                  position="absolute"
                  right={2}
                  top={-5}
                  width={SPACINGS.sm}
                  height={SPACINGS.sm}
                  borderWidth={SPACINGS["3xs"]}
                  borderColor={notificationTheme.borderColor}
                  borderRadius="50%"
                  backgroundColor={notificationTheme.backgroundColor}
                ></View>
              ) : null}
              {currentTheme.button?.textVariant ? (
                <Typography.Text
                  size={"sm"}
                  variant={currentTheme.button.textVariant as VARIANTS}
                  align="center"
                  weight={option.value == option ? "semibold" : "regular"}
                  label={option.label}
                />
              ) : (
                <Typography.Text
                  size={"sm"}
                  align="center"
                  weight={option.value == option ? "semibold" : "regular"}
                  label={option.label}
                />
              )}
            </TouchableOpacity>
          </View>
        );
      })}
    </View>
  );
}

export default SegmentButton;
