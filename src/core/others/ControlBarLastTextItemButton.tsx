import { useCallback, useState } from "react";
import View from "@core/View";
import Button from "@core/general/Button";
import Modal from "@core/feedback/Modal";
import { SPACINGS } from "@commons/consts/design-system/global/spacings";
import { getSelectedItemProp } from "@commons/slices/utils/itemExecutionUtils";
import useAppSelector from "@commons/hooks/useAppSelector";
import Typography from "@core/general/Typography";
import { getLastItemByTypeKey } from "@commons/slices/execution";
import { ItemTypeKey } from "@commons/models/itemTypeModel";
import Item from "@commons/models/itemModel";
import { ItemExecutionItemStatus } from "@commons/slices/types/itemExecutionTypes";
import { getTranslation } from "@locales";

function ControlBarLastTextItemButton() {
  const textItem = useAppSelector((state) => getLastItemByTypeKey(state, ItemTypeKey.TEXT)) as Item;
  const [isOpen, setOpen] = useState(false);
  const status = useAppSelector((state) => getSelectedItemProp(state, "status")) as ItemExecutionItemStatus;

  const handlePress = useCallback(() => {
    setOpen(!isOpen);
  }, [isOpen]);

  if (!textItem || ![ItemExecutionItemStatus.INITIAL, ItemExecutionItemStatus.READY_FOR_INTERACTION].includes(status)) {
    return null;
  }

  return (
    <View position="absolute" bottom={160} alignItems="center" width="100%">
      <View width={200}>
        <Button
          icon="FileText"
          label={getTranslation("core.others.ControlBarLastTextItemButton.label")}
          variant="secondary"
          type="outlined"
          size="lg"
          onPress={handlePress}
        />
      </View>
      <Modal
        title={getTranslation("core.others.ControlBarLastTextItemButton.title")}
        isOpen={isOpen}
        onClose={handlePress}
      >
        <View
          paddingHorizontal={SPACINGS.xl}
          paddingVertical={SPACINGS.xl}
          justifyContent="flex-start"
          alignItems="center"
          flex={1}
        >
          <Typography.RichText variant="secondary" label={textItem.text} size="md" level={600} />
        </View>
      </Modal>
    </View>
  );
}

export default ControlBarLastTextItemButton;
