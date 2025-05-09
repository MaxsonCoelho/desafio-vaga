import React, { useMemo, useState } from "react";
import { Dimensions } from "react-native";
import { TextInput } from "react-native-paper";
import { THEME } from "student-front-commons/src/consts/design-system/theme";
import { COLORS } from "student-front-commons/src/consts/design-system/global/colors";
import { RADIUS } from "student-front-commons/src/consts/design-system/global/radius";
import Typography from "../general/Typography";
import View from "../View";
import Icon, { IconNames } from "../general/Icon";
import { SPACINGS } from "student-front-commons/src/consts/design-system/global/spacings";
import { normalizeHorizontalSize, normalizeVerticalSize } from "@utils/sizeUtils";

type Props = {
  /** The label of the text field */
  label?: string;
  /** Disables the text field when set to true */
  disabled?: boolean;
  /** Name of the lucid icon */
  icon?: IconNames;
  /** Positioning of the icon inside the text field */
  iconPosition?: "trailing" | "leading";
  /** Supporting text displayed below the text field */
  supportingText?: string;
  /** Placeholder text to be displayed when the text field is empty */
  placeholder?: string;
  /** Function to be called when the text in the text field changes */
  onChange?: (e: string) => void;
  /** When the text input has an error */
  errorMessage?: string;
  /** The type of the text field. */
  type?: "default" | "email" | "password";
  /** If the text field is required. If so, an "*" will be shown next to the label */
  required?: boolean;
  /** The value of the text field */
  value?: string;
  /** The max length of text */
  maxLength?: number;
};

function TextField({
  label,
  icon,
  iconPosition = "leading",
  supportingText,
  disabled,
  onChange,
  errorMessage,
  type = "default",
  value,
  placeholder,
  required = false,
  ...props
}: Props) {
  const { width } = Dimensions.get("window");

  const [hideTextContent, setHideTextContent] = useState(type === "password");

  const inputStateTheme = THEME.input.state;
  const leadingIcon = icon && iconPosition === "leading";
  const trailingIcon = icon && iconPosition === "trailing";

  const changeableStyles = useMemo(() => {
    if (disabled) {
      return inputStateTheme.disabled;
    }
    return inputStateTheme.default;
  }, [disabled]);

  const styles = useMemo(() => {
    return {
      height: normalizeVerticalSize(44),
      padding: 0,
      margin: 0,
      backgroundColor: changeableStyles.backgroundColor,
      borderColor: changeableStyles.borderColor,
      ...(errorMessage
        ? {
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.5,
            shadowRadius: 4,
            elevation: 4,
            shadowColor: COLORS.danger[400],
          }
        : {}),
    };
  }, [changeableStyles]);

  return (
    <View width="100%" gap={SPACINGS["2xs"]} position="relative">
      {label && (
        <View flexDirection="row" gap={SPACINGS["3xs"]}>
          <Typography.Text label={label} variant="secondary" level={600} weight="medium" />
          {required ? <Typography.Text level={600} variant="danger" label="*" /> : null}
        </View>
      )}
      <TextInput
        {...props}
        placeholder={placeholder}
        onChangeText={onChange}
        disabled={disabled}
        value={value}
        outlineStyle={{
          borderWidth: 1,
          margin: 0,
          borderRadius: normalizeVerticalSize(RADIUS.md),
        }}
        contentStyle={{
          margin: 0,
          marginLeft: normalizeHorizontalSize(leadingIcon ? 36 : 0),
          marginRight: normalizeHorizontalSize(trailingIcon ? 36 : 0),
          fontSize: normalizeVerticalSize(16),
          color: COLORS.secondary[700],
          paddingBottom: normalizeVerticalSize(1),
          paddingTop: normalizeVerticalSize(1),
          paddingRight: normalizeHorizontalSize(36),
        }}
        style={styles}
        mode="outlined"
        dense
        outlineColor={changeableStyles.borderColor}
        activeOutlineColor={inputStateTheme.focus.borderColor}
        placeholderTextColor={COLORS.secondary[400]}
        error={!!errorMessage}
        secureTextEntry={hideTextContent}
        keyboardType={type === "email" ? "email-address" : "default"}
        autoCapitalize={["email", "password"].includes(type) ? "none" : "sentences"}
        right={
          trailingIcon || type === "password" ? (
            <TextInput.Icon
              icon={() => (
                <Icon
                  name={type === "password" ? (hideTextContent ? "Eye" : "EyeOff") : (icon as IconNames)}
                  variant="secondary"
                  size="md"
                />
              )}
              onPress={() => (type === "password" ? setHideTextContent(!hideTextContent) : null)}
              style={{
                position: "absolute",
                right: normalizeHorizontalSize(width >= 600 ? 0 : -18),
                pointerEvents: type === "password" ? "auto" : "none",
              }}
              disabled={disabled}
            />
          ) : null
        }
        left={
          leadingIcon ? (
            <TextInput.Icon
              disabled={disabled}
              icon={() => <Icon name={icon} variant="secondary" size="md" />}
              style={{
                position: "absolute",
                left: normalizeHorizontalSize(width >= 600 ? 0 : -18),
                pointerEvents: "none",
              }}
            />
          ) : null
        }
      />
      {supportingText || errorMessage ? (
        <View position="absolute" bottom={-23}>
          <Typography.Text
            label={errorMessage || supportingText || ""}
            variant={errorMessage ? "danger" : "secondary"}
            level={600}
          />
        </View>
      ) : null}
    </View>
  );
}

export default TextField;
