export type Position = {
  token: string;
  amount: string;
}

// Define the type for a token holding
export type TokenHolding ={
  tokenAddress: string;
  balance: string;
  decimals: number;
  symbol: string;
  name: string;
  usdPrice?: number;
}
export interface ValueObjectType {
  id: number;
  name: string;
  label: string;
};

export interface ValueObjectTypeOptions extends  ValueObjectType  {
  chainId?: number;
  hex?: string;
};
