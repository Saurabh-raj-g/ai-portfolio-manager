import { VerifyUserProps } from "../ai-agent/cdpWalletProvider";
import { getSignMessage } from "./sign-message-generator";
import Web3Service from "./web3";

export function verifyUser({address, signature, chain}:VerifyUserProps) {
  const message = getSignMessage();
  const verified = Web3Service.verifySignature(message, signature, address, chain);

  if (!verified) {
    throw new Error("User verification failed");
  }
}
