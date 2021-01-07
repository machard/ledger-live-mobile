// @flow

import React, { useContext, useState } from "react";
import { Trans } from "react-i18next";
import _ from "lodash";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import SafeAreaView from "react-native-safe-area-view";
import LText from "../../components/LText";
import Check from "../../icons/Check";
import Lock from "../../icons/Lock";
import colors from "../../colors";
import { context, STEPS, setStep, completeStep } from "./Provider";
import { ScreenName } from "../../const";
import StepLockedBottomModal from "./StepLockedBottomModal";
import ProductTourProgressBar from "./ProductTourProgressBar";

const forceInset = { bottom: "always" };

const stepTitles = {
  INSTALL_CRYPTO: [
    "producttour.menu.installcrypto",
    "producttour.menu.cryptoinstalled",
    {
      files: [
        require("../../images/producttour/blue/installcrypto.png"),
        require("../../images/producttour/green/installcrypto.png"),
      ],
      size: {
        width: 77,
        height: 89,
      },
      offset: {
        right: 10,
        bottom: -20,
      },
    },
  ],
  CREATE_ACCOUNT: [
    "producttour.menu.createaccount",
    "producttour.menu.accountcreated",
    {
      files: [
        require("../../images/producttour/blue/createaccount.png"),
        require("../../images/producttour/green/createaccount.png"),
      ],
      size: {
        width: 76,
        height: 76,
      },
      offset: {
        right: 9,
        bottom: -10,
      },
    },
  ],
  RECEIVE_COINS: [
    "producttour.menu.receivecoins",
    "producttour.menu.coinsreceived",
    {
      files: [
        require("../../images/producttour/blue/receivecoins.png"),
        require("../../images/producttour/green/receivecoins.png"),
      ],
      size: {
        width: 76,
        height: 76,
      },
      offset: {
        right: 10,
        bottom: -20,
      },
    },
  ],
  BUY_COINS: [
    "producttour.menu.buycoins",
    "producttour.menu.coinsbought",
    {
      files: [
        require("../../images/producttour/blue/buycoins.png"),
        require("../../images/producttour/green/buycoins.png"),
      ],
      size: {
        width: 80,
        height: 84,
      },
      offset: {
        right: 11,
        bottom: -4,
      },
    },
  ],
  SEND_COINS: [
    "producttour.menu.sendcoins",
    "producttour.menu.coinssent",
    {
      files: [
        require("../../images/producttour/blue/sendcoins.png"),
        require("../../images/producttour/green/sendcoins.png"),
      ],
      size: {
        width: 102,
        height: 76,
      },
      offset: {
        right: 8,
        bottom: -8,
      },
    },
  ],
  SWAP_COINS: [
    "producttour.menu.swapcoins",
    "producttour.menu.coinsswapped",
    {
      files: [
        require("../../images/producttour/blue/swapcoins.png"),
        require("../../images/producttour/green/swapcoins.png"),
      ],
      size: {
        width: 86,
        height: 75,
      },
      offset: {
        right: 11,
        bottom: -6,
      },
    },
  ],
  CUSTOMIZE_APP: [
    "producttour.menu.customizeapp",
    "producttour.menu.appcustomized",
    {
      files: [
        require("../../images/producttour/blue/customizeapp.png"),
        require("../../images/producttour/green/customizeapp.png"),
      ],
      size: {
        width: 84,
        height: 86,
      },
      offset: {
        right: 1,
        bottom: -21,
      },
    },
  ],
};

const stepProps = {
  isComplete: Function,
  isAccessible: Function,
  goTo: Function,
  setStepLockedModal: Function,
  step: String,
};

const Step = ({
  isComplete,
  isAccessible,
  goTo,
  step,
  setStepLockedModal,
}: stepProps) => {
  return (
    <TouchableOpacity
      style={[
        styles.step,
        isComplete(step)
          ? styles.stepComplete
          : isAccessible(step)
          ? styles.stepAccessible
          : styles.stepLocked,
      ]}
      // eslint-disable-next-line consistent-return
      onPress={() => {
        if (!isAccessible(step)) {
          return setStepLockedModal(true);
        }
        goTo(step);
      }}
      onLongPress={() => completeStep(step)}
      delayLongPress={2000}
      disabled={isComplete(step)}
    >
      <View style={styles.stepHeader}>
        {!isComplete(step) ? (
          <LText semiBold style={styles.stepNumber}>
            {Object.keys(STEPS).indexOf(step) + 1}.
          </LText>
        ) : null}
        {isComplete(step) ? (
          <View style={styles.checkContainer}>
            <View
              style={[
                styles.checkboxContainer,
                styles.checkboxContainerChecked,
              ]}
            >
              <Check size={10} color={colors.ledgerGreen} />
            </View>
            <LText bold style={styles.completedText}>
              <Trans i18nKey="producttour.menu.complete" />
            </LText>
          </View>
        ) : null}
        {!isAccessible(step) && !isComplete(step) ? (
          <View style={styles.lockContainer}>
            <Lock size={12} color={colors.white} />
          </View>
        ) : null}
      </View>
      <LText semiBold style={styles.stepTitle}>
        <Trans i18nKey={stepTitles[step][isComplete(step) ? 1 : 0]} />
      </LText>
      <Image
        source={stepTitles[step][2].files[isComplete(step) ? 1 : 0]}
        style={[
          styles.image,
          stepTitles[step][2].size,
          stepTitles[step][2].offset,
        ]}
      />
    </TouchableOpacity>
  );
};

