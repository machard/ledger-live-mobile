// @flow
import React, { Component } from "react";
import { View, StyleSheet } from "react-native";
import { compose } from "redux";
import { connect } from "react-redux";
import { translate } from "react-i18next";
import { BigNumber } from "bignumber.js";
import type { Account, Currency } from "@ledgerhq/live-common/lib/types";

import {
  counterValueCurrencySelector,
  currencySettingsSelector,
  counterValueExchangeSelector,
  intermediaryCurrency,
} from "../../reducers/settings";
import type { State } from "../../reducers";
import type { T } from "../../types/common";

import LText from "../../components/LText/index";
import CounterValues from "../../countervalues";
import colors from "../../colors";

import CounterValuesSeparator from "./CounterValuesSeparator";
import CurrencyInput from "../../components/CurrencyInput";
import TranslatedError from "../../components/TranslatedError";

type OwnProps = {
  account: Account,
  currency: string,
  value: BigNumber,
  onChange: BigNumber => void,
  error?: Error,
};

type Props = OwnProps & {
  t: T,
  rightCurrency: Currency,
  getCounterValue: BigNumber => ?BigNumber,
  getReverseCounterValue: BigNumber => ?BigNumber,
};

type OwnState = {
  active: "left" | "right",
};

class AmountInput extends Component<Props, OwnState> {
  input = React.createRef();

  state = {
    active: "left",
  };

  componentDidMount() {
    if (this.input.current) {
      this.input.current.focus();
    }
  }

  handleAmountChange = (changeField: "left" | "right") => (
    value: BigNumber,
  ) => {
    const { getReverseCounterValue, onChange } = this.props;
    if (changeField === "left") {
      onChange(value);
    } else {
      const leftVal = getReverseCounterValue(value) || BigNumber(0);
      onChange(leftVal);
    }
  };

  onChangeLeft = this.handleAmountChange("left");

  onChangeRight = this.handleAmountChange("right");

  onFocus = (direction: "left" | "right") => () =>
    this.setState({ active: direction });

  onFocusLeft = this.onFocus("left");

  onFocusRight = this.onFocus("right");

  render() {
    const { active } = this.state;
    const {
      currency,
      value,
      rightCurrency,
      getCounterValue,
      account,
      error,
    } = this.props;
    const isLeft = active === "left";
    const right = value ? getCounterValue(value) : BigNumber(0);
    const rightUnit = rightCurrency.units[0];
    return (
      <View style={styles.container}>
        <View style={styles.wrapper}>
          <View style={styles.inputWrapper}>
            <CurrencyInput
              isActive={isLeft}
              onFocus={this.onFocusLeft}
              onChange={this.onChangeLeft}
              unit={account.unit}
              value={value}
              renderRight={
                <LText
                  style={[styles.currency, isLeft ? styles.active : null]}
                  tertiary
                >
                  {currency}
                </LText>
              }
              renderError={
                <LText style={styles.error} tertiary>
                  <TranslatedError error={error} />
                </LText>
              }
              hasError={!!error}
            />
          </View>
        </View>
        <CounterValuesSeparator />
        <View style={styles.wrapper}>
          <View style={styles.inputWrapper}>
            <CurrencyInput
              isActive={!isLeft}
              onFocus={this.onFocusRight}
              onChange={this.onChangeRight}
              unit={rightUnit}
              value={right}
              renderRight={
                <LText
                  style={[styles.currency, !isLeft ? styles.active : null]}
                  tertiary
                >
                  {rightUnit.code}
                </LText>
              }
            />
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  wrapper: {
    flex: 1,
    flexDirection: "column",
    alignItems: "flex-start",
  },
  inputWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  currency: {
    fontSize: 24,
    color: colors.grey,
  },
  active: {
    fontSize: 32,
  },
  error: {
    color: colors.alert,
    fontSize: 14,
  },
  errorText: {
    fontSize: 14,
    flex: 1,
  },
});

const mapStateToProps = (state: State, props: OwnProps) => {
  const {
    account: { currency },
  } = props;

  const counterValueCurrency = counterValueCurrencySelector(state);
  const fromExchange = currencySettingsSelector(state, { currency }).exchange;
  const toExchange = counterValueExchangeSelector(state);

  const getCounterValue = value =>
    CounterValues.calculateWithIntermediarySelector(state, {
      from: currency,
      fromExchange,
      intermediary: intermediaryCurrency,
      toExchange,
      to: counterValueCurrency,
      value,
      disableRounding: true,
    });

  const getReverseCounterValue = value =>
    CounterValues.reverseWithIntermediarySelector(state, {
      from: currency,
      fromExchange,
      intermediary: intermediaryCurrency,
      toExchange,
      to: counterValueCurrency,
      value,
    });

  return {
    rightCurrency: counterValueCurrency,
    getCounterValue,
    getReverseCounterValue,
  };
};

export default compose(
  translate(),
  connect(mapStateToProps),
)(AmountInput);