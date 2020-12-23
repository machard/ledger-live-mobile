/* @flow */
import React, { useCallback, useContext, useEffect, useState } from "react";
import { StyleSheet, Linking } from "react-native";
import SafeAreaView from "react-native-safe-area-view";
import type { Account, AccountLike } from "@ledgerhq/live-common/lib/types";
import { TrackScreen } from "../../analytics";
import colors from "../../colors";
import ValidateError from "../../components/ValidateError";
import { urls } from "../../config/urls";
import {
  context as _wcContext,
  setCurrentCallRequestError,
} from "../WalletConnect/Provider";
import { ScreenName, NavigatorName } from "../../const";
import { context as _ptContext, setStep } from "../ProductTour/Provider";
import { navigate } from "../../rootnavigation";

const forceInset = { bottom: "always" };

type Props = {
  account: AccountLike,
  parentAccount: ?Account,
  navigation: any,
  route: { params: RouteParams },
};

type RouteParams = {
  accountId: string,
  parentId: String,
  deviceId: string,
  transaction: any,
  error: Error,
};

export default function ValidationError({ navigation, route }: Props) {
  const error = route.params.error;
  const wcContext = useContext(_wcContext);
  const [disableRetry, setDisableRetry] = useState(false);
  const ptContext = useContext(_ptContext);

  useEffect(() => {
    if (wcContext.currentCallRequestId) {
      setDisableRetry(true);
      setCurrentCallRequestError(error);
    }
  }, []);

  const onClose = useCallback(() => {
    if (ptContext.currentStep === "SEND_COINS") {
      navigate(NavigatorName.ProductTour, {
        screen: ScreenName.ProductTourMenu,
      });
      setStep(null);
    } else {
      navigation.dangerouslyGetParent().pop();
    }
  }, [navigation, ptContext.currentStep]);

  const contactUs = useCallback(() => {
    Linking.openURL(urls.contact);
  }, []);

  const retry = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return (
    <SafeAreaView style={styles.root} forceInset={forceInset}>
      <TrackScreen category="SendFunds" name="ValidationError" />
      <ValidateError
        error={error}
        onRetry={!disableRetry ? retry : null}
        onClose={onClose}
        onContactUs={contactUs}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.white,
  },
});
