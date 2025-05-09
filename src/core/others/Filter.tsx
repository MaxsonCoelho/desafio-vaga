import React, { useCallback, useState } from "react";
import { TouchableOpacity } from "react-native";

import { uniqueId } from "lodash";

import { SPACINGS } from "@commons/consts/design-system/global/spacings";
import { COLORS } from "@commons/consts/design-system/global/colors";
import { OPACITIES } from "@commons/consts/design-system/global/opacities";

import View from "@core/View";
import Typography from "@core/general/Typography";

import ScrollView from "./ScrollView";

export type FilterOption<ValueType> = {
  label: string;
  value: ValueType;
  quantity: number;
  isDisabled?: boolean;
};

type FilterProps<ValueType> = {
  options: FilterOption<ValueType>[];
  onChange: (value: ValueType) => void;
  defaultValue: ValueType;
};

export default function Filter<ValueType>({ options, onChange, defaultValue }: FilterProps<ValueType>) {
  const [selectedOption, setSelectedOption] = useState<ValueType>(defaultValue);

  const handlePress = useCallback(
    (value: ValueType) => () => {
      if (value !== selectedOption) {
        setSelectedOption(value);
        onChange(value);
      } else {
        setSelectedOption(defaultValue);
        onChange(defaultValue);
      }
    },
    [selectedOption],
  );

  return (
    <ScrollView horizontal contentContainerStyle={{ gap: SPACINGS["2xs"] }} showsHorizontalScrollIndicator={false}>
      {options.map((option) => {
        const isSelected = option.value === selectedOption;
        return (
          <View key={uniqueId()}>
            <TouchableOpacity
              onPress={handlePress(option.value)}
              style={{
                backgroundColor: !!option?.isDisabled
                  ? OPACITIES.primary[0.2]
                  : isSelected
                    ? COLORS.white
                    : COLORS.primary[600],
                borderRadius: SPACINGS["4xl"],
                paddingVertical: SPACINGS["2xs"],
                paddingHorizontal: SPACINGS.sm,
              }}
              disabled={!!option.isDisabled}
            >
              <Typography.Text
                label={`${option.label} (${option.quantity})`}
                variant={!!option?.isDisabled ? "primary" : isSelected ? "secondary" : undefined}
                level={!!option?.isDisabled ? 400 : 600}
                weight="medium"
              />
            </TouchableOpacity>
          </View>
        );
      })}
    </ScrollView>
  );
}
