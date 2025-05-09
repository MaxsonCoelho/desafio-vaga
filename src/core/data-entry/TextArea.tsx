import React, { useMemo } from "react";
import { TextInput } from "react-native-paper";
import { THEME } from "student-front-commons/src/consts/design-system/theme";
import { COLORS } from "student-front-commons/src/consts/design-system/global/colors";
import { RADIUS } from "student-front-commons/src/consts/design-system/global/radius";
import Typography from "../general/Typography";
import View from "../View";
import { SPACINGS } from "student-front-commons/src/consts/design-system/global/spacings";
import { normalizeHorizontalSize, normalizeVerticalSize } from "@utils/sizeUtils";

type Props = {
  /** The label of the text field */
  label?: string;
  /** Disables the text field when set to true */
  disabled?: boolean;
  /** Supporting text displayed below the text field */
  supportingText?: string;
  /** Placeholder text to be displayed when the text field is empty */
  placeholder?: string;
  /** Function to be called when the text in the text field changes */
  onChange?: (e: string) => void;
  /** When the text input has an error */
  errorMessage?: string;
  /** If the text field is required. If so, an "*" will be shown next to the label */
  required?: boolean;
  /** The value of the text field */
  value?: string;
  /** The max length of text */
  maxLength?: number;
};

function TextArea({
  label,
  supportingText,
  disabled,
  onChange,
  errorMessage,
  value,
  placeholder,
  required = false,
  ...props
}: Props) {
  const inputStateTheme = THEME.input.state;

  const changeableStyles = useMemo(() => {
    if (disabled) {
      return inputStateTheme.disabled;
    }
    return inputStateTheme.default;
  }, [disabled]);

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
        multiline={true}
        outlineStyle={{
          borderWidth: 1,
          margin: 0,
          borderRadius: normalizeVerticalSize(RADIUS.md),
        }}
        contentStyle={{
          margin: 0,
          minHeight: normalizeVerticalSize(132),
          lineHeight: normalizeVerticalSize(24),
          fontSize: normalizeVerticalSize(16),
          color: COLORS.secondary[700],
          paddingBottom: normalizeVerticalSize(8),
          paddingTop: normalizeVerticalSize(8),
          paddingRight: normalizeHorizontalSize(36),
        }}
        style={{
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
        }}
        mode="outlined"
        dense
        outlineColor={changeableStyles.borderColor}
        activeOutlineColor={inputStateTheme.focus.borderColor}
        placeholderTextColor={COLORS.secondary[400]}
        error={!!errorMessage}
        keyboardType="default"
        autoCapitalize="sentences"
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

export default TextArea;