type Props = {
  navigation: any,
};

let to;

const ProductTourMenu = ({ navigation }: Props) => {
  const ptContext = useContext(context);
  const [stepLockedModal, setStepLockedModal] = useState(false);

  const isAccessible = step =>
    _.every(STEPS[step], step => ptContext.completedSteps.includes(step));
  const isComplete = step => ptContext.completedSteps.includes(step);

  const goTo = step => {
    clearTimeout(to);
    setStep(step);
    navigation.navigate(ScreenName.ProductTourStepStart);
  };

  // eslint-disable-next-line consistent-return
  useFocusEffect(() => {
    if (ptContext.currentStep) {
      // timeout avoid ui glitch
      to = setTimeout(() => setStep(null), 1000);
      // we don't cancel it on purpose
    }
  }, [ptContext.currentStep]);

  return (
    <>
      <View style={styles.header}>
        <LText secondary style={styles.title} bold>
          <Trans
            i18nKey={
              ptContext.completedSteps.length === Object.keys(STEPS).length
                ? "producttour.menu.completedtitle"
                : "producttour.menu.title"
            }
          />
        </LText>
        <ProductTourProgressBar />
        <View style={styles.badge}>
          <LText style={styles.badgeTitle} bold>
            <Trans
              i18nKey={
                ptContext.completedSteps.length <= 1
                  ? "producttour.menu.badgeBeginner"
                  : ptContext.completedSteps.length > 1 && ptContext.completedSteps.length <= 4
                  ? "producttour.menu.badgeInsider"
                  : "producttour.menu.badgeMaster"
              }
            />
          </LText>
        </View>
      </View>
      <SafeAreaView style={{ flex: 1 }} forceInset={forceInset}>
        <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.root}>
          {_.map(STEPS, (_, step) => (
            <View
              key={`${step}-${ptContext.completedSteps.length}`}
              style={styles.stepContainer}
            >
              <Step
                step={step}
                isComplete={isComplete}
                isAccessible={isAccessible}
                goTo={goTo}
                setStepLockedModal={setStepLockedModal}
              />
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
      <StepLockedBottomModal
        isOpened={!!stepLockedModal}
        onPress={() => setStepLockedModal(false)}
        onClose={() => setStepLockedModal(false)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  badge: {
    marginTop: 16,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: colors.ledgerGreen,
    alignSelf: "flex-start",
  },
  badgeTitle: {
    color: colors.white,
    fontSize: 10,
  },
  image: {
    position: "absolute",
  },
  checkContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkboxContainer: {
    marginTop: 2,
    marginBottom: 2,
    height: 16,
    width: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.white,
    backgroundColor: colors.live,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 4,
  },
  checkboxContainerChecked: {
    backgroundColor: colors.white,
  },
  completedText: {
    color: colors.white,
    fontSize: 8,
  },
  lockContainer: {},
  stepHeader: {
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  root: {
    marginHorizontal: 12,
    marginTop: 12,
    flexWrap: "wrap",
    alignContent: "stretch",
    flexDirection: "row",
  },
  stepContainer: {
    width: "50%",
    padding: 12,
  },
  step: {
    width: "100%",
    padding: 16,
    borderRadius: 4,
    paddingBottom: 80,
    overflow: "hidden",
  },
  stepComplete: {
    backgroundColor: colors.ledgerGreen,
  },
  stepAccessible: {
    backgroundColor: colors.live,
  },
  stepLocked: {
    backgroundColor: colors.live,
    opacity: 0.4,
  },
  stepTitle: {
    color: colors.white,
    fontSize: 18,
  },
  stepNumber: {
    color: colors.white,
    fontSize: 16,
    marginRight: 11,
  },
  header: {
    backgroundColor: colors.live,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 43,
  },
  title: {
    fontSize: 28,
    color: colors.white,
    marginBottom: 16,
  },
});

export default ProductTourMenu;
