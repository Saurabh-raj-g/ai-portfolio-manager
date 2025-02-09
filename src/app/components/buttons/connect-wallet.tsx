"use client";
import { useAccountModal, useConnectModal } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { formatAddress } from "@/app/utils/helper";
import { ButtonOutline } from "@/app/components/buttons/button-outline";

export const ConnectWallet = () => {
  const { address } = useAccount();
  const { openConnectModal } = useConnectModal();
  const { openAccountModal } = useAccountModal();

  return (
    <ButtonOutline onClick={address ? openAccountModal : openConnectModal}>
      { address ? formatAddress(address) : "connect wallet"}
    </ButtonOutline>
  );
};
