import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { EventSubscription } from "expo-modules-core";
import * as ScreenOrientation from "expo-screen-orientation";

const OrientationContext = React.createContext<{
  isOrientationChanging: boolean;
  setOrientation: (orientation: ScreenOrientation.OrientationLock) => void;
}>({
  isOrientationChanging: false,
  setOrientation: () => false,
});

export default function OrientationContextProvider({ children }: { children: React.ReactNode }) {
  const [isOrientationChanging, setIsOrientationChanging] = useState(false);

  const subscription = useRef<EventSubscription>();

  useEffect(() => {
    subscription.current = ScreenOrientation.addOrientationChangeListener(() => {
      setTimeout(() => setIsOrientationChanging(false), 500);
    });
    return () => subscription.current?.remove();
  }, []);

  const setOrientation = useCallback((orientation: ScreenOrientation.OrientationLock) => {
    setIsOrientationChanging(true);
    setTimeout(() => ScreenOrientation.lockAsync(orientation), 500);
  }, []);

  const providerValue = useMemo(() => {
    return {
      isOrientationChanging,
      setOrientation,
    };
  }, [isOrientationChanging]);

  return <OrientationContext.Provider value={providerValue}>{children}</OrientationContext.Provider>;
}

export const useOrientation = () => React.useContext(OrientationContext);
