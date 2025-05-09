import { useMemo, useRef } from "react";
import { ViewStyle } from "react-native/Libraries/StyleSheet/StyleSheetTypes";
import { normalizeHorizontalSize, normalizeVerticalSize } from "@utils/sizeUtils";
import { isEqual } from "lodash";

const verticalAndHorizontalProperties = ["padding", "margin"];
const horizontalProperties = [
  "width",
  "maxWidth",
  "minWidth",
  "marginLeft",
  "marginRight",
  "paddingLeft",
  "paddingRight",
  "paddingHorizontal",
  "marginHorizontal",
  "rowGap",
  "left",
  "right",
];
const verticalProperties = [
  "height",
  "maxHeight",
  "minHeight",
  "marginTop",
  "marginBottom",
  "paddingTop",
  "paddingBottom",
  "paddingVertical",
  "marginVertical",
  "columnGap",
  "top",
  "bottom",
];

function useNormalizeStyle(style: Partial<ViewStyle>) {
  const prevStyleRef = useRef(style);

  if (!isEqual(style, prevStyleRef.current)) {
    prevStyleRef.current = style;
  }

  const normalizedStyles = useMemo(() => {
    const normalizedStyle: { [K in keyof ViewStyle]?: ViewStyle[K] | number } = {};

    Object.entries(style).forEach(([key, value]) => {
      const typedKey = key as keyof ViewStyle;

      if (typeof value === "number") {
        if (key === "gap") {
          normalizedStyle[`columnGap` as keyof ViewStyle] = normalizeVerticalSize(value);
          normalizedStyle[`rowGap` as keyof ViewStyle] = normalizeHorizontalSize(value);
        } else if (verticalAndHorizontalProperties.some((property) => property === key)) {
          normalizedStyle[`${typedKey}Vertical` as keyof ViewStyle] = normalizeVerticalSize(value);
          normalizedStyle[`${typedKey}Horizontal` as keyof ViewStyle] = normalizeHorizontalSize(value);
        } else if (horizontalProperties.includes(key)) {
          normalizedStyle[typedKey] = normalizeHorizontalSize(value);
        } else if (verticalProperties.includes(key)) {
          normalizedStyle[typedKey] = normalizeVerticalSize(value);
        } else {
          normalizedStyle[typedKey] = value;
        }
      } else {
        normalizedStyle[typedKey] = value as never;
      }
    });

    if ((style["height"] as number) > 0 && (style["width"] as number) > 0 && style["height"] === style["width"]) {
      // If the height and width are the same, we can assume that it's a square and normalize it as a vertical size to keep the aspect ratio
      normalizedStyle["width"] = normalizeVerticalSize(style["width"] as number);
      normalizedStyle["height"] = normalizeVerticalSize(style["height"] as number);
    }

    return normalizedStyle;
  }, [prevStyleRef.current]);

  return normalizedStyles as ViewStyle;
}

export default useNormalizeStyle;
