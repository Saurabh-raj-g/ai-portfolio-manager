"use client";
import { useAccountModal, useConnectModal } from "@rainbow-me/rainbowkit";
import { useAccount, useEnsName } from "wagmi";
import { formatAddress } from "@/app/utils/helper";
import { ButtonOutline } from "@/app/components/buttons/button-outline";

export const ConnectWallet = () => {
  const { address, isConnected } = useAccount();
  const { data: ensName } = useEnsName({ address })
  const { openConnectModal } = useConnectModal();
  const { openAccountModal } = useAccountModal();

  return (
    <ButtonOutline onClick={isConnected ? openAccountModal : openConnectModal}>
      {isConnected && address
        ? (ensName
          ? `${ensName} (${formatAddress(address)})`
          : formatAddress(address))
        : "Connect wallet"}
    </ButtonOutline>
  );
};
