import { useState, useEffect, useRef, useCallback } from "react";
import { Animated } from "react-native";
import Modal from "@core/feedback/Modal";
import View from "@core/View";
import Typography from "@core/general/Typography";
import Switch from "@core/data-entry/Switch";
import Button from "@core/general/Button";
import useAppSelector from "@commons/hooks/useAppSelector";
import { getSelectedItemProp } from "@commons/slices/utils/itemExecutionUtils";
import { SPACINGS } from "@commons/consts/design-system/global/spacings";
import Icon from "@core/general/Icon";
import { getTranslation } from "@locales";
import useTranslation from "@commons/hooks/useTranslation";
import { useStudent } from "@commons/contexts/StudentContext";
import { normalizeVerticalSize } from "@utils/sizeUtils";
import Separator from "@core/others/Separator";
import useAppDispatch from "@commons/hooks/useAppDispatch";
import { translateItem } from "@commons/slices/actions/itemExecutionActions";

export enum ReadAndTranslateModalMode {
  READ = "READ",
  TRANSLATE = "TRANSLATE",
}

type Props = {
  mode?: ReadAndTranslateModalMode;
  onClose: () => void;
  isOpen: boolean;
  isTranslationOnly?: boolean;
};

function ReadAndTranslateModal({
  mode = ReadAndTranslateModalMode.READ,
  onClose,
  isOpen,
  isTranslationOnly = false,
}: Props) {
  const { profile } = useStudent();
  const dispatch = useAppDispatch();

  const [showTranslation, setShowTranslation] = useState(false);

  const itemText = useAppSelector((state) => getSelectedItemProp(state, "item.text")) as string;
  const itemId = useAppSelector((state) => getSelectedItemProp(state, "item.id")) as string;

  const [, translation] = useTranslation(itemId, profile?.locale as string);

  const translateAnim = useRef(new Animated.Value(-35)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateAnim, {
        toValue: showTranslation ? 0 : -35,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: showTranslation ? 1 : 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [showTranslation]);

  useEffect(() => {
    setShowTranslation(mode === ReadAndTranslateModalMode.TRANSLATE);
  }, [isOpen]);

  const handleTranslate = useCallback(
    (shouldShow: boolean) => {
      setShowTranslation(shouldShow);
      if (shouldShow) {
        dispatch(translateItem(itemId));
      }
    },
    [itemId],
  );

  return (
    <Modal onClose={onClose} isOpen={isOpen} showCloseButton={false}>
      <View flex={1} gap={SPACINGS.xl}>
        <View justifyContent="center" alignItems="center" flexDirection="row" width="100%">
          <View alignItems="center">
            <Typography.Text
              label={getTranslation(
                `core.others.control-bar.ReadAndTranslateModal.${showTranslation ? "translateTitle" : "readTitle"}`,
              )}
              variant="secondary"
              size="lg"
              weight="medium"
              level={600}
            />
          </View>

          {!isTranslationOnly && (
            <View position="absolute" right={0}>
              <Switch
                defaultValue={mode === ReadAndTranslateModalMode.TRANSLATE}
                onChange={() => handleTranslate(!showTranslation)}
                icon="Languages"
              />
            </View>
          )}
        </View>

        <View alignItems="center" gap={SPACINGS.md}>
          <Typography.Text
            label={isTranslationOnly ? (translation as string) : itemText}
            weight="semibold"
            size="xl"
            variant="secondary"
            align="center"
            level={600}
          />
          {!isTranslationOnly && (
            <Animated.View
              style={{
                transform: [{ translateY: translateAnim }],
                opacity: opacityAnim,
                alignItems: "center",
                gap: normalizeVerticalSize(SPACINGS.md),
              }}
            >
              <Icon name="ArrowDown" variant="secondary" level={300} size="xl" />
              <Typography.Text label={translation as string} align="center" variant="secondary" size="xl" level={600} />
            </Animated.View>
          )}
        </View>
      </View>
      <Separator size="5xl" />
      <Button
        label={getTranslation("core.others.control-bar.ReadAndTranslateModal.closeButton")}
        variant="secondary"
        type="outlined"
        onPress={onClose}
        size="md"
      />
    </Modal>
  );
}

export default ReadAndTranslateModal;
