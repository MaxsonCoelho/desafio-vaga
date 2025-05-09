import { Platform, Text as RnText, TextStyle } from "react-native";
import { COLORS } from "student-front-commons/src/consts/design-system/global/colors";
import {
  LEVELS,
  NORMAL_SIZES,
  VARIANTS,
  WEIGHTS,
} from "student-front-commons/src/consts/design-system/global/definitions";
import { THEME } from "student-front-commons/src/consts/design-system/theme";
import { normalizeVerticalSize } from "@utils/sizeUtils";
import { StyleProp } from "react-native/Libraries/StyleSheet/StyleSheet";
import { get } from "lodash";
import React, { useCallback, useMemo } from "react";
import { DefaultTreeAdapterTypes, parseFragment } from "parse5";
import { ChildNode } from "parse5/dist/tree-adapters/default";
import * as WebBrowser from "expo-web-browser";

type TextNode = DefaultTreeAdapterTypes.TextNode;

export type TypographyProps = {
  /** The text label to be displayed. */
  label: string | number;
  /** The color variant of the text. This determines the color of the text based on the design system. */
  variant?: VARIANTS;
  /** The size of the text. This corresponds to font sizes and line height defined in the design system. */
  size?: NORMAL_SIZES;
  /** The weight of the text. This affects the font thickness. */
  weight?: WEIGHTS;
  /** The level of the text within a specific variant. This is used for colored text variants with shades. Only relevant when using a `variant`.*/
  level?: LEVELS;
  /** The alignment of the text. This affects the horizontal alignment of the text within its container. */
  align?: "left" | "center" | "right";
  /** Whether the text should be underlined. */
  underlined?: boolean;
  /** Whether the text should be in italic style */
  italic?: boolean;
  /** Whether the text should be ellipsized. */
  ellipsize?: boolean;
  /** The opacity of the text. This affects the transparency of the text. */
  opacity?: number;
  /** The function to be called when the text is pressed. */
  onPress?: () => void;
};

type VariantProps = Omit<TypographyProps, "variant" | "level"> & {
  /** The color variant of the text. This determines the color and shade of the text based on the design system. */
  variant: VARIANTS;
  /** The level of the text within a specific variant. This is used for colored text variants with shades. Only relevant when using a `variant`.*/
  level: LEVELS;
};

function Text({
  label,
  size = "sm",
  weight = "regular",
  variant,
  align,
  underlined,
  italic,
  opacity = 1,
  ellipsize,
  onPress,
  ...props
}: TypographyProps | VariantProps) {
  const typographySize = THEME.typography.dimensions.normal[size];

  const style: StyleProp<TextStyle> = {
    fontSize: normalizeVerticalSize(typographySize.fontSize),
    lineHeight: normalizeVerticalSize(typographySize.lineHeight),
    color: "",
    opacity,
    ...(align ? { textAlign: align } : {}),
    ...(underlined ? { textDecorationLine: "underline" as "underline" } : {}),
    fontFamily: Platform.select({
      ios: get(THEME.typography.fontFamily, italic ? `${weight}_italic` : weight),
      android: get(THEME.typography.fontFamily, italic ? `${weight}_italic` : weight),
    }),
  };

  if (!variant) {
    style.color = COLORS.white;
  } else {
    const { level = 500 } = props as VariantProps;
    style.color = COLORS[variant][level] as string;
  }

  return (
    <RnText onPress={onPress} style={style} {...(ellipsize && { numberOfLines: 1 })} ellipsizeMode="tail">
      {label}
    </RnText>
  );
}

type TitleProps = Omit<TypographyProps, "size"> & {
  size?: NORMAL_SIZES | "2xl";
};

function Title({
  label,
  size = "sm",
  weight = "regular",
  variant,
  align,
  underlined,
  italic,
  opacity = 1,
  ...props
}: TitleProps | VariantProps) {
  const typographySize = THEME.typography.dimensions.display[size];

  const style = {
    fontSize: normalizeVerticalSize(typographySize.fontSize),
    lineHeight: normalizeVerticalSize(typographySize.lineHeight),
    color: "",
    opacity,
    ...(align ? { textAlign: align } : {}),
    ...(underlined ? { textDecorationLine: "underline" as "underline" } : {}),
    fontFamily: Platform.select({
      ios: get(THEME.typography.fontFamily, italic ? `${weight}_italic` : weight),
      android: get(THEME.typography.fontFamily, italic ? `${weight}_italic` : weight),
    }),
  };

  if (!variant) {
    style.color = COLORS.white;
  } else {
    const { level = 500 } = props as VariantProps;
    style.color = COLORS[variant][level] as string;
  }

  return <RnText style={style}>{label}</RnText>;
}

type RichTextNode = {
  type: "text" | "paragraph" | "link" | "bold" | "italic" | "underline" | "break" | "title" | "subtitle";
  value?: string;
  children?: RichTextNode[];
  url?: string;
};

