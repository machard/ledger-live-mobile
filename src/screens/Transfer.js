/* @flow */
import React, { useState, useContext } from "react";
import Touchable from "../components/Touchable";
import TabIcon from "../components/TabIcon";
import CreateModal from "../modals/Create";
import TransferIcon from "../icons/Transfer";
import { lockSubject } from "../components/RootNavigator/CustomBlockRouterNavigator";
import { enableHole, context } from "./ProductTour/Provider";

const hitSlop = {
  top: 10,
  left: 25,
  right: 25,
  bottom: 25,
};

type Props = {
  tintColor: string,
  navigation: any,
};

export default () => null;

export function TransferTabIcon(props: Props) {
  const [isModalOpened, setIsModalOpened] = useState(false);
  const ptContext = useContext(context);

  function openModal() {
    if (ptContext.holeConfig) {
      enableHole(`-${ptContext.holeConfig}`);
    }
    setIsModalOpened(true);
  }

  function onModalClose() {
    setIsModalOpened(false);
  }

  return (
    <>
      <Touchable
        event="Transfer"
        disabled={lockSubject.getValue()}
        hitSlop={hitSlop}
        onPress={openModal}
      >
        {/* $FlowFixMe */}
        <TabIcon Icon={TransferIcon} i18nKey="tabs.transfer" {...props} />
      </Touchable>
      <CreateModal isOpened={isModalOpened} onClose={onModalClose} />
    </>
  );
}
