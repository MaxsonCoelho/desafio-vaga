import { Image, LayoutChangeEvent, TouchableOpacity } from "react-native";
import { useCallback, useEffect, useState } from "react";
import { StyleProp } from "react-native/Libraries/StyleSheet/StyleSheet";
import { ImageStyle } from "react-native/Libraries/StyleSheet/StyleSheetTypes";
import ConfigStore from "@commons/configStore";
import { To } from "@commons/core/navigation";

export type ImageProps = {
  uri: string;
  width?: number;
  height?: number;
  style?: StyleProp<ImageStyle>;
  onLayout?: (event: LayoutChangeEvent) => void;
  borderRadius?: number;
  enableFullScreenOnPress?: boolean;
  fullScreenTittle?: string;
};

export default function RemoteImage({
  uri,
  width = 0,
  height = 0,
  style,
  onLayout,
  borderRadius,
  enableFullScreenOnPress,
  fullScreenTittle,
}: ImageProps) {
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    Image.getSize(uri, (realWidth, realHeight) => {
      setImageSize({ width: realWidth, height: realHeight });
    });
  }, []);

  const handleOnImagePress = useCallback(() => {
    ConfigStore.getNavigationInstance().navigate(To.Image, {
      title: fullScreenTittle,
      images: [uri],
    });
  }, [uri]);

  if (!imageSize.width && !imageSize.height) {
    return null;
  }

  return (
    <TouchableOpacity disabled={!enableFullScreenOnPress} onPress={handleOnImagePress}>
      <Image
        onLayout={onLayout}
        source={{ uri }}
        borderRadius={borderRadius}
        resizeMethod="scale"
        resizeMode="contain"
        progressiveRenderingEnabled={true}
        style={{
          ...(style as object),
          width: width || height * (imageSize.width / imageSize.height),
          height: height || width * (imageSize.height / imageSize.width),
        }}
      />
    </TouchableOpacity>
  );
}