function RichText({
  label,
  size = "sm",
  variant,
  level,
  ellipsize,
}: Omit<TypographyProps & { label: string }, "weight" | "italic" | "underlined">) {
  const recursiveNodeConverter = useCallback((nodes: ChildNode[]): RichTextNode[] => {
    return nodes.map((node) => {
      if (node.nodeName === "#text") {
        return {
          type: "text",
          value: (node as TextNode).value as string,
        };
      }
      if (node.nodeName === "p") {
        return {
          type: "paragraph",
          children: recursiveNodeConverter(node.childNodes),
        };
      }
      if (node.nodeName === "a") {
        const rawUrl = node.attrs.find((attr: any) => attr.name === "href")?.value ?? "";
        const cleanedUrl = rawUrl.replace(/\\+/g, "").replace(/^[\"'“”]+|[\"'“”]+$/g, "");
        return {
          type: "link",
          url: cleanedUrl,
          children: recursiveNodeConverter(node.childNodes),
        };
      }
      if (node.nodeName === "strong" || node.nodeName === "b") {
        return {
          type: "bold",
          children: recursiveNodeConverter(node.childNodes),
        };
      }
      if (node.nodeName === "em" || node.nodeName === "i") {
        return {
          type: "italic",
          children: recursiveNodeConverter(node.childNodes),
        };
      }
      if (node.nodeName === "u") {
        return {
          type: "underline",
          children: recursiveNodeConverter(node.childNodes),
        };
      }
      if (node.nodeName === "br") {
        return {
          type: "break",
        };
      }
      if (node.nodeName === "title") {
        return {
          type: "title",
          children: recursiveNodeConverter(node.childNodes),
        };
      }
      if (node.nodeName === "subtitle") {
        return {
          type: "subtitle",
          children: recursiveNodeConverter(node.childNodes),
        };
      }

      return {
        type: "text",
        value: "",
      };
    }) as RichTextNode[];
  }, []);

  const recursiveRender = useCallback(
    (nodes: RichTextNode[], accumulatedProps: Partial<TypographyProps> = {}): React.ReactNode => {
      return nodes.map((node, index) => {
        switch (node.type) {
          case "paragraph":
            return (
              <React.Fragment key={`${node.type}-${node.value ?? index}-children`}>
                {node.children ? recursiveRender(node.children, accumulatedProps) : null}
              </React.Fragment>
            );
          case "title":
            return (
              <React.Fragment key={`${node.type}-${node.value ?? index}-children`}>
                {node.children
                  ? recursiveRender(node.children || [], { ...accumulatedProps, size: "xl", weight: "semibold" })
                  : null}
              </React.Fragment>
            );
          case "subtitle":
            return (
              <React.Fragment key={`${node.type}-${node.value ?? index}-children`}>
                {node.children
                  ? recursiveRender(node.children || [], { ...accumulatedProps, size: "md", weight: "medium" })
                  : null}
              </React.Fragment>
            );
          case "bold":
            return (
              <React.Fragment key={`${node.type}-${node.value ?? index}-children`}>
                {node.children ? recursiveRender(node.children || [], { ...accumulatedProps, weight: "bold" }) : null}
              </React.Fragment>
            );
          case "italic":
            return (
              <React.Fragment key={`${node.type}-${node.value ?? index}-children`}>
                {node.children ? recursiveRender(node.children || [], { ...accumulatedProps, italic: true }) : null}
              </React.Fragment>
            );
          case "underline":
            return (
              <React.Fragment key={`${node.type}-${node.value ?? index}-children`}>
                {node.children ? recursiveRender(node.children || [], { ...accumulatedProps, underlined: true }) : null}
              </React.Fragment>
            );
          case "link":
            return (
              <React.Fragment key={`${node.type}-${node.value ?? index}-children`}>
                {node.children
                  ? recursiveRender(node.children || [], {
                      ...accumulatedProps,
                      underlined: true,
                      variant: "primary",
                      level: 500,
                      onPress: () => {
                        if (node.url) {
                          WebBrowser.openBrowserAsync(node.url).catch((error) =>
                            console.error("Erro ao abrir o link:", error),
                          );
                        }
                      },
                    })
                  : null}
              </React.Fragment>
            );
          case "break":
            return <RnText key={`${node.type}-${node.value ?? index}-children`}>{"\n"}</RnText>;

          default:
            return (
              <Typography.Text
                key={`${node.type}-${node.value}-children`}
                variant={variant}
                level={level}
                size={size}
                label={node.value ?? ""}
                ellipsize={ellipsize}
                {...accumulatedProps}
              />
            );
        }
      });
    },
    [size, variant, level, ellipsize],
  );

  const richLabel = useMemo(() => {
    let formattedLabel = label;
    formattedLabel = formattedLabel.replace(/<link to="(.*?)">/g, '<a href="$1">');
    formattedLabel = formattedLabel.replace(/<\/link>/g, "</a>");

    const parsedHtml = parseFragment(formattedLabel);
    return recursiveRender(recursiveNodeConverter(parsedHtml.childNodes));
  }, [label]);

  return (
    <RnText
      style={{ flexWrap: "wrap", lineHeight: THEME.typography.dimensions.normal[size].lineHeight }}
      {...(ellipsize && { numberOfLines: 1 })}
      ellipsizeMode="tail"
    >
      {richLabel}
    </RnText>
  );
}

const Typography = {
  Text,
  Title,
  RichText,
};
export default Typography;
