import { WalletProviderProps } from "../ai-agent/cdpWalletProvider";
import { getSignMessage } from "./sign-message-generator";
import Web3Service from "./web3";

export function verifyUser({address, signature, chain}:WalletProviderProps) {
  const message = getSignMessage();
  const verified = Web3Service.verifySignature(message, signature, address, chain);

  if (!verified) {
    throw new Error("User verification failed");
  }
}
