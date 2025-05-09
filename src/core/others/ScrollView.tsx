import React, { useCallback, useImperativeHandle, useMemo, useRef, useState } from "react";
import { ScrollView as RNScrollView } from "react-native";
import { ScrollViewProps } from "react-native/Libraries/Components/ScrollView/ScrollView";

const ScrollViewContext = React.createContext<{
  setScrollEnabled: (enabled: boolean) => void;
  scrollToTop: () => void;
}>({
  setScrollEnabled: () => false,
  scrollToTop: () => false,
});

const ScrollView = React.forwardRef<RNScrollView, ScrollViewProps>((props, forwardedRef) => {
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const ref = useRef<RNScrollView | null>();

  useImperativeHandle(forwardedRef, () => ref.current!);

  const handleScrollToTop = useCallback(() => {
    ref.current?.scrollTo({ y: 0, animated: true });
  }, []);

  const providerValue = useMemo(
    () => ({
      setScrollEnabled,
      scrollToTop: handleScrollToTop,
    }),
    [setScrollEnabled]
  );

  return (
    <ScrollViewContext.Provider value={providerValue}>
      <RNScrollView {...props} ref={(sv) => (ref.current = sv)} scrollEnabled={scrollEnabled} />
    </ScrollViewContext.Provider>
  );
});

export const useScrollView = () => React.useContext(ScrollViewContext);

export default ScrollView;
