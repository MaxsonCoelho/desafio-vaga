import { useEffect, useState } from "react";
import { Keyboard } from "react-native";

export function useKeyboardHeight() {
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const keyboardDidShow = Keyboard.addListener("keyboardDidShow", (event) =>
      setKeyboardHeight(event.endCoordinates.height),
    );
    const keyboardDidHide = Keyboard.addListener("keyboardDidHide", () => setKeyboardHeight(0));
    return () => {
      keyboardDidShow.remove();
      keyboardDidHide.remove();
    };
  }, []);

  return keyboardHeight;
}
