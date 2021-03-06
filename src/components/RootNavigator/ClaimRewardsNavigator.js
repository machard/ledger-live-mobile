// @flow

import React from "react";
import { useTranslation } from "react-i18next";
import { createStackNavigator } from "@react-navigation/stack";
import { ScreenName } from "../../const";
import { closableStackNavigatorConfig } from "../../navigation/navigatorConfig";
import SelectDevice from "../../screens/SelectDevice";
import ConnectDevice from "../../screens/ConnectDevice";
import ValidationSuccess from "../../screens/ClaimRewards/02-ValidationSuccess";
import ValidationError from "../../screens/ClaimRewards/02-ValidationError";
import StepHeader from "../StepHeader";

const totalSteps = "2";

export default function ClaimRewardsNavigator() {
  const { t } = useTranslation();

  return (
    <Stack.Navigator screenOptions={closableStackNavigatorConfig}>
      <Stack.Screen
        name={ScreenName.ClaimRewardsSelectDevice}
        component={SelectDevice}
        options={{
          headerTitle: () => (
            <StepHeader
              title={t("claimReward.stepperHeader.selectDevice")}
              subtitle={t("claimReward.stepperHeader.stepRange", {
                currentStep: "1",
                totalSteps,
              })}
            />
          ),
        }}
      />
      <Stack.Screen
        name={ScreenName.ClaimRewardsConnectDevice}
        component={ConnectDevice}
        options={{
          headerTitle: () => (
            <StepHeader
              title={t("claimReward.stepperHeader.connectDevice")}
              subtitle={t("claimReward.stepperHeader.stepRange", {
                currentStep: "2",
                totalSteps,
              })}
            />
          ),
        }}
      />
      <Stack.Screen
        name={ScreenName.ClaimRewardsValidationSuccess}
        component={ValidationSuccess}
        options={{
          headerTitle: null,
          gestureEnabled: false,
          headerLeft: null,
          headerRight: null,
        }}
      />
      <Stack.Screen
        name={ScreenName.ClaimRewardsValidationError}
        component={ValidationError}
        options={{ headerTitle: null }}
      />
    </Stack.Navigator>
  );
}

const Stack = createStackNavigator();
