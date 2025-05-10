import React from "react";
import Typography from "@core/general/Typography";
import useAppSelector from "@commons/hooks/useAppSelector";
import { getSelectedItemProp } from "@commons/slices/utils/itemExecutionUtils";
import View from "@core/View";

export default function SingleChoiceTextHeader() {
  const itemText = useAppSelector((state) => getSelectedItemProp(state, "item.text")) as string;

  if (!itemText) return null;

  return (
    <View paddingHorizontal={24}>
      <Typography.Text
        label={itemText}
        size="xl"
        level={600}
        weight="semibold"
        variant="secondary"
        align="center"
      />
    </View>
  );
}
