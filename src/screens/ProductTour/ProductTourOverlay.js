// @flow

import { useTheme } from "@react-navigation/native";
import React, { useContext, useState, useEffect } from "react";
import { StyleSheet, TouchableOpacity, Image } from "react-native";
import { RNHoleView } from "react-native-hole-view";
import { Trans } from "react-i18next";
import { context } from "./Provider";
import LText from "../../components/LText";

const configs = {
  "Porfolio-ManagerTab": [
    {
      layout: "ManagerTab",
      arrow: require("../../images/producttour/arrow-bottomright.png"),
      text: "producttour.overlay.Porfolio-ManagerTab",
      arrowPosition: ({ x, width, y }) => ({
        left: x + width / 2,
        top: y - 11 - 45,
      }),
      textLayout: ({ y }) => ({
        top: y - 11 - 45 - 44,
        left: 0,
        right: 0,
        textAlign: "center",
      }),
    },
  ],
  "Porfolio-AccountsTab": [
    {
      layout: "AccountsTab",
      arrow: require("../../images/producttour/arrow-bottomleft.png"),
      text: "producttour.overlay.Porfolio-AccountsTab",
      arrowPosition: ({ x, width, y }) => ({
        left: x + width / 2,
        top: y - 11 - 45,
      }),
      textLayout: ({ y }) => ({
        top: y - 11 - 45 - 44,
        left: 0,
        right: 0,
        textAlign: "center",
      }),
    },
  ],
  "Manager-selectDevice": [
    {
      layout: "selectDevice",
      arrow: require("../../images/producttour/arrow-topleft.png"),
      text: "producttour.overlay.Manager-selectDevice",
      arrowPosition: ({ x, y, height }) => ({
        left: x + 110,
        top: y + height + 23,
      }),
      textLayout: ({ y, height }) => ({
        top: y + height + 23 + 45 + 22,
        left: 0,
        right: 0,
        textAlign: "center",
      }),
    },
  ],
  "Manager-managerDevice": [
    {
      layout: "managerDevice",
      arrow: require("../../images/producttour/arrow-topleft.png"),
      text: "producttour.overlay.Manager-managerDevice",
      arrowPosition: ({ x, y, height }) => ({
        left: x + 110,
        top: y + height + 23,
      }),
      textLayout: ({ y, height }) => ({
        top: y + height + 23 + 45 + 22,
        left: 0,
        right: 0,
        textAlign: "center",
      }),
    },
    {
      layout: "appsList",
      arrow: require("../../images/producttour/arrow-bottomright.png"),
      text: "producttour.overlay.Manager-appsList",
      arrowPosition: ({ x, width, y }) => ({
        left: x + width / 2,
        top: y - 11 - 45,
      }),
      textLayout: ({ y }) => ({
        top: y - 11 - 45 - 44 - 16,
        left: 0,
        right: 0,
        textAlign: "center",
      }),
    },
    {
      layout: "appRow-catalog-Bitcoin",
      arrow: require("../../images/producttour/arrow-bottomright.png"),
      text: "producttour.overlay.Manager-appRow-bitcoin",
      arrowPosition: ({ x, width, y }) => ({
        left: x + width / 2,
        top: y - 11 - 45,
      }),
      textLayout: ({ y }) => ({
        top: y - 11 - 45 - 44 - 16,
        left: 0,
        right: 0,
        textAlign: "center",
      }),
    },
  ],
};

const PortfolioOverlay = () => {
  const { colors } = useTheme();
  const [disabled, setDisabled] = useState();
  const [index, setIndex] = useState(0);
  const ptContext = useContext(context);

  console.log(ptContext);

  useEffect(() => {
    if (disabled === ptContext.holeConfig) {
      setIndex(0);
    }

    if (!ptContext.holeConfig) {
      setDisabled(null);
      setIndex(0);
    }
  }, [disabled, ptContext.holeConfig]);

  if (!ptContext.holeConfig || disabled === ptContext.holeConfig) {
    return null;
  }

  const configArray = configs[ptContext.holeConfig];

  const next = () => {
    if (configArray.length === index + 1) {
      setDisabled(ptContext.holeConfig);
    } else {
      setIndex(index + 1);
    }
  };

  const config = configArray[index];

  console.log(config, index);

  const layout = ptContext.layouts[config.layout];

  // not ready yet
  if (!layout) {
    return null;
  }

  console.log(layout);

  const arrow = config.arrow;
  const arrowStyle = config.arrowPosition(layout);
  const textStyle = config.textLayout(layout);
  const text = config.text;

  return (
    <>
      <RNHoleView
        style={[
          styles.fullscreen,
          { backgroundColor: colors.darkBlue, opacity: 0.9 },
        ]}
        holes={[
          {
            ...layout,
            borderRadius: 4,
          },
        ]}
      />
      <Image source={arrow} style={[arrowStyle, styles.tooltipArrow]} />
      <LText style={[textStyle, styles.tooltipText]} color="white" bold>
        <Trans i18nKey={text} />
      </LText>
      <TouchableOpacity
        /* android */
        onPress={e => {
          e.preventDefault();
          next();
        }}
        style={[styles.fullscreen, { backgroundColor: "transparent" }]}
      />
      <TouchableOpacity style={styles.closeButton} onPress={next}>
        <LText style={styles.closeText} color="white" bold>
          <Trans i18nKey="producttour.overlay.closeText" />
        </LText>
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  fullscreen: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  closeButton: {
    backgroundColor: "transparent",
    borderColor: "#FFF",
    borderWidth: 1,
    position: "absolute",
    top: 40,
    right: 16,
    borderRadius: 4,
    zIndex: 10,
  },
  closeText: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    color: "#FFF",
    fontSize: 12,
  },
  tooltipArrow: {
    width: 8.5,
    height: 45,
    position: "absolute",
  },
  tooltipText: {
    fontSize: 16,
    position: "absolute",
  },
});

export default PortfolioOverlay;