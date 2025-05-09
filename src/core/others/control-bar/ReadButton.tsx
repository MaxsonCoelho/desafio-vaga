import { useCallback, useState } from "react";
import ControlBarButton from "@core/others/control-bar/ControlBarButton";
import ReadAndTranslateModal, { ReadAndTranslateModalMode } from "@core/others/control-bar/ReadAndTranslateModal";
import { getSelectedItemProp } from "@commons/slices/utils/itemExecutionUtils";
import useAppSelector from "@commons/hooks/useAppSelector";
import useAppDispatch from "@commons/hooks/useAppDispatch";
import { readItem } from "@commons/slices/actions/itemExecutionActions";

function ReadButton({ disabled }: { disabled?: boolean }) {
  const dispatch = useAppDispatch();

  const [readModalOpen, setReadModalOpen] = useState(false);

  const itemId = useAppSelector((state) => getSelectedItemProp(state, "item.id")) as string;

  const handleClick = useCallback(() => {
    setReadModalOpen(true);
    dispatch(readItem(itemId));
  }, [itemId]);

  return (
    <>
      <ControlBarButton
        variant="secondary"
        type="solid"
        icon="Text"
        onPress={handleClick}
        disabled={disabled}
        labelKey="read"
      />
      <ReadAndTranslateModal
        isTranslationOnly={false}
        onClose={() => setReadModalOpen(false)}
        mode={ReadAndTranslateModalMode.READ}
        isOpen={readModalOpen}
      />
    </>
  );
}

export default ReadButton;
