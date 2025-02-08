import { TokenMetadataResponse } from 'alchemy-sdk';

export type Position = {
  token: string;
  amount: string;
}

export type BalanceData = {
  ethBalance: string;
  tokens: TokenBalanceData[];
};

export type TokenBalanceData = {
  balance: string;
  tokenMetadata: TokenMetadataResponse;
  isLong: Boolean;
  hrBalance: string;
};