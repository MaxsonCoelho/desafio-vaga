import React, { ReactNode } from "react";
import { StyleSheet } from "react-native";
import { COLORS } from "student-front-commons/src/consts/design-system/global/colors";
import { SPACINGS } from "student-front-commons/src/consts/design-system/global/spacings";
import { RADIUS } from "student-front-commons/src/consts/design-system/global/radius";
import View from "../View";
import SafeAreaView from "@core/SafeAreaView";

function BottomSheet({ children }: { children: ReactNode }) {
  return (
    <SafeAreaView edges={["bottom"]} {...styles.container}>
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexGrow: 1,
    justifyContent: "space-evenly",
    padding: SPACINGS.xl,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: RADIUS.lg,
    borderTopRightRadius: RADIUS.lg,
  },
});

export default BottomSheet;
