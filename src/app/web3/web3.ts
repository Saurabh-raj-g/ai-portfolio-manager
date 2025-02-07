import Web3 from "web3";
import {baseSepolia} from "wagmi/chains";
import Chain from "@/app/value-objects/chain";


export default class Web3Service {

  public static provider(chain: Chain) {
    if(chain.isUnknown()) {
      throw new Error("Chain is unknown");
    }
    
    if(chain.isBaseSepolia()) {
      return new Web3.providers.HttpProvider(baseSepolia.rpcUrls.default.http[0]);
    }

    throw new Error("Chain is not supported");
  }
  
  /**
   * Verify Original Message and Signature with Wallet Address.
   * @param msg
   * @param signature
   * @param publicAddress
   * @param chain
   * @returns
   */
  public static verifySignature(
    msg: string,
    signature: string,
    publicAddress: string,
    chain: Chain
  ) {
    const provider = this.provider(chain);
    const web3 = new Web3(provider);
    const account = web3.eth.accounts.recover(msg, signature);
    return account.toUpperCase() == publicAddress.toUpperCase();
  }
}
