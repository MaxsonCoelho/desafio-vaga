import { DateTime } from "luxon";
import React, { useEffect, useRef, useState } from "react";
import { SPACINGS } from "student-front-commons/src/consts/design-system/global/spacings";
import View from "@core/View";
import Typography from "@core/general/Typography";
import ContinueAllowed from "../assets/continue-allowed-icon.svg";
import { getTranslation } from "@locales";

function UnitContinueCountdown({
  remainingTimeToContinue,
  onCountdownEnd,
}: {
  remainingTimeToContinue: number;
  onCountdownEnd: () => void;
}) {
  const timerId = useRef<ReturnType<typeof setInterval>>();

  const [diffTime, setDiffTime] = useState<number>(remainingTimeToContinue);
  const [timeRemaining, setTimeRemaining] = useState<string>();

  useEffect(() => {
    setDiffTime(remainingTimeToContinue);
  }, [remainingTimeToContinue]);

  useEffect(() => {
    timerId.current = setInterval(() => {
      setDiffTime((prevState) => {
        return prevState - 1 / 60;
      });
    }, 1000);

    if (diffTime <= 0) {
      onCountdownEnd();
      clearInterval(timerId.current);
    }

    const time = DateTime.fromObject({
      minute: Math.floor(diffTime),
      second: Math.floor((diffTime % 1) * 60),
    }).toFormat("mm:ss");
    setTimeRemaining(time);

    return () => clearInterval(timerId.current);
  }, [diffTime, onCountdownEnd]);

  if (!timeRemaining) return null;

  return (
    <View width="100%" paddingLeft={SPACINGS.md} marginTop={SPACINGS.xs} flexDirection="row" gap={SPACINGS.sm}>
      <ContinueAllowed width={16} height={16} />
      <Typography.Text
        label={getTranslation("features.Units.components.UnitContinueCountdown.label", { timeRemaining })}
        variant="primary"
        level={500}
        size="xs"
        weight="medium"
      />
    </View>
  );
}

export default UnitContinueCountdown;
