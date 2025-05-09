import { useCallback } from "react";
import View from "@core/View";
import useAppSelector from "@commons/hooks/useAppSelector";
import Button from "@core/general/Button";
import { getItemExecutionType } from "@commons/slices/selectors/itemExecutionSelectors";
import { ItemTypeKey } from "@commons/models/itemTypeModel";
import { getLastItemByTypeKey } from "@commons/slices/execution";
import Item from "@commons/models/itemModel";
import ConfigStore from "@commons/configStore";
import { To } from "@commons/core/navigation";
import { ItemExecutionItemStatus } from "@commons/slices/types/itemExecutionTypes";
import { getSelectedItemProp } from "@commons/slices/utils/itemExecutionUtils";

function ControlBarLastImageItemButton() {
  const imageItem = useAppSelector((state) => getLastItemByTypeKey(state, ItemTypeKey.IMAGE)) as Item;
  const executionItemType = useAppSelector(getItemExecutionType);
  const status = useAppSelector((state) => getSelectedItemProp(state, "status")) as ItemExecutionItemStatus;

  const handlePress = useCallback(() => {
    ConfigStore.getNavigationInstance().navigate(To.Image, {
      title: "",
      images: [imageItem?.image],
    });
  }, [imageItem?.image]);

  if (
    !imageItem ||
    ItemExecutionItemStatus.INITIAL !== status ||
    executionItemType === ItemTypeKey.MULTIPLE_CHOICE_TEXT
  ) {
    return null;
  }

  return (
    <View position="absolute" bottom={160} alignItems="center" width="100%">
      <View width={200}>
        <Button
          icon="Image"
          label="Verificar imagem"
          variant="secondary"
          type="outlined"
          size="lg"
          onPress={handlePress}
        />
      </View>
    </View>
  );
}

export default ControlBarLastImageItemButton;
