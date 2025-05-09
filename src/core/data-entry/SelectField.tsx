import { SPACINGS } from "@commons/consts/design-system/global/spacings";
import Modal from "@core/feedback/Modal";
import Icon from "@core/general/Icon";
import Typography from "@core/general/Typography";
import View from "@core/View";
import { normalizeHorizontalSize } from "@utils/sizeUtils";
import React, { useMemo, useState } from "react";
import { Image, ImageSourcePropType, TouchableOpacity } from "react-native";
import { RADIUS } from "@commons/consts/design-system/global/radius";
import { THEME } from "@commons/consts/design-system/theme";

interface Option<T> {
  title: string;
  iconUri: ImageSourcePropType;
  obj: T;
}

interface SelectFieldProps<T> {
  label?: string;
  disabled?: boolean;
  value: string;
  onChange: (obj: T) => void;
  options: Option<T>[] | Omit<Option<T>, "iconUri">[];
  title: string;
}

export function SelectField<T>({ label, disabled, options, value, title, onChange }: SelectFieldProps<T>) {
  const [modalOpen, setModalOpen] = useState(false);

  const inputStateTheme = THEME.input.state;

  const changeableStyles = useMemo(() => {
    if (disabled) {
      return inputStateTheme.disabled;
    }
    return inputStateTheme.default;
  }, [disabled]);

  const toggleModal = () => {
    setModalOpen((state) => !state);
  };

  return (
    <View gap={SPACINGS["2xs"]}>
      {label && <Typography.Text label={label} variant="secondary" level={600} weight="medium" />}
      <TouchableOpacity
        style={{
          width: "100%",
          height: 44,
          backgroundColor: changeableStyles.backgroundColor,
          borderColor: changeableStyles.borderColor,
          borderWidth: 1,
          borderRadius: RADIUS.md,
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: SPACINGS.md,
          flexDirection: "row",
        }}
        onPress={toggleModal}
        disabled={disabled}
      >
        <Typography.Text label={value} variant="secondary" level={700} size="md" />
        <Icon name="ChevronRight" variant="secondary" level={600} strokeWidth={SPACINGS["2xs"]} size="md" />
      </TouchableOpacity>
      <Modal isOpen={modalOpen} showCloseButton={false} onClose={toggleModal}>
        <Typography.Text label={title} variant="secondary" level={600} size="lg" weight="semibold" />
        <View gap={normalizeHorizontalSize(SPACINGS.md)} marginTop={SPACINGS.xl}>
          {options.map((option, index) => (
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: normalizeHorizontalSize(SPACINGS.sm),
              }}
              onPress={() => {
                onChange(option.obj);
                toggleModal();
              }}
              key={index}
            >
              {"iconUri" in option && (
                <Image
                  source={option.iconUri}
                  style={{ height: 40, borderRadius: SPACINGS.lg, width: 40, resizeMode: "contain" }}
                />
              )}
              <Typography.Text label={option.title} variant="secondary" />
            </TouchableOpacity>
          ))}
        </View>
      </Modal>
    </View>
  );
}
