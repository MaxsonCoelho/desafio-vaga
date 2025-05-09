import React from "react";
import View from "../View";
import Separator from "./Separator";
import Button from "../general/Button";
import AvatarIcon from "../general/AvatarIcon";
import Typography from "../general/Typography";
import { IconNames } from "../general/Icon";
import Modal, { ModalProps } from "../feedback/Modal";
import { getTranslation } from "@locales";
import { SPACINGS } from "@commons/consts/design-system/global/spacings";
import { camelCase } from "lodash";

enum KnownErrors {
  USER_DISABLED = "user_disabled",
  INVALID_ROLE = "invalid_role",
  OUT_OF_DEMO_PERIOD = "out_of_demo_period",
  PLACEMENT_ONLY_STUDENT_ALREADY_FINISH_TEST = "placement_only_student_already_finish_test",
}

export type ErrorModalProps = {
  error:
    | KnownErrors.USER_DISABLED
    | KnownErrors.INVALID_ROLE
    | KnownErrors.OUT_OF_DEMO_PERIOD
    | KnownErrors.PLACEMENT_ONLY_STUDENT_ALREADY_FINISH_TEST
    | string;
  onClose: ModalProps["onClose"];
};

function ErrorModal({ error, onClose }: ErrorModalProps) {
  const isKnownError = Object.values(KnownErrors).includes(error as KnownErrors);

  return (
    <Modal isOpen onClose={onClose}>
      <View flex={1} height={375} alignItems="center" paddingHorizontal={SPACINGS["3xl"]} paddingBottom={SPACINGS.xl}>
        <View position="relative" marginTop={SPACINGS.md}>
          <AvatarIcon
            name={
              ({
                user_disabled: "User",
                invalid_role: "ShieldX",
                out_of_demo_period: "CalendarX",
                placement_only_student_already_finish_test: "CheckCheck",
              }[error] as IconNames) || "X"
            }
            variant="secondary"
            level={600}
            size="xl"
          />
          <View position="absolute" right={-8} top={-8}>
            <AvatarIcon name="CircleAlert" variant="danger" level={700} size="md" />
          </View>
        </View>
        <Separator size="md" />
        <Typography.Text
          label={getTranslation(`core.others.ErrorModal.${isKnownError ? camelCase(error) : "unknown"}.title`)}
          weight="semibold"
          variant="secondary"
          level={700}
          size="lg"
        />
        <Separator size="xs" />
        <Typography.Text
          label={getTranslation(`core.others.ErrorModal.${isKnownError ? camelCase(error) : "unknown"}.description`)}
          align="center"
          variant="secondary"
          level={700}
        />
        <View width="100%" marginTop="auto">
          <Button
            variant="primary"
            label={getTranslation(`core.others.ErrorModal.${isKnownError ? camelCase(error) : "unknown"}.buttonLabel`)}
            size="md"
            onPress={onClose}
          />
        </View>
      </View>
    </Modal>
  );
}

export default ErrorModal;
