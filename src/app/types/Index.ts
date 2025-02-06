import { TokenMetadataResponse } from 'alchemy-sdk';

export type Position = {
  token: string;
  amount: string;
}

export type BalanceData = {
  balance: string;
  tokenData: TokenMetadataResponse;
  isLong: Boolean;
  hrBalance: string;
};