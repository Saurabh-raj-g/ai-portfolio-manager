import { BalanceData } from '@/app/types';
import { Alchemy, Network, Utils } from 'alchemy-sdk';
const HRNumbers = require('human-readable-numbers');

const getBalanceData = async (userAddress: string, chainId: number = 8453) => {
  let network: Network;

  switch (chainId) {
    // case 1:
    //   network = Network.ETH_MAINNET;
    //   break;
    // case 137:
    //   network = Network.MATIC_MAINNET;
    //   break;
    case 8453:
      network = Network.BASE_MAINNET;
      break;
    default:
      throw new Error(`Unsupported chain ID: ${chainId}`);
  }

  const settings = {
    apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API,
    // network: network,
    network: Network.ARB_MAINNET,
  };

  const alchemy = new Alchemy(settings);

  const data = await alchemy.core.getTokenBalances(userAddress);

  const tokenDataPromises = data.tokenBalances.map((balance) =>
    alchemy.core.getTokenMetadata(balance.contractAddress)
  );


  const tokenData = await Promise.all(tokenDataPromises);

  const balanceData: BalanceData[] = data.tokenBalances.map((balance, index) => ({
    balance: Utils.formatUnits(balance.tokenBalance!),
    tokenData: tokenData[index],
    isLong: Utils.formatUnits(balance.tokenBalance!).length > 5,
    hrBalance: HRNumbers.toHumanString(Utils.formatUnits(balance.tokenBalance!)),
  }));

  return balanceData;
};

export default getBalanceData;
