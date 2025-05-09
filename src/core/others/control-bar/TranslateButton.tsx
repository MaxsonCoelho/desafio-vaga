import { useCallback, useState } from "react";
import useAppDispatch from "@commons/hooks/useAppDispatch";
import { getSelectedItemProp } from "@commons/slices/utils/itemExecutionUtils";
import useAppSelector from "@commons/hooks/useAppSelector";
import ReadAndTranslateModal, { ReadAndTranslateModalMode } from "@core/others/control-bar/ReadAndTranslateModal";
import ControlBarButton from "@core/others/control-bar/ControlBarButton";
import Popover from "@core/others/item-types/Popover";
import View from "@core/View";
import Typography from "@core/general/Typography";
import { getTranslation } from "@locales";
import { TouchableOpacity } from "react-native";
import { ItemExecutionItemStatus } from "@commons/slices/types/itemExecutionTypes";
import { translateItem } from "@commons/slices/actions/itemExecutionActions";

function TranslateButton({ disabled, isTranslationOnly }: { disabled?: boolean; isTranslationOnly?: boolean }) {
  const dispatch = useAppDispatch();
  const [showPopOver] = useState(false);

  const [translateModalOpen, setTranslateModalOpen] = useState(false);

  const itemId = useAppSelector((state) => getSelectedItemProp(state, "item.id")) as string;
  const repeatCount = useAppSelector((state) => getSelectedItemProp(state, "repeatCount")) as number;
  const executionStatus = useAppSelector((state) => getSelectedItemProp(state, "status")) as ItemExecutionItemStatus;

  const handleClick = useCallback(() => {
    // if (disabled) {
    //   if (repeatCount < 1) {
    //     setShowPopOver(true);
    //     return;
    //   }
    //   return;
    // }

    setTranslateModalOpen(true);
    dispatch(translateItem(itemId));
  }, [itemId, repeatCount, disabled, executionStatus]);

  return (
    <Popover
      isOpen={showPopOver}
      content={
        <View>
          <Typography.Text
            variant="secondary"
            level={600}
            align="center"
            weight="medium"
            label={getTranslation("core.others.control-bar.TranslateButton.popoverTitle")}
          />
        </View>
      }
    >
      <TouchableOpacity disabled={disabled} onPress={handleClick} activeOpacity={0.6}>
        <ControlBarButton
          variant="secondary"
          type="solid"
          icon="Languages"
          onPress={handleClick}
          disabled={disabled}
          labelKey="translate"
        />
      </TouchableOpacity>
      <ReadAndTranslateModal
        isTranslationOnly={isTranslationOnly}
        onClose={() => setTranslateModalOpen(false)}
        mode={ReadAndTranslateModalMode.TRANSLATE}
        isOpen={translateModalOpen}
      />
    </Popover>
  );
}

export default TranslateButton;
